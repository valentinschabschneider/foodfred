<script lang="ts">
	export let data;

	let { supabase } = data;
	$: ({ supabase } = data);

	let email: string;
	let password: string;

	function signUpWithPassword() {
		supabase.auth.signUp({
			email,
			password,
			options: {
				emailRedirectTo: data.afterLogin
			}
		});
	}

	function signInWithPassword() {
		supabase.auth.signInWithPassword({
			email,
			password
		});
	}

	function signInWithSlack() {
		supabase.auth.signInWithOAuth({
			provider: 'slack',
			options: {
				redirectTo: data.afterLogin // doesnt work :(
			}
		});
	}

	console.log(data.afterLogin);
</script>

<svelte:head>
	<title>Login - FoodFred</title>
</svelte:head>

<div>
	<form on:submit={signUpWithPassword}>
		<input name="email" bind:value={email} />
		<input type="password" name="password" bind:value={password} />
		<button>Sign up</button>

		<button on:click={signInWithPassword}>Sign in</button>
	</form>
</div>

<button on:click={signInWithSlack}>Sign in with Slack</button>
