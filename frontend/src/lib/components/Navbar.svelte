<script lang="ts">
	import { goto } from '$app/navigation';
	import type { FoodFredSupabaseClient } from '$supabase/types/FoodFredSupabaseClient';
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
	import { Icon } from 'flowbite-svelte-icons';
	import { getContext } from 'svelte';
	import { toast } from 'svelte-sonner';
	import UserCard from './UserCard.svelte';

	export let user: User | null;

	const supabase: FoodFredSupabaseClient = getContext('supabase');

	const handleSignOut = () => {
		supabase.auth.signOut().then(() => {
			toast.success('Signed out');
			goto('/auth/login');
		});
	};
</script>

<Navbar
	style="z-index: 99; position: relative;"
	navClass="bg-transparent dark:bg-transparent p-2 pb-0"
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
		<div class="flex items-center md:order-2">
			<Avatar id="avatar-menu" src={user?.image} />
		</div>
		<Dropdown placement="bottom" triggeredBy="#avatar-menu">
			{#if user}
				<DropdownHeader>
					<UserCard {user} hideImage />
				</DropdownHeader>
				<DropdownItem href="/profile" class="flex">
					<Icon name="profile-card-outline" class="mr-2" />Profile
				</DropdownItem>
			{/if}
			<!-- <DropdownItem>Settings</DropdownItem> -->
			<DropdownItem
				href="https://github.com/valentinschabschneider/foodfred"
				target="blank"
				class="flex"
			>
				<Icon name="github-solid" class="mr-2" />GitHub
			</DropdownItem>
			<DropdownDivider />
			{#if user}
				<DropdownItem on:click={handleSignOut}>Sign out</DropdownItem>
			{:else}
				<DropdownItem href="/auth/login?mode=signIn">Sign in</DropdownItem>
			{/if}
		</Dropdown>
	</div>
</Navbar>
