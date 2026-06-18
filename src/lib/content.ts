
export const ABOUT =
  "Computer Science graduate from UW-Madison with full-stack experience across React, Python, and Java. Built technical proficiency through professional experience, coursework, and personal projects. Seeking full-time software engineering roles in full-stack or AI-adjacent environments.";

export const LOCATION = "Los Angeles, CA · Madison, WI";

export interface SkillGroup {
  category: string;
  items: string[];
}

export const SKILLS: SkillGroup[] = [
  { category: "Languages", items: ["Java", "Python", "JavaScript", "TypeScript", "C", "C++", "R", "Assembly"] },
  { category: "Frontend", items: ["React", "Next.js", "Vite", "Jest", "Tailwind CSS"] },
  { category: "Backend", items: ["Spring Boot", "FastAPI","PostgreSQL", "MySQL", "SQLite", "SQLAlchemy", "Redis"] },
  { category: "Libraries", items: ["Scikit-learn", "NumPy", "Pandas", "Matplotlib"] },
  { category: "Tools", items: ["Git", "AWS", "Docker", "Jira", "GitHub Actions", "CI/CD"] },
];

export interface Project {
  name: string;
  description: string;
  tech: string[];
  link: string;
}

export const PROJECTS: Project[] = [
  {
    name: "Pokemon Battler",
    description:
      "Pokemon Showdown-esque real-time multiplayer battle simulator. Players sign in via Google, create or join 6v6 turn-based battles using a private 6-character code, with WebSocket communication for live updates.",
    tech: ["Next.js", "FastAPI", "WebSockets", "Redis", "PostgreSQL", "Docker", "NextAuth.js", "Jest", "pytest"],
    link: "https://github.com/colinshaw7/pokemon-battler",
  },
  {
    name: "Uncluttrd",
    description:
      "Capsule Wardrobe creator and explorer app. Built with a 6-person team for CS620 (Computer Science Capstone/Senior Design Project) in collaboration with Amazon/Shopbop.",
    tech: ["React", "Vite", "FastAPI", "AWS Cloudfront", "AWS S3", "AWS EC2", "AWS RDS", "Github Actions CI/CD", "Docker"],
    link: "https://uncluttrd.fit",
  },
  {
    name: "MadTrips",
    description: "Trip-planning app to help a user find points of interest along a travel path.",
    tech: ["React", "Vite", "Zustand", "FastAPI", "Tailwind CSS", "Mapbox GL JS", "OpenRouteService API", "Docker"],
    link: "https://github.com/colinshaw7/trip-planner",
  },
  {
    name: "Terminal Portfolio",
    description: "This site! A retro CRT-styled interactive terminal portfolio built with Next.js and Tailwind CSS.",
    tech: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Three.js"],
    link: "https://github.com/colinshaw7/portfolio",
  },
  {
    name: "QuestGPT",
    description:
      "Full-stack survival game integrating the Gemma 3 LLM for dynamic NPC dialogue and quest generation. Built with a 5-person team for CS506 (Software Development).",
    tech: ["Java", "Spring Boot", "React", "MySQL"],
    link: "https://github.com/mattdomingo/QuestGPT",
  },
  {
    name: "MadMovies",
    description:
      "Full-stack movie recommendation app built in 24 hours for MadData Hackathon. Users complete a preference quiz filtered against a movie dataset, with live poster fetching via the TMDB API.",
    tech: ["FastAPI", "SQLite", "React"],
    link: "https://github.com/Jake-Garneau/MadMovies",
  },
];

export const RESUME_PDF = "/Colin Shaw Resume 2026.pdf";

export interface ExperienceRole {
  title: string;
  dates: string;
  bullets: string[];
}

export interface ExperienceEntry {
  org: string;
  location: string;
  roles: ExperienceRole[];
}

export const EXPERIENCE: ExperienceEntry[] = [
  {
    org: "Amazon/Shopbop",
    location: "Madison, WI",
    roles: [
      {
        title: "Software Developer (UW Madison Capstone)",
        dates: "Jan 2026 — April 2026",
        bullets: [
          "Served as Product Owner for a 5-person capstone team, owning the full Jira backlog and sprint planning while conducting customer interviews and iterating on a capsule wardrobe creation app under Shopbop mentorship",
        ],
      },
    ],
  },
  {
    org: "TVScientific",
    location: "El Segundo, CA",
    roles: [
      {
        title: "Software Development Intern",
        dates: "Jun 2025 — Sept 2025",
        bullets: [
          "Designed and implemented new audience targeting functions as part of an agile development team",
          "Built a custom GitHub Action to automate backporting, improving the development experience by streamlining a difficult part of the CI/CD process",
          "Improved frontend test coverage using Jest, ensuring reliability of UI components",
        ],
      },
    ],
  },
  {
    org: "Humorology Inc.",
    location: "Madison, WI",
    roles: [
      {
        title: "Executive Director",
        dates: "Jun 2023 — April 2026",
        bullets: [
          "Served as the primary liaison between the executive board and 9 casts of 100-200 members, facilitating director meetings and driving key organizational decisions across all productions",
          "Raised $850,000 for the Gio's Garden nonprofit respite care service during the 2025-2026 academic year",
        ],
      },
      {
        title: "Public Relations Chair",
        dates: "Jun 2023 — April 2026",
        bullets: [
          "Handled all marketing and community relations for Wisconsin's largest student-run philanthropy, including social media, apparel design, show program, and videographer/photographer booking",
          "Raised over $610,000 for the Safe Harbor Child Advocacy Center, a $100,000 increase from the previous year",
        ],
      },
    ],
  },
];

export interface EducationEntry {
  degree: string;
  detail: string;
}

export const EDUCATION: EducationEntry = {
  degree: "B.S. Computer Science, Data Science Certificate",
  detail: "University of Wisconsin-Madison · Sep 2022 — May 2026",
};

export const CONTACT = {
  email: "colinjshaw1@gmail.com",
  github: [
    { url: "https://github.com/colinshaw7", label: "github.com/colinshaw7" },
    { url: "https://github.com/cjshaw3", label: "github.com/cjshaw3" },
  ],
  linkedin: { url: "https://www.linkedin.com/in/colin-shaw-2003abc/", label: "linkedin.com/in/colin-shaw-2003abc" },
  phone: "(310) 415-4289",
};
