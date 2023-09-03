<script lang="ts">
	import { browser } from '$app/environment';
	import { afterNavigate } from '$app/navigation';
	import { A, Heading, P } from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';

	export let data;

	let { currentUser } = data;
	$: ({ currentUser } = data);

	const convo = [
		'pssst!',
		'hey you!',
		'are you hungry?',
		'well of course you are',
		"oh whats that you're saying?",
		"you're not the only one thats hungry?",
		'your friends | family | colleagues are as well!?!',
		"well let's get some food then",
		'but nah thats waaay too complicated isnt it',
		'you need talk to everyone, get them to decide what they want to get',
		'and then the worst part, getting everyone to pay...',
		'what a pain in the arse...',
		'...',
		"wait you're still here?",
		'what if i know a way to make this whole procedure easier?'
	];

	let convoIndex = 0;
	let convoFinished = currentUser !== null;

	afterNavigate(({ from }) => {
		convoFinished = convoFinished || from !== null;
	});

	onMount(() => {
		if (convoFinished) return;

		const interval = setInterval(() => {
			if (convoIndex >= convo.length - 1) {
				clearInterval(interval);

				setTimeout(() => {
					convoFinished = true;
				}, 1000);
			}

			convoIndex++;
		}, 3000);
	});
</script>

<svelte:head>
	<title>FoodFred</title>
</svelte:head>

<div class="h-[100px]">
	{#if browser}
		{#if !convoFinished}
			<div class="relative flex justify-center">
				{#key convoIndex}
					<div in:fly={{ y: 50, duration: 1000 }} out:fade class="absolute">
						<P>{convo[convoIndex] ?? ''}</P>
					</div>
				{/key}
			</div>
		{/if}
	{:else}
		<div class="hidden">
			{#each convo as text (text)}
				<p>{text}</p>
			{/each}
		</div>
	{/if}

	{#if convoFinished}
		<div class="flex gap-3 justify-center">
			<div in:fly={{ y: -50, duration: 3000 }}>
				<Heading class="text-center">Welcome to</Heading>
			</div>
			<div in:fly={{ y: 50, duration: 3000, delay: 1000 }}>
				<Heading class="text-center">FoodFred</Heading>
			</div>
		</div>
	{/if}
</div>

{#if convoFinished}
	<div in:fade={{ delay: 1000 }}>
		{#if !currentUser}
			<A href="/auth/login?mode=signUp">Sign up to get started</A>
		{/if}
	</div>
{/if}
