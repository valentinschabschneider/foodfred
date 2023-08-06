// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import {
	SupabaseClient,
	createClient,
} from "https://esm.sh/@supabase/supabase-js@2.31.0";

console.log("Hello from Functions!");

serve(async (req) => {
	const parsedData = await req.formData();
	const payload = JSON.parse(parsedData.get("payload")!.toString());

	const supabaseClient = createClient(
		// Supabase API URL - env var exported by default.
		Deno.env.get("PUBLIC_SUPABASE_URL") ?? Deno.env.get("SUPABASE_URL") ?? "",
		// Supabase API ANON KEY - env var exported by default.
		Deno.env.get("PUBLIC_SUPABASE_SERVICE_KEY") ??
			Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ??
			""
	);

	const { data: user, error } = await supabaseClient
		.from("users")
		.select()
		.eq("auth_provider", "slack")
		.eq("auth_provider_id", payload.user.id)
		.maybeSingle();

	console.log(user, error);

	if (!user) {
		return new Response(
			"You must register at https://foodfred.app before using the slack app!",
			{ headers: { "Content-Type": "text/plain" } }
		);
	}

	for (let i = 0; i < payload.actions.length; i++) {
		switch (payload.actions[i].action_id) {
			case "restaurant-name":
				createOrder(payload.actions[i].value, user.id, supabaseClient).then(
					(url) =>
						sendSlackResponse(
							url,
							payload.response_url,
							payload.actions[i].value
						)
				);
		}
	}
	return new Response(null, { headers: { "Content-Type": "text/plain" } });
});

async function createOrder(
	name: string,
	userId: string,
	supabaseClient: SupabaseClient
): Promise<string> {
	const { data: existingRestaurant, error: queryRestaurantError } =
		await supabaseClient.from("restaurants").select().eq("name", name);

	let restaurant = existingRestaurant![0];

	console.log("exrest", restaurant, queryRestaurantError);

	if (!restaurant) {
		const { data: newRestaurant, error: restaurantError } = await supabaseClient
			.from("restaurants")
			.insert({ name })
			.select()
			.maybeSingle();

		console.log("rest", newRestaurant, restaurantError);

		restaurant = newRestaurant;
	}

	const { data: order, error: orderError } = await supabaseClient
		.from("orders")
		.insert({ payee_id: userId, restaurant_id: restaurant.id })
		.select()
		.maybeSingle();

	console.log("ord", order, orderError);

	// TODO: create order here
	return `https://foodfred.app/orders/${order!.id}`;
}

function sendSlackResponse(
	url: string,
	response_url: string,
	restaurantName: string
): Promise<Response> {
	console.log;

	return fetch(response_url as string, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			response_type: "in_channel",
			replace_original: false,
			delete_original: true,
			text: `Wir bestellen bei *${restaurantName}*`,
			blocks: [
				{
					type: "section",
					text: {
						type: "mrkdwn",
						text: `:mega: Wer bestellt bei *${restaurantName}* mit?`,
					},
				},
				{
					type: "actions",
					elements: [
						{
							type: "button",
							text: {
								type: "plain_text",
								text: "Ich bestelle mit ...",
								emoji: true,
							},
							value: "link-to-order",
							url: url,
							action_id: "actionId-0",
						},
					],
				},
			],
		}),
	});
}

// To invoke:
// curl -i --location --request POST 'http://localhost:54321/functions/v1/' \
//   --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
//   --header 'Content-Type: application/json' \
//   --data '{"name":"Functions"}'
