<script lang="ts">
	import type { OrderItem } from '$lib/types/OrderItem';
	import { Heading, Li, List } from 'flowbite-svelte';

	export let order: Order;
	export let orderItems: OrderItem[];

	const total = orderItems.reduce((acc, item) => acc + item.price, 0);
</script>

<Heading>Order summary</Heading>
<List list="none">
	{#each orderItems as item}
		<Li><span class="font-medium dark:text-white">{item.name}</span></Li>
	{/each}
</List>

<br />

<p>That makes {total} €</p>
