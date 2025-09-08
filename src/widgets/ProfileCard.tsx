import Image from 'next/image';
import React from 'react';

interface Props {
  img?: string;
  description: string;
  title: string;
  gitHub: string;
}

function ProfileCard({ img, description, title, gitHub }: Props) {
  return (
    <a href={gitHub} target="_blank" className="profile-card">
      <div className="card bg-base-100 w-70 shadow-sm md:w-96">
        <figure>
          <Image
            priority={true}
            alt="profile-photo"
            src={img ?? ''}
            width={300}
            height={300}
            className="h-90 w-full object-cover"
          ></Image>
        </figure>
        <div className="card-body">
          <h2 className="card-title">{title}</h2>
          <p>{description}</p>
        </div>
      </div>
    </a>
  );
}

export default ProfileCard;
