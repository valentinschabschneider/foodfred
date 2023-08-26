<script lang="ts">
	import Navbar from '$lib/components/Navbar.svelte';

	export let data;

	$: ({ currentUser } = data);
</script>

<Navbar user={currentUser} />

<main class="pt-8 pb-16 lg:pt-16 lg:pb-24">
	<div class="flex justify-between px-4 mx-auto max-w-screen-xl">
		<div
			class="mx-auto w-full max-w-4xl format format-sm sm:format-base lg:format-lg format-blue dark:format-invert"
		>
			<slot />
		</div>
	</div>
</main>
