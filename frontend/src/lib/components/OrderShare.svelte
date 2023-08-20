<script lang="ts">
	import { goto } from '$app/navigation';
	import { PUBLIC_URL } from '$env/static/public';
	import type { Order } from '$supabase/types/Order';
	import { Button } from 'flowbite-svelte';
	import { Icon } from 'flowbite-svelte-icons';
	import { copy } from 'svelte-copy';
	import { toast } from 'svelte-sonner';

	export let order: Order;

	function onShared() {
		shared = true;

		if (sharedCounter < 10) {
			toast.success('Copied link to clipboard!');
		} else if (sharedCounter == 10) {
			toast.warning('Bro...');
		} else if (sharedCounter == 100) {
			toast.error("Nah... you ain't real (┛◉Д◉)┛彡┻━┻");

			setTimeout(() => {
				goto('https://www.humanornot.ai/');
			}, 3000);
		}

		setTimeout(() => {
			shared = false;
		}, 150);

		sharedCounter++;
	}

	let shared = false;
	let sharedCounter = 0;
</script>

<div
	use:copy={`${PUBLIC_URL}/orders/${order.id}`}
	on:svelte-copy={onShared}
	class={`${$$props.class}`}
>
	<Button color="purple">
		<span class="transition-transform duration-300" class:scale-125={shared}
			><Icon name="share-nodes-solid" class="mr-2" /></span
		>Share order
	</Button>
</div>
