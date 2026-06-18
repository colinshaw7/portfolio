import Terminal from "../components/Terminal";
import {
  ABOUT,
  LOCATION,
  SKILLS,
  PROJECTS,
  EXPERIENCE,
  EDUCATION,
  CONTACT,
} from "../lib/content";

// Server-rendered, visually-hidden content block. Lives in the initial HTML
// payload (no JS required) so crawlers and AI agents can read the full
// portfolio. Humans interact with <Terminal /> rendered on top.
function SeoContent() {
  return (
    <section className="sr-only">
      <h1>Colin Shaw — Software Engineer</h1>
      <p>{ABOUT}</p>
      <p>{LOCATION}</p>

      <h2>Skills</h2>
      <ul>
        {SKILLS.map((group) => (
          <li key={group.category}>
            {group.category}: {group.items.join(", ")}
          </li>
        ))}
      </ul>

      <h2>Projects</h2>
      {PROJECTS.map((project) => (
        <article key={project.name}>
          <h3>{project.name}</h3>
          <p>{project.description}</p>
          <p>Tech: {project.tech.join(", ")}</p>
          <a href={project.link}>{project.name}</a>
        </article>
      ))}

      <h2>Experience</h2>
      {EXPERIENCE.map((company) => (
        <article key={company.org}>
          <h3>{company.org}</h3>
          <p>{company.location}</p>
          {company.roles.map((role) => (
            <div key={role.title}>
              <h4>{role.title}</h4>
              <p>{role.dates}</p>
              <ul>
                {role.bullets.map((bullet, i) => (
                  <li key={i}>{bullet}</li>
                ))}
              </ul>
            </div>
          ))}
        </article>
      ))}

      <h2>Education</h2>
      <p>{EDUCATION.degree}</p>
      <p>{EDUCATION.detail}</p>

      <h2>Contact</h2>
      <ul>
        <li>
          <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
        </li>
        {CONTACT.github.map((g) => (
          <li key={g.url}>
            <a href={g.url}>{g.label}</a>
          </li>
        ))}
        <li>
          <a href={CONTACT.linkedin.url}>{CONTACT.linkedin.label}</a>
        </li>
        <li>{CONTACT.phone}</li>
      </ul>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <SeoContent />
      <Terminal />
    </>
  );
}
