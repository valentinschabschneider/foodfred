<script lang="ts">
	import type { Order } from '$supabase/types/Order';
	import type { OrderItem } from '$supabase/types/OrderItem';
	import type { User } from '$supabase/types/User';
	import { Accordion, AccordionItem, Avatar, Badge, Heading, Indicator } from 'flowbite-svelte';
	import { slide } from 'svelte/transition';

	export let order: Order;
	export let orderItems: OrderItem[];

	$: itemsGrouped = Object.values(
		orderItems.reduce(function (r, a) {
			const consumerId = a.consumer?.id || 'unknown';

			console.log('help');

			r[consumerId] = r[consumerId] || { consumer: a.consumer, items: [] };
			r[consumerId].items.push(a);
			return r;
		}, Object.create(null))
	) as { consumer: User | null; items: OrderItem[] }[];

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

<div class={`${$$props.class}`}>
	<Heading>Others items</Heading>

	<div class="mt-4">
		<Accordion>
			{#each itemsGrouped as group (group.consumer?.id)}
				<div transition:slide>
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
									{item.name} - {item.price} € | {item.note}
								</div>
							{/key}
						{/each}
					</AccordionItem>
				</div>
			{:else}
				<p>Nothing...</p>
			{/each}
		</Accordion>
	</div>
</div>
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
