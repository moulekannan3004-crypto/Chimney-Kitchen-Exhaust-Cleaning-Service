export const pricingPlans = {
  residential: [
    {
      id: 'res-basic',
      name: 'Essential Sweep',
      price: '$99',
      billing: 'per session',
      popular: false,
      desc: 'Ideal for standard residential kitchen chimneys needing regular maintenance.',
      features: [
        'Single Hood Surface Cleaning',
        'Baffle / Mesh Filter Soak & Clean',
        'Soot & Light Creosote Removal',
        'Air Suction Efficiency Test',
        '30-Day Service Guarantee'
      ],
      ctaText: 'Book Essential Sweep'
    },
    {
      id: 'res-deep',
      name: 'Deep Sanitization',
      price: '$149',
      billing: 'per session',
      popular: true,
      desc: 'Our most comprehensive home service for heavily used home kitchens.',
      features: [
        'Everything in Essential Sweep',
        'Rotary Motorized Flue Pipe Scrubbing',
        'HEPA Containment Vacuuming',
        'Motor Turbine & Impeller Degreasing',
        'External Stainless Steel Polish',
        'Dual-Camera Inspection Video'
      ],
      ctaText: 'Book Deep Cleaning'
    },
    {
      id: 'res-annual',
      name: 'Annual Care Plan',
      price: '$249',
      billing: 'per year (2 sessions)',
      popular: false,
      desc: 'Bi-annual automated visits with complimentary filter replacements.',
      features: [
        '2 Full Deep Sanitization Visits',
        'Free Mesh/Baffle Filter Swap',
        'Priority Emergency Dispatch',
        '15% Off Any Spare Parts',
        '1-Year Smoke-Free Guarantee'
      ],
      ctaText: 'Subscribe Annual Care'
    }
  ],
  commercial: [
    {
      id: 'com-standard',
      name: 'Standard Hood & Duct',
      price: '$299',
      billing: 'up to 10 ft canopy',
      popular: false,
      desc: 'Perfect for small cafes, bakeries, and bistro kitchens.',
      features: [
        'Canopy Hood Bare-Metal Scraping',
        'Hot Water Pressure Jet Washing',
        'Riser Duct Chemical Foam Degreasing',
        'Fan Blade & Housing Overhaul',
        'NFPA 96 Compliance Certificate'
      ],
      ctaText: 'Book Commercial Hood'
    },
    {
      id: 'com-pro',
      name: 'Heavy Commercial Overhaul',
      price: '$549',
      billing: 'up to 25 ft duct run',
      popular: true,
      desc: 'Designed for high-volume restaurants, hotel kitchens, and fast food joints.',
      features: [
        'Everything in Standard Commercial',
        'Overnight / Off-Hours Service',
        'Access Door Installation included',
        'ESP Ionizer Cell Deep Wash',
        'Grease Trap & Discharger Drain Clean',
        'Before & After Digital Audit Report'
      ],
      ctaText: 'Request Restaurant Quote'
    },
    {
      id: 'com-enterprise',
      name: 'Resort & Hotel Enterprise',
      price: 'Custom',
      billing: 'multi-station contract',
      popular: false,
      desc: 'Custom maintenance contracts for casino complexes, food courts, and resort chains.',
      features: [
        'Dedicated Senior Lead Technician',
        'Quarterly Scheduled Audits',
        '24/7 Priority Emergency Rapid Response',
        'Full Insurance & City Compliance Liaison',
        'Custom Access Door Engineering'
      ],
      ctaText: 'Contact Enterprise Team'
    }
  ]
};
