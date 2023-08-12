<script lang="ts">
	import { goto } from '$app/navigation';
	import { Button, Input } from 'flowbite-svelte';

	export let data;

	let { supabase } = data;
	$: ({ supabase } = data);

	const handleSignOut = async () => {
		await supabase.auth.signOut();
		goto('/auth/login');
	};

	async function createOrder() {
		const { data, error } = await supabase.functions.invoke('create-order', {
			body: { restaurantName }
		});

		const { orderId } = data;

		goto(`/orders/${orderId}`);
	}

	let restaurantName: string;
</script>

<button on:click={handleSignOut}>Sign out</button>

<div class="flex">
	<Input bind:value={restaurantName} placeholder="Restaurant name" />
	<Button on:click={createOrder}>Create order</Button>
</div>
