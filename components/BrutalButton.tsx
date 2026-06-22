import type { ReactNode } from "react";
import { ArrowIcon } from "./ArrowIcon";

type BrutalButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "light" | "dark" | "pink";
};

export function BrutalButton({ href, children, variant = "light" }: BrutalButtonProps) {
  const styles =
    variant === "light"
      ? "border-white bg-white text-black hover:bg-black hover:text-white"
      : variant === "pink"
        ? "border-shock bg-shock text-black hover:bg-black hover:text-shock"
        : "border-black bg-black text-white hover:bg-white hover:text-black";

  return (
    <a
      className={`group inline-flex min-h-14 max-w-full items-center justify-between gap-6 border-2 px-5 py-3 font-mono text-sm font-bold uppercase transition duration-200 hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 ${styles}`}
      href={href}
    >
      <span className="copy-safe text-left leading-tight">{children}</span>
      <ArrowIcon />
    </a>
  );
}
