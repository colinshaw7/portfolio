"use client";

import { useState, useRef, useEffect, useCallback } from "react";

const ASCII_ART = `
 ██████╗ ██████╗ ██╗     ██╗███╗   ██╗
██╔════╝██╔═══██╗██║     ██║████╗  ██║
██║     ██║   ██║██║     ██║██╔██╗ ██║
██║     ██║   ██║██║     ██║██║╚██╗██║
╚██████╗╚██████╔╝███████╗██║██║ ╚████║
 ╚═════╝ ╚═════╝ ╚══════╝╚═╝╚═╝  ╚═══╝
███████╗██╗  ██╗ █████╗ ██╗    ██╗
██╔════╝██║  ██║██╔══██╗██║    ██║
███████╗███████║███████║██║ █╗ ██║
╚════██║██╔══██║██╔══██║██║███╗██║
███████║██║  ██║██║  ██║╚███╔███╔╝
╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝ ╚══╝╚══╝
`.trimStart();

interface HistoryEntry {
  command: string;
  output: React.ReactNode;
}

const COMMANDS: Record<string, { description: string; category: string }> = {
  about: { description: "Who is Colin Shaw?", category: "info" },
  skills: { description: "Technical skills & expertise", category: "info" },
  projects: { description: "Featured projects & work", category: "info" },
  resume: { description: "Education & experience", category: "info" },
  contact: { description: "Get in touch", category: "info" },
  clear: { description: "Clear the terminal", category: "system" },
};

function AboutOutput() {
  return (
    <div className="space-y-3">
      <p className="text-green text-glow font-bold">{'>'} COLIN SHAW</p>
      <p className="text-foreground">
        Computer Science senior at UW-Madison with a Data Science certificate.
        Passionate about backend and frontend development, AI/ML systems,
        and data analysis. I focus on building business applications and
        fostering collaboration in development teams.
      </p>
      <p className="text-gray-light">
        Manhattan Beach, CA · Madison, WI
      </p>
    </div>
  );
}

function SkillsOutput() {
  const skills = [
    { category: "Languages", items: ["Java", "Python", "JavaScript/TypeScript", "C", "C++", "R", "Assembly"] },
    { category: "Frontend", items: ["React"] },
    { category: "Backend", items: ["FastAPI", "SQLite", "SQLAlchemy"] },
    { category: "Data/ML", items: ["Scikit-learn", "NumPy", "Pandas", "Matplotlib"] },
    { category: "Tools", items: ["Git", "Docker", "Jira"] },
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

function ProjectsOutput() {
  const projects = [
    {
      name: "Terminal Portfolio",
      description: "This site! A retro CRT-styled interactive terminal portfolio built with Next.js and Tailwind CSS.",
      tech: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
      link: "https://github.com/colinshaw7/portfolio",
    },
    {
      name: "QuestGPT",
      description: "Full-stack infinite survival game with battles, shops, and NPCs. Built with a 5-person team for CS506.",
      tech: ["Java", "Spring Boot", "React", "MySQL"],
      link: "https://github.com/mattdomingo/QuestGPT",
    },
    {
      name: "MadMovies",
      description: "Movie recommendation service built in 24 hours at MadData Hackathon 2025. Delivers recommendations through data processing.",
      tech: ["FastAPI", "SQLite", "React"],
      link: "https://github.com/Jake-Garneau/MadMovies",
    },
  ];

  return (
    <div className="space-y-4">
      <p className="text-green text-glow font-bold">{'>'} FEATURED PROJECTS</p>
      {projects.map((project) => (
        <div key={project.name} className="border border-green-dark p-3 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-amber font-bold">{project.name}</span>
            <a href={project.link} className="text-cyan text-sm hover:underline">
              [view →]
            </a>
          </div>
          <p className="text-foreground text-sm">{project.description}</p>
          <div className="flex gap-2">
            {project.tech.map((t) => (
              <span key={t} className="text-green-dim text-xs">
                #{t}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function ResumeOutput() {
  return (
    <div className="space-y-4">
      <p className="text-green text-glow font-bold">{'>'} RESUME</p>

      <a
        href="/Colin_Shaw_Resume.pdf"
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
            <p className="text-gray-light text-sm">Jan 2026 — Present · Manhattan Beach, CA</p>
            <p className="text-gray-light text-sm pl-2">• Product Owner and Developer for CS 620 capstone team under Shopbop mentors</p>
            <p className="text-gray-light text-sm pl-2">• Designed and iterated on a capsule wardrobe creation application, solving novel problems and prioritizing high-impact features</p>
          </div>
          <div>
            <p className="text-foreground">Software Development Intern — <span className="text-cyan">TVScientific</span></p>
            <p className="text-gray-light text-sm">Jun 2025 — Sept 2025 · El Segundo, CA</p>
            <p className="text-gray-light text-sm pl-2">• Designed and implemented new audience targeting functions in an agile team</p>
            <p className="text-gray-light text-sm pl-2">• Built a custom GitHub Action to automate backporting, streamlining CI/CD</p>
            <p className="text-gray-light text-sm pl-2">• Improved frontend test coverage using Jest</p>
          </div>
          <div>
            <p className="text-foreground">Executive Director — <span className="text-cyan">Humorology Inc.</span></p>
            <p className="text-gray-light text-sm">Jun 2023 — Present · Madison, WI</p>
            <p className="text-gray-light text-sm pl-2">• Manage 9 casts of 100-200 people as liaison between exec board and production</p>
            <p className="text-gray-light text-sm pl-2">• Projected to raise $500K+ for Gio&apos;s Garden nonprofit (2025-2026)</p>
            <p className="text-gray-light text-sm pl-2">• Previously PR Chair — raised $610K+ for Safe Harbor (2024-2025)</p>
          </div>
        </div>
      </div>

      <div>
        <p className="text-amber font-bold">Education</p>
        <div className="pl-4 mt-1">
          <p className="text-foreground">B.S. Computer Science, Data Science Certificate</p>
          <p className="text-gray-light text-sm">University of Wisconsin-Madison · Senior · 3.3 GPA · Sep 2022 — Present</p>
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

function ErrorOutput({ command }: { command: string }) {
  return (
    <div>
      <p className="text-red">
        bash: {command}: command not found
      </p>
      <p className="text-gray-light">
        Type a command from the list above to explore.
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
      case "clear":
        setHistory([]);
        setInput("");
        return;
      default:
        output = <ErrorOutput command={trimmed} />;
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
      onClick={() => inputRef.current?.focus()}
    >
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
                Available commands:
              </p>
              <div className="flex flex-wrap gap-3 pl-2">
                {Object.entries(COMMANDS).map(([cmd, { description }]) => (
                  <button
                    key={cmd}
                    onClick={(e) => {
                      e.stopPropagation();
                      processCommand(cmd);
                    }}
                    className="group cursor-pointer"
                  >
                    <span className="text-amber group-hover:text-green transition-colors">
                      {cmd}
                    </span>
                    <span className="text-gray hidden sm:inline">
                      {" "}— {description}
                    </span>
                  </button>
                ))}
              </div>
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
