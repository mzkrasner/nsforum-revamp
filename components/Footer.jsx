import Image from "next/image";
import Link from "next/link";
import { GithubIcon, TwitterIcon } from "./Icons";

function Footer() {
  return (
    <footer className="border-primary border-t">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="py-8">
          {/* Top area */}
          <div className="mb-4 flex flex-col items-center justify-center md:flex-row md:justify-between">
            <div className="mr-4 shrink-0">
              {/* Logo */}
              <Link
                className="text-primary group mb-8 inline-flex md:mb-0"
                href="/"
              >
                <Image src="/logo-gray.png" className="h-8" alt="logo" />
              </Link>
            </div>
            {/* Right links */}
            <div className="mb-2 text-sm font-medium md:order-1 md:mb-0">
              <ul className="inline-flex flex-wrap space-x-6 text-sm">
                {/**<li>
                  <Link className="text-white hover:underline" href="/post/kjzl6cwe1jw14b9pin02aak0ot08wvnrhzf8buujkop28swyxnvtsjdye742jo6">
                    Learn more
                  </Link>
                </li>*/}
                <li>
                  <Link
                    className="text-secondary flex flex-row items-center hover:underline"
                    href="https://www.banklessdesci.org/"
                    target="_blank"
                  >
                    Secured by Silk
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom area */}
          <div className="text-center md:flex md:items-center md:justify-between">
            {/* Social links */}
            <ul className="mb-4 inline-flex space-x-2 md:order-1 md:mb-0 md:ml-4">
              <li>
                <Link
                  className="text-brand text-brand-hover flex items-center justify-center"
                  target="_blank"
                  href="https://twitter.com/noahchonlee"
                >
                  <TwitterIcon />
                </Link>
              </li>
              <li>
                <Link
                  className="text-brand text-brand-hover flex items-center justify-center"
                  target="_blank"
                  href="https://github.com/"
                >
                  <GithubIcon />
                </Link>
              </li>
            </ul>

            {/* Copyright
            <div className="text-sm text-secondary">Copyright © Silk. All rights reserved.</div> */}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
