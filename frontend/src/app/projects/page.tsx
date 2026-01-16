import Image from "next/image";
import Link from "next/link";

const projects = [
  {
    title: "Aurora Archive",
    image: "/projects/aurora.svg",
  },
  {
    title: "Paper Skyline",
    image: "/projects/skyline.svg",
  },
  {
    title: "Studio Drift",
    image: "/projects/studio.svg",
  },
];

export default function ProjectsPage() {
  return (
    <div className="page">
      <header className="site-header">
        <div className="logo">VivishkosHub</div>
        <nav className="nav">
          <Link href="/">Home</Link>
          <Link href="/projects">Projects</Link>
        </nav>
      </header>
      <main className="projects">
        <h1>Projects</h1>
        <div className="project-grid">
          {projects.map((project) => (
            <article className="project-card" key={project.title}>
              <div className="project-image">
                <Image
                  src={project.image}
                  alt={project.title}
                  width={480}
                  height={360}
                />
              </div>
              <div className="project-title">{project.title}</div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
