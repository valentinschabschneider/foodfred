import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../../../types/supabase';
import { getRestaurant } from './restaurant';
import { getUser } from './user';

export async function getOrder(client: SupabaseClient<Database>, orderId: string) {
	return client
		.from('orders')
		.select()
		.eq('id', orderId)
		.maybeSingle()
		.then(async (res) => {
			if (!res.data)
				return {
					...res,
					data: null
				};

			const restaurant = (await getRestaurant(client, res.data.restaurant_id)).data!;

			const payee = (await getUser(client, res.data.payee_id)).data!;

			return {
				...res,
				data: mapToModel(res.data, restaurant, payee)
			};
		});
}

function mapToModel(
	order: Database['public']['Tables']['orders']['Row'],
	restaurant: Restaurant,
	payee: User
) {
	return {
		id: order.id,
		status: order.status,
		restaurant: restaurant,
		payee: payee
	} as Order;
}
