<script lang="ts">
	import { useOrderItems } from '$lib/stores/orderItems';
	import { updateOrder } from '$supabase/queries/order';
	import type { FoodFredSupabaseClient } from '$supabase/types/FoodFredSupabaseClient';
	import type { Order } from '$supabase/types/Order';
	import type { User } from '$supabase/types/User';
	import {
		Button,
		Chevron,
		Dropdown,
		DropdownItem,
		Modal,
		P,
		Span,
		Tooltip
	} from 'flowbite-svelte';
	import { Icon } from 'flowbite-svelte-icons';
	import { getContext } from 'svelte';
	import { toast } from 'svelte-sonner';
	import UserCard from './UserCard.svelte';

	export let order: Order;

	const { orderItems } = useOrderItems(order.id);

	const supabase: FoodFredSupabaseClient = getContext('supabase');

	let showModal = false;
	let changePayeeTo: User | null = null;
	let showDropdown = false;
	let loading = false;

	function updateOrderPayee(user: User | null) {
		loading = true;
		updateOrder(supabase, { ...order, payee: user! }).then((response) => {
			if (response.error) {
				toast.error(response.error.message);
				loading = false;
			}
		});
	}

	const participantsEqual = (xs: User[], ys: User[]) =>
		xs.length === ys.length && [...xs].every((x) => ys.includes(x));

	async function fetchParticipants() {
		const newOtherParticipants = getOtherParticipants();

		if (!participantsEqual(users, newOtherParticipants)) {
			toast.success('Participants changed!');
		}

		users = newOtherParticipants;
	}

	$: $orderItems && fetchParticipants();

	function getOtherParticipants() {
		const users = $orderItems
			.map((item) => item.consumer)
			.filter((user) => user && user.id != order.payee?.id) as User[];

		return [...new Map(users.map((item) => [item['id'], item])).values()];
	}

	let users = getOtherParticipants();
</script>

<div class={`${$$props.class}`}>
	<Button disabled={users.length == 0}
		><Chevron
			><span
				class="mr-2 transition-transform duration-300"
				class:rotate-180={showDropdown || showModal}><Icon name="rotate-outline" /></span
			>Change payee</Chevron
		></Button
	>
	{#if users.length == 0}
		<Tooltip>There are currently no other participants</Tooltip>
	{/if}

	<Dropdown on:show={() => (showDropdown = !showDropdown)}>
		{#each users as user}
			<DropdownItem
				on:click={() => {
					showModal = true;
					changePayeeTo = user;
				}}
			>
				<UserCard {user} disableHandleLink />
			</DropdownItem>
		{/each}
	</Dropdown>

	<Modal title="Change payee" bind:open={showModal}>
		<P class="text-base leading-relaxed text-gray-800 dark:text-gray-200">
			Are you sure you want to change the payee to <Span class="font-bold"
				>{changePayeeTo?.name}</Span
			>?
		</P>
		<svelte:fragment slot="footer">
			<Button {loading} on:click={() => updateOrderPayee(changePayeeTo)}>Yes</Button>
			<Button color="alternative" on:click={() => (showModal = false)}>No</Button>
		</svelte:fragment>
	</Modal>
</div>
