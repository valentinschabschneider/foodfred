import type { SupabaseClient } from '@supabase/supabase-js';
import { query } from '../helpers/query';
import type { Database } from '../types/Database';
import type { Order } from '../types/Order';
import { getRestaurant } from './restaurant';
import { getUser } from './user';

type OrderRow = Database['public']['Tables']['orders']['Row'];

export function getOrder(client: SupabaseClient<Database>, orderId: string) {
	const orderQuery = client.from('orders').select().eq('id', orderId).maybeSingle();

	return query(orderQuery, (data) => mapOrder(client, data));
}

export function getOrders(client: SupabaseClient<Database>) {
	const ordersQuery = client.from('orders').select().order('created_at', { ascending: false });

	return query(ordersQuery, (data) => mapOrders(client, data));
}

export function updateOrder(client: SupabaseClient<Database>, order: Order) {
	const model = {
		status: order.status,
		payee_id: order.payee.id
	};

	return client.from('orders').update(model).eq('id', order.id);
}

async function mapOrders(client: SupabaseClient<Database>, orders: OrderRow[]) {
	return Promise.all(orders.map((order) => mapOrder(client, order)));
}

async function mapOrder(client: SupabaseClient<Database>, order: OrderRow) {
	const restaurant = (await getRestaurant(client, order.restaurant_id)).data!;

	const payee = (await getUser(client, order.payee_id)).data!;

	return {
		id: order.id,
		createdAt: new Date(order.created_at),
		status: order.status,
		restaurant: restaurant,
		payee: payee
	} as Order;
}
