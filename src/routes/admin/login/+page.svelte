<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';

	let email = $state('');
	let password = $state('');
	let error = $state('');
	let loading = $state(false);

	async function handleLogin(e: Event) {
		e.preventDefault();
		error = '';
		loading = true;

		try {
			const response = await fetch('/api/auth/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ email, password })
			});

			const data = await response.json();

			if (data.success) {
				// Invalidate all data to trigger re-checks
				await invalidateAll();
				// Redirect to home page after successful login
				await goto('/', { replaceState: true });
				// Force reload to ensure edit mode appears
				window.location.reload();
			} else {
				error = data.error || 'Login failed';
			}
		} catch (err) {
			error = 'An error occurred. Please try again.';
			console.error('Login error:', err);
		} finally {
			loading = false;
		}
	}
</script>

<svelte:head>
	<title>Admin Login - Pikastro</title>
</svelte:head>

<div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 px-4">
	<div class="max-w-md w-full">
		<!-- Logo/Heading -->
		<div class="text-center mb-8">
			<h1 class="text-4xl font-bold text-white mb-2">
				Pikastro CMS
			</h1>
			<p class="text-purple-200">
				Zaloguj się, aby edytować treści
			</p>
		</div>

		<!-- Login Form -->
		<div class="bg-white rounded-2xl shadow-2xl p-8">
			<form onsubmit={handleLogin} class="space-y-6">
				{#if error}
					<div class="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
						{error}
					</div>
				{/if}

				<div>
					<label for="email" class="block text-sm font-medium text-gray-700 mb-2">
						Email
					</label>
					<input
						type="email"
						id="email"
						bind:value={email}
						required
						class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
						placeholder="magda@zaur.app"
						autocomplete="email"
					/>
				</div>

				<div>
					<label for="password" class="block text-sm font-medium text-gray-700 mb-2">
						Hasło
					</label>
					<input
						type="password"
						id="password"
						bind:value={password}
						required
						class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
						placeholder="••••••••"
						autocomplete="current-password"
					/>
				</div>

				<button
					type="submit"
					disabled={loading}
					class="w-full text-white font-bold py-4 px-8 rounded-xl border-2 focus:outline-none transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
					style="background: linear-gradient(135deg, #9333ea 0%, #4f46e5 100%); border-color: #ec4899; box-shadow: 0 10px 30px rgba(147, 51, 234, 0.5);"
				>
					{loading ? 'Logowanie...' : 'Zaloguj się'}
				</button>
			</form>

			<div class="mt-6 text-center text-sm text-gray-500">
				<p>Tylko dla autoryzowanych administratorów</p>
			</div>
		</div>

		<!-- Footer -->
		<div class="text-center mt-8 text-purple-200 text-sm">
			<p>&copy; 2024 Pikastro. Wszystkie prawa zastrzeżone.</p>
		</div>
	</div>
</div>

<style>
	/* Additional custom styles if needed */
	input:focus {
		outline: none;
	}
</style>
