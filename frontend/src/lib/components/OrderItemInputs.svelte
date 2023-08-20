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

<div {...$$restProps} class={`flex gap-4 ${$$props.class}`}>
	<Input
		bind:value={itemInputs.name}
		on:change={onChange}
		placeholder="Product name"
		{disabled}
		required
		class="grow"
	/>
	<CurrencyInput
		placeholder="Price"
		{disabled}
		required
		type="text"
		pattern={'^d*(.d{(0, 2)})?$'}
		bind:value={itemInputs.price}
		on:change={onChange}
		class="h-full"
		containerClass="min-w-[100px]"
	/>
	<Input
		bind:value={itemInputs.note}
		on:change={onChange}
		placeholder={itemInputs.note === undefined ? 'Note' : ''}
		{disabled}
		class="grow"
	/>
</div>
