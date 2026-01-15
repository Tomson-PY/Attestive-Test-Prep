export interface Testimonial {
  id: string;
  name: string;
  role: string;
  industry: string;
  beforePhrase: string;
  boldedPhrase: string;
  afterPhrase: string;
  row: number;
}

export const testimonials: Testimonial[] = [
  {
    id: "maria-s",
    name: "Maria S.",
    role: "Director of Nursing",
    industry: "Hospital",
    beforePhrase: "When we rolled out critical changes, we needed more than acknowledgment.",
    boldedPhrase: "We can't prove staff understood the update.",
    afterPhrase: "That was the problem we had to solve.",
    row: 0,
  },
  {
    id: "james-r",
    name: "James R.",
    role: "Quality & Compliance Lead",
    industry: "Pharmaceutical Manufacturing",
    beforePhrase: "Audit season used to mean days of digging through folders and emails.",
    boldedPhrase: "Audits are painful because evidence is scattered.",
    afterPhrase: "We wanted everything in one place.",
    row: 1,
  },
  {
    id: "alyssa-k",
    name: "Alyssa K.",
    role: "Training Manager",
    industry: "Aviation Maintenance",
    beforePhrase: "Our LMS showed completion, but performance still varied on the floor.",
    boldedPhrase: "Training completion doesn't equal competency.",
    afterPhrase: "We needed proof of understanding.",
    row: 0,
  },
  {
    id: "priya-n",
    name: "Dr. Priya N.",
    role: "Operations & Safety Director",
    industry: "Utilities",
    beforePhrase: "We can publish updates instantly, but adoption used to lag for weeks.",
    boldedPhrase: "Policy changes don't translate into behavior fast enough.",
    afterPhrase: "That gap created avoidable risk.",
    row: 1,
  },
  {
    id: "tom-h",
    name: "Tom H.",
    role: "Plant Manager",
    industry: "Food Processing",
    beforePhrase: "We'd send an SOP update and hope it got read.",
    boldedPhrase: "Our SOP updates die in email.",
    afterPhrase: "That's exactly what we had to eliminate.",
    row: 0,
  },
  {
    id: "samantha-l",
    name: "Samantha L.",
    role: "Risk & Controls Manager",
    industry: "Fintech",
    beforePhrase: "In regulated environments, evidence has to be defensible and searchable.",
    boldedPhrase: "Regulators want a trail—screenshots don't count.",
    afterPhrase: "We needed audit-grade records.",
    row: 1,
  },
  {
    id: "renee-b",
    name: "Renee B.",
    role: "Regional Field Supervisor",
    industry: "Logistics & Warehousing",
    beforePhrase: "We were burning cycles on follow-ups instead of fixing the real issues.",
    boldedPhrase: "We spend more time chasing signatures than reducing risk.",
    afterPhrase: "That had to change.",
    row: 0,
  },
  {
    id: "omar-c",
    name: "Omar C.",
    role: "EHS Program Lead",
    industry: "Chemical Manufacturing",
    beforePhrase: "We were always reacting after something happened instead of preventing it.",
    boldedPhrase: "We can't spot competency gaps until an incident happens.",
    afterPhrase: "We needed earlier signals.",
    row: 1,
  },
];
