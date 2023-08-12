<script lang="ts">
	import { redirect } from '@sveltejs/kit';

	export let data;

	let { supabase } = data;
	$: ({ supabase } = data);

	const handleSignOut = async () => {
		await supabase.auth.signOut();
		redirect(302, '/auth/login');
	};
</script>

<button on:click={handleSignOut}>Sign out</button>
