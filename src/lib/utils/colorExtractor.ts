/**
 * Color extraction and role assignment utilities for dynamic theming
 */

export interface ColorPalette {
	primary: string;
	accent: string;
	secondary: string;
	success: string;
	tertiary: string;
}

/**
 * Extract dominant colors from an image
 * Uses a simple canvas-based approach to analyze image pixels
 */
export async function extractColorsFromImage(imageSrc: string, maxColors: number = 5): Promise<string[]> {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.crossOrigin = 'anonymous';

		img.onload = () => {
			try {
				const canvas = document.createElement('canvas');
				const ctx = canvas.getContext('2d');

				if (!ctx) {
					reject(new Error('Could not get canvas context'));
					return;
				}

				// Set canvas size to image size (but smaller for performance)
				const scale = Math.min(1, 200 / Math.max(img.width, img.height));
				canvas.width = img.width * scale;
				canvas.height = img.height * scale;

				// Draw image to canvas
				ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

				// Get image data
				const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
				const data = imageData.data;

				// Extract colors using quantization
				const colorMap = new Map<string, number>();

				// Sample pixels (skip every few pixels for performance)
				const step = Math.max(1, Math.floor(data.length / 4 / 10000)); // Sample ~10k pixels max

				for (let i = 0; i < data.length; i += step * 4) {
					const r = data[i];
					const g = data[i + 1];
					const b = data[i + 2];
					const alpha = data[i + 3];

					// Skip transparent pixels
					if (alpha < 128) continue;

					// Quantize colors to reduce noise (group similar colors)
					const quantized = quantizeColor([r, g, b], 32);
					const colorKey = quantized.join(',');

					colorMap.set(colorKey, (colorMap.get(colorKey) || 0) + 1);
				}

				// Sort by frequency and convert to hex
				const sortedColors = Array.from(colorMap.entries())
					.sort((a, b) => b[1] - a[1])
					.slice(0, maxColors)
					.map(([colorStr]) => {
						const [r, g, b] = colorStr.split(',').map(Number);
						return rgbToHex(r, g, b);
					})
					.filter(color => color !== '#000000' && color !== '#ffffff'); // Filter out pure black/white

				resolve(sortedColors);
			} catch (error) {
				reject(error);
			}
		};

		img.onerror = () => reject(new Error('Failed to load image'));
		img.src = imageSrc;
	});
}

/**
 * Quantize a color to reduce noise
 */
function quantizeColor([r, g, b]: [number, number, number], factor: number): [number, number, number] {
	return [
		Math.round(r / factor) * factor,
		Math.round(g / factor) * factor,
		Math.round(b / factor) * factor
	];
}

/**
 * Convert RGB to hex color
 */
function rgbToHex(r: number, g: number, b: number): string {
	return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
}

/**
 * Calculate color luminance for contrast checking
 */
function getLuminance(hex: string): number {
	const rgb = hexToRgb(hex);
	const [r, g, b] = rgb.map(c => {
		c = c / 255;
		return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
	});
	return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Check if two colors have sufficient contrast
 */
function hasGoodContrast(color1: string, color2: string): boolean {
	const lum1 = getLuminance(color1);
	const lum2 = getLuminance(color2);
	const ratio = (Math.max(lum1, lum2) + 0.05) / (Math.min(lum1, lum2) + 0.05);
	return ratio >= 4.5; // WCAG AA standard
}

/**
 * Convert hex to RGB array
 */
function hexToRgb(hex: string): [number, number, number] {
	const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	if (!result) return [0, 0, 0];
	return [
		parseInt(result[1], 16),
		parseInt(result[2], 16),
		parseInt(result[3], 16)
	];
}

/**
 * Assign color roles based on extracted colors
 * Uses intelligent heuristics to assign semantic roles
 */
export function assignColorRoles(colors: string[]): ColorPalette {
	if (colors.length === 0) {
		// Fallback colors
		return {
			primary: '#27275b',
			accent: '#FB7185',
			secondary: '#10B981',
			success: '#10B981',
			tertiary: '#27275b'
		};
	}

	// Analyze colors for characteristics
	const colorData = colors.map(color => {
		const [r, g, b] = hexToRgb(color);
		const luminance = getLuminance(color);
		const isBright = luminance > 0.5;
		const isVibrant = Math.max(r, g, b) - Math.min(r, g, b) > 100;
		const isWarm = r > g && g > b; // Reddish tones
		const isCool = b > g && g > r; // Bluish tones

		return {
			color,
			rgb: [r, g, b],
			luminance,
			isBright,
			isVibrant,
			isWarm,
			isCool
		};
	});

	// Sort colors by priority for role assignment
	const sortedColors = colorData.sort((a, b) => {
		// Prioritize vibrant colors
		if (a.isVibrant !== b.isVibrant) return b.isVibrant ? 1 : -1;
		// Then by contrast potential
		return b.luminance - a.luminance;
	});

	let primary = sortedColors[0]?.color || '#27275b';
	let accent = sortedColors[1]?.color || '#FB7185';
	let secondary = sortedColors[2]?.color || '#10B981';
	let tertiary = sortedColors[3]?.color || primary;

	// Ensure good contrast between primary and accent
	if (!hasGoodContrast(primary, accent)) {
		// Try to find a better accent color
		const betterAccent = colors.find(c => hasGoodContrast(primary, c) && c !== primary);
		if (betterAccent) accent = betterAccent;
	}

	// Assign secondary (should be different from primary and accent)
	if (secondary === primary || secondary === accent) {
		const remaining = colors.filter(c => c !== primary && c !== accent);
		secondary = remaining[0] || '#10B981';
	}

	// Ensure secondary is distinguishable
	if (!hasGoodContrast(primary, secondary)) {
		secondary = colors.find(c => hasGoodContrast(primary, c) && c !== primary && c !== accent) || secondary;
	}

	return {
		primary,
		accent,
		secondary,
		success: secondary, // Use secondary as success color
		tertiary: tertiary !== primary ? tertiary : primary
	};
}

/**
 * Apply color palette to CSS custom properties
 */
export function applyColorPalette(palette: ColorPalette): void {
	const root = document.documentElement.style;

	// Set color variables
	root.setProperty('--color-primary', palette.primary);
	root.setProperty('--color-accent', palette.accent);
	root.setProperty('--color-secondary', palette.secondary);
	root.setProperty('--color-success', palette.success);
	root.setProperty('--color-tertiary', palette.tertiary);

	// Set RGB values for opacity support
	root.setProperty('--color-primary-rgb', hexToRgbValues(palette.primary));
	root.setProperty('--color-accent-rgb', hexToRgbValues(palette.accent));
	root.setProperty('--color-secondary-rgb', hexToRgbValues(palette.secondary));
}

/**
 * Convert hex to RGB values string for CSS
 */
function hexToRgbValues(hex: string): string {
	const [r, g, b] = hexToRgb(hex);
	return `${r}, ${g}, ${b}`;
}
