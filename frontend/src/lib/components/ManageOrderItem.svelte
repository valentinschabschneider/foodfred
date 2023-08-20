<script lang="ts">
	import type {
		OrderItem,
		OrderItemInputs as OrderItemInputsType
	} from '$supabase/types/OrderItem';
	import { Button } from 'flowbite-svelte';
	import { createEventDispatcher } from 'svelte';
	import OrderItemInputs from './OrderItemInputs.svelte';

	export let item: OrderItem;

	export let disabled = false;

	let itemInputs: OrderItemInputsType = {
		name: item.name,
		price: item.price,
		note: item.note
	};

	const dispatch = createEventDispatcher();

	function onChange() {
		item = {
			...item,
			name: itemInputs.name!,
			price: itemInputs.price!,
			note: itemInputs.note ?? null
		};
		dispatch('change', item);
	}

	function onRemove() {
		disabled = true;
		dispatch('remove', { item });
	}
</script>

<form class={`flex gap-4 ${$$props.class}`}>
	<OrderItemInputs bind:itemInputs on:change={onChange} {disabled} class="w-full" />
	<Button on:click={onRemove} {disabled} class="w-[42px]">-</Button>
</form>
