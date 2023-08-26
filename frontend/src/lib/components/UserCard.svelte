<script lang="ts">
	import type { User } from '$supabase/types/User';
	import { A, Avatar, P } from 'flowbite-svelte';

	export let user: User;
	export let disableHandleLink: boolean = false;
	export let hideImage: boolean = false;
</script>

<div class={`flex gap-2 items-center ${$$props.class}`}>
	{#if !hideImage}
		<Avatar src={user.image} rounded />
	{/if}
	<div class="flex flex-col gap-1">
		<P class="font-semibold">{user.name}</P>
		{#if user.handle}
			{#if disableHandleLink}
				<P class="text-xs">{user.handle}</P>
			{:else}
				<A href={`https://whatever.com/user/${user.handle}`} class="text-xs">{user.handle}</A>
			{/if}
		{/if}
	</div>
</div>
