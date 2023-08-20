<script lang="ts">
	import { Input } from 'flowbite-svelte';
	import { createEventDispatcher } from 'svelte';

	export let value: number | undefined;
	export let containerClass: string = '';

	const dispatch = createEventDispatcher();

	function forward(event: any) {
		dispatch('change', event.detail);
	}

	const pattern = '^d+(.|,)d{2}$'; // dont work
</script>

<div class={`flex ${containerClass}`}>
	<Input {...$$restProps} let:props class="h-full">
		<div slot="left">€</div>
		<input type="text" {pattern} {...props} bind:value on:change={forward} />
	</Input>
</div>
