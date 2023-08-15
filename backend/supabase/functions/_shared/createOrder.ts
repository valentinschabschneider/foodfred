import { SupabaseClient } from "./supabaseClient";

export async function createOrder(
	restaurantName: string,
	userId: string,
	supabaseClient: SupabaseClient
): Promise<string> {
	const restaurant = await getOrCreateRestaurant(
		restaurantName,
		supabaseClient
	);

	const { data: order, error: orderError } = await supabaseClient
		.from("orders")
		.insert({ payee_id: userId, restaurant_id: restaurant.id })
		.select()
		.single();

	console.log("ord", order, orderError);

	return order!.id;
}

async function getOrCreateRestaurant(
	name: string,
	supabaseClient: SupabaseClient
) {
	const { data: existingRestaurant, error: queryRestaurantError } =
		await supabaseClient.from("restaurants").select().eq("name", name).single();

	console.log("exrest", existingRestaurant, queryRestaurantError);

	if (existingRestaurant) {
		return existingRestaurant;
	}

	const { data: newRestaurant, error: restaurantError } = await supabaseClient
		.from("restaurants")
		.insert({ name })
		.select()
		.single();

	console.log("rest", newRestaurant, restaurantError);

	return newRestaurant!;
}
