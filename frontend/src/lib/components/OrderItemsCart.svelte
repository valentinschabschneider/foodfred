<script lang="ts">
	import { page } from '$app/stores';
	import AddOrderItem from '$lib/components/AddOrderItem.svelte';
	import { addOrderItem, removeOrderItem, updateOrderItem } from '$supabase/queries/orderItems';
	import type { Order } from '$supabase/types/Order';
	import type { AddOrderItem as AddOrderItemType, OrderItem } from '$supabase/types/OrderItem';
	import type { PostgrestError } from '@supabase/supabase-js';
	import { Button, Heading, List, P } from 'flowbite-svelte';
	import { toast } from 'svelte-sonner';
	import { slide } from 'svelte/transition';
	import ManageOrderItem from './ManageOrderItem.svelte';
	import OrderItemInputs from './OrderItemInputs.svelte';

	export let order: Order;
	export let items: OrderItem[];
	export let userId: string;

	let { supabase } = $page.data;
	$: ({ supabase } = $page.data);

	$: allowChanges = order.status == 'open';

	$: items && itemsChanged();

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
			removeOrderItem(supabase, item).then((d) => {
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
		console.log('updated', item);

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

	async function itemsChanged() {
		if (!manipulating) {
			toast.success('Fetched items!');
		}

		manipulating = false;
		adding = false;
	}

	let itemsAdded = 0;
</script>

<div class={`${$$props.class}`}>
	<Heading>Your items</Heading>

	<div class="mt-4">
		<List class="flex flex-col justify-center content-evenly gap-2 min-h-[42px]">
			{#each items as item}
				{#key item.id}
					<div transition:slide>
						<ManageOrderItem
							{item}
							on:change={(e) => updateItem(e.detail)}
							on:remove={() => removeItem(item)}
							disabled={!allowChanges}
						/>
					</div>
				{/key}
			{:else}
				{#if !manipulating}
					<P class="text-center">Add some items...</P>
				{/if}
			{/each}

			{#if adding}
				<div role="status" class="flex gap-4 animate-pulse hide-font" in:slide>
					<OrderItemInputs itemInputs={{ name: '', price: 0, note: '' }} class="w-full" />
					<Button class="w-[42px]">-</Button>
				</div>
			{/if}
		</List>

		{#if allowChanges}
			<hr class="h-px my-4 bg-gray-200 border-0 dark:bg-gray-700" />

			{#key itemsAdded}
				<AddOrderItem on:add={(e) => addItem({ ...e.detail, consumerId: userId })} />
			{/key}
		{/if}
	</div>
</div>

<style>
	.hide-font :global(*) {
		font-size: 0;
	}
</style>
