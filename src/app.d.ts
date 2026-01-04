// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
		interface PrivateEnv {
			RESEND_API_KEY: string;
			DATABASE_URL: string;
			JWT_SECRET: string;
		}
	}
}

export {};
