import { getOrdersForUser } from '$supabase/queries/order';
import { error, redirect } from '@sveltejs/kit';

export async function load({ locals: { session, supabase } }) {
	if (!session) {
		throw redirect(302, `/auth`);
	}

	const { data: orders, error: orderError } = await getOrdersForUser(supabase, session.user.id);

	if (orderError || !orders) {
		throw error(500, 'Orders not found');
	}

	return {
		orders
	};
}
