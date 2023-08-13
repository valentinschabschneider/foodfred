<script lang="ts">
	import type { OrderItemInputs as OrderItemInputsType } from '$supabase/types/OrderItem';
	import { Button } from 'flowbite-svelte';
	import { createEventDispatcher } from 'svelte';
	import OrderItemInputs from './OrderItemInputs.svelte';

	export let disabled = false;

	let itemInputs: OrderItemInputsType = {
		name: undefined,
		price: undefined,
		note: null
	};

	const dispatch = createEventDispatcher();

	function onAdd() {
		dispatch('add', itemInputs);
	}
</script>

<form class="flex" on:submit|preventDefault={onAdd}>
	<OrderItemInputs bind:itemInputs {disabled} />
	<Button type="submit" {disabled}>+</Button>
</form>
