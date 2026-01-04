<script lang="ts">
    import { portal } from "$lib/actions/portal";
    import { editModeStore } from "$lib/stores/editMode.svelte";

    interface Props {
        /** Image key for registry (e.g., "home.hero.background") */
        imageKey: string;
        /** Current image source (fallback if not in registry) */
        src: string;
        /** Alt text for the image */
        alt: string;
        /** CSS class for the image */
        class?: string;
        /** Additional HTML attributes */
        [key: string]: any;
    }

    let {
        imageKey,
        src: defaultSrc,
        alt,
        class: className = "",
        ...restProps
    }: Props = $props();

    let isModalOpen = $state(false);
    let isUploading = $state(false);
    let uploadError = $state("");
    let availableImages = $state<Array<{ filename: string; url: string }>>([]);
    let registeredUrl = $state<string | null>(null);
    let fileInput: HTMLInputElement | null = $state(null);
    let dragOver = $state(false);

    // Determine if this element is editable (only in edit mode and authenticated)
    let isEditable = $derived(
        editModeStore.isEditMode && editModeStore.isAuthenticated,
    );

    // Get current image source (registry URL or default)
    let currentSrc = $derived(registeredUrl || defaultSrc);

    // Load registry on mount
    $effect(() => {
        loadRegistry();
    });

    async function loadRegistry() {
        try {
            const response = await fetch("/api/images");
            if (response.ok) {
                const data = await response.json();
                availableImages = data.images || [];
                if (data.registry && data.registry[imageKey]) {
                    registeredUrl = data.registry[imageKey];
                }
            }
        } catch (error) {
            console.error("Error loading image registry:", error);
        }
    }

    function openModal(e: MouseEvent) {
        if (!isEditable) return;
        e.preventDefault();
        e.stopPropagation();
        isModalOpen = true;
        uploadError = "";
        loadRegistry(); // Refresh available images
    }

    function closeModal() {
        isModalOpen = false;
        uploadError = "";
    }

    async function handleFileUpload(file: File) {
        if (!file) return;

        // Validate file type
        const validTypes = [
            "image/jpeg",
            "image/png",
            "image/gif",
            "image/webp",
            "image/svg+xml",
        ];
        if (!validTypes.includes(file.type)) {
            uploadError = "Invalid file type. Use JPG, PNG, GIF, WebP, or SVG.";
            return;
        }

        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            uploadError = "File too large. Maximum 10MB.";
            return;
        }

        isUploading = true;
        uploadError = "";

        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("key", imageKey);

            const response = await fetch("/api/images", {
                method: "POST",
                credentials: "include",
                body: formData,
            });

            const data = await response.json();

            if (data.success) {
                registeredUrl = data.url;
                await loadRegistry();
                closeModal();
                // Reload page to reflect changes
                window.location.reload();
            } else {
                uploadError = data.error || "Upload failed";
            }
        } catch (error) {
            console.error("Error uploading image:", error);
            uploadError = "Network error. Please try again.";
        } finally {
            isUploading = false;
        }
    }

    function handleFileSelect(e: Event) {
        const input = e.target as HTMLInputElement;
        if (input.files && input.files[0]) {
            handleFileUpload(input.files[0]);
        }
    }

    function handleDrop(e: DragEvent) {
        e.preventDefault();
        dragOver = false;
        if (e.dataTransfer?.files && e.dataTransfer.files[0]) {
            handleFileUpload(e.dataTransfer.files[0]);
        }
    }

    function handleDragOver(e: DragEvent) {
        e.preventDefault();
        dragOver = true;
    }

    function handleDragLeave() {
        dragOver = false;
    }

    async function selectExistingImage(url: string) {
        isUploading = true;
        try {
            const response = await fetch("/api/images", {
                method: "PUT",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ key: imageKey, url }),
            });

            const data = await response.json();

            if (data.success) {
                registeredUrl = url;
                closeModal();
                window.location.reload();
            } else {
                uploadError = data.error || "Failed to select image";
            }
        } catch (error) {
            console.error("Error selecting image:", error);
            uploadError = "Network error. Please try again.";
        } finally {
            isUploading = false;
        }
    }

    async function removeImage() {
        isUploading = true;
        try {
            const response = await fetch(
                `/api/images?key=${encodeURIComponent(imageKey)}`,
                {
                    method: "DELETE",
                    credentials: "include",
                },
            );

            const data = await response.json();

            if (data.success) {
                registeredUrl = null;
                closeModal();
                window.location.reload();
            } else {
                uploadError = data.error || "Failed to remove image";
            }
        } catch (error) {
            console.error("Error removing image:", error);
            uploadError = "Network error. Please try again.";
        } finally {
            isUploading = false;
        }
    }
    function handleKeyDown(e: KeyboardEvent) {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openModal(e as unknown as MouseEvent);
        }
    }
</script>

<!-- Image with edit overlay -->
<div
    class="editable-image-wrapper relative {isEditable ? 'cursor-pointer' : ''}"
>
    <img src={currentSrc} {alt} class={className} {...restProps} />

    {#if isEditable}
        <!-- Edit overlay -->
        <div
            role="button"
            tabindex="0"
            class="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/40 transition-all duration-300 group z-20 pointer-events-auto"
            onclick={openModal}
            onkeydown={handleKeyDown}
            aria-label="Edit image"
        >
            <div
                class="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 rounded-xl px-4 py-3 shadow-lg flex items-center gap-2"
            >
                <svg
                    class="w-5 h-5 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    ></path>
                </svg>
                <span class="text-sm font-bold text-purple-600"
                    >Zmień obraz</span
                >
            </div>
        </div>
    {/if}
</div>

<!-- Image Picker Modal -->
{#if isModalOpen}
    <div
        use:portal
        class="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 pointer-events-auto"
        onclick={closeModal}
        role="dialog"
        aria-modal="true"
    >
        <div
            class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
            onclick={(e) => e.stopPropagation()}
        >
            <!-- Header -->
            <div
                class="flex items-center justify-between px-6 py-4 border-b border-gray-200"
            >
                <h2 class="text-xl font-bold text-gray-900">
                    Wybierz lub wgraj obraz
                </h2>
                <button
                    type="button"
                    onclick={closeModal}
                    class="text-gray-400 hover:text-gray-600 transition"
                >
                    <svg
                        class="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M6 18L18 6M6 6l12 12"
                        ></path>
                    </svg>
                </button>
            </div>

            <!-- Content -->
            <div class="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                <!-- Upload Area -->
                <div
                    class="border-2 border-dashed rounded-xl p-8 text-center transition-colors mb-6 {dragOver
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-300 hover:border-purple-400'}"
                    ondrop={handleDrop}
                    ondragover={handleDragOver}
                    ondragleave={handleDragLeave}
                >
                    <input
                        bind:this={fileInput}
                        type="file"
                        accept="image/*"
                        class="hidden"
                        onchange={handleFileSelect}
                    />

                    <svg
                        class="w-12 h-12 mx-auto text-gray-400 mb-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        ></path>
                    </svg>

                    <p class="text-gray-600 mb-2">
                        Przeciągnij obraz tutaj lub
                    </p>
                    <button
                        type="button"
                        onclick={() => fileInput?.click()}
                        disabled={isUploading}
                        class="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:opacity-50"
                    >
                        {isUploading ? "Wgrywanie..." : "Wybierz plik"}
                    </button>
                    <p class="text-sm text-gray-400 mt-2">
                        JPG, PNG, GIF, WebP, SVG (max 10MB)
                    </p>
                </div>

                {#if uploadError}
                    <div
                        class="text-red-600 text-sm mb-4 p-3 bg-red-50 rounded-lg"
                    >
                        {uploadError}
                    </div>
                {/if}

                <!-- Existing Images -->
                {#if availableImages.length > 0}
                    <div>
                        <h3 class="text-sm font-semibold text-gray-700 mb-3">
                            Lub wybierz z istniejących:
                        </h3>
                        <div class="grid grid-cols-3 gap-3">
                            {#each availableImages as image}
                                <button
                                    type="button"
                                    onclick={() =>
                                        selectExistingImage(image.url)}
                                    class="aspect-square rounded-lg overflow-hidden border-2 border-gray-200 hover:border-purple-500 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    disabled={isUploading}
                                >
                                    <img
                                        src={image.url}
                                        alt={image.filename}
                                        class="w-full h-full object-cover"
                                    />
                                </button>
                            {/each}
                        </div>
                    </div>
                {/if}

                <!-- Remove Image Button -->
                {#if registeredUrl}
                    <div class="mt-6 pt-6 border-t border-gray-200">
                        <button
                            type="button"
                            onclick={removeImage}
                            disabled={isUploading}
                            class="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
                        >
                            Usuń przypisany obraz
                        </button>
                    </div>
                {/if}
            </div>
        </div>
    </div>
{/if}

<style>
    .editable-image-wrapper {
        display: contents;
    }

    .editable-image-wrapper > img {
        position: relative;
    }

    .editable-image-wrapper > div[role="button"] {
        pointer-events: auto;
    }
</style>
