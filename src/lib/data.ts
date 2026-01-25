export const MENU_CATEGORIES = [
    'ALL EXTRACTS',
    'COSMETICS',
    'PHARMA',
    'AGRICULTURE',
];

export const MENU_ITEMS = [
    {
        id: 1,
        name: 'COFFEE OIL',
        description: 'Cosmetic-grade natural oil rich in lipids, essential fatty acids, and antioxidants. Ideal for serums, creams, and anti-aging formulations.',
        category: 'COSMETICS',
        image: '/images/product-oil.png',
        applications: ['Skin creams', 'Serums', 'Haircare', 'Anti-aging'],
    },
    {
        id: 2,
        name: 'CAFFEINE ANHYDROUS',
        description: 'Naturally derived, pharmaceutical-grade caffeine refined to meet stringent purity standards for medicines and supplements.',
        category: 'PHARMA',
        image: '/images/product-caffeine.png',
        applications: ['Medicines', 'Energy drinks', 'Supplements', 'Sports nutrition'],
    },
    {
        id: 3,
        name: 'ANTIOXIDANTS',
        description: 'Rich in polyphenols and chlorogenic acids. Used in beverages, functional foods, and premium skincare formulations.',
        category: 'COSMETICS',
        image: '/images/product-antioxidants.png',
        applications: ['Beverages', 'Baked goods', 'Skincare', 'Fermented extracts'],
    },
    {
        id: 4,
        name: 'ORGANIC FERTILIZER',
        description: 'Nutrient-rich organic fertilizer that enhances soil water retention, aeration, and microbial activity for better yields.',
        category: 'AGRICULTURE',
        image: '/images/product-fertilizer.png',
        applications: ['Organic farms', 'Nurseries', 'Home Gardening', 'Soil revitalization'],
    },
];

export const SHOPS = [
    {
        id: 1,
        name: 'COSMETICS & SKINCARE',
        description: 'Natural ingredients for beauty brands',
        image: '/images/market-cosmetics.png',
        longDescription: 'Our premium coffee-derived ingredients are transforming the beauty industry. Rich in natural antioxidants and essential fatty acids, our extracts provide a sustainable alternative to synthetic chemicals.',
        marketFocus: 'NATURAL BEAUTY REVOLUTION',
        keyBenefits: [
            'Rich in chlorogenic acid for anti-aging',
            'Natural UV protection properties',
            'Deep skin penetration and hydration',
            'Sustainably sourced and cruelty-free'
        ],
        applications: [
            'Anti-aging serums',
            'Exfoliating body scrubs',
            'Hydrating facial creams',
            'Scalp health treatments'
        ]
    },
    {
        id: 2,
        name: 'PHARMACEUTICALS',
        description: 'Pharma-grade compounds for medicines',
        image: '/images/market-pharma.png',
        longDescription: 'We extract high-purity, pharmaceutical-grade caffeine and compounds that meet stringent medical standards. Our circular model ensures consistent quality and supply for global healthcare providers.',
        marketFocus: 'BIOTECH PURITY & PRECISION',
        keyBenefits: [
            '99%+ purity pharmaceutical caffeine',
            'Strict adherence to GMP standards',
            'Consistent batch-to-batch quality',
            'Fully traceable supply chain'
        ],
        applications: [
            'OTC pain medications',
            'Respiratory stimulants',
            'Herbal supplement formulations',
            'Topical medicinal patches'
        ]
    },
    {
        id: 3,
        name: 'FOOD & BEVERAGES',
        description: 'Antioxidants for functional foods',
        image: '/images/market-food.png',
        longDescription: 'Unlock the power of coffee antioxidants in the food industry. Our natural extracts enhance nutritional value and provide functional benefits to a wide range of food and beverage offerings.',
        marketFocus: 'FUNCTIONAL NUTRITION',
        keyBenefits: [
            'High concentration of polyphenols',
            'Natural food preservative properties',
            'Enhanced flavor profiling',
            'Clean-label ingredient certification'
        ],
        applications: [
            'Energy and performance drinks',
            'Fortified baked goods',
            'Natural food colorants',
            'Antioxidant-rich snack bars'
        ]
    },
    {
        id: 4,
        name: 'AGRICULTURE',
        description: 'Organic fertilizers for sustainable farming',
        image: '/images/market-agriculture.png',
        longDescription: 'Closing the loop in agriculture, we transform remaining biomass into nutrient-rich organic fertilizers. We help farmers improve soil health and crop yields while reducing reliance on synthetic chemicals.',
        marketFocus: 'SUSTAINABLE CROP HEALTH',
        keyBenefits: [
            'Slow-release nitrogen enrichment',
            'Improved soil water retention',
            'Enhanced microbial soil activity',
            '100% organic and carbon-neutral'
        ],
        applications: [
            'Organic vegetable farming',
            'Commercial fruit orchards',
            'Ornamental plant nurseries',
            'Soil revitalization projects'
        ]
    },
];

export const FAQS = [
    {
        id: 1,
        question: 'What makes VisionForge unique?',
        answer: 'We use a proprietary, patented extraction system tailored specifically for Indian coffee blends, achieving 100% utilization of coffee waste with zero landfill output.',
    },
    {
        id: 2,
        question: 'How do you source the coffee waste?',
        answer: 'We partner with cafés, restaurants, and coffee chains to collect spent coffee grounds at zero cost, ensuring a reliable and sustainable raw material supply.',
    },
    {
        id: 3,
        question: 'What extracts do you manufacture?',
        answer: 'We produce coffee oil for cosmetics, pharma-grade caffeine, natural antioxidants for food and skincare, and organic fertilizer for agriculture.',
    },
    {
        id: 4,
        question: 'Is your process environmentally friendly?',
        answer: 'Absolutely! Our process as well as products are environment friendly and our circular model ensures zero waste goes to landfill, reduces methane emissions, and creates sustainable alternatives to synthetic ingredients.',
    },
    {
        id: 5,
        question: 'How can businesses partner with VisionForge?',
        answer: 'Cafés can contribute waste collection, brands can source natural ingredients, and farms can purchase organic fertilizers. Contact us to explore collaboration opportunities.',
    },
];
