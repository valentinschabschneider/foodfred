<script lang="ts">
	import { goto } from '$app/navigation';
	import { capitalizeFirstLetter } from '$lib/helpers/string';
	import dayjs from 'dayjs';
	import LocalizedFormat from 'dayjs/plugin/localizedFormat';
	import relativeTime from 'dayjs/plugin/relativeTime';
	import {
		Badge,
		Button,
		Indicator,
		Input,
		Spinner,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell
	} from 'flowbite-svelte';

	dayjs.extend(LocalizedFormat);
	dayjs.extend(relativeTime);

	export let data;

	let { supabase, session } = data;
	$: ({ supabase, session } = data);

	const currentUser = session!!.user!!;

	const handleSignOut = async () => {
		await supabase.auth.signOut();
		goto('/auth/login');
	};

	async function createOrder() {
		creatingOrder = true;

		const { data, error } = await supabase.functions.invoke('create-order', {
			body: { restaurantName }
		});

		const { orderId } = data;

		goto(`/orders/${orderId}`);
	}

	let restaurantName: string;

	let creatingOrder = false;

	function getOrderStatusColor(status: string) {
		switch (status) {
			case 'open':
				return 'green';
			case 'locked':
				return 'blue';
			case 'closed':
				return 'red';
		}
	}
</script>

<svelte:head>
	<title>Your profile - FoodFred</title>
</svelte:head>

<button on:click={handleSignOut}>Sign out</button>

<form class="flex" on:submit={createOrder}>
	<Input bind:value={restaurantName} placeholder="Restaurant name" required />
	<Button type="submit">
		{#if creatingOrder}
			<Spinner />
		{:else}
			Create order
		{/if}
	</Button>
</form>

<Table striped hoverable>
	<TableHead>
		<TableHeadCell class="max-w[50px]">Date</TableHeadCell>
		<TableHeadCell>Relative time</TableHeadCell>
		<TableHeadCell>Restaurant</TableHeadCell>
		<TableHeadCell>Payee</TableHeadCell>
		<TableHeadCell>Status</TableHeadCell>
	</TableHead>
	<TableBody>
		{#each data.orders as order}
			<TableBodyRow on:click={() => goto(`/orders/${order.id}`)} class="cursor-pointer">
				<TableBodyCell class="w-min">{dayjs(order.createdAt).format('lll')}</TableBodyCell>
				<TableBodyCell>{dayjs().to(dayjs(order.createdAt))}</TableBodyCell>
				<TableBodyCell>{order.restaurant.name}</TableBodyCell>
				<TableBodyCell>{order.payee.id == currentUser.id ? 'You' : order.payee.name}</TableBodyCell>
				<TableBodyCell>
					<Badge color={getOrderStatusColor(order.status)} rounded class="px-2.5 py-0.5">
						<Indicator
							color={getOrderStatusColor(order.status)}
							size="xs"
							class="mr-1"
						/>{capitalizeFirstLetter(order.status)}
					</Badge></TableBodyCell
				>
			</TableBodyRow>
		{/each}
	</TableBody>
</Table>
