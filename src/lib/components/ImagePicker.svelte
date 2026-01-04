    interface Props {
        isOpen: boolean;
        onSelect: (url: string) => void;
        onClose?: () => void;
    }

    let { isOpen = $bindable(false), onSelect, onClose }: Props = $props();

    let isUploading = $state(false);
    let uploadError = $state("");
    let availableImages = $state<Array<{ filename: string; url: string }>>([]);
    let fileInput: HTMLInputElement | null = $state(null);
    let dragOver = $state(false);

    // Load available images when modal opens
    $effect(() => {
        if (isOpen) {
            loadImages();
            uploadError = "";
        }
    });

    async function loadImages() {
        try {
            const response = await fetch("/api/images");
            if (response.ok) {
                const data = await response.json();
                availableImages = data.images || [];
            }
        } catch (error) {
            console.error("Error loading images:", error);
        }
    }

    function close() {
        isOpen = false;
        uploadError = "";
        onClose?.();
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
            // No key provided here, purely uploading a file

            const response = await fetch("/api/images", {
                method: "POST",
                credentials: "include",
                body: formData,
            });

            const data = await response.json();

            if (data.success) {
                await loadImages();
                onSelect(data.url);
                close();
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

    // Delete a file from the server
    async function deleteFile(filename: string, e: Event) {
        e.stopPropagation(); // Prevent selection
        if (!confirm("Are you sure you want to delete this file permenantly?"))
            return;

        isUploading = true;
        try {
            const response = await fetch(`/api/images?filename=${filename}`, {
                method: "DELETE",
                credentials: "include",
            });

            if (response.ok) {
                await loadImages();
            } else {
                uploadError = "Failed to delete file";
            }
        } catch (err) {
            console.error(err);
            uploadError = "Error deleting file";
        } finally {
            isUploading = false;
        }
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
                <h2 class="text-xl font-bold text-gray-900">
                    Wybierz lub wgraj obraz
                </h2>
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
                <!-- Upload Area -->
                <div
                    class="border-2 border-dashed rounded-xl p-8 text-center transition-colors mb-6 {dragOver
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-300 hover:border-purple-400'}"
                    ondrop={handleDrop}
                    ondragover={handleDragOver}
                    ondragleave={handleDragLeave}
                    role="region"
                    aria-label="Upload Drop Zone"
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
                                <div class="relative group">
                                    <button
                                        type="button"
                                        onclick={() => onSelect(image.url)}
                                        class="aspect-square rounded-lg overflow-hidden border-2 border-gray-200 hover:border-purple-500 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 w-full"
                                        disabled={isUploading}
                                    >
                                        <img
                                            src={image.url}
                                            alt={image.filename}
                                            class="w-full h-full object-cover"
                                        />
                                    </button>

                                    <!-- Delete File Button -->
                                    <button
                                        type="button"
                                        class="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                                        onclick={(e) =>
                                            deleteFile(image.filename, e)}
                                        title="Delete file"
                                    >
                                        <svg
                                            class="w-3 h-3"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            ><path
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                stroke-width="2"
                                                d="M6 18L18 6M6 6l12 12"
                                            ></path></svg
                                        >
                                    </button>
                                </div>
                            {/each}
                        </div>
                    </div>
                {/if}
            </div>
        </div>
    </div>
{/if}
