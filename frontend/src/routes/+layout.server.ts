import { getUser } from '$supabase/queries/user';

export const load = async ({ locals: { supabase, getSession } }) => {
	const session = await getSession();
	const currentUser = session?.user ? (await getUser(supabase, session.user.id)).data : null;

	return {
		session,
		currentUser
	};
};
