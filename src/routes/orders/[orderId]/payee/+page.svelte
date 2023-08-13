<script lang="ts">
	import { Avatar, Button, Chevron, Dropdown, DropdownItem, Modal } from 'flowbite-svelte';
	import { onMount } from 'svelte';

	import { goto } from '$app/navigation';
	import { PUBLIC_URL } from '$env/static/public';
	import OrderItemsCart from '$lib/components/OrderItemsCart.svelte';
	import OrderItemsCartGrouped from '$lib/components/OrderItemsCartGrouped.svelte';
	import OrderSummary from '$lib/components/OrderSummary.svelte';
	import { getOrder, updateOrder } from '$supabase/queries/order';
	import { getOrderItems } from '$supabase/queries/orderItems.js';
	import type { User } from '$supabase/types/User';
	import { Icon } from 'flowbite-svelte-icons';
	import { copy } from 'svelte-copy';
	import { toast } from 'svelte-sonner';

	export let data;

	let { supabase, session } = data;
	$: ({ supabase, session } = data);

	const currentUser = session!!.user!!;

	let { order, orderItems } = data;

	let changePayeeModal = false;
	let changePayeeTo: User | null = null;

	//duplicate
	function fetchOrder() {
		getOrder(supabase, order.id).then((o) => {
			const changedOrder = o.data!;

			if (order.status != changedOrder.status) {
				toast.info(`Status changed to ${changedOrder.status}!`);
			}

			if (order.payee.id != changedOrder.payee.id) {
				toast.info(`Payee changed to ${changedOrder.payee.name}!`);
			}

			order = changedOrder!;
		});
	}

	async function updateOrderStatus(status: 'open' | 'locked' | 'closed') {
		const { data, error } = await updateOrder(supabase, { ...order, status });
		console.log(data, error);
	}

	function updateOrderPayee(user: User | null) {
		updateOrder(supabase, { ...order, payee: user! }).then(() => {
			goto(`/orders/${order.id}`);
		});
	}

	const participantsEqual = (xs: User[], ys: User[]) =>
		xs.length === ys.length && [...xs].every((x) => ys.includes(x));

	async function fetchParticipants() {
		const newOtherParticipants = getOtherParticipants(
			(await getOrderItems(supabase, order.id)).data!
		);

		if (!participantsEqual(otherParticipants, newOtherParticipants)) {
			toast.success('Participants changed!');
		}

		otherParticipants = newOtherParticipants;
	}

	onMount(() => {
		const orderChannel = supabase
			.channel('order-changes')
			.on(
				'postgres_changes',
				{
					event: '*',
					schema: 'public',
					table: 'orders',
					filter: 'id=eq.' + order.id
				},
				fetchOrder
			)
			.subscribe();

		const orderItemsChannel = supabase
			.channel('order-items-changes')
			.on(
				'postgres_changes',
				{
					event: '*',
					schema: 'public',
					table: 'order_entries',
					filter: 'order_id=eq.' + order.id
				},
				(payload) => {
					if ('consumer_id' in payload.new && payload.new['consumer_id'] != currentUser.id)
						fetchParticipants();
				}
			)
			.subscribe();

		return () => {
			orderChannel.unsubscribe();
			orderItemsChannel.unsubscribe();
		};
	});

	function getOtherParticipants() {
		const users = orderItems
			.map((item) => item.consumer)
			.filter((user) => user && user.id != order.payee.id) as User[];

		return [...new Map(users.map((item) => [item['id'], item])).values()];
	}

	const yourOrderItems = orderItems.filter((item) => item.consumer?.id == order.payee.id);
	let otherParticipants = getOtherParticipants();
</script>

<svelte:head>
	<title>Order at {order.restaurant.name} - FoodFred</title>
</svelte:head>

<div class="flex gap-2 mb-8 justify-between">
	{#if order.status == 'open'}
		<Button color="blue" on:click={() => updateOrderStatus('locked')}>
			<Icon name="lock-solid" /><span class="ml-2">Lock order</span>
		</Button>
	{/if}

	{#if order.status == 'locked'}
		<Button color="red" on:click={() => updateOrderStatus('closed')}>
			<Icon name="close-circle-solid" /><span class="ml-2">Close order</span>
		</Button>
	{/if}

	{#if order.status != 'closed' && otherParticipants.length > 0}
		<div>
			<Button><Chevron>Change payee</Chevron></Button>
			<Dropdown>
				{#each otherParticipants as user}
					<DropdownItem
						on:click={() => {
							changePayeeModal = true;
							changePayeeTo = user;
						}}
					>
						<div class="flex gap-2 items-center">
							<Avatar src={user.image} rounded />
							<div class="flex flex-col gap-1">
								<span>{user.name}</span>
								<span class="text-xs">{user.handle}</span>
							</div>
						</div>
					</DropdownItem>
				{/each}
			</Dropdown>
		</div>
	{/if}

	<div
		use:copy={`${PUBLIC_URL}/orders/${order.id}`}
		on:svelte-copy={() => toast.success('Copied link to clipboard!')}
	>
		<Button color="purple">Share order</Button>
	</div>
</div>

{#if order.status == 'locked'}
	<OrderSummary bind:order bind:orderItems />
{/if}

<Modal title="Change payee" bind:open={changePayeeModal} autoclose>
	<p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">
		Are you sure you want to change the payee to <strong>{changePayeeTo?.name}</strong>?
	</p>
	<svelte:fragment slot="footer">
		<Button on:click={() => updateOrderPayee(changePayeeTo)}>Yes</Button>
		<Button color="alternative">No</Button>
	</svelte:fragment>
</Modal>

<OrderItemsCart {order} items={yourOrderItems} userId={currentUser.id} />

<OrderItemsCartGrouped {order} items={orderItems} excludeUserId={currentUser.id} />
