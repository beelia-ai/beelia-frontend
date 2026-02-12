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
            linkedin: "https://www.linkedin.com/in/juan-carlos-calvo-fresno-a62414331?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app"
          }
        },
      },
      {
        type: "quote",
        data: {
          quote: "\"Beelia was built from the belief that AI should be easy to use, easy to trust, and viable to monetize.\"",
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
          name: "Jinesh Varma",
          role: "Head of Product Engineering",
          image: "/images/jinesh.png",
          description: "Software product engineering, MVP execution, and user-centred implementation.",
          background: "Product-oriented Software Engineer with a foundation in embedded systems and experience building and executing real-world software products. Currently pursuing a Master’s in High-Tech Entrepreneurship at Harbour.Space, Barcelona. Focused on helping early-stage teams transform ideas into working software MVPs, emphasizing clarity, usability, and fast iteration.",
          responsibilities: [
            "Leads software product engineering for early-stage MVP",
            "Translates product ideas and user needs into clear software requirements",
            "Works closely with founders and technical teams to implement and iterate software features",
            "Ensures MVP is scalable, understandable, and easy for users to adopt",
            "Supports rapid experimentation, validation, and feedback-driven product improvement"
          ],
          coreStrengths: [
            "Software-first product thinking",
            "Translating complex logic into simple user-facing features",
            "Clear communication across technical and non-technical teams",
            "Calm execution in fast-moving, ambiguous environments",
            "Strong interest in AI-enabled software and everyday digital products"
          ],
          socials: {
            linkedin: "https://www.linkedin.com/in/jinesh-varma-674a63165/"
          }
        },
      },
      {
        type: "profile",
        data: {
          name: "Emmanuel Ngwoke",
          role: "Founding Designer",
          image: "/images/Emmanuel.png",
          description: "Product vision, user experience, and feature prioritization.",
          background: "Product-focused designer and builder with experience designing and shipping user-centric digital products. Brings a strong understanding of usability, interface design, and translating user needs into scalable product solutions.",
          responsibilities: [
            "Owns product vision and roadmap",
            "Defines user experience across the platform",
            "Translates user needs into clear product requirements",
            "Works closely with CEO and Head of Product Engineering on feature prioritization",
            "Ensures consistency, usability, and quality across all user-facing surfaces"
          ],
          coreStrengths: [
            "Product strategy & user discovery",
            "UX/UI design systems",
            "Translating user problems into features",
            "Product prioritization and clarity",
            "Design-led product thinking"
          ],
          socials: {
            linkedin: "https://www.linkedin.com/in/emmanuel-ngwoke-92855123a/"
          }
        },
      },
    ],
  },
  {
    // Fourth row: 2 profile cards
    cards: [
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
      {
        type: "profile",
        data: {
          name: "Sanzhar Tashbenbetov",
          role: "Software Engineer",
          image: "/images/team/sanzhar.png",
          description: "Leads the development of Beelia’s core technical foundation, ensuring reliability, scalability, and long-term viability.",
          background: "Early technical contributor to Beelia, involved from the very first stages of the platform. Brings deep familiarity with the system and long-term continuity, which is critical as Beelia scales and the product matures. Focused on making sure what we build is robust, scalable, and ready for real users, with particular attention to AI features, core infrastructure, and data reliability.",
          responsibilities: [
            "Ensures the platform is built on a strong, reliable, and scalable technical foundation",
            "Owns core system architecture, database stability, and long-term technical decisions",
            "Oversees the quality and correctness of AI features across the product",
            "Leads post-launch verification and trust processes for AI tools on the platform",
            "Acts as a long-term technical anchor as the product and team grow",
            "Takes on additional technical responsibilities as product needs evolve"
          ],
          coreStrengths: [
            "Deep understanding of the platform and its evolution",
            "Strong focus on reliability, stability, and long-term quality",
            "Clear thinking around AI features and system behavior",
            "Detail-oriented approach to risk and edge cases"
          ],
          socials: {
            linkedin: "https://www.linkedin.com/in/sanzhar-tashbenbetov-04a17737a?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app"
          }
        },
      },
    ],
  },
];

