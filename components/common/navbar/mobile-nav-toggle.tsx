"use client";

import { FC } from "react";
import { Button } from "@/components/ui/button";
import { ListIcon, XIcon } from "@phosphor-icons/react";
import { Else, If, Then } from "react-if";

interface MobileNavToggleProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const MobileNavToggle: FC<MobileNavToggleProps> = ({ isOpen, setIsOpen }) => {
  return (
    <div className="flex items-center md:hidden">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
        className="text-slate-lighter hover:text-primary"
      >
        <If condition={isOpen}>
          <Then>
            <XIcon className="h-5 w-5" />
          </Then>
          <Else>
            <ListIcon className="h-5 w-5" />
          </Else>
        </If>
      </Button>
    </div>
  );
};

export { MobileNavToggle };