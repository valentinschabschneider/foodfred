import { getOrder } from '$supabase/queries/order';
import { getOrderItems } from '$supabase/queries/orderItems.js';
import { redirect } from '@sveltejs/kit';

export async function load({ params, locals: { getSession, supabase } }) {
	const session = await getSession();
	if (!session) {
		// the user is not signed in
		throw redirect(302, `/auth/login?afterLogin=/orders/${params.orderId}`);
	}

	const { data: order } = await getOrder(supabase, params.orderId);

	if (!order) {
		throw redirect(303, '/');
	}

	if (order.payee.id == session.user.id) {
		throw redirect(303, `/orders/${params.orderId}/payee`);
	}

	const { data: orderItems } = await getOrderItems(supabase, params.orderId, session.user.id);

	return {
		order,
		orderItems
	};
}
