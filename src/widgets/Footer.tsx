import Image from 'next/image';
import React from 'react';

function Footer() {
  return (
    <footer className="bg-base-400 flex flex-wrap items-end justify-center gap-3 p-5 md:flex-nowrap">
      <nav className="pl-10 text-center">
        <a
          href="https://github.com/ksarise/rest-client-app"
          target="_blank"
          className="GitHub-link relative"
        >
          <span className="tooltip absolute bottom-full left-[-70px] w-[160px]">
            Project on GitHub
          </span>
          <Image
            priority={true}
            src="/github-icon.png"
            alt="GitHub-logo"
            width={50}
            height={50}
            className="github-logo m-auto"
          ></Image>
        </a>
      </nav>
      <nav className="text-center">
        <a
          href="https://rs.school/courses/reactjs"
          target="_blank"
          className="course-link relative"
        >
          <span className="tooltip absolute bottom-full left-[-70px] w-[140px]">
            React course
          </span>
          <Image
            src="/rss-logo.svg"
            width={50}
            height={50}
            alt="rsschool-logo"
            className="m-auto"
          />
        </a>
      </nav>
      <p className="w-full text-center md:text-end">
        Copyright © {new Date().getFullYear()} - All right reserved
      </p>
    </footer>
  );
}

export default Footer;