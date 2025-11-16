import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { Resend } from 'resend';
import { env } from '$env/dynamic/private';

const resend = new Resend(env.RESEND_API_KEY || '');

export const POST: RequestHandler = async ({ request }) => {
	try {
		// Check if API key is configured
		if (!env.RESEND_API_KEY) {
			console.error('RESEND_API_KEY is not configured');
			return json({ error: 'Serwis email nie jest skonfigurowany' }, { status: 500 });
		}

		const body = await request.json();
		const { name, email, project, message } = body;

		// Validate required fields
		if (!name || !email || !message) {
			return json({ error: 'Wszystkie pola są wymagane' }, { status: 400 });
		}

		// Validate email format
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return json({ error: 'Nieprawidłowy adres email' }, { status: 400 });
		}

		// Send email using Resend
		const { data, error } = await resend.emails.send({
			from: 'Kontakt Pikastro <noreply@auth.zaur.app>',
			to: ['magda@zaur.app'],
			replyTo: email,
			subject: `Nowa wiadomość od ${name} - ${project || 'Kontakt'}`,
			html: `
				<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
					<h2 style="color: #333;">Nowa wiadomość z formularza kontaktowego</h2>
					<div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
						<p><strong>Imię i nazwisko:</strong> ${name}</p>
						<p><strong>Email:</strong> ${email}</p>
						<p><strong>Typ projektu:</strong> ${project || 'Nie określono'}</p>
					</div>
					<div style="background: white; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
						<h3 style="color: #333; margin-top: 0;">Wiadomość:</h3>
						<p style="white-space: pre-wrap; line-height: 1.6;">${message}</p>
					</div>
					<hr style="margin: 30px 0; border: none; border-top: 1px solid #e0e0e0;">
					<p style="color: #666; font-size: 12px;">
						Ta wiadomość została wysłana z formularza kontaktowego na stronie pikastro.eu
					</p>
				</div>
			`,
		});

		if (error) {
			console.error('Resend error:', error);
			return json({ error: 'Wystąpił błąd podczas wysyłania wiadomości' }, { status: 500 });
		}

		return json({ success: true, messageId: data?.id });
	} catch (error) {
		console.error('Server error:', error);
		return json({ error: 'Wystąpił błąd serwera' }, { status: 500 });
	}
};
