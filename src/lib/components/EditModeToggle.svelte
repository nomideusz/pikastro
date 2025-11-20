<script lang="ts">
	import { onMount } from 'svelte';
	import {
		isEditMode,
		isAuthenticated,
		isCheckingAuth,
		toggleEditMode,
		checkAuth,
		logout
	} from '$lib/stores/editMode.svelte';
	import { goto } from '$app/navigation';

	// Check authentication on mount
	onMount(() => {
		checkAuth();
	});

	async function handleLogout() {
		await logout();
		goto('/admin/login');
	}
</script>

{#if !isCheckingAuth && isAuthenticated}
	<!-- Floating edit mode toolbar -->
	<div class="fixed bottom-6 right-6 z-50 flex flex-col gap-2 items-end">
		<!-- Edit mode toggle -->
		<div class="bg-white rounded-full shadow-2xl border-2 border-purple-500 overflow-hidden">
			<button
				onclick={toggleEditMode}
				class="flex items-center gap-3 px-6 py-3 transition-all {isEditMode
					? 'bg-purple-600 text-white'
					: 'bg-white text-gray-700 hover:bg-purple-50'}"
				title={isEditMode ? 'Wyłącz tryb edycji' : 'Włącz tryb edycji'}
			>
				<span class="text-xl">{isEditMode ? '🔒' : '✏️'}</span>
				<span class="font-semibold">
					{isEditMode ? 'Tryb edycji ON' : 'Tryb edycji OFF'}
				</span>
			</button>
		</div>

		{#if isEditMode}
			<!-- Help text when edit mode is on -->
			<div
				class="bg-purple-900 text-white text-sm px-4 py-2 rounded-lg shadow-lg max-w-xs animate-fade-in"
			>
				<p class="font-semibold mb-1">Tryb edycji aktywny</p>
				<p class="text-purple-200 text-xs">
					Kliknij na dowolny tekst, aby go edytować. Zmiany będą widoczne po zapisaniu.
				</p>
			</div>
		{/if}

		<!-- Logout button -->
		<button
			onclick={handleLogout}
			class="bg-white text-gray-600 px-4 py-2 rounded-full shadow-lg hover:bg-gray-50 transition text-sm font-medium border border-gray-200"
			title="Wyloguj się"
		>
			Wyloguj się
		</button>
	</div>
{/if}

<style>
	@keyframes fade-in {
		from {
			opacity: 0;
			transform: translateY(10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.animate-fade-in {
		animation: fade-in 0.3s ease-out;
	}
</style>
