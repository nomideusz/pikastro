export interface ValidationResult {
	isValid: boolean;
	error?: string;
}

export interface FormValidationResult {
	name: ValidationResult;
	email: ValidationResult;
	message: ValidationResult;
	isFormValid: boolean;
}

// Email validation with comprehensive checks
export function validateEmail(email: string): ValidationResult {
	if (!email.trim()) {
		return { isValid: false, error: 'Adres email jest wymagany' };
	}

	// Basic format check
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (!emailRegex.test(email)) {
		return { isValid: false, error: 'Wprowadź prawidłowy adres email' };
	}

	// Additional checks for professional email validation
	const localPart = email.split('@')[0];
	const domain = email.split('@')[1];

	// Check for minimum length
	if (email.length < 5) {
		return { isValid: false, error: 'Adres email jest zbyt krótki' };
	}

	// Check for maximum length (RFC 5321)
	if (email.length > 254) {
		return { isValid: false, error: 'Adres email jest zbyt długi' };
	}

	// Check local part length
	if (localPart.length > 64) {
		return { isValid: false, error: 'Część lokalna adresu email jest zbyt długa' };
	}

	// Check for common typos
	const commonTypos = ['gmial.com', 'gmai.com', 'hotmai.com', 'yaho.com', 'outlok.com'];
	const domainLower = domain.toLowerCase();
	if (commonTypos.some(typo => domainLower.includes(typo))) {
		return { isValid: false, error: 'Sprawdź czy adres email jest prawidłowy (możliwa literówka)' };
	}

	// Check for disposable email domains (basic check)
	const disposableDomains = ['10minutemail.com', 'temp-mail.org', 'guerrillamail.com'];
	if (disposableDomains.includes(domainLower)) {
		return { isValid: false, error: 'Proszę użyj stałego adresu email' };
	}

	return { isValid: true };
}

// Name validation
export function validateName(name: string): ValidationResult {
	if (!name.trim()) {
		return { isValid: false, error: 'Imię i nazwisko są wymagane' };
	}

	const trimmedName = name.trim();

	// Check minimum length
	if (trimmedName.length < 2) {
		return { isValid: false, error: 'Imię i nazwisko muszą mieć co najmniej 2 znaki' };
	}

	// Check maximum length
	if (trimmedName.length > 100) {
		return { isValid: false, error: 'Imię i nazwisko są zbyt długie' };
	}

	// Check for valid characters (allow letters, spaces, hyphens, apostrophes)
	const nameRegex = /^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ\s\-']+$/;
	if (!nameRegex.test(trimmedName)) {
		return { isValid: false, error: 'Imię i nazwisko mogą zawierać tylko litery, spacje, myślniki i apostrofy' };
	}

	// Check for at least one letter
	if (!/[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ]/.test(trimmedName)) {
		return { isValid: false, error: 'Imię i nazwisko muszą zawierać przynajmniej jedną literę' };
	}

	// Check for reasonable word count (1-4 words)
	const words = trimmedName.split(/\s+/).filter(word => word.length > 0);
	if (words.length < 1 || words.length > 4) {
		return { isValid: false, error: 'Wprowadź imię i nazwisko w prawidłowym formacie' };
	}

	// Check each word has reasonable length
	if (words.some(word => word.length > 50)) {
		return { isValid: false, error: 'Poszczególne słowa w imieniu i nazwisku są zbyt długie' };
	}

	return { isValid: true };
}

// Message validation
export function validateMessage(message: string): ValidationResult {
	if (!message.trim()) {
		return { isValid: false, error: 'Wiadomość jest wymagana' };
	}

	const trimmedMessage = message.trim();

	// Check minimum length
	if (trimmedMessage.length < 10) {
		return { isValid: false, error: 'Wiadomość musi mieć co najmniej 10 znaków' };
	}

	// Check maximum length
	if (trimmedMessage.length > 5000) {
		return { isValid: false, error: 'Wiadomość jest zbyt długa (maksymalnie 5000 znaków)' };
	}

	// Check for minimum words
	const words = trimmedMessage.split(/\s+/).filter(word => word.length > 0);
	if (words.length < 3) {
		return { isValid: false, error: 'Wiadomość powinna zawierać co najmniej kilka słów' };
	}

	// Check for excessive repetition (simple check)
	const wordCounts: { [key: string]: number } = {};
	words.forEach(word => {
		const lowerWord = word.toLowerCase();
		wordCounts[lowerWord] = (wordCounts[lowerWord] || 0) + 1;
	});

	const maxRepetition = Math.max(...Object.values(wordCounts));
	if (maxRepetition > words.length * 0.3 && words.length > 10) {
		return { isValid: false, error: 'Wiadomość zawiera zbyt wiele powtórzeń' };
	}

	return { isValid: true };
}

// Comprehensive form validation
export function validateForm(formData: {
	name: string;
	email: string;
	message: string;
}): FormValidationResult {
	const nameValidation = validateName(formData.name);
	const emailValidation = validateEmail(formData.email);
	const messageValidation = validateMessage(formData.message);

	return {
		name: nameValidation,
		email: emailValidation,
		message: messageValidation,
		isFormValid: nameValidation.isValid && emailValidation.isValid && messageValidation.isValid
	};
}

// Real-time validation types
export type ValidationField = 'name' | 'email' | 'message';

export function validateField(field: ValidationField, value: string): ValidationResult {
	switch (field) {
		case 'name':
			return validateName(value);
		case 'email':
			return validateEmail(value);
		case 'message':
			return validateMessage(value);
		default:
			return { isValid: true };
	}
}
