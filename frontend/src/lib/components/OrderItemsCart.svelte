<script lang="ts">
	import { page } from '$app/stores';
	import AddOrderItem from '$lib/components/AddOrderItem.svelte';
	import { getOrder } from '$supabase/queries/order';
	import {
		addOrderItem,
		getOrderItems,
		removeOrderItem,
		updateOrderItem
	} from '$supabase/queries/orderItems';
	import type { Order } from '$supabase/types/Order';
	import type { AddOrderItem as AddOrderItemType, OrderItem } from '$supabase/types/OrderItem';
	import type { PostgrestError } from '@supabase/supabase-js';
	import { Heading, List, Spinner } from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import { toast } from 'svelte-sonner';
	import ManageOrderItem from './ManageOrderItem.svelte';

	export let order: Order;
	export let items: OrderItem[];
	export let userId: string;

	let { supabase } = $page.data;
	$: ({ supabase } = $page.data);

	$: allowChanges = order.status == 'open';

	let manipulating: boolean = false;
	let adding: boolean = false;

	async function addItem(item: AddOrderItemType) {
		console.log(item);

		manipulating = true;
		adding = true;

		const promise = new Promise((resolve, reject) =>
			addOrderItem(supabase, order.id, item).then((d) => {
				if (d.error) {
					reject(d.error);
					manipulating = false;
				} else {
					resolve(d.data);
					itemsAdded++;
				}
			})
		);

		toast.promise(promise, {
			loading: `Adding ${item.name} to order...`,
			success: `Added ${item.name} to order`,
			error: (error) =>
				`Couldn't add ${item.name}. An error occured: ${(error as PostgrestError).message}`,
			info: '',
			warning: ''
		});
	}

	async function removeItem(item: OrderItem) {
		manipulating = true;

		const promise = new Promise((resolve, reject) =>
			removeOrderItem(supabase, order.id, item).then((d) => {
				if (d.error) {
					reject(d.error);
					manipulating = false;
				} else {
					resolve(d.data);
				}
			})
		);

		toast.promise(promise, {
			loading: `Removing ${item.name} from order...`,
			success: `Removed ${item.name} from order`,
			error: (error) =>
				`Couldn't remove ${item.name}. An error occured: ${(error as PostgrestError).message}`,
			info: '',
			warning: ''
		});
	}

	async function updateItem(item: OrderItem) {
		manipulating = true;

		const promise = new Promise((resolve, reject) =>
			updateOrderItem(supabase, order.id, item).then((d) => {
				if (d.error) {
					reject(d.error);
					manipulating = false;
				} else {
					resolve(d.data);
				}
			})
		);

		toast.promise(promise, {
			loading: `Updating ${item.name}...`,
			success: `Updated ${item.name}`,
			error: (error) =>
				`Couldn't update ${item.name}. An error occured: ${(error as PostgrestError).message}`,
			info: '',
			warning: ''
		});
	}

	async function fetchItems() {
		items = (await getOrderItems(supabase, order.id, userId)).data!;

		if (!manipulating) {
			toast.success('Fetched items!');
		}

		manipulating = false;
		adding = false;
	}

	async function fetchOrder() {
		order = (await getOrder(supabase, order.id)).data!;
	}

	onMount(() => {
		const orderItemsChannel = supabase
			.channel('order-items-changes-cart')
			.on(
				'postgres_changes',
				{
					event: '*',
					schema: 'public',
					table: 'order_entries',
					filter: `order_id=eq.${order.id}`
				},
				(payload) => {
					if (!('consumer_id' in payload.new) || payload.new['consumer_id'] == userId) fetchItems();
				}
			)
			.subscribe();

		const orderChannel = supabase
			.channel('order-changes-cart')
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

		return () => {
			orderItemsChannel.unsubscribe();
			orderChannel.unsubscribe();
		};
	});

	let itemsAdded = 0;
</script>

<Heading>Your items</Heading>

<List>
	{#each items as item}
		{#key item}
			<ManageOrderItem
				{item}
				on:change={(e) => updateItem(e.detail)}
				on:remove={() => removeItem(item)}
				disabled={!allowChanges}
			/>
		{/key}
	{:else}
		{#if !manipulating}
			<p>Add some items...</p>
		{/if}
	{/each}
</List>

{#if adding}
	<Spinner />
{/if}

<div class="my-8" />

{#if allowChanges}
	{#key itemsAdded}
		<AddOrderItem on:add={(e) => addItem({ ...e.detail, consumerId: userId })} />
	{/key}
{/if}
