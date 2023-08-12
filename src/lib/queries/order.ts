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
				data: {
					id: res.data.id,
					status: res.data.status,
					restaurant: restaurant,
					payee: payee
				} as Order
			};
		});
}

export async function updateOrder(client: SupabaseClient<Database>, order: Order) {
	const model = {
		status: order.status
	};

	return client.from('orders').update(model).eq('id', order.id);
}
