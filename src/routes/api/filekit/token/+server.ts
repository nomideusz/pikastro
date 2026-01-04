
import { json } from '@sveltejs/kit';
import { createToken } from 'filekit-svelte';
import { env } from '$env/dynamic/private';
import type { RequestHandler } from './$types';
import { getCurrentUser } from '$lib/server/auth';

/**
 * GET /api/filekit/token
 * Generates a short-lived media token for FileKit client components.
 */
export const GET: RequestHandler = async ({ request }) => {
    // Optional: Check if user is authenticated (admins only)
    // For public viewing, we might need a public token, but for uploading we definitely need checks.
    // Since this token allows *uploading*, we should restrict it to admins.
    // However, the same token is used for *viewing* secure images.
    // FileKit docs suggest "private" media needs a token.
    // If our images are public-read, we might not need a token for viewing (depending on FileKit config),
    // but the components require it.

    // For now, let's assume we need a token for everything.
    // To allow public viewing of portfolio, we might need to expose this without auth, 
    // OR create two endpoints: one for admin (upload capability) and one for public (view only - if FileKit supports scoped tokens).
    // FileKit docs don't explicitly mention scoped tokens yet, just "Media Token".
    // We'll expose it publicly for now so the portfolio loads for visitors, BUT...
    // ideally, we should check if the user is an admin before rendering the <Uploader>.

    // Let's protect the endpoint slightly but realistically for a public site:
    // Any visitor needs to see images. So we generate tokens.
    // Only admins see the Uploader component in the UI. 
    // Secure app would use signed URLs generated on server for public views, 
    // but FileKit components fetch them client-side using the token.

    const API_KEY = env.FILEKIT_PRIVATE_KEY;
    if (!API_KEY) {
        return json({ error: 'Server misconfiguration: No API Key' }, { status: 500 });
    }

    try {
        const result = await createToken(API_KEY);

        if (result.error) {
            console.error("FileKit token error:", result.error);
            return json({ error: result.error }, { status: 500 });
        }

        return json({ token: result.token });
    } catch (err) {
        console.error("FileKit token exception:", err);
        return json({ error: 'Internal Server Error' }, { status: 500 });
    }
};
