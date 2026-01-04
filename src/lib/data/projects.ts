/**
 * Portfolio Projects Data
 * CMS-ready structure for portfolio projects
 * Can be easily migrated to a headless CMS
 */

export interface Project {
	id: string;
	titleKey: string; // Translation key
	descriptionKey: string; // Translation key
	technologies: string[];
	image: string;
	category: 'interiors' | 'graphics' | 'all';
	year: string;
}

// Note: Images will need to be imported in the component that uses this data
export const projectsData = [
	{
		id: 'scandinavian-apartment',
		titleKey: 'portfolio.scandinavianApartment.title',
		descriptionKey: 'portfolio.scandinavianApartment.description',
		technologies: ['AutoCAD', 'SketchUp', 'V-Ray', '3ds Max'],
		imageId: 'img07',
		category: 'interiors' as const,
		year: '2024'
	},
	{
		id: 'studio-visual-identity',
		titleKey: 'portfolio.studioIdentity.title',
		descriptionKey: 'portfolio.studioIdentity.description',
		technologies: ['Adobe Creative Suite', 'Brand Strategy', 'Print Design'],
		imageId: 'colorsImg',
		category: 'graphics' as const,
		year: '2024'
	},
	{
		id: 'coworking-space',
		titleKey: 'portfolio.coworkingSpace.title',
		descriptionKey: 'portfolio.coworkingSpace.description',
		technologies: ['3D Modeling', 'Space Planning', 'Smart Solutions'],
		imageId: 'img08',
		category: 'interiors' as const,
		year: '2023'
	},
	{
		id: 'modern-house',
		titleKey: 'portfolio.modernHouse.title',
		descriptionKey: 'portfolio.modernHouse.description',
		technologies: ['ArchiCAD', 'Lumion', 'Sustainable Design'],
		imageId: 'img09',
		category: 'interiors' as const,
		year: '2023'
	},
	{
		id: 'cafe-concept',
		titleKey: 'portfolio.cafeConcept.title',
		descriptionKey: 'portfolio.cafeConcept.description',
		technologies: ['Interior Design', 'Branding', 'Visual Identity'],
		imageId: 'img10',
		category: 'graphics' as const,
		year: '2024'
	},
	{
		id: 'industrial-loft',
		titleKey: 'portfolio.industrialLoft.title',
		descriptionKey: 'portfolio.industrialLoft.description',
		technologies: ['Adaptive Reuse', 'Industrial Design', 'BIM'],
		imageId: 'img11',
		category: 'interiors' as const,
		year: '2023'
	}
];
