/**
 * Design Process Steps Data
 * CMS-ready structure for the design process
 */

export interface ProcessStep {
	id: string;
	number: string;
	titleKey: string;
	descriptionKey: string;
	duration: string;
	icon: string;
}

export const processSteps: ProcessStep[] = [
	{
		id: 'consultation',
		number: '01',
		titleKey: 'process.consultation.title',
		descriptionKey: 'process.consultation.description',
		duration: '1-2 dni',
		icon: '01'
	},
	{
		id: 'prototyping',
		number: '02',
		titleKey: 'process.prototyping.title',
		descriptionKey: 'process.prototyping.description',
		duration: '2-3 dni',
		icon: '02'
	},
	{
		id: 'refinement',
		number: '03',
		titleKey: 'process.refinement.title',
		descriptionKey: 'process.refinement.description',
		duration: '3-5 dni',
		icon: '03'
	},
	{
		id: 'documentation',
		number: '04',
		titleKey: 'process.documentation.title',
		descriptionKey: 'process.documentation.description',
		duration: '2-3 dni',
		icon: '📐'
	}
];
