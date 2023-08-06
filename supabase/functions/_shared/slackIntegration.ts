export const validateRequest = (req: Request) => {
	if (
		Deno.env.get('SLACK_HOOKS_TOKEN') &&
		new URL(req.url).searchParams.get('token') != Deno.env.get('SLACK_HOOKS_TOKEN')
	)
		throw new Error('Invalid token');
};
