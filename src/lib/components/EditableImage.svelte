<script lang="ts">
    import { editModeStore } from "$lib/stores/editMode.svelte";
    import ImagePicker from "./ImagePicker.svelte";
    import { Image } from "filekit-svelte";
    import { filekitToken } from "$lib/stores/filekit.svelte";

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
    let registeredUrl = $state<string | null>(null);
    let isUpdating = $state(false);

    // Determine if this element is editable (only in edit mode and authenticated)
    let isEditable = $derived(
        editModeStore.isEditMode && editModeStore.isAuthenticated,
    );

    // Get current image source (registry URL or default)
    let currentSrc = $derived(registeredUrl || defaultSrc);

    // Check if source is a FileKit reference (simple heuristic: no slash/http)
    let isFileKitReference = $derived(
        currentSrc &&
            !currentSrc.startsWith("/") &&
            !currentSrc.startsWith("http"),
    );

    // Load registry on mount
    $effect(() => {
        loadRegistry();
        // Init token if needed
        if (!$filekitToken) {
            filekitToken.init();
        }
    });

    async function loadRegistry() {
        try {
            const response = await fetch("/api/images");
            if (response.ok) {
                const data = await response.json();
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
    }

    async function updateImage(reference: string) {
        isUpdating = true;
        try {
            const response = await fetch("/api/images", {
                method: "PUT",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ key: imageKey, reference }),
            });

            const data = await response.json();

            if (data.success) {
                registeredUrl = reference;
                // Ideally we don't reload if we can just update state,
                // but for global consistency across components sharing same key, reload is safest for now.
                // However, since we are using FileKit references, simply updating registeredUrl makes the
                // <Image /> component render the new image immediately if token is valid.
                // Let's try avoid reload for better UX.
                // window.location.reload();
            } else {
                console.error(data.error || "Failed to update image");
            }
        } catch (error) {
            console.error("Error updating image:", error);
        } finally {
            isUpdating = false;
        }
    }

    async function removeImage() {
        if (!confirm("Are you sure you want to revert to the default image?"))
            return;

        isUpdating = true;
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
            } else {
                console.error(data.error || "Failed to remove image");
            }
        } catch (error) {
            console.error("Error removing image:", error);
        } finally {
            isUpdating = false;
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
    {#if isFileKitReference && $filekitToken}
        <Image
            reference={currentSrc}
            token={$filekitToken}
            {alt}
            class={className}
            {...restProps}
        />
    {:else}
        <!-- svelte-ignore a11y_missing_attribute -->
        <img src={currentSrc} {alt} class={className} {...restProps} />
    {/if}

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

            <!-- Delete/Revert Button (if custom image set) -->
            {#if registeredUrl}
                <button
                    type="button"
                    onclick={(e) => {
                        e.stopPropagation();
                        removeImage();
                    }}
                    class="absolute top-2 right-2 bg-red-600/80 hover:bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
                    title="Przywróć domyślny"
                >
                    <svg
                        class="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        ></path>
                    </svg>
                </button>
            {/if}
        </div>
    {/if}
</div>

<ImagePicker bind:isOpen={isModalOpen} onSelect={updateImage} />

<style>
    .editable-image-wrapper {
        display: contents;
    }

    /* We can't target nested elements easily with display: contents as container */
    /* Adjust selectors as needed or rely on global/scoped styles */
</style>
