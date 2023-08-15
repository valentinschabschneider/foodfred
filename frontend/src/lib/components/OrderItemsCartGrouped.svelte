<script lang="ts">
	import { page } from '$app/stores';
	import { getOrder } from '$supabase/queries/order';
	import { getOrderItems, removeOrderItem, updateOrderItem } from '$supabase/queries/orderItems';
	import type { Order } from '$supabase/types/Order';
	import type { OrderItem } from '$supabase/types/OrderItem';
	import type { User } from '$supabase/types/User';
	import type { PostgrestError } from '@supabase/supabase-js';
	import { Accordion, AccordionItem, Avatar, Badge, Heading, Indicator } from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import { toast } from 'svelte-sonner';

	export let order: Order;
	export let items: OrderItem[];
	export let excludeUserId: string;

	let { supabase, session } = $page.data;
	$: ({ supabase, session } = $page.data);

	let manipulating: boolean = false;

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
		items = (await getOrderItems(supabase, order.id)).data!;

		if (!manipulating) {
			toast.success('Fetched items!');
		}

		manipulating = false;
	}

	async function fetchOrder() {
		order = (await getOrder(supabase, order.id)).data!;
	}

	onMount(() => {
		const orderItemsChannel = supabase
			.channel('order-items-changes-cart-grouped')
			.on(
				'postgres_changes',
				{
					event: '*',
					schema: 'public',
					table: 'order_entries',
					filter: 'order_id=eq.' + order.id
				},
				(payload) => {
					if ('consumer_id' in payload.new && payload.new['consumer_id'] != excludeUserId)
						fetchItems();
				}
			)
			.subscribe();

		const orderChannel = supabase
			.channel('order-changes-cart-grouped')
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

	$: itemsGrouped = (
		Object.values(
			items.reduce(function (r, a) {
				const consumerId = a.consumer?.id || 'unknown';

				r[consumerId] = r[consumerId] || { consumer: a.consumer, items: [] };
				r[consumerId].items.push(a);
				return r;
			}, Object.create(null))
		) as { consumer: User | null; items: OrderItem[] }[]
	).filter((group) => group.consumer?.id != excludeUserId);

	function getOrderItemStatusColor(status: string) {
		switch (status) {
			case 'open':
				return 'red';
			case 'says-payed':
				return 'yellow';
			case 'payed':
				return 'green';
		}
	}
</script>

<Heading>Others items</Heading>

<Accordion>
	{#each itemsGrouped as group}
		{#key group}
			<AccordionItem>
				<span slot="header" class="text-base flex gap-2 items-center w-full mr-4">
					<Avatar src={group.consumer?.image} rounded />
					<div class="flex flex-col gap-1">
						<span>{group.consumer?.name || 'Unknown'}</span>
						<span class="text-xs">{group.consumer?.handle}</span>
					</div>
					<div class="flex gap-2 items-center ml-auto">
						{#if order.status == 'closed'}
							{#each new Set(group.items.map((i) => i.status)) as status}
								<Badge color={getOrderItemStatusColor(status)} rounded class="px-2.5 py-0.5">
									<Indicator
										color={getOrderItemStatusColor(status)}
										size="xs"
										class="mr-1"
									/>{status}
								</Badge>
							{/each}
						{/if}

						<span>
							{Intl.NumberFormat('de-AT', {
								currency: 'EUR',
								style: 'currency',
								maximumFractionDigits: 2,
								minimumFractionDigits: 2
							}).format(group.items.map((p) => p.price).reduce((a, b) => a + b))}
						</span>
					</div>
				</span>

				{#each group.items as item}
					{#key item}
						<div class="flex gap-2 items-center w-full mb-2">
							{item.name} - {item.price} €
						</div>
					{/key}
				{/each}
			</AccordionItem>
		{/key}
	{:else}
		{#if !manipulating}
			<p>Nothing...</p>
		{/if}
	{/each}
</Accordion>

<!--
{#if order_.status.text != 'Paid'}
	<div class="flex gap-2 items-center w-full mt-8">
		{#if order.status == 'closed' && order_.status.text == 'Unpaid'}
			<Button color="yellow" size="xs" on:click={() => alert('yooo pay you bitch')}
				>Remind to pay</Button
			>
		{/if}

		{#if order.status == 'closed' && order_.status.text == 'Payment unconfirmed'}
			<Button color="green" size="xs" on:click={() => alert('paid')}>Confirm payment</Button>
		{/if}
	</div>
{/if}
-->
