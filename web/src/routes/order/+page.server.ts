import { error } from '@sveltejs/kit';

export async function load({ locals: { supabase, getSession } }) {
	const session = await getSession();
	if (!session) {
		// the user is not signed in
		throw error(401, { message: 'Unauthorized' });
	}

	return {
		payee: 'Vla',
		orders: [
			{
				customer: {
					handle: '@valentin.schabschneider',
					name: 'Shaby',
					image: 'https://flowbite-svelte.com/images/profile-picture-2.webp'
				},
				products: [
					{
						name: 'Hawaii Pizza',
						price: 11.99
					},
					{
						name: 'Coke',
						price: 2.1
					}
				],
				status: {
					color: 'green' as 'green' | 'red' | 'yellow',
					text: 'Paid'
				},
				currency: 'EUR'
			},
			{
				customer: {
					handle: '@klaus.betz',
					name: 'Klaus'
				},
				products: [
					{
						name: 'Margherita Pizza',
						price: 10.5
					}
				],
				status: {
					color: 'yellow' as 'green' | 'red' | 'yellow',
					text: 'Payment unconfirmed'
				},
				currency: 'EUR'
			},
			{
				customer: {
					handle: '@daniel.steinkogler',
					name: 'Stani'
				},
				products: [
					{
						name: 'Vanessa',
						price: 999
					}
				],
				status: {
					color: 'red' as 'green' | 'red' | 'yellow',
					text: 'Unpaid'
				},
				currency: 'EUR'
			}
		]
	};
}
