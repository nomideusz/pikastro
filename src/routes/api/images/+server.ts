
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { query } from '$lib/server/db';
import { getCurrentUser } from '$lib/server/auth';

/**
 * GET /api/images
 * Lists image registry (key -> reference).
 */
export const GET: RequestHandler = async () => {
    try {
        // Fetch registry (assigned images)
        const registryResults = await query(
            "SELECT * FROM content WHERE category = 'image_registry'"
        );

        const registry: Record<string, string> = {};
        registryResults.rows.forEach(row => {
            registry[row.key] = row.value;
        });

        // We no longer list "all uploads" since FileKit manages storage
        return json({ registry });
    } catch (error) {
        console.error('Error fetching images:', error);
        return json({ error: 'Failed to list images' }, { status: 500 });
    }
};

/**
 * PUT /api/images
 * Updates the registry map (assigns a FileKit reference to a key).
 */
export const PUT: RequestHandler = async ({ request }) => {
    try {
        const user = await getCurrentUser(request);
        if (!user) {
            return json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const { key, reference } = await request.json();

        if (!key || !reference) {
            return json({ success: false, error: 'Key and Reference required' }, { status: 400 });
        }

        // Save reference to DB
        // Value is now the FileKit Reference ID (UUID mostly)
        await query(
            `INSERT INTO content (key, value, locale, category)
             VALUES ($1, $2, $3, $4)
             ON CONFLICT (key, locale) DO UPDATE SET value = $2, updated_at = CURRENT_TIMESTAMP`,
            [key, reference, 'default', 'image_registry']
        );

        return json({ success: true, key, reference });

    } catch (error) {
        console.error('Update error:', error);
        return json({ success: false, error: 'Failed to update' }, { status: 500 });
    }
};

/**
 * DELETE /api/images
 * Removes a registry assignment.
 */
export const DELETE: RequestHandler = async ({ request, url }) => {
    try {
        const user = await getCurrentUser(request);
        if (!user) {
            return json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const key = url.searchParams.get('key');

        if (key) {
            // Remove assignment from registry
            // We do NOT delete the file from FileKit here (that would require a different API call if desired, 
            // but usually we just unlink the reference).
            await query(
                "DELETE FROM content WHERE key = $1 AND category = 'image_registry'",
                [key]
            );
            return json({ success: true, removedKey: key });
        }

        return json({ success: false, error: 'Key required' }, { status: 400 });

    } catch (error) {
        console.error('Delete error:', error);
        return json({ success: false, error: 'Delete failed' }, { status: 500 });
    }
};
