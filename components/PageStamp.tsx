import type { ReactNode } from "react";

type PageStampProps = {
  children: ReactNode;
  index: string;
};

export function PageStamp({ children, index }: PageStampProps) {
  return (
    <div className="inline-flex max-w-full items-stretch border-2 border-white font-mono text-sm uppercase">
      <span className="bg-shock px-3 py-2 font-black text-black">{index}</span>
      <span className="copy-safe px-3 py-2 leading-tight">{children}</span>
    </div>
  );
}
