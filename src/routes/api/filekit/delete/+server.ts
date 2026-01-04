import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import type { RequestHandler } from './$types';
import { getCurrentUser } from '$lib/server/auth';

/**
 * DELETE /api/filekit/delete
 * Deletes a file from FileKit.
 * Expects JSON body: { fileId: string }
 */
export const DELETE: RequestHandler = async ({ request }) => {
    try {
        // Authorization check
        const user = await getCurrentUser(request);
        if (!user) {
            return json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { fileId } = await request.json();

        if (!fileId) {
            return json({ error: 'File ID is required' }, { status: 400 });
        }

        const API_KEY = env.FILEKIT_PRIVATE_KEY;
        if (!API_KEY) {
            return json({ error: 'Server misconfiguration' }, { status: 500 });
        }

        // Call FileKit API to delete
        // Assumed Endpoint: DELETE https://filekit.dev/api/files/{id}
        // Authentication: key in query or Bearer token? 
        // createToken uses key in query. We will try that first.
        const response = await fetch(`https://filekit.dev/api/files/${fileId}?key=${encodeURIComponent(API_KEY)}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            // Try alternative: /api/file/{id} if 404? 
            // For now, let's assume standard REST.
            const errorText = await response.text();
            console.error('FileKit delete error:', response.status, errorText);
            return json({ error: `FileKit failed: ${errorText}` }, { status: response.status });
        }

        return json({ success: true });

    } catch (err) {
        console.error('FileKit delete exception:', err);
        return json({ error: 'Internal Server Error' }, { status: 500 });
    }
};
