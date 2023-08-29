<script lang="ts">
	import { goto } from '$app/navigation';
	import SlackIcon from '$lib/components/icons/SlackIcon.svelte';
	import type { Provider } from '@supabase/supabase-js';
	import { A, Button, Hr, Input, P, Span } from 'flowbite-svelte';
	import { Icon } from 'flowbite-svelte-icons';
	import { toast } from 'svelte-sonner';

	export let data;

	let { supabase, mode } = data;
	$: ({ supabase } = data);

	let email: string;
	let password: string;
	let displayName: string;

	function signUpWithPassword() {
		supabase.auth
			.signUp({
				email,
				password,
				options: {
					data: {
						name: displayName
					},
					emailRedirectTo: data.afterLogin
				}
			})
			.then(() => toast.success('Check your email for the confirmation link'));
	}

	function signInWithPassword() {
		supabase.auth
			.signInWithPassword({
				email,
				password
				// options: {
				// 		emailRedirectTo: data.afterLogin
				// }
			})
			.then(() => goto('/profile'));
	}

	function signInWithOAuth(provider: Provider) {
		supabase.auth.signInWithOAuth({
			provider: provider
			// options: {
			// 	redirectTo: data.afterLogin // doesnt work :(
			// }
		});
	}
</script>

<svelte:head>
	{#if mode === 'signIn'}
		<title>Sign in - FoodFred</title>
	{:else if mode === 'signUp'}
		<title>Sign up - FoodFred</title>
	{/if}
</svelte:head>

<div class="flex flex-col gap-6">
	<div>
		<P>
			{#if mode === 'signIn'}
				Sign in with
			{:else if mode === 'signUp'}
				Sign up with
			{/if}
		</P>
		<div class="mt-2 flex flex-col gap-1">
			<Button on:click={() => signInWithOAuth('slack')} color="alternative">
				<SlackIcon class="mr-2" />Slack
			</Button>
			<Button on:click={() => signInWithOAuth('google')} color="alternative">
				<Icon name="google-solid" class="mr-2" />Google
			</Button>
		</div>
	</div>

	<div class="flex gap-4 h-10 items-center">
		<Hr />
		<Span class="whitespace-nowrap text-sm font-normal text-gray-400 dark:text-gray-200">
			or continue with
		</Span>
		<Hr />
	</div>

	<form
		on:submit={() => {
			if (mode == 'signIn') signInWithPassword();
			else signUpWithPassword();
		}}
		class="flex flex-col gap-2"
	>
		<Input
			id="email"
			type="email"
			placeholder="Email"
			required
			bind:value={email}
			class="bg-transparent dark:bg-transparent"
			size="lg"
		>
			<Icon name="envelope-solid" slot="left" class="w-5 h-5 text-gray-500 dark:text-gray-400" />
		</Input>
		<Input
			id="password"
			type="password"
			placeholder="Password"
			required
			bind:value={password}
			class="bg-transparent dark:bg-transparent"
			size="lg"
		>
			<Icon name="lock-solid" slot="left" class="w-5 h-5 text-gray-500 dark:text-gray-400" />
		</Input>

		{#if mode === 'signUp'}
			<Input
				id="displayName"
				type="text"
				placeholder="Name"
				required
				bind:value={displayName}
				class="bg-transparent dark:bg-transparent"
				size="lg"
			>
				<Icon name="user-solid" slot="left" class="w-5 h-5 text-gray-500 dark:text-gray-400" />
			</Input>
		{/if}

		<Button type="submit" class="mt-2">
			{#if mode === 'signIn'}
				Sign in
			{:else if mode === 'signUp'}
				Sign up
			{/if}
		</Button>
	</form>

	<div class="flex flex-col gap-2">
		<P class="text-center text-sm">
			{#if mode === 'signIn'}
				<A on:click={() => (mode = 'signUp')}>Don't have an account? Sign up</A>
			{:else if mode === 'signUp'}
				<A on:click={() => (mode = 'signIn')}>Do you have an account? Sign in</A>
			{/if}
		</P>

		<P class="text-center text-sm">
			{#if mode === 'signIn'}
				<A on:click={() => alert('not implemented yet')}>Sign in with magic link</A>
			{:else if mode === 'signUp'}
				<A on:click={() => alert('not implemented yet')}>Sign up with magic link</A>
			{/if}
		</P>
	</div>
</div>
