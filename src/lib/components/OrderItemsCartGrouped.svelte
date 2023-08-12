<script lang="ts">
	import { page } from '$app/stores';
	import { getOrder } from '$lib/queries/order';
	import { getOrderItems, removeOrderItem, updateOrderItem } from '$lib/queries/orderItems';
	import type { OrderItem } from '$lib/types/OrderItem';
	import type { PostgrestError } from '@supabase/supabase-js';
	import { Accordion, AccordionItem, Avatar, Badge, Heading, Indicator } from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import { toast } from 'svelte-sonner';

	export let order: Order;
	export let items: OrderItem[];

	let { supabase, session } = $page.data;
	$: ({ supabase, session } = $page.data);

	$: allowChanges = order.status == 'open';
	const currentUser = session!!.user!!;

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
		items = (await getOrderItems(supabase, order.id, currentUser.id)).data!;

		if (!manipulating) {
			toast.success('Fetched items!');
		}

		manipulating = false;
	}

	async function fetchOrder() {
		order = (await getOrder(supabase, order.id)).data!;
	}

	onMount(() => {
		const orderItemsChannel = supabase.channel('order-items-changes').on(
			'postgres_changes',
			{
				event: '*',
				schema: 'public',
				table: 'order_entries',
				filter: 'order_id=eq.' + order.id
			},
			fetchItems
		);

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

		return () => {
			orderItemsChannel.unsubscribe();
			orderChannel.unsubscribe();
		};
	});

	const itemsGrouped: { consumer: User; items: OrderItem[] }[] = Object.values(
		items.reduce(function (r, a) {
			r[a.consumer.id] = r[a.consumer.id] || { consumer: a.consumer, items: [] };
			r[a.consumer.id].items.push(a);
			return r;
		}, Object.create(null))
	);

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
					<Avatar src={group.consumer.image} rounded />
					<div class="flex flex-col gap-1">
						<span>{group.consumer.name}</span>
						<span class="text-xs">{group.consumer.handle}</span>
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
				<p>{group.consumer.name}</p>

				<ul>
					{#each group.items as item}
						{#key item}
							<li>
								{item.name} - {item.price}
							</li>
						{/key}
					{/each}
				</ul>
			</AccordionItem>
		{/key}
	{:else}
		{#if !manipulating}
			<p>Nothing...</p>
		{/if}
	{/each}
</Accordion>
<!-- 
<Accordion>
	{#each order.orders as order_}
		<AccordionItem>
			<span slot="header" class="text-base flex gap-2 items-center w-full mr-4">
				<Avatar src={order_.customer.image} rounded />
				<div class="flex flex-col gap-1">
					<span>{order_.customer.name}</span>
					<span class="text-xs">{order_.customer.handle}</span>
				</div>
				<div class="flex gap-2 items-center ml-auto">
					{#if order.status == 'closed'}
							<Badge color={order_.status.color} rounded class="px-2.5 py-0.5">
								<Indicator color={order_.status.color} size="xs" class="mr-1" />{order_.status.text}
							</Badge>
						{/if}

						<span>
							{Intl.NumberFormat('de-AT', {
								currency: order_.currency,
								style: 'currency',
								maximumFractionDigits: 2,
								minimumFractionDigits: 2
							}).format(order_.products.map((p) => p.price).reduce((a, b) => a + b))}
						</span>
				</div>
			</span>

			{#each order_.products as product}
				<div class="flex gap-2 items-center w-full mb-2">
					<span>{product.name}</span>
					<CurrencyInput
						name="total"
						value={product.price}
						locale="de-AT"
						currency={order_.currency}
						disabled={order.status == 'closed'}
					/>
				</div>
			{/each}

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
		</AccordionItem>
	{/each}
</Accordion> -->
