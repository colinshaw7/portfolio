"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";

const CRTOverlay = dynamic(() => import("../components/CRTOverlay"), { ssr: false });
import DinoGame from "../components/DinoGame";

const ASCII_ART = `
  /$$$$$$            /$$ /$$                  /$$$$$$  /$$                              
 /$$__  $$          | $$|__/                 /$$__  $$| $$                              
| $$   \\__/ /$$$$$$ | $$ /$$ /$$$$$$$       | $$  \\__/| $$$$$$$   /$$$$$$  /$$  /$$  /$$
| $$       /$$__  $$| $$| $$| $$__  $$      |  $$$$$$ | $$__  $$ |____  $$| $$ | $$ | $$
| $$      | $$  \\ $$| $$| $$| $$  \\ $$       \\____  $$| $$  \\ $$  /$$$$$$$| $$ | $$ | $$
| $$    $$| $$  | $$| $$| $$| $$  | $$       /$$  \\ $$| $$  | $$ /$$__  $$| $$ | $$ | $$
|  $$$$$$/|  $$$$$$/| $$| $$| $$  | $$      |  $$$$$$/| $$  | $$|  $$$$$$$|  $$$$$/$$$$/
 \\______/  \\______/ |__/|__/|__/  |__/       \\______/ |__/  |__/ \\_______/ \\_____/\\___/
`;

interface HistoryEntry {
  command: string;
  output: React.ReactNode;
}

const COMMANDS: Record<string, { description: string; category: string; label?: string }> = {
  help: { description: "List available commands", category: "system" },
  about: { description: "Who is Colin Shaw?", category: "info" },
  skills: { description: "Technical skills & expertise", category: "info" },
  projects: { description: "Featured projects — filter by tech with projects <tech>", category: "info", label: "projects [tech]" },
  resume: { description: "Education & experience", category: "info" },
  contact: { description: "Get in touch", category: "info" },
  dino: { description: "Play the dino runner game", category: "extra" },
  leaderboard: { description: "View dino game high scores", category: "extra" },
  clear: { description: "Clear the terminal", category: "system" },
};

function AboutOutput() {
  return (
    <div className="space-y-3">
      <p className="text-green text-glow font-bold">{'>'} COLIN SHAW</p>
      <p className="text-foreground">
        Computer Science graduate from UW-Madison with full-stack experience across React, Python, and Java. Built technical proficiency through professional experience, coursework, and personal projects. Seeking full-time software engineering roles in full-stack or AI-adjacent environments.
      </p>
      <p className="text-gray-light">
        Los Angeles, CA · Madison, WI
      </p>
    </div>
  );
}

function SkillsOutput() {
  const skills = [
    { category: "Languages", items: ["Java", "Python", "JavaScript", "TypeScript", "C", "C++", "R", "Assembly"] },
    { category: "Frontend", items: ["React", "Next.js", "Vite", "Jest", "Tailwind CSS"] },
    { category: "Backend", items: ["Spring Boot", "FastAPI", "MySQL", "SQLite", "SQLAlchemy"] },
    { category: "Libraries", items: ["Scikit-learn", "NumPy", "Pandas", "Matplotlib"] },
    { category: "Tools", items: ["Git", "Docker", "Jira", "GitHub Actions", "CI/CD"] },

  ];

  return (
    <div className="space-y-3">
      <p className="text-green text-glow font-bold">{'>'} TECHNICAL SKILLS</p>
      {skills.map((group) => (
        <div key={group.category}>
          <span className="text-amber">[{group.category}]</span>
          <div className="pl-4 flex flex-wrap gap-2 mt-1">
            {group.items.map((skill) => (
              <span
                key={skill}
                className="text-foreground border border-green-dark px-2 py-0.5 text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

const PROJECTS = [
    {
      name: "Pokemon Battler",
      description: "Pokemon Showdown-esque real-time multiplayer battle simulator. Players sign in via Google, create or join 6v6 turn-based battles using a private 6-character code, with WebSocket communication for live updates.",
      tech: ["Next.js", "FastAPI", "WebSockets", "Redis", "PostgreSQL", "Docker", "NextAuth.js", "Jest", "pytest"],
      link: "https://github.com/colinshaw7/pokemon-battler",
    },
    {
      name: "Uncluttrd",
      description: "Capsule Wardrobe creator and explorer app. Built with a 6-person team for CS620 (Computer Science Capstone/Senior Design Project) in collaboration with Amazon/Shopbop.",
      tech: ["React", "Vite", "FastAPI","AWS Cloudfront", "AWS S3", "AWS EC2","AWS RDS", "Github Actions CI/CD", "Docker"],
      link: "https://uncluttrd.fit",
    },
    {
      name: "MadTrips",
      description: "Trip-planning app to help a user find points of interest along a travel path.",
      tech: ["React", "Vite", "Zustand", "FastAPI", "Tailwind CSS", "Mapbox GL JS", "OpenRouteService API",  "Docker"],
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
      description: "Full-stack survival game integrating the Gemma 3 LLM for dynamic NPC dialogue and quest generation. Built with a 5-person team for CS506 (Software Development).",
      tech: ["Java", "Spring Boot", "React", "MySQL"],
      link: "https://github.com/mattdomingo/QuestGPT",
    },
    {
      name: "MadMovies",
      description: "Full-stack movie recommendation app built in 24 hours for MadData Hackathon. Users complete a preference quiz filtered against a movie dataset, with live poster fetching via the TMDB API.",
      tech: ["FastAPI", "SQLite", "React"],
      link: "https://github.com/Jake-Garneau/MadMovies",
    },
];

function ProjectCard({ project }: { project: typeof PROJECTS[0] }) {
  return (
    <div className="border border-green-dark p-3 space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-amber font-bold">{project.name}</span>
        <a href={project.link} className="text-cyan text-sm hover:underline">
          [view →]
        </a>
      </div>
      <p className="text-foreground text-sm">{project.description}</p>
      <div className="flex flex-wrap gap-2">
        {project.tech.map((t) => (
          <span key={t} className="text-green-dim text-xs">
            #{t}
          </span>
        ))}
      </div>
    </div>
  );
}

function ProjectsOutput() {
  return (
    <div className="space-y-4">
      <p className="text-green text-glow font-bold">{'>'} FEATURED PROJECTS</p>
      {PROJECTS.map((project) => (
        <ProjectCard key={project.name} project={project} />
      ))}
    </div>
  );
}

function ProjectByTechOutput({ tech }: { tech: string }) {
  const matches = PROJECTS.filter((p) =>
    p.tech.some((t) => t.toLowerCase() === tech.toLowerCase())
  );
  return (
    <div className="space-y-4">
      <p className="text-green text-glow font-bold">{'>'} PROJECTS USING {tech.toUpperCase()}</p>
      {matches.length === 0 ? (
        <p className="text-gray-light text-sm">
          No projects found using <span className="text-amber">{tech}</span>.
        </p>
      ) : (
        matches.map((project) => (
          <ProjectCard key={project.name} project={project} />
        ))
      )}
    </div>
  );
}

function ResumeOutput() {
  return (
    <div className="space-y-4">
      <p className="text-green text-glow font-bold">{'>'} RESUME</p>

      <a
        href="/Colin Shaw Resume May 2026.pdf"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block text-cyan border border-cyan px-3 py-1 text-sm hover:bg-cyan hover:text-background transition-colors"
      >
        [↓ Download Full Resume PDF]
      </a>

      <div>
        <p className="text-amber font-bold">Experience</p>
        <div className="pl-4 space-y-3 mt-1">
          <div>
            <p className="text-foreground">Software Developer (UW Madison Capstone) — <span className="text-cyan">Amazon/Shopbop</span></p>
            <p className="text-gray-light text-sm">Jan 2026 — April 2026 · Madison, WI</p>
            <p className="text-gray-light text-sm pl-2">• Served as Product Owner for a 5-person capstone team, owning the full Jira backlog and sprint planning while conducting customer interviews and iterating on a capsule wardrobe creation app under Shopbop mentorship</p>
          </div>
          <div>
            <p className="text-foreground">Software Development Intern — <span className="text-cyan">TVScientific</span></p>
            <p className="text-gray-light text-sm">Jun 2025 — Sept 2025 · El Segundo, CA</p>
            <p className="text-gray-light text-sm pl-2">• Designed and implemented new audience targeting functions as part of an agile development team</p>
            <p className="text-gray-light text-sm pl-2">• Built a custom GitHub Action to automate backporting, improving the development experience by streamlining a difficult part of the CI/CD process</p>
            <p className="text-gray-light text-sm pl-2">• Improved frontend test coverage using Jest, ensuring reliability of UI components</p>
          </div>
          <div>
            <p className="text-foreground">Executive Director — <span className="text-cyan">Humorology Inc.</span></p>
            <p className="text-gray-light text-sm">Jun 2023 — April 2026 · Madison, WI</p>
            <p className="text-gray-light text-sm pl-2">• Served as the primary liaison between the executive board and 9 casts of 100-200 members, facilitating director meetings and driving key organizational decisions across all productions</p>
            <p className="text-gray-light text-sm pl-2">• Raised $850,000 for the Gio&apos;s Garden nonprofit respite care service during the 2025-2026 academic year</p>
            <p className="text-foreground pl-2 mt-1">Public Relations Chair</p>
            <p className="text-gray-light text-sm pl-2">• Handled all marketing and community relations for Wisconsin&apos;s largest student-run philanthropy, including social media, apparel design, show program, and videographer/photographer booking</p>
            <p className="text-gray-light text-sm pl-2">• Raised over $610,000 for the Safe Harbor Child Advocacy Center, a $100,000 increase from the previous year</p>
          </div>
        </div>
      </div>

      <div>
        <p className="text-amber font-bold">Education</p>
        <div className="pl-4 mt-1">
          <p className="text-foreground">B.S. Computer Science, Data Science Certificate</p>
          <p className="text-gray-light text-sm">University of Wisconsin-Madison · Sep 2022 — May 2026</p>
        </div>
      </div>
    </div>
  );
}

function ContactOutput() {
  return (
    <div className="space-y-2">
      <p className="text-green text-glow font-bold">{'>'} CONTACT</p>
      <div className="pl-2 space-y-1">
        <p>
          <span className="text-amber">email</span>
          <span className="text-gray"> .... </span>
          <a href="mailto:colinjshaw1@gmail.com" className="text-cyan hover:underline">colinjshaw1@gmail.com</a>
        </p>
        <p>
          <span className="text-amber">github</span>
          <span className="text-gray"> ... </span>
          <a href="https://github.com/colinshaw7" target="_blank" rel="noopener noreferrer" className="text-cyan hover:underline">github.com/colinshaw7</a>
          <a> and </a>
          <a href="https://github.com/cjshaw3" target="_blank" rel="noopener noreferrer" className="text-cyan hover:underline">github.com/cjshaw3</a>
        </p>
        <p>
          <span className="text-amber">linkedin</span>
          <span className="text-gray"> . </span>
          <a href="https://www.linkedin.com/in/colin-shaw-2003abc/" target="_blank" rel="noopener noreferrer" className="text-cyan hover:underline">linkedin.com/in/colin-shaw-2003abc</a>
        </p>
        <p>
          <span className="text-amber">phone</span>
          <span className="text-gray"> ... </span>
          <span className="text-cyan">(310) 415-4289</span>
        </p>
      </div>
    </div>
  );
}

function LeaderboardOutput() {
  const [data, setData] = useState<Array<{ name: string; score: number }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("/api/scores")
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => { setError(true); setLoading(false); });
  }, []);

  return (
    <div className="space-y-2">
      <p className="text-green text-glow font-bold">{">"} DINO LEADERBOARD</p>
      {loading && <p className="text-gray-light text-sm">Fetching scores...</p>}
      {error && <p className="text-red text-sm">Failed to load leaderboard.</p>}
      {!loading && !error && data.length === 0 && (
        <p className="text-gray-light text-sm">
          No scores yet. Type <span className="text-amber">dino</span> to play!
        </p>
      )}
      {!loading && !error && data.length > 0 && (
        <div className="border border-green-dark p-2 space-y-0.5 text-sm">
          {data.map((entry, i) => (
            <div key={i} className="flex gap-4">
              <span className="text-amber w-6">#{i + 1}</span>
              <span className="text-foreground w-32">{entry.name}</span>
              <span className="text-cyan">{entry.score.toLocaleString()} pts</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function HelpOutput({ onCommand }: { onCommand: (cmd: string) => void }) {
  const categories = ["system", "info", "extra"] as const;
  const labels: Record<string, string> = { system: "System", info: "Info", extra: "Extra" };
  return (
    <div className="space-y-3">
      <p className="text-green text-glow font-bold">{">"} AVAILABLE COMMANDS</p>
      {categories.map((cat) => {
        const cmds = Object.entries(COMMANDS).filter(([, v]) => v.category === cat);
        if (!cmds.length) return null;
        return (
          <div key={cat}>
            <span className="text-amber">[{labels[cat]}]</span>
            <div className="pl-4 mt-1 space-y-0.5">
              {cmds.map(([cmd, { description, label }]) => (
                <div key={cmd} className="flex gap-2">
                  <button
                    onClick={() => onCommand(cmd)}
                    className="text-cyan hover:text-green transition-colors text-sm w-32 text-left !cursor-pointer"
                  >
                    {label ?? cmd}
                  </button>
                  <span className="text-gray-light text-sm">— {description}</span>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ErrorOutput({ command }: { command: string }) {
  return (
    <div>
      <p className="text-red">
        bash: {command}: command not found
      </p>
      <p className="text-gray-light">
        Type <span className="text-amber">help</span> to see available commands.
      </p>
    </div>
  );
}

export default function Home() {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [booted, setBooted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setBooted(true), 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [booted]);

  const processCommand = useCallback((cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();

    if (trimmed === "") return;

    let output: React.ReactNode;

    switch (trimmed) {
      case "help":
        output = <HelpOutput onCommand={processCommand} />;
        break;
      case "about":
        output = <AboutOutput />;
        break;
      case "skills":
        output = <SkillsOutput />;
        break;
      case "projects":
        output = <ProjectsOutput />;
        break;
      case "resume":
        output = <ResumeOutput />;
        break;
      case "contact":
        output = <ContactOutput />;
        break;
      case "dino":
        output = <DinoGame key={Date.now()} />;
        break;
      case "leaderboard":
        output = <LeaderboardOutput />;
        break;
      case "clear":
        setHistory([]);
        setInput("");
        return;
      default:
        if (trimmed.startsWith("projects ")) {
          const tech = trimmed.slice(9).trim();
          output = tech ? <ProjectByTechOutput tech={tech} /> : <ProjectsOutput />;
        } else {
          output = <ErrorOutput command={trimmed} />;
        }
    }

    setHistory((prev) => [...prev, { command: cmd, output }]);
    setCommandHistory((prev) => [cmd, ...prev]);
    setHistoryIndex(-1);
    setInput("");
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      processCommand(input);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
      } else {
        setHistoryIndex(-1);
        setInput("");
      }
    }
  };

  return (
    <div
      className="min-h-screen bg-background p-4 sm:p-8 cursor-text"
      onClick={() => { if (!window.getSelection()?.toString()) inputRef.current?.focus(); }}
    >
      <CRTOverlay />
      <div className="max-w-4xl mx-auto">
        {/* Boot sequence */}
        {!booted && (
          <div className="text-green-dim">
            <p>Booting system...</p>
            <p className="cursor-blink">█</p>
          </div>
        )}

        {booted && (
          <>
            {/* ASCII Header */}
            <pre className="text-green text-glow text-[0.45rem] leading-tight sm:text-xs md:text-sm select-none mb-6">
              {ASCII_ART}
            </pre>

            {/* Tagline */}
            <p className="text-gray-light mb-1 text-sm">
              Software Developer • Systems Architect • Builder
            </p>
            <div className="border-b border-green-dark mb-4" />

            {/* Welcome message */}
            <div className="mb-6 space-y-1">
              <p className="text-foreground">
                Welcome to my terminal. Type a command to explore.
              </p>
              <p className="text-gray-light text-sm">
                Type{" "}
                <button
                  onClick={(e) => { e.stopPropagation(); processCommand("help"); }}
                  className="text-amber hover:text-green transition-colors !cursor-pointer"
                >
                  help
                </button>
                {" "}to see available commands.
              </p>
            </div>

            {/* Command History */}
            <div className="space-y-4 mb-4">
              {history.map((entry, i) => (
                <div key={i} className="type-in">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-green-dim">visitor@colinshaw</span>
                    <span className="text-gray">:</span>
                    <span className="text-cyan">~</span>
                    <span className="text-gray">$</span>
                    <span className="text-foreground">{entry.command}</span>
                  </div>
                  <div className="pl-2">{entry.output}</div>
                </div>
              ))}
            </div>

            {/* Input Line */}
            <div className="flex items-center gap-2">
              <span className="text-green-dim whitespace-nowrap">visitor@colinshaw</span>
              <span className="text-gray">:</span>
              <span className="text-cyan">~</span>
              <span className="text-gray">$</span>
              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full bg-transparent text-foreground caret-green focus:outline-none"
                  autoFocus
                  spellCheck={false}
                  autoComplete="off"
                  autoCapitalize="off"
                />
              </div>
            </div>

            <div ref={bottomRef} />
          </>
        )}
      </div>
    </div>
  );
}
