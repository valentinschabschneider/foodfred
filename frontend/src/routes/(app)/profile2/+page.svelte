<script lang="ts">
	import dayjs from 'dayjs';
	import LocalizedFormat from 'dayjs/plugin/localizedFormat';
	import relativeTime from 'dayjs/plugin/relativeTime';

	dayjs.extend(LocalizedFormat);
	dayjs.extend(relativeTime);

	let { data } = $props();

	let { supabase, user } = data;
</script>

<svelte:head>
	<title>Your profile - FoodFred</title>
</svelte:head>

yo