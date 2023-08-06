import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { SupabaseClient, createClient } from '../_shared/supabaseClient.ts';
import { validateRequest } from '../_shared/slackIntegration.ts';

console.log('Hello from Functions!');

serve(async (req) => {
	validateRequest(req);

	const parsedData = await req.formData();
	const payload = JSON.parse(parsedData.get('payload')!.toString());

	const supabaseClient = createClient('service');

	const { data: user, error } = await supabaseClient
		.from('users')
		.select()
		.eq('auth_provider', 'slack')
		.eq('auth_provider_id', payload.user.id)
		.maybeSingle();

	console.log(user, error);

	if (!user) {
		return new Response('You must register at https://foodfred.app before using the slack app!', {
			headers: { 'Content-Type': 'text/plain' }
		});
	}

	for (let i = 0; i < payload.actions.length; i++) {
		switch (payload.actions[i].action_id) {
			case 'restaurant-name':
				createOrder(payload.actions[i].value, user.id, supabaseClient).then((url) =>
					sendSlackResponse(url, payload.response_url, payload.actions[i].value)
				);
		}
	}
	return new Response();
});

async function createOrder(
	name: string,
	userId: string,
	supabaseClient: SupabaseClient
): Promise<string> {
	const restaurant = await getOrCreateRestaurant(name, supabaseClient);

	const { data: order, error: orderError } = await supabaseClient
		.from('orders')
		.insert({ payee_id: userId, restaurant_id: restaurant.id })
		.select()
		.single();

	console.log('ord', order, orderError);

	return `https://foodfred.app/orders/${order!.id}`;
}

async function getOrCreateRestaurant(name: string, supabaseClient: SupabaseClient) {
	const { data: existingRestaurant, error: queryRestaurantError } = await supabaseClient
		.from('restaurants')
		.select()
		.eq('name', name)
		.single();

	console.log('exrest', existingRestaurant, queryRestaurantError);

	if (existingRestaurant) {
		return existingRestaurant;
	}

	const { data: newRestaurant, error: restaurantError } = await supabaseClient
		.from('restaurants')
		.insert({ name })
		.select()
		.single();

	console.log('rest', newRestaurant, restaurantError);

	return newRestaurant!;
}

function sendSlackResponse(
	url: string,
	response_url: string,
	restaurantName: string
): Promise<Response> {
	return fetch(response_url as string, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			response_type: 'in_channel',
			replace_original: false,
			delete_original: true,
			text: `Wir bestellen bei *${restaurantName}*`,
			blocks: [
				{
					type: 'section',
					text: {
						type: 'mrkdwn',
						text: `:mega: Wer bestellt bei *${restaurantName}* mit?`
					}
				},
				{
					type: 'actions',
					elements: [
						{
							type: 'button',
							text: {
								type: 'plain_text',
								text: 'Ich bestelle mit ...',
								emoji: true
							},
							value: 'link-to-order',
							url: url,
							action_id: 'actionId-0'
						}
					]
				}
			]
		})
	});
}
