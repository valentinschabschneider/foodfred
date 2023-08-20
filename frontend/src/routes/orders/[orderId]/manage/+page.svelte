<script lang="ts">
	import { Button, Chevron, Dropdown, DropdownItem, Modal, Tooltip } from 'flowbite-svelte';
	import { onMount } from 'svelte';

	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { PUBLIC_URL } from '$env/static/public';
	import OrderItemsCart from '$lib/components/OrderItemsCart.svelte';
	import OrderItemsCartGrouped from '$lib/components/OrderItemsCartGrouped.svelte';
	import OrderSummary from '$lib/components/OrderSummary.svelte';
	import UserCard from '$lib/components/UserCard.svelte';
	import { useOrder } from '$lib/stores/order';
	import { useOrderItems } from '$lib/stores/orderItems';
	import { updateOrder } from '$supabase/queries/order';
	import type { User } from '$supabase/types/User';
	import { Icon } from 'flowbite-svelte-icons';
	import { copy } from 'svelte-copy';
	import { toast } from 'svelte-sonner';

	export let data;

	let { supabase, session } = data;
	$: ({ supabase, session } = data);

	const currentUser = session!!.user!!;

	const { order } = useOrder(data.order);

	const { orderItems } = useOrderItems(data.orderItems, $order.id);

	function orderChanged() {
		if (browser && $order.payee.id != currentUser.id) {
			goto(`/orders/${$order.id}`);
		}
	}

	$: $order && orderChanged();

	let changePayeeModal = false;
	let changePayeeTo: User | null = null;

	async function updateOrderStatus(status: 'open' | 'locked' | 'closed') {
		const { data, error } = await updateOrder(supabase, { ...$order, status });
	}

	function updateOrderPayee(user: User | null) {
		updateOrder(supabase, { ...$order, payee: user! }).then(() => {
			goto(`/orders/${$order.id}`);
		});
	}

	const participantsEqual = (xs: User[], ys: User[]) =>
		xs.length === ys.length && [...xs].every((x) => ys.includes(x));

	async function fetchParticipants() {
		const newOtherParticipants = getOtherParticipants();

		if (!participantsEqual(otherParticipants, newOtherParticipants)) {
			toast.success('Participants changed!');
		}

		otherParticipants = newOtherParticipants;
	}

	onMount(() => {
		const orderItemsChannel = supabase
			.channel('order-items-changes')
			.on(
				'postgres_changes',
				{
					event: '*',
					schema: 'public',
					table: 'order_entries',
					filter: 'order_id=eq.' + $order.id
				},
				(payload) => {
					if ('consumer_id' in payload.new && payload.new['consumer_id'] != currentUser.id)
						fetchParticipants();
				}
			)
			.subscribe();

		return () => {
			orderItemsChannel.unsubscribe();
		};
	});

	function getOtherParticipants() {
		const users = $orderItems
			.map((item) => item.consumer)
			.filter((user) => user && user.id != $order.payee.id) as User[];

		return [...new Map(users.map((item) => [item['id'], item])).values()];
	}

	$: yourOrderItems = $orderItems.filter((item) => item.consumer?.id == $order.payee.id);
	let otherParticipants = getOtherParticipants();
</script>

<svelte:head>
	<title>Order at {$order.restaurant.name} - FoodFred</title>
</svelte:head>

<div class="flex gap-2 mb-8 justify-between">
	{#if $order.status == 'open'}
		<Button color="blue" on:click={() => updateOrderStatus('locked')}>
			<Icon name="lock-solid" class="mr-2" />Lock order
		</Button>
	{/if}

	{#if $order.status == 'locked'}
		<Button color="red" on:click={() => updateOrderStatus('closed')}>
			<Icon name="close-circle-solid" class="mr-2" />Close order</Button
		>
	{/if}

	{#if $order.status != 'closed'}
		<div>
			<Button disabled={otherParticipants.length == 0}
				><Chevron><Icon name="rotate-outline" class="mr-2" />Change payee</Chevron></Button
			>
			{#if otherParticipants.length == 0}
				<Tooltip>There are currently no other participants</Tooltip>
			{/if}

			<Dropdown>
				{#each otherParticipants as user}
					<DropdownItem
						on:click={() => {
							changePayeeModal = true;
							changePayeeTo = user;
						}}
					>
						<UserCard {user} disableHandleLink />
					</DropdownItem>
				{/each}
			</Dropdown>
		</div>
	{/if}

	<div
		use:copy={`${PUBLIC_URL}/orders/${$order.id}`}
		on:svelte-copy={() => toast.success('Copied link to clipboard!')}
	>
		<Button color="purple"><Icon name="share-nodes-solid" class="mr-2" />Share order</Button>
	</div>
</div>

<Modal title="Change payee" bind:open={changePayeeModal} autoclose>
	<p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">
		Are you sure you want to change the payee to <strong>{changePayeeTo?.name}</strong>?
	</p>
	<svelte:fragment slot="footer">
		<Button on:click={() => updateOrderPayee(changePayeeTo)}>Yes</Button>
		<Button color="alternative">No</Button>
	</svelte:fragment>
</Modal>

<div class="flex flex-col gap-8">
	{#if $order.status == 'locked'}
		<OrderSummary order={$order} orderItems={$orderItems} />
	{/if}

	<OrderItemsCart order={$order} items={yourOrderItems} userId={currentUser.id} />

	<OrderItemsCartGrouped order={$order} items={$orderItems} excludeUserId={currentUser.id} />
</div>
