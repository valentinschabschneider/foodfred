import { getOrder } from '$lib/queries/order';
import { getOrderItems } from '$lib/queries/orderItems.js';
import { error, redirect } from '@sveltejs/kit';

export async function load({ params, locals: { getSession, supabase } }) {
	const session = await getSession();
	if (!session) {
		// the user is not signed in
		throw redirect(303, '/auth/login');
	}

	const { data: order } = await getOrder(supabase, params.orderId);

	if (!order) {
		throw error(500, 'Order not found');
	}

	if (order.payee.id !== session.user.id) {
		throw redirect(303, `/orders/${params.orderId}`);
	}

	const { data: orderItems } = await getOrderItems(supabase, params.orderId);

	return {
		order: order,
		horder: {
			id: order.id,
			payee: order.payee,
			orders: [
				{
					customer: {
						id: session.user.id,
						handle: '@valentin.schabschneider',
						name: 'Shaby',
						image: order.payee.image ?? undefined
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
						id: 'asdsfsfsffasdf',
						handle: '@klaus.betz',
						name: 'Klaus',
						image: undefined
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
						id: 'asdfasdf',
						handle: '@daniel.steinkogler',
						name: 'Stani',
						image: undefined
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
		},
		orderItems
	};
}
