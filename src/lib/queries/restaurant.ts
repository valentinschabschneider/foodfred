import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../../../types/supabase';

export async function getRestaurant(client: SupabaseClient<Database>, restaurantId: string) {
	return client
		.from('restaurants')
		.select()
		.eq('id', restaurantId)
		.maybeSingle()
		.then((res) => {
			return {
				...res,
				data: res.data ? mapToModel(res.data) : null
			};
		});
}

function mapToModel(restaurant: Database['public']['Tables']['restaurants']['Row']) {
	return {
		id: restaurant.id,
		name: restaurant.name
	} as Restaurant;
}
