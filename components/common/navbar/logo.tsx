"use client";

import { FC } from "react";
import Image from "next/image";
import Link from "next/link";
import Logo from "@/public/portfolio-logo.png";

const NavLogo: FC = () => {
  return (
    <Link href="/" className="text-xl font-bold">
      <Image
        src={Logo}
        alt="Mai Trọng Nhân Portfolio Logo"
        width={48}
        height={48}
        className="rounded-full"
      />
    </Link>
  );
};

export { NavLogo };