<script lang="ts">
	import '../app.css';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href="/favicon.png" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<title>Picastro - Graphic Design Portfolio</title>
</svelte:head>

{@render children()}
