import ProfileCard from '@/widgets/ProfileCard';

export default function Page() {
  return (
    <main className="hero bg-base-300 min-h-screen">
      <div className="p-3 md:p-10">
        <h1 className="mb-4 text-center text-2xl">Hi! This is our team</h1>
        <div className="m-auto text-center md:w-1/2">
          <p>
            This is a team project, developed as part of the React course at
            Rolling Scopes School (RSSchool). Under the hood, we use Next.js and
            React for a performant, scalable UI and seamless routing. TypeScript
            provides strong typing and safer refactoring, while Tailwind CSS
            ensures a consistent, responsive design with minimal overhead. For
            reliability and confidence, we write unit and integration tests with
            Vitest, enabling rapid iteration without sacrificing quality.
          </p>
        </div>
        <div className="cards-container flex flex-wrap justify-center gap-5 pt-5">
          <ProfileCard
            img="/photo-Inna.jpg"
            description="AWS and Microsoft-certified NOC Engineer & Frontend Developer— React/Next.js, TypeScript, Firebase; cloud ops. Always learning."
            title="Inna"
            gitHub="https://github.com/InnaSodri"
          ></ProfileCard>
          <ProfileCard
            img="/photo-Sergey.png"
            description="A physicist who wanted interfaces better than those of an oscilloscope."
            title="Sergey"
            gitHub="https://github.com/ksarise"
          ></ProfileCard>
          <ProfileCard
            img="/photo-Liza.jpg"
            description="My current main goal is to become a good Frontend Developer. Excited to gain hands-on experience and continue growing as a developer within an team."
            title="Elizaveta"
            gitHub="https://github.com/ElizavetaAbramova"
          ></ProfileCard>
        </div>
      </div>
    </main>
  );
}
