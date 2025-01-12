<script lang="ts">
	import { goto } from '$app/navigation';
	import type { User } from '$supabase/types/User';
	import {
		Avatar,
		DarkMode,
		Dropdown,
		DropdownDivider,
		DropdownHeader,
		DropdownItem,
		NavBrand,
		Navbar
	} from 'flowbite-svelte';
	import { GithubSolid, ProfileCardOutline } from 'flowbite-svelte-icons';
	import UserCard from './UserCard.svelte';

	interface Props {
		user: User | null;
	}

	let { user }: Props = $props();

	const handleSignOut = () => {
		goto('/auth/sign-out');
	};
</script>

<Navbar
	style="z-index: 99; position: relative;"
	class="bg-transparent dark:bg-transparent p-2 pb-0"
>
	<NavBrand href="/">
		<img src="/favicon.png" class="mr-3 h-6 sm:h-9" alt="FoodFred Logo" />
		<span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
			FoodFred
		</span>
	</NavBrand>
	<!-- <NavUl {hidden}>
		<NavLi href="/" active={true}>Home</NavLi>
		<NavLi href="/about">About</NavLi>
		<NavLi href="/docs/components/navbar">Navbar</NavLi>
		<NavLi href="/pricing">Pricing</NavLi>
		<NavLi href="/contact">Contact</NavLi>
	</NavUl> -->
	<div class="flex gap-2">
		<DarkMode />
		<div class="flex items-center md:order-2 cursor-pointer">
			<Avatar id="avatar-menu" src={user?.image} class="hover:grayscale" />
		</div>
		<Dropdown placement="bottom" triggeredBy="#avatar-menu">
			{#if user}
				<DropdownHeader>
					<UserCard {user} hideImage />
				</DropdownHeader>
				<DropdownItem href="/profile" class="flex">
					<ProfileCardOutline class="mr-2" />Profile
				</DropdownItem>
			{/if}
			<!-- <DropdownItem>Settings</DropdownItem> -->
			<DropdownItem
				href="https://github.com/valentinschabschneider/foodfred"
				target="blank"
				class="flex"
			>
				<GithubSolid class="mr-2" />GitHub
			</DropdownItem>
			<DropdownDivider />
			{#if user}
				<DropdownItem on:click={handleSignOut}>Sign out</DropdownItem>
			{:else}
				<DropdownItem href="/auth?mode=signIn">Sign in</DropdownItem>
			{/if}
		</Dropdown>
	</div>
</Navbar>
