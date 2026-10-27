import type { ComponentProps } from "react";
import type { MDXComponents } from "mdx/types";
import { Callout } from "./Callout";
import { MDXCodeBlock } from "./MDXCodeBlock";
import { Practice } from "./Practice";

export const mdxComponents: MDXComponents = {
  pre: MDXCodeBlock,
  Callout,
  Practice,
  a: ({ href, children, ...props }: ComponentProps<"a">) => {
    const isExternal = href?.startsWith("http");

    return (
      <a
        href={href}
        {...props}
        {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {children}
      </a>
    );
  },
  table: (props: ComponentProps<"table">) => (
    <div className="my-6 overflow-x-auto">
      <table {...props} />
    </div>
  ),
};
