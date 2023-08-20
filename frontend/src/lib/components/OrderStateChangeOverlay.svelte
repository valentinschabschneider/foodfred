<script lang="ts">
	import type { Order } from '$supabase/types/Order';
	import { onMount } from 'svelte';
	import { quintOut } from 'svelte/easing';
	import { fade, scale } from 'svelte/transition';

	onMount(() => {
		updateCoordinates();
	});

	export let order: Order;
	export let component: HTMLElement;

	function updateCoordinates() {
		const rect = component.getBoundingClientRect();
		console.log('tmp', rect.left, rect.top);
		x = rect.left + rect.width / 2;
		y = rect.top + rect.height / 2;

		console.log(x, y);
	}

	let x = 0;
	let y = 0;

	onMount(() => {
		if (order.status == 'open') {
			gradientClass = 'from-blue-700 dark:from-blue-600 to-white dark:to-gray-900';
		} else if (order.status == 'locked') {
			gradientClass = 'from-red-700 dark:from-red-600 to-white dark:to-gray-900';
		}
	});

	let gradientClass = '';
</script>

<div
	class="overlay"
	style="--x:{x};--y:{y};"
	in:scale={{ duration: 500, delay: 0, opacity: 0.5, easing: quintOut }}
	out:fade={{ duration: 1000, delay: 100, easing: quintOut }}
>
	<div class={`h-full w-full animate-colorous bg-gradient-radial ${gradientClass} to-70%`} />
	<!-- background-position: center;
	background-repeat: no-repeat; -->
</div>

<style>
	.overlay {
		position: fixed;
		top: calc(var(--y) * 1px);
		left: calc(var(--x) * 1px);
		/* width: 100%; */
		height: calc(100% * 3);

		transform: translate(-50%, -50%);
		/* pointer-events: none; */

		/* animation: blinds 1s; */

		z-index: 98;
		/* background-size: 0% 0%; */

		border-radius: 50%;
		aspect-ratio: 1;
	}
</style>
