export interface Milestone {
    id: string;
    title: string;
    description: string;
    hours: number;
    icon: string;
    benefit: string;
}

export const MILESTONES: Milestone[] = [
    {
        id: '20min',
        title: 'Pulse Normalizes',
        description: 'Your blood pressure and pulse rate return to normal.',
        hours: 0.33,
        icon: 'heartbeat',
        benefit: 'Heart is already thanking you!',
    },
    {
        id: '8hours',
        title: 'Oxygen Restored',
        description: 'Carbon monoxide levels in your blood drop to normal. Oxygen levels increase.',
        hours: 8,
        icon: 'cloud',
        benefit: 'Cells getting the oxygen they need.',
    },
    {
        id: '24hours',
        title: 'Heart Risk Drops',
        description: 'Your risk of heart attack begins to decrease significantly.',
        hours: 24,
        icon: 'heart',
        benefit: 'Major milestone! 24 hours clean!',
    },
    {
        id: '48hours',
        title: 'Senses Awaken',
        description: 'Nerve endings start regrowing. Smell and taste noticeably improve.',
        hours: 48,
        icon: 'smile-o',
        benefit: 'Food tastes better already!',
    },
    {
        id: '72hours',
        title: 'Breathing Easy',
        description: 'Bronchial tubes relax, making breathing easier. Energy levels increase.',
        hours: 72,
        icon: 'leaf',
        benefit: '3 days strong! Nicotine is leaving.',
    },
    {
        id: '1week',
        title: 'One Week Free',
        description: 'Your lungs start to clear. Cilia regain function.',
        hours: 168,
        icon: 'star',
        benefit: 'You made it a whole week!',
    },
    {
        id: '2weeks',
        title: 'Circulation Improves',
        description: 'Blood circulation significantly improves. Walking and exercise become easier.',
        hours: 336,
        icon: 'bolt',
        benefit: 'Physical activity feels better.',
    },
    {
        id: '1month',
        title: 'Lung Recovery',
        description: 'Coughing and shortness of breath decrease. Lung function begins to improve.',
        hours: 720,
        icon: 'trophy',
        benefit: 'One month! Incredible achievement!',
    },
    {
        id: '3months',
        title: 'Circulation Restored',
        description: 'Circulation continues to improve. Lung function increases up to 30%.',
        hours: 2160,
        icon: 'rocket',
        benefit: '3 months! You are a champion!',
    },
    {
        id: '6months',
        title: 'Airways Clear',
        description: 'Cilia fully regrown. Airways clear mucus more efficiently.',
        hours: 4320,
        icon: 'sun-o',
        benefit: 'Half a year smoke-free!',
    },
    {
        id: '1year',
        title: 'Heart Risk Halved',
        description: 'Your risk of coronary heart disease is now half that of a smoker.',
        hours: 8760,
        icon: 'diamond',
        benefit: 'One year! You did it!',
    },
];
