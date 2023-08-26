<script lang="ts">
	import { browser } from '$app/environment';
	import { QueryClient, QueryClientProvider } from '@sveltestack/svelte-query';
	import '../app.postcss';

	import { invalidate } from '$app/navigation';
	import { ProgressBar } from '@prgm/sveltekit-progress-bar';
	import { onMount, setContext } from 'svelte';
	import { Toaster } from 'svelte-sonner';

	export let data;

	$: ({ supabase, session, currentUser } = data);

	onMount(() => {
		const {
			data: { subscription }
		} = supabase.auth.onAuthStateChange((event, _session) => {
			if (_session?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});

		return () => subscription.unsubscribe();
	});

	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				enabled: browser
			}
		}
	});

	$: if (supabase) setContext('supabase', supabase);
	// $: if (session) setContext('session', session);
</script>

<ProgressBar class="text-orange-600" />

<QueryClientProvider client={queryClient}>
	<slot />
	<Toaster />
</QueryClientProvider>
