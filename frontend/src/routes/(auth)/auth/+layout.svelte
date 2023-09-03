<script>
	import { DarkMode, Heading } from 'flowbite-svelte';
</script>

<main class="pt-8 pb-16 lg:pt-16 lg:pb-24">
	<div class="flex justify-between px-4 mx-auto max-w-screen-xl">
		<div
			class="mx-auto w-full max-w-md format format-sm sm:format-base lg:format-lg format-blue dark:format-invert"
		>
			<div class="flex mb-8 justify-between items-end">
				<div class="w-[40px]" />
				<a href="/" class="flex flex-col justify-center">
					<img src="/favicon.png" class="ml-5 self-center" alt="FoodFred Logo" />
					<div class="flex justify-center">
						<Heading class="text-center">FoodFred</Heading>
					</div>
				</a>
				<DarkMode />
			</div>
			<slot />
		</div>
	</div>
</main>
