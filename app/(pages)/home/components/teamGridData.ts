export interface ProfileCardData {
  name: string;
  role: string;
  image: string;
  description: string;
}

export interface QuoteCardData {
  quote: string;
}

export type CardData = 
  | { type: "profile"; data: ProfileCardData }
  | { type: "quote"; data: QuoteCardData };

export interface ProfileRowData {
  cards: CardData[];
}

export const teamGridData: ProfileRowData[] = [
  {
    // First row: 1 profile card + 1 quote card
    cards: [
      {
        type: "profile",
        data: {
          name: "Juan Carlos Calvo Fresno",
          role: "Founder & CEO",
          image: "/images/juan.png",
          description: "Vision, execution, fundraising, partnerships, and company direction. Temporarily leading marketing and growth.",
        },
      },
      {
        type: "quote",
        data: {
          quote: "\"Beelia was built from the belief that AI should be easy to use, easy to trust, and viable to monetize. We're creating the missing layer that connects powerful AI tools with real users, giving creators a clear path to distribution and revenue, and giving users access to intelligence that actually works in the real world.\"",
        },
      },
    ],
  },
  {
    // Second row: 2 profile cards
    cards: [
      {
        type: "profile",
        data: {
          name: "Arshdeep Singh",
          role: "CTO",
          image: "/images/arsh.png",
          description: "Design, Development, AI Solutions, Tools integration, Tech leadership, and UX Solutions.",
        },
      },
      {
        type: "profile",
        data: {
          name: "Juan Carlos Calvo Rivera",
          role: "Head of Finance & Strategy",
          image: "/images/rivera.png",
          description: "Financial oversight, capital discipline, and strategic guidance.",
        },
      },
    ],
  },
  {
    // Third row: 2 profile cards
    cards: [
      {
        type: "profile",
        data: {
          name: "Sanzhar",
          role: "Founding Engineer",
          image: "/images/sanzhar.png",
          description: "Platform integrity and post-launch verification processes.",
        },
      },
      {
        type: "profile",
        data: {
          name: "Naman Bhatt",
          role: "Lead Developer",
          image: "/images/naman.png",
          description: "Tech innovation, Development, Tools Integration, Design implementation, App Performance, and App Analytics.",
        },
      },
    ],
  },
];

