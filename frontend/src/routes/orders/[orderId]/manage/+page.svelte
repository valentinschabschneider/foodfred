<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import OrderItemsCart from '$lib/components/OrderItemsCart.svelte';
	import OrderItemsCartGrouped from '$lib/components/OrderItemsCartGrouped.svelte';
	import OrderShare from '$lib/components/OrderShare.svelte';
	import OrderStateChangeOverlay from '$lib/components/OrderStateChangeOverlay.svelte';
	import OrderStateChanger from '$lib/components/OrderStateChanger.svelte';
	import OrderSummary from '$lib/components/OrderSummary.svelte';
	import PayeeChanger from '$lib/components/PayeeChanger.svelte';
	import { useOrder } from '$lib/stores/order';
	import { useOrderItems } from '$lib/stores/orderItems';

	export let data;

	let { currentUser } = data;
	$: ({ currentUser } = data);

	const { order } = useOrder(data.order);

	const { orderItems } = useOrderItems($order.id, data.orderItems);

	function orderChanged() {
		orderStatusChange = false;
		if (browser && $order.payee.id != currentUser?.id) {
			goto(`/orders/${$order.id}`);
		}
	}

	$: $order && orderChanged();

	$: yourOrderItems = $orderItems.filter((item) => item.consumer?.id == $order.payee.id);

	let orderStatusChange = false;

	let orderStateChangeCenterElement: HTMLElement;
</script>

<svelte:head>
	<title>Order at {$order.restaurant.name} - FoodFred</title>
</svelte:head>

{#if $order.status != 'closed'}
	<div class="flex gap-2 mb-8 justify-between">
		<div bind:this={orderStateChangeCenterElement}>
			<OrderStateChanger order={$order} on:change={() => (orderStatusChange = true)} />
		</div>

		<PayeeChanger order={$order} />

		<OrderShare order={$order} />
	</div>
{/if}

{#if orderStatusChange}
	<OrderStateChangeOverlay order={$order} component={orderStateChangeCenterElement} />
{/if}

<div class="flex flex-col gap-8">
	{#if $order.status == 'locked'}
		<OrderSummary order={$order} orderItems={$orderItems} />
	{/if}

	{#if currentUser != null}
		<OrderItemsCart order={$order} items={yourOrderItems} userId={currentUser.id} />

		<OrderItemsCartGrouped order={$order} items={$orderItems} excludeUserId={currentUser.id} />
	{/if}
</div>
