// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

console.log("Hello from Functions!");

serve(async (req) => {
	const data = await req.formData();

	console.log("incoming data from slack: ", data);

	let slackResponseMessage;

	if (
		["random", "foodfred-test"].includes(
			(data.get("channel_name") as string) ?? ""
		)
	) {
		slackResponseMessage = {
			text: "Create a new Order with @foodfred",
			blocks: [
				{
					dispatch_action: true,
					type: "input",
					element: {
						type: "plain_text_input",
						action_id: "restaurant-name",
					},
					label: {
						type: "plain_text",
						text: "Wo wird bestellt?",
						emoji: true,
					},
				},
			],
		};

		fetch(data.get("response_url") as string, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(slackResponseMessage),
		});
	} else {
		return new Response("/foodfred only works in #random and #foodfred-test", {
			headers: { "Content-Type": "text/plain" },
		});
	}

	return new Response(null, {
		headers: { "Content-Type": "application/json" },
	});
});

// To invoke:
// curl -i --location --request POST 'http://localhost:54321/functions/v1/' \
//   --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
//   --header 'Content-Type: application/json' \
//   --data '{"name":"Functions"}'
