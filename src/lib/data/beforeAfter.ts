/**
 * Before/After Projects Data
 * CMS-ready structure for transformation showcases
 */

export interface BeforeAfterProject {
	id: string;
	titleKey: string;
	descriptionKey: string;
	beforeImageId: string;
	afterImageId: string;
	aiFeaturesKeys: string[];
}

export const beforeAfterProjects: BeforeAfterProject[] = [
	{
		id: 'living-room-kitchen',
		titleKey: 'beforeAfter.project1.title',
		descriptionKey: 'beforeAfter.project1.description',
		beforeImageId: 'img01',
		afterImageId: 'img02',
		aiFeaturesKeys: [
			'beforeAfter.project1.feature1',
			'beforeAfter.project1.feature2',
			'beforeAfter.project1.feature3'
		]
	},
	{
		id: 'bedroom',
		titleKey: 'beforeAfter.project2.title',
		descriptionKey: 'beforeAfter.project2.description',
		beforeImageId: 'img03',
		afterImageId: 'img04',
		aiFeaturesKeys: [
			'beforeAfter.project2.feature1',
			'beforeAfter.project2.feature2',
			'beforeAfter.project2.feature3'
		]
	},
	{
		id: 'home-office',
		titleKey: 'beforeAfter.project3.title',
		descriptionKey: 'beforeAfter.project3.description',
		beforeImageId: 'img05',
		afterImageId: 'img06',
		aiFeaturesKeys: [
			'beforeAfter.project3.feature1',
			'beforeAfter.project3.feature2',
			'beforeAfter.project3.feature3'
		]
	}
];
