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
            linkedin: "https://www.linkedin.com/in/juan-carlos-calvo-fresno-a62414331?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app",
            instagram: "https://www.instagram.com/jccalvof?igsh=MWFpdHJieWkxc2Y4bg%3D%3D&utm_source=qr"
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
          background: "Forward-thinking entrepreneur and product innovator with a proven track record of building successful ventures. Bringing over 5 years of experience in building products and leading teams.",
          responsibilities: [
            "Leads technical architecture decisions and establishes development standards",
            "Manages engineering team workflows and planning for product delivery",
            "Evaluates and integrates AI tools and third-party services into the platform",
            "Builds strategic technical partnerships and manages vendor relationships",
            "Oversees platform development and ensures design implementation quality"
          ],
          coreStrengths: [
            "Product Design & UI/UX Expertise",
            "High-Agency Leadership & Execution",
            "Project & Product Management",
            "Networking & Resource Orchestration",
            "Software Development & Technical Foundation"
          ],
          socials: {
            linkedin: "https://www.linkedin.com/in/065rsh?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app"
          }
        },
      },
      {
        type: "profile",
        data: {
          name: "Juan Carlos Calvo Rivera",
          role: "Head of Finance & Strategy",
          image: "/images/team/rivera.png",
          description: "Financial oversight, capital discipline, and strategic guidance.",
          background: "Founder and CEO of Certia Group, an international infrastructure consulting firm, with over two decades of experience leading large-scale civil engineering and public–private partnership (PPP) projects across Europe, the Middle East, and North America. Brings senior-level operational, financial, and governance experience from managing complex, capital-intensive ventures.",
          responsibilities: [
            "Oversees financial planning and budgeting",
            "Manages runway, burn rate, and capital discipline",
            "Supports strategic decision-making with financial insight",
            "Advises on fundraising structure and governance",
            "Acts as a strategic advisor to the CEO"
          ],
          coreStrengths: [
            "Financial planning & capital discipline",
            "Strategic oversight of large-scale projects",
            "Risk management and governance",
            "Public–private partnership (PPP) structuring",
            "Leadership of large, multidisciplinary teams"
          ],
          socials: {
            linkedin: "https://www.linkedin.com/in/juan-carlos-c-36212422?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app"
          }
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
          name: "Sanzhar Tashbenbetov",
          role: "Founding Engineer",
          image: "/images/team/sanzhar.png",
          description: "Platform integrity and post-launch verification processes.",
          background: "Early technical contributor to Beelia involved during the foundational stages of the platform. Brings continuity and deep system familiarity that supports long-term platform reliability as Beelia transitions from MVP to public launch.",
          responsibilities: [
            "Acts as a foundational technical reference for the platform",
            "Supports engineering efforts as needed during the pre-launch phase",
            "Takes responsibility for AI tool verification and platform trust processes post-launch",
            "Helps ensure quality, reliability, and integrity of listed tools after launch"
          ],
          coreStrengths: [
            "System understanding and continuity",
            "Technical analysis and validation",
            "Platform reliability mindset",
            "Detail-oriented problem assessment",
            "Support in early-stage technical environments"
          ],
          socials: {
            linkedin: "https://www.linkedin.com/in/sanzhar-tashbenbetov-04a17737a?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app",
            instagram: "https://www.instagram.com/sanzhar.beelia?igsh=MXFqbWJlYWxpN2Qydw=="
          }
        },
      },
      {
        type: "profile",
        data: {
          name: "Naman Bhatt",
          role: "Lead Developer",
          image: "/images/team/naman.png",
          description: "Tech innovation, Development, Tools Integration, Design implementation, App Performance, and App Analytics.",
          background: "Full-stack software engineer with a strong foundation in frontend technologies and modern web development. Brings expertise in building scalable, performant applications and implementing cutting-edge design solutions.",
          responsibilities: [
            "Leads development of core platform features and technical integrations",
            "Conducts code reviews and establishes technical standards for the engineering team",
            "Implements performance monitoring and optimization strategies across the application",
            "Collaborates with product and design teams to translate requirements into technical solutions",
            "Troubleshoots and resolves critical production issues to ensure platform stability"
          ],
          coreStrengths: [
            "Fast-Paced Problem Solving & Execution",
            "Scalable Architecture & Infrastructure Design",
            "Performance Optimization & User Experience",
            "Cross-Functional Collaboration & Technical Communication",
            "Software Development Excellence"
          ],
          socials: {
            linkedin: "https://www.linkedin.com/in/naman-bhatt-7881581b1?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app"
          }
        },
      },
    ],
  },
];

