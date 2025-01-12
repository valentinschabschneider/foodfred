// import { redirect } from '@sveltejs/kit';

// import type { Actions } from './$types';

export async function load({ url }) {
	const afterLogin = url.searchParams.get('afterLogin') ?? '/profile2';

	return {
		afterLogin: url.origin + afterLogin
	};
}

// export const actions: Actions = {
// 	signup: async ({ request, locals: { supabase } }) => {
// 		const formData = await request.formData();
// 		const email = formData.get('email') as string;
// 		const password = formData.get('password') as string;

// 		const { error } = await supabase.auth.signUp({ email, password });
// 		if (error) {
// 			console.error(error);
// 			redirect(303, '/auth/error');
// 		} else {
// 			redirect(303, '/profile');
// 		}
// 	},
// 	login: async ({ request, locals: { supabase } }) => {
// 		const formData = await request.formData();
// 		const email = formData.get('email') as string;
// 		const password = formData.get('password') as string;

// 		const { error } = await supabase.auth.signInWithPassword({ email, password });
// 		if (error) {
// 			console.error(error);
// 			redirect(303, '/auth/error');
// 		} else {
// 			redirect(303, '/profile');
// 		}
// 	}
// };
