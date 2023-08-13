import { getOrders } from '$supabase/queries/order';
import { error, redirect } from '@sveltejs/kit';

export async function load({ locals: { getSession, supabase } }) {
	const session = await getSession();
	if (!session) {
		// the user is already signed in
		throw redirect(302, `/auth/login`);
	}

	const { data: orders, error: orderError } = await getOrders(supabase);

	if (orderError || !orders) {
		throw error(500, 'Orders not found');
	}

	return {
		orders
	};
}
