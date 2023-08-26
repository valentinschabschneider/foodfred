<script>
	import { Heading } from 'flowbite-svelte';
</script>

<main class="pt-8 pb-16 lg:pt-16 lg:pb-24">
	<div class="flex justify-between px-4 mx-auto max-w-screen-xl">
		<div
			class="mx-auto w-full max-w-md format format-sm sm:format-base lg:format-lg format-blue dark:format-invert"
		>
			<a href="/">
				<div class="flex flex-col justify-center mb-8">
					<img src="/favicon.png" class="ml-5 self-center" alt="FoodFred Logo" />
					<Heading class="text-center">FoodFred</Heading>
				</div>
			</a>
			<slot />
		</div>
	</div>
</main>
