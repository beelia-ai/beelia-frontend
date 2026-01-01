export interface ProfileCardData {
  name: string;
  role: string;
  image: string;
  description: string;
  background?: string;
  responsibilities?: string[];
  coreStrengths?: string[];
  socials?: {
    linkedin?: string;
    instagram?: string;
  };
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
          image: "/images/team/juan.png",
          description: "Vision, execution, fundraising, partnerships, and company direction. Temporarily leading marketing and growth.",
          background: "Founder with a strong entrepreneurial track record from an early age, building digital businesses, testing markets, and creating online traction across multiple projects. Focused on creating scalable, global platforms with strong narrative and execution discipline.",
          responsibilities: [
            "Defines company vision, mission, and long-term direction",
            "Leads fundraising, investor relations, and strategic partnerships",
            "Sets priorities across product, tech, and growth",
            "Oversees go-to-market strategy and positioning",
            "Temporarily leads marketing, distribution, and growth execution"
          ],
          coreStrengths: [
            "Vision & long-term strategy",
            "Fundraising & investor storytelling",
            "Marketplace and platform thinking",
            "Growth experimentation & marketing strategy",
            "Decision-making under uncertainty"
          ],
          socials: {
            linkedin: "https://linkedin.com",
            instagram: "https://instagram.com"
          }
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
          image: "/images/team/arsh.png",
          description: "Design, Development, AI Solutions, Tools integration, Tech leadership, and UX Solutions.",
        },
      },
      {
        type: "profile",
        data: {
          name: "Juan Carlos Calvo Rivera",
          role: "Head of Finance & Strategy",
          image: "/images/team/rivera.png",
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
          image: "/images/team/sanzhar.png",
          description: "Platform integrity and post-launch verification processes.",
        },
      },
      {
        type: "profile",
        data: {
          name: "Naman Bhatt",
          role: "Lead Developer",
          image: "/images/team/naman.png",
          description: "Tech innovation, Development, Tools Integration, Design implementation, App Performance, and App Analytics.",
        },
      },
    ],
  },
];

