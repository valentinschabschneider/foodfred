import type { FoodFredSupabaseClient } from "../types/FoodFredSupabaseClient";
import type { AddOrderItem, OrderItem } from "../types/OrderItem";
import { getUser } from "./user";

export async function getOrderItems(
	client: FoodFredSupabaseClient,
	orderId: string,
	cunsumerId: string | undefined = undefined
) {
	let query = client
		.from("order_entries")
		.select()
		.eq("order_id", orderId)
		.order("created_at");

	if (cunsumerId) {
		query = query.eq("consumer_id", cunsumerId);
	}

	return query.then(async (res) => {
		return {
			...res,
			data: res.data
				? await Promise.all(
						res.data.map(async (orderItem) => {
							const consumer = orderItem.consumer_id
								? (await getUser(client, orderItem.consumer_id)).data!
								: null;

							return {
								id: orderItem.id,
								consumer: consumer,
								name: orderItem.product_name,
								price: orderItem.price_in_cents / 100,
								note: orderItem.note,
								status: "open",
							} as OrderItem;
						})
				  )
				: [],
		};
	});
}

export async function addOrderItem(
	client: FoodFredSupabaseClient,
	orderId: string,
	orderItem: AddOrderItem
) {
	const model = {
		consumer_id: orderItem.consumerId,
		product_name: orderItem.name,
		price_in_cents: orderItem.price! * 100,
		note: orderItem.note,
		order_id: orderId,
	};

	return client.from("order_entries").insert(model);
}

export async function removeOrderItem(
	client: FoodFredSupabaseClient,
	orderItem: OrderItem
) {
	return client.from("order_entries").delete().match({ id: orderItem.id });
}

export async function updateOrderItem(
	client: FoodFredSupabaseClient,
	orderId: string,
	orderItem: OrderItem
) {
	const model = {
		product_name: orderItem.name!,
		price_in_cents: orderItem.price! * 100,
		note: orderItem.note,
	};

	return client.from("order_entries").update(model).eq("id", orderItem.id);
}
