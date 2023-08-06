<script lang="ts">
	export let data;

	let { supabase } = data;
	$: ({ supabase } = data);

	function signInWithSlack() {
		supabase.auth.signInWithOAuth({
			provider: 'slack'
		});
	}
</script>

<button on:click={signInWithSlack}>Sign in with Slack</button>
