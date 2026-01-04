/**
 * Design Process Steps Data
 * CMS-ready structure for the design process
 */

export interface ProcessStep {
	id: string;
	number: string;
	titleKey: string;
	descriptionKey: string;
	durationKey: string;
	icon: string;
}

export const processSteps: ProcessStep[] = [
	{
		id: 'consultation',
		number: '01',
		titleKey: 'process.consultation.title',
		descriptionKey: 'process.consultation.description',
		durationKey: 'process.consultation.duration',
		icon: '01'
	},
	{
		id: 'prototyping',
		number: '02',
		titleKey: 'process.prototyping.title',
		descriptionKey: 'process.prototyping.description',
		durationKey: 'process.prototyping.duration',
		icon: '02'
	},
	{
		id: 'refinement',
		number: '03',
		titleKey: 'process.refinement.title',
		descriptionKey: 'process.refinement.description',
		durationKey: 'process.refinement.duration',
		icon: '03'
	},
	{
		id: 'documentation',
		number: '04',
		titleKey: 'process.documentation.title',
		descriptionKey: 'process.documentation.description',
		durationKey: 'process.documentation.duration',
		icon: '📐'
	}
];
