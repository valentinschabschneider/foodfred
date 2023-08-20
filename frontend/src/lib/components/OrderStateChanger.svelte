<script lang="ts">
	import { updateOrder } from '$supabase/queries/order';
	import type { FoodFredSupabaseClient } from '$supabase/types/FoodFredSupabaseClient';
	import type { Order } from '$supabase/types/Order';
	import { Button } from 'flowbite-svelte';
	import { Icon } from 'flowbite-svelte-icons';
	import { createEventDispatcher, getContext } from 'svelte';

	export let order: Order;

	const supabase: FoodFredSupabaseClient = getContext('supabase');

	const dispatch = createEventDispatcher();

	function updateOrderStatus(status: 'locked' | 'closed') {
		changed = true;

		updateOrder(supabase, { ...order, status }).then((response) => console.log(response));

		dispatch('change', status);

		setTimeout(() => {
			changed = false;
		}, 300);
	}

	let changed = false;
</script>

<div class={`parent ${$$props.class}`}>
	{#if order.status == 'open'}
		<Button color="blue" on:click={() => updateOrderStatus('locked')}>
			<span class="transition-transform duration-300" class:scale-125={changed}>
				<Icon name="lock-solid" class="mr-2" />
			</span>
			Lock order
		</Button>
	{/if}

	{#if order.status == 'locked'}
		<Button color="red" on:click={() => updateOrderStatus('closed')}>
			<span class="transition-transform duration-300" class:scale-125={changed}>
				<Icon name="close-circle-solid" class="mr-2" />
			</span>
			Close order
		</Button>
	{/if}
</div>
