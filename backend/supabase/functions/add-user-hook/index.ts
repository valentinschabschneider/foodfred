import { serve } from "server";
// import { createClient } from '../_shared/supabaseClient';

console.warn("Deprecated!!!");
console.log("Hello from new user webhook!");

serve(async (req) => {
	const user = (await req.json()).record;

	console.log(user);

	// const supabaseClient = createClient();

	// const { error } = await supabaseClient.from('users').insert({
	// 	id: user.id,
	// 	auth_provider: user.raw_app_meta_data.provider,
	// 	auth_provider_id: user.raw_user_meta_data.sub
	// });

	// console.log(error);

	return new Response();
});
