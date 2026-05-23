export const SITE_META = {
  name: "Rawan Emgawer Architect",
  shortName: "REA CO",
  url: "https://www.rawanemgawer.com",
  title: "Rawan Emgawer Architects: Innovative Design | REA CO",
  description:
    "Rawan Emgawer Architects is a Dubai-based design practice striving to be a global architectural name. Combining international expertise with contemporary design, we create thoughtful and impactful spaces that redefine the architectural landscape.",
  email: "rawan@rawanemgawer.com",
  phone: "+44 778 547 3840",
  location: "Dubai, United Arab Emirates",
  offices: [
    "Sheffield, UK",
    "Dubai, UAE",
    "Qingdao, China",
    "Benghazi, Libya",
    "Istanbul, Turkey",
  ],
  social: {
    facebook: "https://facebook.com/",
    instagram: "https://instagram.com/",
  },
  footerTagline:
    "Independent architect creating thoughtful spaces that connect people and place.",
  copyright: "© 2026 Rawan Emgawer. All rights reserved.",
} as const;

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about-global-expertise" },
  { label: "Portfolio", href: "/portfolio-architectural-solutions" },
  { label: "Our Team", href: "/our-team-international-experience" },
  { label: "Contact", href: "/contactus" },
] as const;

export const HOME_COPY = {
  heroHeadline: "Where Design Becomes Legacy",
  heroSubline:
    "A multidisciplinary design consultancy creating architecture, interiors, and large-scale environments with clarity, purpose, and longevity.",
  philosophyEyebrow: "Architecture as Dialogue",
  philosophyTitle:
    "Refined, meaningful, and timeless environments — shaped by context.",
  philosophyBody:
    "At Rawan Emgawer Architect, we believe architecture is a dialogue between space, context, and human experience. We design spaces that respond to their surroundings, focusing on materials, light, and proportion. Each project is an opportunity to create refined, meaningful, and timeless environments that reflect their context and serve the people who inhabit them.",
  // Compact copy for the springs-Wellness-style hero band.
  philosophyShortBody:
    "At Rawan Emgawer Architect, every project is a dialogue between space, context, and human experience — refined, meaningful, and shaped to serve the people who inhabit them.",
  philosophyWord: "Dialogue",
  philosophyTags: [
    {
      title: "Philosophy",
      body: "Blending function, emotion, and timeless aesthetics to create meaningful, enduring spaces.",
    },
    {
      title: "Approach",
      body: "Context-driven design that integrates materials and light to create balanced, responsive architecture.",
    },
  ],
  aboutBlurb:
    "Rawan Emgawer Architects is a design practice built on a strong international foundation, combining British architectural standards with valuable experience across the Gulf, Europe, and East Asia.",
  ctaHeadline: "Let's create something timeless",
  ctaSubline:
    "Whether you're at the beginning of your architectural journey or ready to start construction, we're here to listen and explore possibilities together.",
  ctaLabel: "Get in Touch",
};

export const STATS = [
  { value: 50, suffix: "+", label: "Happy clients" },
  { value: 15, suffix: "+", label: "Years of experience" },
  { value: 8, suffix: "", label: "Selected works" },
  { value: 2, suffix: "", label: "Global offices" },
];

export interface Service {
  number: string;
  title: string;
  blurb: string;
  detail: string;
  bullets: string[];
  image: string;
}

export const SERVICES: Service[] = [
  {
    number: "01",
    title: "Residential Architecture",
    blurb:
      "Custom homes designed for how you live, from concept to completion.",
    detail:
      "We specialise in creating spaces that balance aesthetic ambition with practical living — refined homes shaped around the people who inhabit them.",
    bullets: [
      "New Build Homes",
      "Coastal & Mountain Residences",
      "Urban Infill Projects",
      "Garden Studios",
    ],
    image: "/new_images/residential design.png",
  },
  {
    number: "02",
    title: "Commercial Projects",
    blurb:
      "Boutique workspaces and retail environments that reflect your brand.",
    detail:
      "Focused on small-scale projects where attention to detail makes a difference. We craft spaces that perform commercially and feel considered.",
    bullets: [
      "Creative Workspaces",
      "Retail Interiors",
      "Showrooms",
      "Hospitality Design",
    ],
    image: "/new_images/commercial design.png",
  },
  {
    number: "03",
    title: "Interior Architecture",
    blurb:
      "Thoughtful interiors that enhance function and atmosphere.",
    detail:
      "Complete interior transformations that honour the building's character while meeting contemporary needs — material, light, proportion.",
    bullets: [
      "Full Interior Design",
      "Space Planning",
      "Custom Millwork Design",
      "Material & Finish Selection",
    ],
    image: "/new_images/work place design.png",
  },
  {
    number: "04",
    title: "Renovations & Additions",
    blurb:
      "Transforming existing spaces with sensitivity to their character.",
    detail:
      "Careful interventions that respect what exists while creating something new — adaptive reuse, heritage work, and additions that read as inevitable.",
    bullets: [
      "Heritage Renovations",
      "Home Extensions",
      "Adaptive Reuse",
      "Building Upgrades",
    ],
    image: "/new_images/health care design.png",
  },
];

export interface ProcessStep {
  number: string;
  title: string;
  body: string;
}

export const PROCESS: ProcessStep[] = [
  {
    number: "01",
    title: "Discover",
    body: "We listen first. Site visits, conversations, and contextual study shape a clear brief before any line is drawn.",
  },
  {
    number: "02",
    title: "Design",
    body: "Concept design, massing, and material studies — iterated openly with the client until the idea feels inevitable.",
  },
  {
    number: "03",
    title: "Develop",
    body: "Technical drawings, consultant coordination, and authority approvals handled with British architectural standards.",
  },
  {
    number: "04",
    title: "Deliver",
    body: "On-site supervision through to handover. We protect the design intent through every detail of construction.",
  },
];

export interface Project {
  slug: string;
  title: string;
  location: string;
  year: string;
  category: string;
  blurb: string;
  image: string;
}

export const PROJECTS: Project[] = [
  {
    slug: "khalifa-airport",
    title: "Khalifa Airport",
    location: "Zwatina, Libya",
    year: "2025",
    category: "Aviation",
    blurb:
      "A large-scale interior design aviation project designed to enhance passenger experience through efficient planning, clear circulation, and modern architecture.",
    image: "/new_images/Airport_Landscape.png",
  },
  {
    slug: "isle-of-dog-tower",
    title: "Isle of Dog Tower",
    location: "London, United Kingdom",
    year: "2025",
    category: "Commercial",
    blurb:
      "A high-rise commercial development balancing a distinctive architectural identity with refined urban presence in central London.",
    image: "/new_images/isleof_portraid.png",
  },
  {
    slug: "oil-gas-headquarters",
    title: "Oil & Gas Headquarters",
    location: "Jebal Ali, UAE",
    year: "2025",
    category: "Commercial",
    blurb:
      "A corporate headquarters designed to reflect strength and innovation, combining functional workspaces with a bold, professional presence.",
    image: "/new_images/oil n gas1.png",
  },
  {
    slug: "aviva-hospital",
    title: "Aviva Hospital",
    location: "Benghazi, Libya",
    year: "2025",
    category: "Healthcare",
    blurb:
      "A contemporary maternal healthcare facility focused on patient comfort, operational efficiency, and advanced medical functionality.",
    image: "/new_images/aviva maternal hospital.png",
  },
  {
    slug: "hala-hypermarket",
    title: "Hala Hypermarket",
    location: "Jdabyah, Libya",
    year: "2024",
    category: "Commercial",
    blurb:
      "A vibrant retail environment designed to enhance customer flow, visibility, and overall shopping experience.",
    image: "/new_images/hala final.png",
  },
  {
    slug: "bng-hills-villa",
    title: "BNG Hills Luxury Villa",
    location: "Benghazi, Libya",
    year: "2024",
    category: "Residential",
    blurb:
      "A modern residential villa combining clean architectural lines with comfortable, high-end living spaces.",
    image: "/new_images/villa.png",
  },
  {
    slug: "pathos-gold-boutique",
    title: "Pathos Gold Boutique",
    location: "Benghazi, Libya",
    year: "2022",
    category: "Commercial",
    blurb:
      "A refined luxury retail space that highlights elegance and exclusivity, creating a sophisticated setting for high-end jewelry display.",
    image: "/new_images/pathos.png",
  },
];

export interface TeamMember {
  name: string;
  role: string;
  image: string;
}

export const TEAM_MEMBERS: TeamMember[] = [
  {
    name: "Rawan Emgawer",
    role: "CEO & Founder",
    image: "/images/team-rawan-emgawer.avif",
  },
  {
    name: "Vincient Bi",
    role: "Architect",
    image: "/images/team-vincient-bi.avif",
  },
  {
    name: "Song Qixia",
    role: "Interior Designer",
    image: "/images/team-song-qixia.avif",
  },
  {
    name: "Yun Li",
    role: "Structural Engineer",
    image: "/images/team-yun-li-structural.avif",
  },
  {
    name: "Zhao Yan",
    role: "Detailing Engineer",
    image: "/images/team-zhao-yan.avif",
  },
  {
    name: "Nancy Liu",
    role: "International Relations Manager",
    image: "/images/team-nancy-liu.avif",
  },
  {
    name: "Yun Li",
    role: "Senior Interior Designer",
    image: "/images/team-yun-li-interior.avif",
  },
  {
    name: "Maggie Wang",
    role: "Office Manager",
    image: "/images/team-maggie-wang.avif",
  },
];

export interface Mission {
  number: string;
  title: string;
  body: string;
}

export const MISSIONS: Mission[] = [
  {
    number: "01",
    title: "Strengthening Regional Development in Libya",
    body: "To actively contribute to the development of smaller cities across Libya by delivering meaningful architectural solutions that improve living standards.",
  },
  {
    number: "02",
    title: "Enhancing Educational Environments",
    body: "To create and refine educational facilities that inspire learning, encourage innovation, and support the development of future generations.",
  },
  {
    number: "03",
    title: "Shaping Future Cities with Purpose",
    body: "To develop masterplans for cities that are sustainable, functional, and human-centered — leaving a lasting architectural legacy.",
  },
  {
    number: "04",
    title: "Advancing Healthcare Infrastructure",
    body: "To design and help deliver modern, efficient healthcare facilities that improve accessibility, patient experience, and community well-being.",
  },
];

export const ABOUT_COPY = {
  eyebrow: "About us",
  title:
    "Bespoke architecture, interiors, and masterplanning — defined by clarity, precision, and refined design intelligence.",
  intro:
    "Rawan Emgawer delivers bespoke architecture, interiors, and masterplanning defined by clarity, precision, and refined design intelligence. Every project is shaped by a dedication to quality, proportion, and lasting architectural value.",
  missionStatement:
    "Our architectural solutions enhance community well-being in Libya's smaller cities.",
  buildingHeadline: "Building Libya's Tomorrow",
  buildingBody:
    "Committed to strengthening healthcare, education, and urban development across Libya's regions.",
};

export const PORTFOLIO_COPY = {
  eyebrow: "Selected Works",
  title: "A curated selection of projects",
  intro:
    "Exploring light, proportion, and the balance between nature and structure — across aviation, healthcare, residential, retail, and corporate environments.",
  ctaHeadline: "Let's discuss your space",
  ctaLabel: "Start a Conversation",
};

export const TEAM_COPY = {
  eyebrow: "Our team",
  title: "Global expertise. One studio.",
  intro:
    "Our team at Rawan Emgawer Architects brings extensive international expertise, delivering innovative design solutions shaped by global experience and collaborative excellence.",
};

export const CONTACT_COPY = {
  eyebrow: "Contact",
  title: "Let's create something timeless together.",
  intro:
    "Whether you're at the beginning of your architectural journey or ready to start construction, we're here to listen and explore possibilities together.",
  formLabels: {
    firstName: "Name",
    lastName: "Last name",
    email: "Email",
    message: "Message",
    submit: "Get in Touch",
  },
};

export interface Faq {
  question: string;
  answer: string;
}

export const FAQS: Faq[] = [
  {
    question: "Where do you take on projects?",
    answer:
      "From our offices in Sheffield, UK and Dubai, UAE we deliver projects across Libya, the wider Gulf region, the UK, and East Asia. Travel is part of the practice.",
  },
  {
    question: "What scale of project do you typically work on?",
    answer:
      "From private residences and boutique retail to airports, healthcare campuses, and oil & gas headquarters. The scale shifts; the standard of detail does not.",
  },
  {
    question: "How long does a typical project take?",
    answer:
      "Concept-to-handover usually runs 12 to 36 months depending on scope and approvals. We share an honest programme in the first conversation.",
  },
  {
    question: "Can you work with an existing contractor?",
    answer:
      "Yes. We collaborate with the client's preferred contractor or appoint one through a tendered process — whichever protects the design intent best.",
  },
  {
    question: "Do you handle interior design and architecture together?",
    answer:
      "Yes. Many of our projects are delivered as a single integrated commission — architecture, interiors, and FF&E — for a consistent material language end to end.",
  },
  {
    question: "How do we start?",
    answer:
      "Send a short brief or call. The first conversation is free and focused on whether we're the right fit for your project.",
  },
];

export interface Testimonial {
  quote: string;
  author: string;
  role: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Rawan and her team translated a difficult brief into a building that simply works — for staff, for patients, for the city.",
    author: "Healthcare client",
    role: "Aviva Hospital, Benghazi",
  },
  {
    quote:
      "The level of detail across drawings, materials, and on-site supervision matched anything we've seen from the larger London practices.",
    author: "Government client",
    role: "Khalifa Airport, Libya",
  },
  {
    quote:
      "What we got was not just a villa, but a way of living. Light, proportion, and quiet — exactly the values we asked for.",
    author: "Private client",
    role: "BNG Hills Villa, Benghazi",
  },
];
