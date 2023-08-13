import { URL } from '$env/static/private';
import { redirect } from '@sveltejs/kit';

export async function load({ url, locals: { getSession } }) {
	const session = await getSession();
	if (session) {
		// the user is already signed in
		throw redirect(302, `/auth/user`);
	}

	const afterLogin = url.searchParams.get('afterLogin');

	return {
		afterLogin: URL + (afterLogin || '/auth/user/')
	};
}
