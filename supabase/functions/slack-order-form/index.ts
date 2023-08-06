import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { validateRequest } from '../_shared/slackIntegration.ts';

console.log('Hello from Functions!');

serve(async (req) => {
	validateRequest(req);

	const data = await req.formData();

	console.log('incoming data from slack: ', data);

	if (!['random', 'foodfred-test'].includes((data.get('channel_name') as string) ?? '')) {
		return new Response('/foodfred only works in #random and #foodfred-test', {
			headers: { 'Content-Type': 'text/plain' }
		});
	}

	const slackResponseMessage = {
		text: 'Create a new Order with @foodfred',
		blocks: [
			{
				dispatch_action: true,
				type: 'input',
				element: {
					type: 'plain_text_input',
					action_id: 'restaurant-name'
				},
				label: {
					type: 'plain_text',
					text: 'Wo wird bestellt?',
					emoji: true
				}
			}
		]
	};

	await fetch(data.get('response_url') as string, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(slackResponseMessage)
	});

	return new Response();
});
