/**
 * Content API endpoints
 * GET /api/content - Fetch all content or by key
 * PUT /api/content - Update content (requires authentication)
 */

import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { query } from '$lib/server/db';
import { getCurrentUser } from '$lib/server/auth';

/**
 * GET /api/content
 * Fetch content by key or all content
 * Query params: ?key=home.hero.heading1 or ?locale=pl or ?category=home
 */
export const GET: RequestHandler = async ({ url }) => {
	try {
		const key = url.searchParams.get('key');
		const locale = url.searchParams.get('locale') || 'pl';
		const category = url.searchParams.get('category');

		let queryText = 'SELECT * FROM content WHERE locale = $1';
		const params: any[] = [locale];

		if (key) {
			queryText += ' AND key = $2';
			params.push(key);
		} else if (category) {
			queryText += ' AND category = $2';
			params.push(category);
		}

		queryText += ' ORDER BY key ASC';

		const result = await query(queryText, params);

		if (key && result.rows.length === 0) {
			return json({ error: 'Content not found' }, { status: 404 });
		}

		// If querying by key, return single object, otherwise return array
		const data = key ? result.rows[0] : result.rows;

		return json({ success: true, data });
	} catch (error) {
		console.error('Error fetching content:', error);
		return json({ success: false, error: 'Internal server error' }, { status: 500 });
	}
};

/**
 * PUT /api/content
 * Update or create content (requires authentication)
 * Body: { key: string, value: string, locale?: string, category?: string }
 */
export const PUT: RequestHandler = async ({ request }) => {
	try {
		// Check authentication
		const user = await getCurrentUser(request);
		if (!user) {
			return json({ success: false, error: 'Unauthorized' }, { status: 401 });
		}

		const { key, value, locale = 'pl', category } = await request.json();

		// Validate input
		if (!key || value === undefined) {
			return json({ success: false, error: 'Key and value are required' }, { status: 400 });
		}

		// Check if content exists
		const existingResult = await query('SELECT * FROM content WHERE key = $1 AND locale = $2', [
			key,
			locale
		]);

		let result;
		let oldValue = null;

		if (existingResult.rows.length > 0) {
			// Update existing content
			const existing = existingResult.rows[0];
			oldValue = existing.value;

			result = await query(
				`UPDATE content
				 SET value = $1, category = $2, updated_at = CURRENT_TIMESTAMP
				 WHERE key = $3 AND locale = $4
				 RETURNING *`,
				[value, category, key, locale]
			);

			// Log to history
			await query(
				`INSERT INTO content_history (content_id, content_key, old_value, new_value, changed_by)
				 VALUES ($1, $2, $3, $4, $5)`,
				[existing.id, key, oldValue, value, user.id]
			);
		} else {
			// Create new content
			result = await query(
				`INSERT INTO content (key, value, locale, category)
				 VALUES ($1, $2, $3, $4)
				 RETURNING *`,
				[key, value, locale, category]
			);
		}

		return json({
			success: true,
			data: result.rows[0],
			action: oldValue ? 'updated' : 'created'
		});
	} catch (error) {
		console.error('Error updating content:', error);
		return json({ success: false, error: 'Internal server error' }, { status: 500 });
	}
};

/**
 * DELETE /api/content
 * Delete content by key (requires authentication)
 * Query params: ?key=home.hero.heading1&locale=pl
 */
export const DELETE: RequestHandler = async ({ request, url }) => {
	try {
		// Check authentication
		const user = await getCurrentUser(request);
		if (!user) {
			return json({ success: false, error: 'Unauthorized' }, { status: 401 });
		}

		const key = url.searchParams.get('key');
		const locale = url.searchParams.get('locale') || 'pl';

		if (!key) {
			return json({ success: false, error: 'Key is required' }, { status: 400 });
		}

		const result = await query('DELETE FROM content WHERE key = $1 AND locale = $2 RETURNING *', [
			key,
			locale
		]);

		if (result.rows.length === 0) {
			return json({ success: false, error: 'Content not found' }, { status: 404 });
		}

		return json({ success: true, deleted: result.rows[0] });
	} catch (error) {
		console.error('Error deleting content:', error);
		return json({ success: false, error: 'Internal server error' }, { status: 500 });
	}
};
