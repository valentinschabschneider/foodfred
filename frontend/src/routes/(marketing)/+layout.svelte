<script lang="ts">
	import Navbar from '$lib/components/Navbar.svelte';

	let { data, children } = $props();
	let user = data.user;
</script>

<Navbar user={user} />

<main class="pb-16 pt-8 lg:pb-24 lg:pt-16">
	<div class="mx-auto flex max-w-screen-xl justify-between px-4">
		<div
			class="format format-sm sm:format-base lg:format-lg format-blue dark:format-invert mx-auto w-full max-w-md"
		>
			{@render children()}
	</div>
</main>