<script lang="ts">
	import { invalidate } from '$app/navigation';
	import { ProgressBar } from '@prgm/sveltekit-progress-bar';
	import { onMount } from 'svelte';
	import { Toaster } from 'svelte-sonner';
	import "../app.css";

	let { data, children } = $props();
	let { session, supabase }=data;

	onMount(() => {
		const { data } = supabase.auth.onAuthStateChange((_, newSession) => {
			if (newSession?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});

		return () => data.subscription.unsubscribe();
	});
</script>

<ProgressBar class="text-orange-600" />
<Toaster />

{@render children()}