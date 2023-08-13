import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../types/Database';
import type { User } from '../types/User';

export async function getUser(client: SupabaseClient<Database>, userId: string) {
	return await client
		.from('users')
		.select()
		.eq('id', userId)
		.maybeSingle()
		.then((res) => {
			return {
				...res,
				data: res.data ? mapToModel(res.data) : null
			};
		});
}

function mapToModel(user: Database['public']['Tables']['users']['Row']) {
	return {
		id: user.id,
		name: user.display_name,
		image: user.image_url,
		handle: '@todo'
	} as User;
}
