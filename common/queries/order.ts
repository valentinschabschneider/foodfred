import { query } from "../helpers/query";
import type { Database } from "../types/Database";
import type { FoodFredSupabaseClient } from "../types/FoodFredSupabaseClient";
import type { Order } from "../types/Order";
import { getRestaurant } from "./restaurant";
import { getUser } from "./user";

type OrderRow = Database["public"]["Tables"]["orders"]["Row"];

export function getOrder(client: FoodFredSupabaseClient, orderId: string) {
	const orderQuery = client
		.from("orders")
		.select()
		.eq("id", orderId)
		.maybeSingle();

	return query(orderQuery, (data) => mapOrder(client, data));
}

export function getOrders(client: FoodFredSupabaseClient) {
	const ordersQuery = client
		.from("orders")
		.select()
		.order("created_at", { ascending: false });

	return query(ordersQuery, (data) => mapOrders(client, data));
}

export function updateOrder(client: FoodFredSupabaseClient, order: Order) {
	const model = {
		status: order.status,
		payee_id: order.payee.id,
	};

	return client.from("orders").update(model).eq("id", order.id);
}

function mapOrders(client: FoodFredSupabaseClient, orders: OrderRow[]) {
	return Promise.all(orders.map((order) => mapOrder(client, order)));
}

async function mapOrder(client: FoodFredSupabaseClient, order: OrderRow) {
	const restaurantPromise = getRestaurant(client, order.restaurant_id);

	const payeePromise = getUser(client, order.payee_id);

	return {
		id: order.id,
		createdAt: new Date(order.created_at),
		status: order.status,
		restaurant: (await restaurantPromise).data!,
		payee: (await payeePromise).data!,
	} as Order;
}
