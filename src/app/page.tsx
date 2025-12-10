import Hero from '@/components/Hero';
import About from '@/components/About';
import Projects from '@/components/Projects';
import Stack from '@/components/Stack';
import Contact from '@/components/Contact';

export default function HomePage() {
  return (
    <main>
      <section id="hero">
        <Hero />
      </section>
      <section id="projects">
        <Projects />
      </section>
      <section id="stack">
        <Stack />
      </section>
      <section id="about">
        <About />
      </section>
      <section id="contact">
        <Contact />
      </section>
    </main>
  );
}
