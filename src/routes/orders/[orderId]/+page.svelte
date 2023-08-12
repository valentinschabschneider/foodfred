<script lang="ts">
	import OrderItemsCart from '$lib/components/OrderItemsCart.svelte';
	import { getOrder } from '$lib/queries/order.js';
	import { Avatar } from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import { toast } from 'svelte-sonner';

	export let data;

	let { order, orderItems } = data;

	let { supabase } = data;
	$: ({ supabase } = data);

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
</script>

<svelte:head>
	<title>Order by {order.payee.name}</title>
</svelte:head>

<div class="flex gap-2 items-center">
	<Avatar src={order.payee.image} rounded />
	<div class="flex flex-col gap-1">
		<span>{order.payee.name}</span>
		<span class="text-xs">{order.payee.handle}</span>
	</div>
</div>

<br />

<p>wants to order at</p>

<h2>{order.restaurant.name}</h2>

<br />

<OrderItemsCart {order} items={orderItems} />
