"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";

const CRTOverlay = dynamic(() => import("./CRTOverlay"), { ssr: false });
import DinoGame from "./DinoGame";
import {
  ABOUT,
  LOCATION,
  SKILLS,
  PROJECTS,
  RESUME_PDF,
  EXPERIENCE,
  EDUCATION,
  CONTACT,
  type Project,
} from "../lib/content";

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
        {ABOUT}
      </p>
      <p className="text-gray-light">
        {LOCATION}
      </p>
    </div>
  );
}

function SkillsOutput() {
  return (
    <div className="space-y-3">
      <p className="text-green text-glow font-bold">{'>'} TECHNICAL SKILLS</p>
      {SKILLS.map((group) => (
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

function ProjectCard({ project }: { project: Project }) {
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
        href={RESUME_PDF}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block text-cyan border border-cyan px-3 py-1 text-sm hover:bg-cyan hover:text-background transition-colors"
      >
        [↓ Download Full Resume PDF]
      </a>

      <div>
        <p className="text-amber font-bold">Experience</p>
        <div className="pl-4 space-y-3 mt-1">
          {EXPERIENCE.map((company) => (
            <div key={company.org}>
              <p className="text-cyan font-bold">{company.org}</p>
              <p className="text-gray-light text-sm">{company.location}</p>
              <div className="pl-2 space-y-2 mt-1">
                {company.roles.map((role) => (
                  <div key={role.title}>
                    <p className="text-foreground">{role.title}</p>
                    <p className="text-gray-light text-sm">{role.dates}</p>
                    {role.bullets.map((bullet, i) => (
                      <p key={i} className="text-gray-light text-sm pl-2">• {bullet}</p>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <p className="text-amber font-bold">Education</p>
        <div className="pl-4 mt-1">
          <p className="text-foreground">{EDUCATION.degree}</p>
          <p className="text-gray-light text-sm">{EDUCATION.detail}</p>
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
          <a href={`mailto:${CONTACT.email}`} className="text-cyan hover:underline">{CONTACT.email}</a>
        </p>
        <p>
          <span className="text-amber">github</span>
          <span className="text-gray"> ... </span>
          <a href={CONTACT.github[0].url} target="_blank" rel="noopener noreferrer" className="text-cyan hover:underline">{CONTACT.github[0].label}</a>
          <a> and </a>
          <a href={CONTACT.github[1].url} target="_blank" rel="noopener noreferrer" className="text-cyan hover:underline">{CONTACT.github[1].label}</a>
        </p>
        <p>
          <span className="text-amber">linkedin</span>
          <span className="text-gray"> . </span>
          <a href={CONTACT.linkedin.url} target="_blank" rel="noopener noreferrer" className="text-cyan hover:underline">{CONTACT.linkedin.label}</a>
        </p>
        <p>
          <span className="text-amber">phone</span>
          <span className="text-gray"> ... </span>
          <span className="text-cyan">{CONTACT.phone}</span>
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

export default function Terminal() {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

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
      </div>
    </div>
  );
}
