/**
 * Image upload/management API endpoints
 * POST /api/images - Upload a new image
 * GET /api/images - List all uploaded images
 * PUT /api/images - Update image registry (key mapping)
 * DELETE /api/images - Delete an image
 */

import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getCurrentUser } from '$lib/server/auth';
import { writeFile, readFile, mkdir, unlink, readdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

const UPLOAD_DIR = 'static/uploads';
const REGISTRY_FILE = 'src/lib/data/images.json';

// Ensure upload directory exists
async function ensureUploadDir() {
    if (!existsSync(UPLOAD_DIR)) {
        await mkdir(UPLOAD_DIR, { recursive: true });
    }
}

// Load image registry
async function loadRegistry(): Promise<Record<string, string>> {
    try {
        const data = await readFile(REGISTRY_FILE, 'utf-8');
        return JSON.parse(data);
    } catch {
        return {};
    }
}

// Save image registry
async function saveRegistry(registry: Record<string, string>) {
    await writeFile(REGISTRY_FILE, JSON.stringify(registry, null, 2));
}

/**
 * GET /api/images
 * List all uploaded images and the registry
 */
export const GET: RequestHandler = async () => {
    try {
        await ensureUploadDir();

        // Get list of files in upload directory
        const files = await readdir(UPLOAD_DIR);
        const images = files
            .filter(f => /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(f))
            .map(f => ({
                filename: f,
                url: `/uploads/${f}`,
                path: `${UPLOAD_DIR}/${f}`
            }));

        // Load registry
        const registry = await loadRegistry();

        return json({
            success: true,
            images,
            registry
        });
    } catch (error) {
        console.error('Error listing images:', error);
        return json({ success: false, error: 'Failed to list images' }, { status: 500 });
    }
};

/**
 * POST /api/images
 * Upload a new image
 * Expects multipart/form-data with 'file' field
 */
export const POST: RequestHandler = async ({ request }) => {
    try {
        // Check authentication
        const user = await getCurrentUser(request);
        if (!user) {
            return json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        await ensureUploadDir();

        const formData = await request.formData();
        const file = formData.get('file') as File | null;
        const imageKey = formData.get('key') as string | null;

        if (!file) {
            return json({ success: false, error: 'No file provided' }, { status: 400 });
        }

        // Validate file type
        const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
        if (!validTypes.includes(file.type)) {
            return json({ success: false, error: 'Invalid file type' }, { status: 400 });
        }

        // Generate unique filename
        const ext = path.extname(file.name) || '.jpg';
        const timestamp = Date.now();
        const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_').replace(ext, '');
        const filename = `${safeName}_${timestamp}${ext}`;
        const filepath = path.join(UPLOAD_DIR, filename);

        // Write file
        const buffer = Buffer.from(await file.arrayBuffer());
        await writeFile(filepath, buffer);

        const imageUrl = `/uploads/${filename}`;

        // If a key was provided, update the registry
        if (imageKey) {
            const registry = await loadRegistry();
            registry[imageKey] = imageUrl;
            await saveRegistry(registry);
        }

        return json({
            success: true,
            filename,
            url: imageUrl,
            key: imageKey
        });
    } catch (error) {
        console.error('Error uploading image:', error);
        return json({ success: false, error: 'Failed to upload image' }, { status: 500 });
    }
};

/**
 * PUT /api/images
 * Update image registry (map a key to an image URL)
 * Body: { key: string, url: string }
 */
export const PUT: RequestHandler = async ({ request }) => {
    try {
        // Check authentication
        const user = await getCurrentUser(request);
        if (!user) {
            return json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const { key, url } = await request.json();

        if (!key || !url) {
            return json({ success: false, error: 'Key and URL are required' }, { status: 400 });
        }

        const registry = await loadRegistry();
        registry[key] = url;
        await saveRegistry(registry);

        return json({
            success: true,
            key,
            url
        });
    } catch (error) {
        console.error('Error updating image registry:', error);
        return json({ success: false, error: 'Failed to update registry' }, { status: 500 });
    }
};

/**
 * DELETE /api/images
 * Delete an uploaded image
 * Query params: ?filename=image.jpg or ?key=home.hero.background
 */
export const DELETE: RequestHandler = async ({ request, url }) => {
    try {
        // Check authentication
        const user = await getCurrentUser(request);
        if (!user) {
            return json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const filename = url.searchParams.get('filename');
        const key = url.searchParams.get('key');

        if (filename) {
            // Delete file
            const filepath = path.join(UPLOAD_DIR, filename);
            if (existsSync(filepath)) {
                await unlink(filepath);
            }

            // Remove from registry if mapped
            const registry = await loadRegistry();
            for (const [k, v] of Object.entries(registry)) {
                if (v === `/uploads/${filename}`) {
                    delete registry[k];
                }
            }
            await saveRegistry(registry);

            return json({ success: true, deleted: filename });
        }

        if (key) {
            // Just remove from registry (don't delete file)
            const registry = await loadRegistry();
            delete registry[key];
            await saveRegistry(registry);

            return json({ success: true, removedKey: key });
        }

        return json({ success: false, error: 'Filename or key required' }, { status: 400 });
    } catch (error) {
        console.error('Error deleting image:', error);
        return json({ success: false, error: 'Failed to delete image' }, { status: 500 });
    }
};
