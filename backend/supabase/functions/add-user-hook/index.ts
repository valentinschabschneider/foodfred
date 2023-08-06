// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.31.0";

console.log("Hello from new user webhook!");

serve(async (req) => {
	const user = (await req.json()).record;

	console.log(user);

	const supabaseClient = createClient(
		// Supabase API URL - env var exported by default.
		Deno.env.get("PUBLIC_SUPABASE_URL") ?? Deno.env.get("SUPABASE_URL") ?? "",
		// Supabase API ANON KEY - env var exported by default.
		Deno.env.get("PUBLIC_SUPABASE_SERVICE_KEY") ??
			Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ??
			""
	);

	const { error } = await supabaseClient.from("users").insert({
		id: user.id,
		auth_provider: user.raw_app_meta_data.provider,
		auth_provider_id: user.raw_user_meta_data.sub,
	});

	console.log(error);

	return new Response(null, { headers: { "Content-Type": "text/plain" } });
});
