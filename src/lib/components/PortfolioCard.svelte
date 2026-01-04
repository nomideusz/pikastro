<script lang="ts">
    import { Image } from "filekit-svelte";

    interface ImageObject {
        reference: string;
        description?: string;
    }

    interface Props {
        item: string | ImageObject;
        index: number;
        token: string | null;
        isEditable: boolean;
        altText: string;
        imageClass?: string;
        containerClass?: string;
        style?: string;
        onEditImage?: (index: number) => void;
        onDeleteImage?: (index: number) => void;
        onUpdateDescription?: (index: number, newDescription: string) => void;
    }

    let {
        item,
        index,
        token,
        isEditable,
        altText,
        imageClass = "h-full w-auto object-contain",
        containerClass = "",
        style = "",
        onEditImage,
        onDeleteImage,
        onUpdateDescription,
    }: Props = $props();

    // Derived state for easy access
    let imgSrc = $derived(typeof item === "string" ? item : item.reference);
    let description = $derived(
        typeof item === "string" ? "" : item.description || "",
    );
    let isFileKit = $derived(
        imgSrc && !imgSrc.startsWith("/") && !imgSrc.startsWith("http"),
    );

    // Editing description state
    let isEditingDesc = $state(false);
    let editValue = $state("");

    function startEditing(e: MouseEvent) {
        if (!isEditable) return;
        e.stopPropagation();
        editValue = description;
        isEditingDesc = true;
    }

    function saveDescription() {
        if (editValue !== description) {
            onUpdateDescription?.(index, editValue);
        }
        isEditingDesc = false;
    }

    function cancelEditing() {
        isEditingDesc = false;
    }

    function handleKeydown(e: KeyboardEvent) {
        if (e.key === "Enter") {
            e.preventDefault();
            saveDescription();
        } else if (e.key === "Escape") {
            e.preventDefault();
            cancelEditing();
        }
    }
    // Loading state
    let isLoaded = $state(false);

    function handleLoad() {
        isLoaded = true;
    }

    // Safety timeout to ensure image doesn't stay hidden forever if onload misses
    $effect(() => {
        const timer = setTimeout(() => {
            isLoaded = true;
        }, 2000);
        return () => clearTimeout(timer);
    });
</script>

<div
    class="flex-shrink-0 group relative rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 border-2 carousel-image-container {containerClass} bg-gray-100"
    {style}
    role="group"
    aria-label="Portfolio item"
>
    <!-- Image (Always rendered, opacity transition happens on Skeleton instead) -->
    {#if isFileKit && token}
        <div
            class="w-full h-full relative z-0 flex items-center justify-center"
        >
            <Image
                reference={imgSrc}
                {token}
                alt={altText}
                class={imageClass}
                draggable="false"
                onload={handleLoad}
            />
        </div>
    {:else if !isFileKit}
        <!-- svelte-ignore a11y_missing_attribute -->
        <div
            class="w-full h-full relative z-0 flex items-center justify-center"
        >
            <img
                src={imgSrc}
                alt={altText}
                class={imageClass}
                draggable="false"
                onload={handleLoad}
            />
        </div>
    {/if}

    <!-- Skeleton Overlay (Fades out when loaded) -->
    {#if !isLoaded || (isFileKit && !token)}
        <div
            class="absolute inset-0 z-10 flex items-center justify-center bg-gray-200 transition-opacity duration-500 pointer-events-none"
            class:opacity-0={isLoaded && (!isFileKit || token)}
            class:opacity-100={!isLoaded}
        >
            <div
                class="w-10 h-10 border-4 border-gray-300 border-t-purple-500 rounded-full animate-spin"
            ></div>
        </div>
    {/if}

    <!-- Edit/Delete Operations Overlay -->
    {#if isEditable && !isEditingDesc}
        <div
            class="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-20"
        >
            <button
                onclick={() => onEditImage?.(index)}
                class="bg-white/90 text-purple-600 p-2 rounded-full font-bold hover:bg-white shadow-lg backdrop-blur-sm transition-transform hover:scale-110"
                title="Zmień zdjęcie"
            >
                <svg
                    class="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                    />
                </svg>
            </button>
            <button
                onclick={() => onDeleteImage?.(index)}
                class="bg-red-600/90 text-white p-2 rounded-full font-bold hover:bg-red-600 shadow-lg backdrop-blur-sm transition-transform hover:scale-110"
                title="Usuń zdjęcie"
            >
                <svg
                    class="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                </svg>
            </button>
        </div>
    {/if}

    <!-- Description Overlay -->
    <div
        class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6"
    >
        {#if isEditingDesc}
            <div
                class="bg-white p-2 rounded-lg shadow-lg"
                onclick={(e) => e.stopPropagation()}
            >
                <input
                    type="text"
                    bind:value={editValue}
                    onkeydown={handleKeydown}
                    class="w-full px-2 py-1 border border-purple-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
                    placeholder="Wpisz opis..."
                    autoFocus
                />
                <div class="flex justify-end gap-2 mt-2">
                    <button
                        onclick={cancelEditing}
                        class="text-xs text-gray-500 hover:text-gray-700"
                        >Anuluj</button
                    >
                    <button
                        onclick={saveDescription}
                        class="text-xs bg-purple-600 text-white px-2 py-1 rounded hover:bg-purple-700"
                        >Zapisz</button
                    >
                </div>
            </div>
        {:else}
            <div
                class:cursor-pointer={isEditable}
                onclick={startEditing}
                role={isEditable ? "button" : undefined}
                tabindex={isEditable ? 0 : undefined}
                class="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
            >
                {#if description}
                    <p
                        class="text-white font-medium text-lg leading-tight relative"
                    >
                        {description}
                        {#if isEditable}
                            <span
                                class="absolute -right-6 top-1/2 -translate-y-1/2 opacity-50 text-xs"
                                >✏️</span
                            >
                        {/if}
                    </p>
                {:else if isEditable}
                    <p
                        class="text-gray-300 italic text-sm border border-dashed border-gray-500 rounded px-2 py-1 inline-block hover:bg-white/10 transition"
                    >
                        + Dodaj opis
                    </p>
                {/if}
            </div>
        {/if}
    </div>
</div>

<style>
    /* Ensure content is visible on touch devices if no hover mechanism */
    @media (hover: none) {
        .group:active .opacity-0 {
            opacity: 1;
        }
    }
</style>
