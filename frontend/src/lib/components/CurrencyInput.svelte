<script lang="ts">
	import { Input } from 'flowbite-svelte';
	import { createEventDispatcher } from 'svelte';

	export let value: number | undefined;

	const dispatch = createEventDispatcher();

	function forward(event: any) {
		dispatch('message', event.detail);
	}

	const pattern = '^d+(.|,)d{2}$'; // dont work
</script>

<Input class="h-full" let:props {...$$restProps}>
	<div slot="left">€</div>
	<input type="text" {pattern} {...props} bind:value on:change={forward} />
</Input>
