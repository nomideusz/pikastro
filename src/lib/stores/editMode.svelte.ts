/**
 * Edit mode store
 * Manages global edit mode state and authentication status
 */

const EDIT_MODE_KEY = 'pikastro_edit_mode';

class EditModeStore {
	isEditMode = $state(false);
	isAuthenticated = $state(false);
	isCheckingAuth = $state(true);

	constructor() {
		// Restore edit mode state from localStorage on initialization
		if (typeof window !== 'undefined') {
			const savedMode = localStorage.getItem(EDIT_MODE_KEY);
			if (savedMode === 'true') {
				this.isEditMode = true;
			}
		}
	}

	/**
	 * Toggle edit mode on/off
	 */
	toggleEditMode() {
		if (this.isAuthenticated) {
			this.isEditMode = !this.isEditMode;
			this.saveEditModeState();
		}
	}

	/**
	 * Enable edit mode
	 */
	enableEditMode() {
		if (this.isAuthenticated) {
			this.isEditMode = true;
			this.saveEditModeState();
		}
	}

	/**
	 * Disable edit mode
	 */
	disableEditMode() {
		this.isEditMode = false;
		this.saveEditModeState();
	}

	/**
	 * Save edit mode state to localStorage
	 */
	private saveEditModeState() {
		if (typeof window !== 'undefined') {
			localStorage.setItem(EDIT_MODE_KEY, this.isEditMode.toString());
		}
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

				// If not authenticated, disable edit mode
				if (!this.isAuthenticated) {
					this.isEditMode = false;
					this.saveEditModeState();
				}
			} else {
				this.isAuthenticated = false;
				this.isEditMode = false;
				this.saveEditModeState();
			}
		} catch (error) {
			console.error('Error checking auth:', error);
			this.isAuthenticated = false;
			this.isEditMode = false;
			this.saveEditModeState();
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
			this.saveEditModeState();
		} catch (error) {
			console.error('Error logging out:', error);
		}
	}
}

export const editModeStore = new EditModeStore();
