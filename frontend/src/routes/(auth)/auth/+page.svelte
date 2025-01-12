<script lang="ts">
	import SlackIcon from '$lib/components/icons/SlackIcon.svelte';
	import type { Provider } from '@supabase/supabase-js';
	import { Button } from 'flowbite-svelte';

		let { data } = $props();
		let { supabase, afterLogin } = data;

		function signInWithOAuth(provider: Provider) {
		supabase.auth.signInWithOAuth({
			provider: provider,
			options: {
				redirectTo: afterLogin
			}
		});
	}
</script>

<!-- <form method="POST" action="?/login">
	<label>
		Email
		<input name="email" type="email" />
	</label>
	<label>
		Password
		<input name="password" type="password" />
	</label>
	<button>Login</button>
	<button formaction="?/signup">Sign up</button>
</form> -->

<Button on:click={() => signInWithOAuth('slack')} color="alternative">
	<SlackIcon class="mr-2" />Slack
</Button>