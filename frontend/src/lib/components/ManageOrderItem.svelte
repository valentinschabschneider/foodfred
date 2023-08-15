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
			note: itemInputs.note
		};
		dispatch('change', item);
	}

	function onRemove() {
		disabled = true;
		dispatch('remove', { item });
	}
</script>

<div class="flex">
	<OrderItemInputs bind:itemInputs on:change={onChange} {disabled} />
	<Button on:click={onRemove} {disabled}>-</Button>
</div>
