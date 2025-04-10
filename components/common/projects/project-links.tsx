"use client";

import { Button } from "@/components/ui/button";
import { Download, GithubLogo, Link } from "@phosphor-icons/react";
import NextLink from "next/link";
import { FC } from "react";

interface ProjectLinksProps {
  liveUrl?: string;
  githubUrl?: string;
  downloads?: number;
}

const ProjectLinks: FC<ProjectLinksProps> = ({
  liveUrl,
  githubUrl,
  downloads,
}) => {
  return (
    <div className="flex flex-wrap gap-4">
      {liveUrl && (
        <Button
          asChild
          size="sm"
          variant="ghost"
          className="text-slate-light hover:text-primary p-0"
        >
          <NextLink href={liveUrl} target="_blank">
            <Link className="h-4 w-4 mr-2" />
            Demo
          </NextLink>
        </Button>
      )}

      {githubUrl && (
        <Button
          asChild
          size="sm"
          variant="ghost"
          className="text-slate-light hover:text-primary p-0"
        >
          <NextLink href={githubUrl} target="_blank">
            <GithubLogo className="h-4 w-4 mr-2" />
            Code
          </NextLink>
        </Button>
      )}

      {downloads && (
        <Button
          asChild
          size="sm"
          variant="ghost"
          className="text-slate-light hover:text-primary p-0"
        >
          <NextLink href={liveUrl || "#"} target="_blank">
            <Download className="h-4 w-4 mr-2" />
            {downloads.toLocaleString()} Installs
          </NextLink>
        </Button>
      )}
    </div>
  );
};

export { ProjectLinks };
