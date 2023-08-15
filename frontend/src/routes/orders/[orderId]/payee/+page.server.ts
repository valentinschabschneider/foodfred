import { getOrder } from '$supabase/queries/order';
import { getOrderItems } from '$supabase/queries/orderItems';
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
		orderItems
	};
}
