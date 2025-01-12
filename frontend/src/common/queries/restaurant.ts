import type { Database } from "../types/Database";
import type { FoodFredSupabaseClient } from "../types/FoodFredSupabaseClient";
import type { Restaurant } from "../types/Restaurant";

export async function getRestaurant(
	client: FoodFredSupabaseClient,
	restaurantId: string
) {
	return client
		.from("restaurants")
		.select()
		.eq("id", restaurantId)
		.maybeSingle()
		.then((res) => {
			return {
				...res,
				data: res.data ? mapToModel(res.data) : null,
			};
		});
}

function mapToModel(
	restaurant: Database["public"]["Tables"]["restaurants"]["Row"]
) {
	return {
		id: restaurant.id,
		name: restaurant.name,
	} as Restaurant;
}
