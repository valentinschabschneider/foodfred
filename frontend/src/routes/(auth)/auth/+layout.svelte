<script>
	import { DarkMode, Heading } from 'flowbite-svelte';

	let { children } = $props();
</script>

<main class="pb-16 pt-8 lg:pb-24 lg:pt-16">
	<div class="mx-auto flex max-w-screen-xl justify-between px-4">
		<div
			class="format format-sm sm:format-base lg:format-lg format-blue dark:format-invert mx-auto w-full max-w-md"
		>
			<div class="mb-8 flex items-end justify-between">
				<!-- <div class="w-[40px]" /> -->
				<a href="/" class="flex flex-col justify-center">
					<img src="/favicon.png" class="ml-5 self-center" alt="FoodFred Logo" />
					<div class="flex justify-center">
						<Heading class="text-center">FoodFred</Heading>
					</div>
				</a>
				<DarkMode />
			</div>

			{@render children()}
		</div>
	</div>
</main>
