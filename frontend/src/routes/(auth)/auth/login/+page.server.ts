import { PUBLIC_URL } from '$env/static/public';
import { redirect } from '@sveltejs/kit';

export async function load({ url, locals: { getSession } }) {
	const session = await getSession();
	if (session) {
		// the user is already signed in
		throw redirect(302, `/profile`);
	}

	const afterLogin = url.searchParams.get('afterLogin');

	const mode = (url.searchParams.get('mode') as 'signUp' | 'signIn') ?? 'signIn';

	return {
		afterLogin: PUBLIC_URL + (afterLogin || '/profile'),
		mode
	};
}
