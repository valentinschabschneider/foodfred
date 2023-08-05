<script lang="ts">
	import { enhance } from '$app/forms';
	export let form;

	export let data;

	let { supabase } = data;
	$: ({ supabase } = data);

	function signInWithGoogle() {
		supabase.auth.signInWithOAuth({
			provider: 'google'
		});
	}
</script>

<form method="post" use:enhance>
	<input name="email" value={form?.email ?? ''} />
	<input type="password" name="password" />
	<button>Sign up</button>
</form>

<button on:click={signInWithGoogle}>Sign in with Google</button>
