
import { writable } from 'svelte/store';

function createFileKitStore() {
    const { subscribe, set } = writable<string | null>(null);

    return {
        subscribe,
        set,
        init: async () => {
            try {
                const response = await fetch('/api/filekit/token');
                const data = await response.json();
                if (data.token) {
                    set(data.token);
                } else {
                    console.error("Failed to load FileKit token:", data.error);
                }
            } catch (err) {
                console.error("Error fetching FileKit token:", err);
            }
        }
    };
}

export const filekitToken = createFileKitStore();
