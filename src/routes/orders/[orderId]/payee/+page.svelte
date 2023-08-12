<script lang="ts">
	import {
		Avatar,
		Button,
		Chevron,
		Dropdown,
		DropdownItem,
		Heading,
		Li,
		List,
		Modal
	} from 'flowbite-svelte';
	import { onMount } from 'svelte';

	import OrderItemsCart from '$lib/components/OrderItemsCart.svelte';
	import OrderItemsCartGrouped from '$lib/components/OrderItemsCartGrouped.svelte';
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

	const { order, orderItems } = data;

	const yourOrderItems = orderItems.filter((item) => item.consumer.id == order.payee.id);
	const otherParticipants = orderItems
		.map((item) => item.consumer)
		.filter((user) => user.id != order.payee.id);
	const notYourOrderItems = orderItems.filter((item) => item.consumer.id != order.payee.id);
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

	{#if orderStatus != 'closed' && otherParticipants.length > 0}
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
</div>

{#if orderStatus == 'locked'}
	<Heading>Order summary</Heading>
	<List list="none">
		{#each orderItems as item}
			<Li><span class="font-medium dark:text-white">{item.name}</span></Li>
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

<OrderItemsCart {order} items={yourOrderItems} />

<OrderItemsCartGrouped {order} items={notYourOrderItems} />
