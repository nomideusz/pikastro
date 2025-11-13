# Contact Form Setup Instructions

The contact form has been configured to send emails to **magda@zaur.app** using Resend.

## Setup Steps

### 1. Get Resend API Key

1. Go to [Resend.com](https://resend.com) and create a free account
2. Navigate to API Keys section: https://resend.com/api-keys
3. Click "Create API Key"
4. Copy your API key

### 2. Configure Environment Variable

1. Create a `.env` file in the project root (it's already gitignored):
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your Resend API key:
   ```
   RESEND_API_KEY=re_your_actual_api_key_here
   ```

### 3. Verify Domain (Optional but Recommended)

By default, emails are sent from `onboarding@resend.dev`. To use a custom domain:

1. Add and verify your domain in Resend dashboard
2. Update the `from` address in `/src/routes/api/contact/+server.ts`:
   ```typescript
   from: 'Kontakt Pikastro <noreply@pikastro.eu>',
   ```

### 4. Deploy to Netlify

When deploying, add the environment variable to Netlify:

1. Go to Site Settings > Environment Variables
2. Add `RESEND_API_KEY` with your API key value
3. Redeploy the site

## Form Features

- ✅ Sends emails to magda@zaur.app
- ✅ Email includes sender's name, email, project type, and message
- ✅ Reply-To header set to sender's email for easy responses
- ✅ Client-side and server-side validation
- ✅ Loading states and error handling
- ✅ Success/error feedback messages
- ✅ Form reset after successful submission

## Testing Locally

1. Make sure `.env` file is configured with your Resend API key
2. Run the development server:
   ```bash
   npm run dev
   ```
3. Navigate to the contact section (#kontakt)
4. Fill out and submit the form
5. Check your email at magda@zaur.app

## Troubleshooting

**Error: "Serwis email nie jest skonfigurowany"**
- Make sure `.env` file exists with `RESEND_API_KEY` set
- Restart the development server after adding the env variable

**Error: "Wystąpił błąd podczas wysyłania wiadomości"**
- Check that your Resend API key is valid
- Verify you haven't exceeded Resend's free tier limits (100 emails/day)
- Check browser console and server logs for detailed error messages

**Emails not being received:**
- Check spam folder
- Verify the recipient email (magda@zaur.app) in `/src/routes/api/contact/+server.ts`
- For custom domains, ensure domain is verified in Resend

## Resend Free Tier Limits

- 100 emails per day
- 3,000 emails per month
- No credit card required

For higher volume, consider upgrading to a paid plan.
