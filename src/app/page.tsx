'use client'
import ProfileCard from '@/widgets/ProfileCard'
import { useT } from '@/hooks/useT'

export default function Page() {
  const { t } = useT()
  return (
    <main className="hero bg-base-300 min-h-screen">
      <div className="p-3 md:p-10">
        <h1 className="mb-4 text-center text-2xl">{t('team_title')}</h1>
        <div className="m-auto text-center md:w-1/2">
          <p>{t('team_intro')}</p>
        </div>
        <div className="cards-container flex flex-wrap justify-center gap-5 pt-5">
          <ProfileCard
            img="/photo-Inna.jpg"
            description={t('inna_desc')}
            title="Inna"
            gitHub="https://github.com/InnaSodri"
          />
          <ProfileCard
            img="/photo-Sergey.png"
            description={t('sergey_desc')}
            title="Sergey"
            gitHub="https://github.com/ksarise"
          />
          <ProfileCard
            img="/photo-Liza.jpg"
            description={t('elizaveta_desc')}
            title="Elizaveta"
            gitHub="https://github.com/ElizavetaAbramova"
          />
        </div>
      </div>
    </main>
  )
}
