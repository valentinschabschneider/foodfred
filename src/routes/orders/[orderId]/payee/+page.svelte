<script lang="ts">
	import { Avatar, Button, Chevron, Dropdown, DropdownItem, Modal } from 'flowbite-svelte';
	import { onMount } from 'svelte';

	import { URL } from '$env/static/private';
	import OrderItemsCart from '$lib/components/OrderItemsCart.svelte';
	import OrderItemsCartGrouped from '$lib/components/OrderItemsCartGrouped.svelte';
	import OrderSummary from '$lib/components/OrderSummary.svelte';
	import { getOrder, updateOrder } from '$lib/queries/order.js';
	import { Icon } from 'flowbite-svelte-icons';
	import { copy } from 'svelte-copy';
	import { toast } from 'svelte-sonner';

	export let data;

	let { supabase } = data;
	$: ({ supabase } = data);

	let { order, orderItems } = data;

	let changePayeeModal = false;
	let changePayeeTo: null | string = null;

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

	function updateOrderStatus(status: 'open' | 'locked' | 'closed') {
		updateOrder(supabase, { ...order, status });
	}

	onMount(() => {
		const channel = supabase
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

		return () => channel.unsubscribe();
	});

	const yourOrderItems = orderItems.filter((item) => item.consumer.id == order.payee.id);
	const otherParticipants = orderItems
		.map((item) => item.consumer)
		.filter((user) => user.id != order.payee.id);
	const notYourOrderItems = orderItems.filter((item) => item.consumer.id != order.payee.id);
</script>

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
							changePayeeTo = user.name;
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
		use:copy={`${URL}/orders/${order.id}`}
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
		Are you sure you want to change the payee to <strong>{changePayeeTo}</strong>?
	</p>
	<svelte:fragment slot="footer">
		<Button on:click={() => alert('Handle "success"')}>Yes</Button>
		<Button color="alternative">No</Button>
	</svelte:fragment>
</Modal>

<OrderItemsCart {order} items={yourOrderItems} />

<OrderItemsCartGrouped {order} items={notYourOrderItems} />
