<script lang="ts">
	import type { OrderItemInputs as OrderItemInputsType } from '$supabase/types/OrderItem';
	import { Button } from 'flowbite-svelte';
	import { createEventDispatcher } from 'svelte';
	import OrderItemInputs from './OrderItemInputs.svelte';

	export let disabled = false;

	let itemInputs: OrderItemInputsType = {
		name: undefined,
		price: undefined,
		note: undefined
	};

	const dispatch = createEventDispatcher();

	function onAdd() {
		dispatch('add', itemInputs);
	}
</script>

<form class={`flex gap-4 ${$$props.class}`} on:submit|preventDefault={onAdd}>
	<OrderItemInputs bind:itemInputs {disabled} class="w-full" />
	<Button type="submit" {disabled} class="w-[42px]">+</Button>
</form>
