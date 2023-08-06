<script lang="ts">
	import CurrencyInput from '@canutin/svelte-currency-input';
	import {
		Accordion,
		AccordionItem,
		Avatar,
		Badge,
		Button,
		Chevron,
		Dropdown,
		DropdownItem,
		Heading,
		Indicator,
		Li,
		List,
		Modal,
		Spinner
	} from 'flowbite-svelte';
	import { onMount } from 'svelte';

	import { Icon } from 'flowbite-svelte-icons';

	let changePayeeModal = false;
	let changePayeeTo: null | string = null;
	let loadingPrice = true;

	let orderStatus = 'open';

	onMount(async () => {
		await new Promise((r) => setTimeout(r, 2000));
		loadingPrice = false;
	});

	export let data;
</script>

<div class="flex gap-2 mb-8 justify-between">
	{#if orderStatus == 'open'}
		<Button color="blue" on:click={() => (orderStatus = 'locked')}>
			<Icon name="lock-solid" /><span class="ml-2">Lock order</span>
		</Button>
	{/if}

	{#if orderStatus == 'locked'}
		<Button color="red" on:click={() => (orderStatus = 'closed')}>
			<Icon name="close-circle-solid" /><span class="ml-2">Close order</span>
		</Button>
	{/if}

	{#if orderStatus != 'closed'}
		<div>
			<Button><Chevron>Change payee</Chevron></Button>
			<Dropdown>
				{#each data.orders as order}
					<DropdownItem
						on:click={() => {
							changePayeeModal = true;
							changePayeeTo = order.customer.name;
						}}
					>
						<div class="flex gap-2 items-center">
							<Avatar src={order.customer.image} rounded />
							<div class="flex flex-col gap-1">
								<span>{order.customer.name}</span>
								<span class="text-xs">{order.customer.handle}</span>
							</div>
						</div>
					</DropdownItem>
				{/each}
			</Dropdown>
		</div>
	{/if}
</div>

{#if orderStatus == 'locked'}
	<Heading>Order summary</Heading>
	<List list="none">
		{#each data.orders.map((o) => o.products).flat() as product}
			<Li><span class="font-medium dark:text-white">{product.name}</span></Li>
		{/each}
	</List>
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

<Accordion>
	{#each data.orders as order}
		<AccordionItem>
			<span slot="header" class="text-base flex gap-2 items-center w-full mr-4">
				<Avatar src={order.customer.image} rounded />
				<div class="flex flex-col gap-1">
					<span>{order.customer.name}</span>
					<span class="text-xs">{order.customer.handle}</span>
				</div>
				<div class="flex gap-2 items-center ml-auto">
					{#if loadingPrice}
						<Spinner />
					{:else}
						{#if orderStatus == 'closed'}
							<Badge color={order.status.color} rounded class="px-2.5 py-0.5">
								<Indicator color={order.status.color} size="xs" class="mr-1" />{order.status.text}
							</Badge>
						{/if}

						<span>
							{Intl.NumberFormat('de-AT', {
								currency: order.currency,
								style: 'currency',
								maximumFractionDigits: 2,
								minimumFractionDigits: 2
							}).format(order.products.map((p) => p.price).reduce((a, b) => a + b))}
						</span>
					{/if}
				</div>
			</span>

			{#each order.products as product}
				<div class="flex gap-2 items-center w-full mb-2">
					<span>{product.name}</span>
					<CurrencyInput
						name="total"
						value={product.price}
						locale="de-AT"
						currency={order.currency}
						disabled={orderStatus == 'closed'}
					/>
				</div>
			{/each}

			{#if order.status.text != 'Paid'}
				<div class="flex gap-2 items-center w-full mt-8">
					{#if orderStatus == 'closed' && order.status.text == 'Unpaid'}
						<Button color="yellow" size="xs" on:click={() => alert('yooo pay you bitch')}
							>Remind to pay</Button
						>
					{/if}

					{#if orderStatus == 'closed' && order.status.text == 'Payment unconfirmed'}
						<Button color="green" size="xs" on:click={() => alert('paid')}>Confirm payment</Button>
					{/if}
				</div>
			{/if}
		</AccordionItem>
	{/each}
</Accordion>
