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

// Grouped categories for the decision-flow diagram. Collapsing the raw
// stakeholder/verb/outcome values (already shown individually elsewhere on
// the page) into a handful of groups keeps the flow legible and avoids
// duplicating the verb-by-verb detail.
const peopleGroup: Record<string, string> = {
	'External Partners': 'External partners',
	Executives: 'Leadership + executives',
	Leadership: 'Leadership + executives',
	Product: 'Product + Engineering',
	Engineering: 'Product + Engineering',
	Analytics: 'Analytics + Marketing + Data/ML',
	Marketing: 'Analytics + Marketing + Data/ML',
	'Data / ML Teams': 'Analytics + Marketing + Data/ML',
};

const workGroup: Record<string, string> = {
	Model: 'Analyze + Model',
	Build: 'Build + Automate',
	Automate: 'Build + Automate',
	Lead: 'Build + Automate',
	Translate: 'Translate + Advise',
	Advise: 'Translate + Advise',
	Measure: 'Measure',
};

const outcomeGroup: Record<Outcome, string> = {
	'Network decisions': 'Network + operational decisions',
	'Operational decisions': 'Network + operational decisions',
	'Partner strategy': 'Partner + market strategy',
	'Market strategy': 'Partner + market strategy',
	'Product decisions': 'Product / customer experience',
	'Commercial value': 'Commercial value',
};

// Who I work with -> what the work is.
export const peopleWorkLinks: FlowLink[] = aggregate(
	highlights.map((h) => [peopleGroup[h.stakeholders[0]], workGroup[h.verb]]),
);

// What the work is -> what it changed.
export const workOutcomeLinks: FlowLink[] = aggregate(
	highlights.map((h) => [workGroup[h.verb], outcomeGroup[h.outcome]]),
);

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
			'Led a cross-company initiative with an external partner to build an in-house crowdsourced data solution, and owned the analytical system it became.',
			'Designed a Data-as-a-Service dashboard adopted across the business, and led the data-integrity work behind it.',
			"Partnered externally with Apple's team on network congestion mitigation and led a strategic partnership with Meta, while regularly translating analysis into recommendations for executives, product and engineering.",
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
			'Built analytical and AI systems, including partner-health monitoring, a Hispanic-market segmentation model, and a global FIFA World Cup reporting pipeline.',
			'Led GenAI upskilling and evaluation frameworks across the analyst team, working extensively across internal teams and external partners.',
		],
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

// Seven points, curated for label readability rather than completeness:
// Monte Carlo forecasting, B2B executive advisory and Value measurement
// anchor the progression and are always kept.
export const scatterProjects: ScatterProject[] = [
	{ label: 'Monte Carlo forecasting', x: 12, y: 14 },
	{ label: 'DaaS dashboard', x: 32, y: 36 },
	{ label: 'Crowdsourced-data solution', x: 44, y: 68 },
	{ label: 'iCloud congestion mitigation', x: 58, y: 50 },
	{ label: 'GenAI enablement', x: 68, y: 82 },
	{ label: 'B2B executive advisory', x: 84, y: 64 },
	{ label: 'Value measurement', x: 94, y: 96 },
];
