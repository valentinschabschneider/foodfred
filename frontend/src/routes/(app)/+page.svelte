<script lang="ts">
	import { A, Heading } from 'flowbite-svelte';

	export let data;

	const { currentUser } = data;
</script>

<svelte:head>
	<title>FoodFred</title>
</svelte:head>

<div>
	<Heading class="text-center">Welcome to FoodFred</Heading>

	{#if currentUser}
		<A href="/profile">View your profile</A>
	{:else}
		<A href="/auth/login?mode=signUp">Sign up to get started</A>
	{/if}
</div>
