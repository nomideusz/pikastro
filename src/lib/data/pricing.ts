/**
 * Pricing Tiers Data
 * CMS-ready structure for design journey pricing
 */

export interface PricingTier {
	id: string;
	titleKey: string;
	subtitleKey: string;
	descriptionKey: string;
	processKeys: string[]; // Array of translation keys
	durationKey: string;
	investmentKey: string;
	image: string;
	highlight: boolean;
}

export const pricingTiers: PricingTier[] = [
	{
		id: 'single-room',
		titleKey: 'pricing.singleRoom.title',
		subtitleKey: 'pricing.singleRoom.subtitle',
		descriptionKey: 'pricing.singleRoom.description',
		processKeys: [
			'pricing.singleRoom.process1',
			'pricing.singleRoom.process2',
			'pricing.singleRoom.process3',
			'pricing.singleRoom.process4',
			'pricing.singleRoom.process5',
			'pricing.singleRoom.process6'
		],
		durationKey: 'pricing.singleRoom.duration',
		investmentKey: 'pricing.singleRoom.investment',
		image: '',
		highlight: false
	},
	{
		id: 'full-apartment',
		titleKey: 'pricing.fullApartment.title',
		subtitleKey: 'pricing.fullApartment.subtitle',
		descriptionKey: 'pricing.fullApartment.description',
		processKeys: [
			'pricing.fullApartment.process1',
			'pricing.fullApartment.process2',
			'pricing.fullApartment.process3',
			'pricing.fullApartment.process4',
			'pricing.fullApartment.process5',
			'pricing.fullApartment.process6'
		],
		durationKey: 'pricing.fullApartment.duration',
		investmentKey: 'pricing.fullApartment.investment',
		image: '🏡',
		highlight: true
	},
	{
		id: 'business-spaces',
		titleKey: 'pricing.businessSpaces.title',
		subtitleKey: 'pricing.businessSpaces.subtitle',
		descriptionKey: 'pricing.businessSpaces.description',
		processKeys: [
			'pricing.businessSpaces.process1',
			'pricing.businessSpaces.process2',
			'pricing.businessSpaces.process3',
			'pricing.businessSpaces.process4',
			'pricing.businessSpaces.process5',
			'pricing.businessSpaces.process6'
		],
		durationKey: 'pricing.businessSpaces.duration',
		investmentKey: 'pricing.businessSpaces.investment',
		image: '🏢',
		highlight: false
	}
];
