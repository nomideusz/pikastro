/**
 * Edit mode store
 * Manages global edit mode state and authentication status
 */

class EditModeStore {
	isEditMode = $state(false);
	isAuthenticated = $state(false);
	isCheckingAuth = $state(true);

	/**
	 * Toggle edit mode on/off
	 */
	toggleEditMode() {
		if (this.isAuthenticated) {
			this.isEditMode = !this.isEditMode;
		}
	}

	/**
	 * Enable edit mode
	 */
	enableEditMode() {
		if (this.isAuthenticated) {
			this.isEditMode = true;
		}
	}

	/**
	 * Disable edit mode
	 */
	disableEditMode() {
		this.isEditMode = false;
	}

	/**
	 * Check if user is authenticated
	 */
	async checkAuth() {
		this.isCheckingAuth = true;
		try {
			const response = await fetch('/api/auth/me', {
				credentials: 'include'
			});

			if (response.ok) {
				const data = await response.json();
				this.isAuthenticated = data.authenticated;
			} else {
				this.isAuthenticated = false;
			}
		} catch (error) {
			console.error('Error checking auth:', error);
			this.isAuthenticated = false;
		} finally {
			this.isCheckingAuth = false;
		}
	}

	/**
	 * Logout and disable edit mode
	 */
	async logout() {
		try {
			await fetch('/api/auth/logout', {
				method: 'POST',
				credentials: 'include'
			});
			this.isAuthenticated = false;
			this.isEditMode = false;
		} catch (error) {
			console.error('Error logging out:', error);
		}
	}
}

export const editModeStore = new EditModeStore();
