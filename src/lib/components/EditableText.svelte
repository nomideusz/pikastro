<script lang="ts">
	import { editModeStore } from '$lib/stores/editMode.svelte';
	import { t, getLocale, localeStore, translationsVersion } from '$lib/i18n';

	interface Props {
		/** Translation key (e.g., "home.hero.heading1") */
		key: string;
		/** HTML tag to render (default: span) */
		tag?: string;
		/** CSS class for the element */
		class?: string;
		/** Fallback text if key not found */
		fallback?: string;
		/** Category for grouping (e.g., "home", "portfolio") */
		category?: string;
		/** Multiline editing (textarea vs input) */
		multiline?: boolean;
		/** Additional HTML attributes */
		[key: string]: any;
	}

	let {
		key: contentKey,
		tag = 'span',
		class: className = '',
		fallback = '',
		category = '',
		multiline = false,
		...restProps
	}: Props = $props();

	let isEditing = $state(false);
	let editValue = $state('');
	let isSaving = $state(false);
	let saveError = $state('');
	let element: HTMLElement | null = $state(null);
	let currentLocale = $state(getLocale());
	let translationsVer = $state(0);
	let textareaElement: HTMLTextAreaElement | null = $state(null);

	// Auto-calculate rows for textarea based on content length
	let textareaRows = $derived.by(() => {
		if (!multiline) return 4;
		const length = editValue.length;
		if (length < 100) return 4;
		if (length < 300) return 8;
		if (length < 600) return 12;
		return 16;
	});

	// Subscribe to locale and translations version changes to trigger re-rendering
	$effect(() => {
		const unsubscribeLocale = localeStore.subscribe(() => {
			currentLocale = getLocale();
		});
		const unsubscribeVersion = translationsVersion.subscribe((v) => {
			translationsVer = v;
		});
		return () => {
			unsubscribeLocale();
			unsubscribeVersion();
		};
	});

	// Get current text from translation (reactive to locale and version changes)
	let currentText = $derived.by(() => {
		void currentLocale; // Create dependency on locale
		void translationsVer; // Create dependency on translations version
		const translated = t(contentKey);
		// If translation not found, t() returns the key itself, so use fallback instead
		return (translated === contentKey) ? fallback : translated;
	});

	/**
	 * Process markdown for display (supports bold text and line breaks)
	 */
	function processMarkdown(text: string): string {
		return text
			// Bold: **text** → <strong>text</strong>
			.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
			// Line breaks: preserve \n\n as paragraph breaks
			.split('\n\n')
			.map(para => `<p class="mb-4">${para.replace(/\n/g, '<br>')}</p>`)
			.join('');
	}

	// Determine if this element is editable (only in edit mode and authenticated)
	let isEditable = $derived(editModeStore.isEditMode && editModeStore.isAuthenticated);

	/**
	 * Start editing
	 */
	function startEdit(e: MouseEvent) {
		if (!isEditable) return;
		e.stopPropagation();
		editValue = currentText;
		isEditing = true;
		saveError = '';

		// Focus the input after DOM update
		setTimeout(() => {
			const input = element?.querySelector('input, textarea') as HTMLInputElement | null;
			input?.focus();
		}, 0);
	}

	/**
	 * Save the edited content
	 */
	async function saveEdit() {
		if (editValue === currentText) {
			// No changes, just cancel
			isEditing = false;
			return;
		}

		isSaving = true;
		saveError = '';

		try {
			const response = await fetch('/api/content', {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				credentials: 'include',
				body: JSON.stringify({
					key: contentKey,
					value: editValue,
					locale: getLocale(),
					category: category || contentKey.split('.')[0]
				})
			});

			const data = await response.json();

			if (data.success) {
				// Update successful - reload page to reflect changes
				window.location.reload();
			} else {
				saveError = data.error || 'Failed to save';
			}
		} catch (error) {
			console.error('Error saving content:', error);
			saveError = 'Network error. Please try again.';
		} finally {
			isSaving = false;
		}
	}

	/**
	 * Cancel editing
	 */
	function cancelEdit() {
		isEditing = false;
		editValue = '';
		saveError = '';
	}

	/**
	 * Handle keyboard shortcuts
	 */
	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter' && !multiline) {
			e.preventDefault();
			saveEdit();
		} else if (e.key === 'Escape') {
			e.preventDefault();
			cancelEdit();
		} else if (e.key === 'Enter' && e.ctrlKey && multiline) {
			e.preventDefault();
			saveEdit();
		}
	}
</script>

{#if isEditing}
	<!-- Edit Mode -->
	<div bind:this={element} class="editable-text-editing relative {className}">
		{#if multiline}
			<textarea
				bind:this={textareaElement}
				bind:value={editValue}
				onkeydown={handleKeydown}
				class="w-full px-4 py-3 border-2 border-purple-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 bg-white text-gray-900 shadow-lg text-base font-normal"
				rows={textareaRows}
				style="min-height: 200px; resize: vertical;"
			></textarea>
		{:else}
			<input
				type="text"
				bind:value={editValue}
				onkeydown={handleKeydown}
				class="w-full px-3 py-2 border-2 border-purple-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 bg-white text-gray-900 shadow-lg"
			/>
		{/if}

		{#if saveError}
			<div class="text-red-600 text-sm mt-1">{saveError}</div>
		{/if}

		<!-- Action buttons -->
		<div class="flex gap-2 mt-2">
			<button
				onclick={saveEdit}
				disabled={isSaving}
				class="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition disabled:opacity-50"
			>
				{isSaving ? 'Saving...' : 'Save'}
			</button>
			<button
				onclick={cancelEdit}
				disabled={isSaving}
				class="px-3 py-1 bg-gray-600 text-white text-sm rounded-md hover:bg-gray-700 transition disabled:opacity-50"
			>
				Cancel
			</button>
			{#if multiline}
				<span class="text-xs text-gray-500 self-center">Ctrl+Enter to save, Esc to cancel</span>
			{:else}
				<span class="text-xs text-gray-500 self-center">Enter to save, Esc to cancel</span>
			{/if}
		</div>
	</div>
{:else}
	<!-- Display Mode -->
	{#if multiline}
		{#if isEditable}
			<div
				bind:this={element}
				class="{className} editable-text cursor-pointer hover:bg-purple-50 hover:outline hover:outline-2 hover:outline-purple-300 transition-all rounded px-1"
				onclick={startEdit}
				role="button"
				tabindex="0"
				{...restProps}
			>
				{@html processMarkdown(currentText)}
			</div>
		{:else}
			<div
				bind:this={element}
				class={className}
				{...restProps}
			>
				{@html processMarkdown(currentText)}
			</div>
		{/if}
	{:else}
		<svelte:element
			this={tag}
			bind:this={element}
			class="{className} {isEditable ? 'editable-text cursor-pointer hover:bg-purple-50 hover:outline hover:outline-2 hover:outline-purple-300 transition-all rounded px-1' : ''}"
			onclick={isEditable ? startEdit : undefined}
			role={isEditable ? 'button' : undefined}
			tabindex={isEditable ? 0 : undefined}
			{...restProps}
		>
			{currentText}
		</svelte:element>
	{/if}
{/if}

<style>
	.editable-text {
		position: relative;
	}

	.editable-text::after {
		content: '✏️';
		position: absolute;
		right: -24px;
		top: 50%;
		transform: translateY(-50%);
		opacity: 0;
		transition: opacity 0.2s;
		font-size: 0.875rem;
	}

	.editable-text:hover::after {
		opacity: 1;
	}

	.editable-text-editing {
		display: block;
		min-width: 300px;
		max-width: 100%;
	}
</style>
