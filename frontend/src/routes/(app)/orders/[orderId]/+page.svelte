<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import OrderItemsCart from '$lib/components/OrderItemsCart.svelte';
	import UserCard from '$lib/components/UserCard.svelte';
	import { useOrder } from '$lib/stores/order';
	import { useOrderItems } from '$lib/stores/orderItems';
	import { A, Heading, P, Span } from 'flowbite-svelte';

	export let data;

	let { session } = data;
	$: ({ session } = data);

	const currentUser = session!!.user!!;

	const { order } = useOrder(data.order);

	const { orderItems } = useOrderItems($order.id, undefined, data.orderItems);
	$: yourOrderItems = $orderItems.filter((item) => item.consumer?.id == currentUser.id);

	function orderChanged() {
		if (browser && $order.payee.id == currentUser.id) {
			goto(`/orders/${$order.id}/manage`);
		}
	}

	$: $order && orderChanged();

	$: total = $orderItems.reduce((acc, item) => acc + item.price, 0);
</script>

<svelte:head>
	<title>Order at {$order.restaurant.name} by {$order.payee.name} - FoodFred</title>
</svelte:head>

<div class="flex flex-col gap-8">
	<div class="flex items-center w-full">
		<UserCard
			user={$order.payee}
			class="bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md p-2 flex-shrink-0"
		/>

		<Heading tag="h3" class="ml-4">wants to order at <Span>{$order.restaurant.name}</Span></Heading>
	</div>

	<div>
		{#if $order.status == 'locked'}
			<P>Order is locked!</P>
		{:else if $order.status == 'closed'}
			<P>Order is closed... Pay up!</P>
			{#if $order.payee.handle}
				<A href={`https://paypal.me/${$order.payee.handle}/${total}EUR`} target="_blank">Pay</A>
			{:else}
				<P>Payee has not set up a payment method yet.</P>
			{/if}
		{/if}
	</div>

	<OrderItemsCart order={$order} items={yourOrderItems} manageAsUserId={currentUser.id} />
</div>
