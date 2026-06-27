import Link from "next/link";
import { Social } from "./social";
import { NoSSR } from "@/components/ui/no-ssr";
import { Container } from "@/components/ui/container";

export default function Footer() {

  return (
    <footer className="bg-canvas-white dark:bg-canvas-light border-t border-borderSubtle py-6">
      <Container>
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <Social />

          <div className="font-mono text-xs text-text-muted">
            <p>
              Designed & Built by{" "}
              <Link
                href="https://github.com/maitrongnhan99"
                target="_blank"
                aria-label="GitHub"
              >
                @maitrongnhan99
              </Link>
            </p>
            <p className="mt-1">© <NoSSR>{new Date().getFullYear()}</NoSSR> All Rights Reserved</p>
          </div>
        </div>
      </Container>
    </footer>
  );
}
