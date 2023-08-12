import { redirect } from '@sveltejs/kit';

export async function load({ locals: { getSession } }) {
	const session = await getSession();
	if (!session) {
		// the user is already signed in
		throw redirect(302, `/auth/login`);
	}
}
