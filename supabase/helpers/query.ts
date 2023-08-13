import type { PostgrestBuilder } from '@supabase/postgrest-js';
import type { PostgrestSingleResponse } from '@supabase/supabase-js';

export async function query<T>(
	builder: PostgrestBuilder<any>,
	mapData: (data: any) => T
): Promise<PostgrestSingleResponse<Awaited<T> | null>> {
	return await builder.then(async (res) => {
		if (!res.data || !mapData) return res;
		if (!res.data) return { ...res, data: null };

		return {
			...res,
			data: (await mapData(res.data)) as T
		} as PostgrestSingleResponse<T>;
	});
}
