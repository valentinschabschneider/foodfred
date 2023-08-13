<script lang="ts">
	import type { Session } from '@supabase/supabase-js';
	import { Heading } from 'flowbite-svelte';
	import { onMount } from 'svelte';

	export let data;

	let { supabase } = data;
	$: ({ supabase } = data);

	let session: Session | null = null;

	onMount(async () => {
		session = (await supabase.auth.getSession()).data.session;
	});
</script>

<svelte:head>
	<title>FoodFred</title>
</svelte:head>

<Heading>FoodFred</Heading>

{#if session}
	<a href="/profile">your profile</a>
{:else}
	<a href="/auth/login">login</a>
{/if}
