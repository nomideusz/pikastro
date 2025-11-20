/**
 * Edit mode store
 * Manages global edit mode state and authentication status
 */

// Edit mode state
export let isEditMode = $state(false);
export let isAuthenticated = $state(false);
export let isCheckingAuth = $state(true);

/**
 * Toggle edit mode on/off
 */
export function toggleEditMode() {
	if (isAuthenticated) {
		isEditMode = !isEditMode;
	}
}

/**
 * Enable edit mode
 */
export function enableEditMode() {
	if (isAuthenticated) {
		isEditMode = true;
	}
}

/**
 * Disable edit mode
 */
export function disableEditMode() {
	isEditMode = false;
}

/**
 * Check if user is authenticated
 */
export async function checkAuth() {
	isCheckingAuth = true;
	try {
		const response = await fetch('/api/auth/me', {
			credentials: 'include'
		});

		if (response.ok) {
			const data = await response.json();
			isAuthenticated = data.authenticated;
		} else {
			isAuthenticated = false;
		}
	} catch (error) {
		console.error('Error checking auth:', error);
		isAuthenticated = false;
	} finally {
		isCheckingAuth = false;
	}
}

/**
 * Logout and disable edit mode
 */
export async function logout() {
	try {
		await fetch('/api/auth/logout', {
			method: 'POST',
			credentials: 'include'
		});
		isAuthenticated = false;
		isEditMode = false;
	} catch (error) {
		console.error('Error logging out:', error);
	}
}
