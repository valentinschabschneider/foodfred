import {
	SupabaseClientOptions,
	createClient as createSupabaseClient,
	SupabaseClient as _SupabaseClient
} from 'https://esm.sh/@supabase/supabase-js@2';
import type { Database } from '../../../types/supabase.ts';

export type SupabaseClient = _SupabaseClient<Database>;

export const createClient = (
	role: 'anon' | 'service' = 'anon',
	// Create client with Auth context of the user that called the function.
	// This way your row-level-security (RLS) policies are applied.
	// {
	// 	global: {
	// 		headers: { Authorization: req.headers.get('Authorization')! }
	// 	}
	// }
	options?: SupabaseClientOptions<'public'> | undefined
) => {
	let supabaseKey;
	switch (role) {
		case 'anon':
			supabaseKey =
				// Public Supabase API ANON KEY - env var needs to be set manually.
				Deno.env.get('PUBLIC_SUPABASE_ANON_KEY') ??
				// Supabase API ANON KEY - env var exported by default.
				Deno.env.get('SUPABASE_ANON_KEY') ??
				'';
			break;
		case 'service':
			supabaseKey =
				// Public Supabase API SERVICE ROLE KEY - env var needs to be set manually.
				Deno.env.get('PUBLIC_SUPABASE_SERVICE_KEY') ??
				// Supabase API SERVICE ROLE KEY - env var exported by default.
				Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ??
				'';
			break;
	}

	const supabaseUrl =
		// Public Supabase API URL - env var needs to be set manually.
		Deno.env.get('PUBLIC_SUPABASE_URL') ??
		// Supabase API URL - env var exported by default.
		Deno.env.get('SUPABASE_URL') ??
		'';

	return createSupabaseClient<Database>(supabaseUrl, supabaseKey, options);
};
