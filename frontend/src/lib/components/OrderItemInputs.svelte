<script lang="ts">
	import type { OrderItemInputs } from '$supabase/types/OrderItem';
	import { Input } from 'flowbite-svelte';
	import { createEventDispatcher } from 'svelte';
	import CurrencyInput from './CurrencyInput.svelte';

	export let itemInputs: OrderItemInputs;
	export let disabled: boolean = false;

	const dispatch = createEventDispatcher();

	function onChange() {
		dispatch('change', { itemInputs });
	}
</script>

<Input
	bind:value={itemInputs.name}
	on:change={onChange}
	placeholder="Product name"
	{disabled}
	required
/>
<CurrencyInput
	placeholder="Price"
	{disabled}
	required
	type="text"
	pattern={'^d*(.d{(0, 2)})?$'}
	bind:value={itemInputs.price}
	on:change={onChange}
/>
<Input bind:value={itemInputs.note} on:change={onChange} placeholder="Note" {disabled} />
