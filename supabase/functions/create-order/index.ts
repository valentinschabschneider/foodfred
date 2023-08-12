import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';
import { createOrder } from '../_shared/createOrder.ts';
import { createClient } from '../_shared/supabaseClient.ts';

console.log('Hello from Functions!');

serve(async (req) => {
	// This is needed if you're planning to invoke your function from a browser.
	if (req.method === 'OPTIONS') {
		return new Response('ok', { headers: corsHeaders });
	}

	const supabase = createClient('service', {
		global: {
			headers: { Authorization: req.headers.get('Authorization')! }
		}
	});

	const body = await req.json();

	const {
		data: { user }
	} = await supabase.auth.getUser();

	console.log('user: ', user!.id);

	const orderId = await createOrder(body.restaurantName, user!.id, supabase);

	return new Response(JSON.stringify({ orderId }), {
		headers: { ...corsHeaders, 'Content-Type': 'application/json' },
		status: 200
	});
});
