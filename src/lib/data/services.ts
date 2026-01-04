/**
 * Services Data
 * CMS-ready structure for services offered
 * Can be easily migrated to a headless CMS like Contentful, Strapi, or Netlify CMS
 */

export interface Service {
	id: string;
	titleKey: string; // Translation key
	descriptionKey: string; // Translation key
	icon: string;
	featuresKeys: string[]; // Array of translation keys
}

export const services: Service[] = [
	{
		id: 'interior-design',
		titleKey: 'services.interiorDesign.title',
		descriptionKey: 'services.interiorDesign.description',
		icon: '◻',
		featuresKeys: [
			'services.interiorDesign.feature1',
			'services.interiorDesign.feature2',
			'services.interiorDesign.feature3',
			'services.interiorDesign.feature4',
			'services.interiorDesign.feature5'
		]
	},
	{
		id: 'graphic-design',
		titleKey: 'services.graphicDesign.title',
		descriptionKey: 'services.graphicDesign.description',
		icon: '○',
		featuresKeys: [
			'services.graphicDesign.feature1',
			'services.graphicDesign.feature2',
			'services.graphicDesign.feature3',
			'services.graphicDesign.feature4'
		]
	},
	{
		id: 'ai-technology',
		titleKey: 'services.aiTechnology.title',
		descriptionKey: 'services.aiTechnology.description',
		icon: '△',
		featuresKeys: [
			'services.aiTechnology.feature1',
			'services.aiTechnology.feature2',
			'services.aiTechnology.feature3',
			'services.aiTechnology.feature4'
		]
	}
];
