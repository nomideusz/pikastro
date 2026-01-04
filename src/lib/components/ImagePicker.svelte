<script lang="ts">
    import { portal } from "$lib/actions/portal";
    import { onMount } from "svelte";
    import { Uploader, Image } from "filekit-svelte";
    import { filekitToken } from "$lib/stores/filekit.svelte";

    interface Props {
        isOpen: boolean;
        onSelect: (reference: string) => void;
        onClose?: () => void;
    }

    let { isOpen = $bindable(false), onSelect, onClose }: Props = $props();

    let isUploading = $state(false);
    let uploadError = $state("");
    // Previously we had a list of uploaded images. FileKit doesn't easily expose a "list all" API for public consumption
    // without a backend proxy. For now, we will focus on *uploading new* images or *selecting* based on what we might have stored locally
    // (though we wiped the local registry).
    // If the user wants to re-use an image, they might need a different UI (e.g., "Recently Uploaded" tracked in our DB).
    // For this iteration, let's keep it simple: Upload New.
    // We can add "Library" tab later if we track all uploads in our DB (which `api/images` POST used to do).
    // FileKit returns a reference. We should probably track this reference in our DB if we want a gallery.
    // However, the current requirements are just "upload image".

    // Check for token on mount/open
    $effect(() => {
        if (isOpen && !$filekitToken) {
            filekitToken.init();
        }
    });

    function close() {
        isOpen = false;
        uploadError = "";
        onClose?.();
    }

    function handleUploadSuccess(data: { reference: string }) {
        onSelect(data.reference);
        close();
    }

    function handleUploadError(data: { error: string }) {
        console.error("Upload error:", data.error);
        uploadError = data.error;
    }
</script>

{#if isOpen}
    <div
        use:portal
        class="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 pointer-events-auto"
        onclick={close}
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
                <h2 class="text-xl font-bold text-gray-900">Wgraj obraz</h2>
                <button
                    type="button"
                    onclick={close}
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
                {#if $filekitToken}
                    <div
                        class="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50"
                    >
                        <Uploader
                            token={$filekitToken}
                            accept="image/*"
                            maxFileSize={10 * 1024 * 1024}
                            onUpload={handleUploadSuccess}
                            onError={handleUploadError}
                            class="px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition cursor-pointer shadow-md"
                            btnTxt="Wybierz lub przeciągnij plik"
                        />
                        <p class="text-sm text-gray-500 mt-4">
                            Max 10MB. JPG, PNG, WebP, GIF.
                        </p>
                    </div>
                {:else}
                    <div class="flex items-center justify-center p-8">
                        <div
                            class="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"
                        ></div>
                        <span class="ml-3 text-gray-600"
                            >Ładowanie bezpiecznego połączenia...</span
                        >
                    </div>
                {/if}

                {#if uploadError}
                    <div
                        class="mt-4 text-red-600 text-sm p-3 bg-red-50 rounded-lg text-center"
                    >
                        {uploadError}
                    </div>
                {/if}
            </div>
        </div>
    </div>
{/if}
