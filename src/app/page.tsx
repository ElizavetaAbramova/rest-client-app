'use client';
import ProfileCard from '@/widgets/ProfileCard';
import { useT } from '@/hooks/useT';
import { profiles } from '@/constants/profiles';

export default function Page() {
  const { t } = useT();
  return (
    <main className="hero bg-base-300 block min-h-screen p-3 md:p-10">
      <h1 className="mb-4 text-center text-2xl">{t('team_title')}</h1>
      <div className="m-auto text-center md:w-1/2">
        <p>{t('team_intro')}</p>
      </div>
      <div className="cards-container flex flex-wrap justify-center gap-5 pt-5">
        {profiles.map((profile) => {
          return (
            <ProfileCard
              key={profile.title}
              img={profile.img}
              description={t(profile.description)}
              title={profile.title}
              gitHub={profile.gitHub}
            />
          );
        })}
      </div>
    </main>
  );
}
