// Structured career data for the About page. Every field is drawn directly
// from real career facts; nothing here is invented for the sake of a chart.
//
// Convention: `stakeholders[0]` is treated as the primary stakeholder for a
// highlight wherever a single-stakeholder view is needed (the decision-flow
// diagram). It's a curation choice about which relationship mattered most,
// not a fabricated data point.

export interface Metric {
	value: string;
	label: string;
}

export type Outcome =
	| 'Network decisions'
	| 'Operational decisions'
	| 'Commercial value'
	| 'Product decisions'
	| 'Partner strategy'
	| 'Market strategy';

export interface Highlight {
	company: 'Bell' | 'Meta';
	/** Primary action verb. */
	verb: string;
	/** Who this work was done with or for, primary stakeholder first. */
	stakeholders: string[];
	/** What kind of decision or change the work fed into. */
	outcome: Outcome;
	/** One-line description of the work itself. */
	text: string;
	/** Optional quantified outcome. */
	metric?: Metric;
}

export const highlights: Highlight[] = [
	{
		company: 'Bell',
		verb: 'Model',
		stakeholders: ['Engineering'],
		outcome: 'Network decisions',
		text: 'Built a Monte Carlo simulation model in R to forecast network performance against competitors, informing network optimization in key markets.',
	},
	{
		company: 'Bell',
		verb: 'Automate',
		stakeholders: ['Engineering'],
		outcome: 'Operational decisions',
		text: 'Automated geolocation mapping in PyQGIS to speed up identification of underperforming network areas.',
	},
	{
		company: 'Bell',
		verb: 'Lead',
		stakeholders: ['External Partners', 'Product', 'Engineering'],
		outcome: 'Commercial value',
		text: 'Led a cross-company initiative with an external partner to build an in-house crowdsourced data solution, retiring a third-party data purchase.',
		metric: { value: '$2M', label: 'cost savings from replacing third-party crowdsourced data with an internal solution' },
	},
	{
		company: 'Bell',
		verb: 'Build',
		stakeholders: ['Analytics', 'Product', 'Marketing'],
		outcome: 'Product decisions',
		text: 'Designed a Data-as-a-Service dashboard adopted across the business.',
		metric: { value: '40+', label: "users of Bell's Data-as-a-Service dashboard" },
	},
	{
		company: 'Bell',
		verb: 'Advise',
		stakeholders: ['External Partners', 'Engineering'],
		outcome: 'Network decisions',
		text: "Worked with Apple's team to identify and mitigate iCloud congestion during high-traffic events.",
		metric: { value: '28%', label: 'reduction in congestion-related network impact' },
	},
	{
		company: 'Bell',
		verb: 'Lead',
		stakeholders: ['External Partners', 'Leadership'],
		outcome: 'Partner strategy',
		text: 'Led a strategic partnership with Meta focused on customer-experience analytics.',
	},
	{
		company: 'Bell',
		verb: 'Translate',
		stakeholders: ['Executives', 'Product', 'Engineering'],
		outcome: 'Operational decisions',
		text: 'Regularly translated analysis into recommendations for executives, product and engineering teams.',
	},
	{
		company: 'Meta',
		verb: 'Advise',
		stakeholders: ['External Partners', 'Executives'],
		outcome: 'Partner strategy',
		text: 'Advise senior B2B executives at major US and LATAM telecom carriers, translating consumer and network analytics into business recommendations.',
	},
	{
		company: 'Meta',
		verb: 'Build',
		stakeholders: ['External Partners', 'Analytics'],
		outcome: 'Partner strategy',
		text: 'Built an AI-powered partner health monitoring tool that won an internal hackathon, automating contextual follow-up recommendations.',
		metric: { value: '15+ hrs', label: 'saved monthly by the AI-powered partner-health monitoring workflow' },
	},
	{
		company: 'Meta',
		verb: 'Model',
		stakeholders: ['External Partners', 'Product'],
		outcome: 'Market strategy',
		text: "Built a language segmentation model, using internal ML systems and US Census benchmarks, to support a telecom partner's Hispanic-market expansion.",
	},
	{
		company: 'Meta',
		verb: 'Automate',
		stakeholders: ['External Partners', 'Analytics'],
		outcome: 'Operational decisions',
		text: 'Engineered a global FIFA World Cup reporting pipeline with dynamic regional hosting insights.',
		metric: { value: '100+ hrs', label: 'of manual reporting eliminated per event cycle through the FIFA World Cup reporting pipeline' },
	},
	{
		company: 'Meta',
		verb: 'Lead',
		stakeholders: ['Data / ML Teams', 'Analytics'],
		outcome: 'Operational decisions',
		text: 'Led generative-AI upskilling for analysts, including certification standards and evaluation frameworks.',
		metric: { value: '25', label: 'analysts supported through GenAI upskilling' },
	},
	{
		company: 'Meta',
		verb: 'Measure',
		stakeholders: ['Executives', 'External Partners', 'Data / ML Teams'],
		outcome: 'Commercial value',
		text: 'Developing approaches to quantify whether network interventions causally influence downstream customer and commercial outcomes.',
	},
];

export interface FlowLink {
	source: string;
	target: string;
	count: number;
}

function aggregate(pairs: [string, string][]): FlowLink[] {
	const counts = new Map<string, number>();
	for (const [source, target] of pairs) {
		const key = `${source}␟${target}`;
		counts.set(key, (counts.get(key) ?? 0) + 1);
	}
	return [...counts.entries()].map(([key, count]) => {
		const [source, target] = key.split('␟');
		return { source, target, count };
	});
}

// Who I work with -> what the work is.
export const peopleWorkLinks: FlowLink[] = aggregate(
	highlights.map((h) => [h.stakeholders[0], h.verb]),
);

// What the work is -> what it changed.
export const workOutcomeLinks: FlowLink[] = aggregate(highlights.map((h) => [h.verb, h.outcome]));

export const verbCounts = Object.entries(
	highlights.reduce<Record<string, number>>((counts, h) => {
		counts[h.verb] = (counts[h.verb] ?? 0) + 1;
		return counts;
	}, {}),
).sort((a, b) => b[1] - a[1]);

// Role history, oldest first. Reversed at render time for the
// current-first, reverse-chronological "How I got here" section.
export interface Role {
	stage: string;
	org: string;
	title: string;
	period: string;
	weight: 'strong' | 'medium' | 'compact';
	bullets: string[];
	tags?: string[];
	closingNote?: string;
}

export const roles: Role[] = [
	{
		stage: 'Statistics',
		org: 'Foundation',
		title: 'Undergraduate degree in Statistics',
		period: 'Completed 2023',
		weight: 'compact',
		bullets: [],
		tags: [
			'Statistical modelling',
			'Supervised learning',
			'Unsupervised learning',
			'Predictive modelling',
			'Model validation',
		],
		closingNote: "Turns out the statistics degree was useful.",
	},
	{
		stage: 'Predict',
		org: 'Bell',
		title: 'Data Science Intern',
		period: 'During undergraduate studies',
		weight: 'compact',
		bullets: [
			'Built a Monte Carlo simulation model in R to forecast network performance against competitors.',
			'Automated geolocation mapping in PyQGIS to speed up identification of underperforming network areas.',
		],
	},
	{
		stage: 'Build',
		org: 'Bell',
		title: 'Data Scientist',
		period: '2023 – 2025',
		weight: 'medium',
		bullets: [
			'Led a cross-company initiative with an external partner to build an in-house crowdsourced data solution, saving $2M by retiring a third-party data purchase.',
			'Designed a Data-as-a-Service dashboard adopted by 40+ users, and led the data-integrity work behind it.',
			"Worked with Apple's team to mitigate iCloud congestion during high-traffic events, cutting the impact by 28%.",
			'Led a strategic partnership with Meta, and regularly translated analysis into recommendations for executives, product and engineering.',
		],
	},
	{
		stage: 'Influence',
		org: 'Meta',
		title: 'Partner Data Scientist',
		period: '2025 – Present',
		weight: 'strong',
		bullets: [
			'Advise senior B2B executives at major US and LATAM telecom carriers, translating consumer and network analytics into recommendations they act on.',
			'Built an AI-powered partner-health monitoring tool that won an internal hackathon and now saves 15+ hours a month.',
			"Built a language segmentation model to support a telecom partner's Hispanic-market expansion.",
			'Engineered a global FIFA World Cup reporting pipeline, eliminating 100+ hours of manual reporting per event cycle.',
			'Led GenAI upskilling and evaluation frameworks for 25 analysts.',
		],
	},
];

// Capabilities accumulated by each stage, cumulative. Evidence-based: each
// entry traces to a specific highlight or academic bullet above.
export const capabilityColumns = [
	'Statistical modelling',
	'ML',
	'Geospatial analytics',
	'Automation',
	'Data products',
	'External partners',
	'Executive advisory',
	'AI systems',
	'Causal inference',
] as const;

export interface CapabilityRow {
	label: string;
	period: string;
	newCapabilities: string[];
}

export const capabilityRows: CapabilityRow[] = [
	{
		label: 'Bell Intern',
		period: 'during undergrad',
		newCapabilities: ['Statistical modelling', 'ML', 'Geospatial analytics', 'Automation'],
	},
	{
		label: 'Bell Data Scientist',
		period: '2023 – 2025',
		newCapabilities: ['Data products', 'External partners'],
	},
	{
		label: 'Meta Partner Data Scientist',
		period: '2025 – Present',
		newCapabilities: ['Executive advisory', 'AI systems'],
	},
	{
		label: 'Current focus',
		period: 'ongoing',
		newCapabilities: ['Causal inference'],
	},
];

// Qualitative career scatterplot. Coordinates are an editorial judgment
// call about where each project sits, not a measured or validated scale.
export interface ScatterProject {
	label: string;
	/** 0 = technical implementation, 100 = decision proximity. */
	x: number;
	/** 0 = individual analytical task, 100 = cross-functional ownership. */
	y: number;
}

export const scatterProjects: ScatterProject[] = [
	{ label: 'Monte Carlo forecasting', x: 14, y: 12 },
	{ label: 'DaaS dashboard', x: 38, y: 42 },
	{ label: 'Crowdsourced-data solution', x: 46, y: 78 },
	{ label: 'iCloud congestion mitigation', x: 60, y: 62 },
	{ label: 'Hispanic-market segmentation', x: 52, y: 54 },
	{ label: 'World Cup reporting pipeline', x: 44, y: 48 },
	{ label: 'B2B executive advisory', x: 82, y: 72 },
	{ label: 'GenAI enablement', x: 62, y: 84 },
	{ label: 'Value measurement', x: 94, y: 94 },
];
