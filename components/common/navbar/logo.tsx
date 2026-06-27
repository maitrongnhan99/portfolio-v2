"use client";

import Logo from "@/public/portfolio-logo.png";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";

const NavLogo: FC = () => {
  return (
    <Link href="/" className="text-xl font-bold">
      <Image
        src={Logo}
        alt="Mai Trọng Nhân Portfolio Logo"
        width={48}
        height={48}
        className="rounded-full transition dark:brightness-0 dark:invert"
      />
    </Link>
  );
};

export { NavLogo };
