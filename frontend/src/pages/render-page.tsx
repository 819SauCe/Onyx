import React from "react";

export type Breakpoint = "sm" | "md" | "lg";
export type Responsive<T> = T | Partial<Record<Breakpoint, T>>;

export type AbsRect = { x: number; y: number; w: number; h: number; z?: number; rotate?: number };
export type ResponsiveAbs = Responsive<AbsRect>;

export type NodeBase = {
  id: string;
  type: string;
  children?: Node[];
  props?: Record<string, any>;
  layout?: {
    maxWidth?: number;
    paddingY?: number;
    paddingX?: number;
    gap?: number;
    align?: "start" | "center" | "end";
    cols?: number;
    colSpan?: Responsive<number>;
    abs?: ResponsiveAbs;
    canvasHeight?: Responsive<number>;
  };
  style?: {
    bg?: string;
    textColor?: string;
  };
};

export type Node =
  | (NodeBase & { type: "page"; props: { title?: string } })
  | (NodeBase & { type: "section" })
  | (NodeBase & { type: "grid" })
  | (NodeBase & { type: "canvas" })
  | (NodeBase & {
      type: "hero";
      props: { title: string; subtitle?: string; ctaLabel?: string; ctaHref?: string };
    })
  | (NodeBase & { type: "richText"; props: { html: string } })
  | (NodeBase & { type: "image"; props: { src: string; alt?: string } })
  | (NodeBase & { type: "spacer"; props: { h: number } })
  | (NodeBase & {
      type: "button";
      props: {
        label: string;
        href: string;
        target?: "_self" | "_blank";
        rel?: string;
        ariaLabel?: string;
        className?: string;
        cssRaw?: string;
        style?: {
          display?: "inline-block" | "block";
          fontSize?: number;
          fontWeight?: number;
          paddingY?: number;
          paddingX?: number;
          radius?: number;
          bg?: string;
          color?: string;
          borderColor?: string;
          borderWidth?: number;
          borderStyle?: "solid" | "dashed" | "dotted" | "none";
          textDecoration?: "none" | "underline";
          width?: string;
          height?: string;
          textAlign?: "left" | "center" | "right";
        };
      };
    });

export type PageNode = Extract<Node, { type: "page" }>;

export const EMPTY_PAGE: PageNode = {
  type: "page",
  id: "page_1",
  props: { title: "Nova página" },
  children: [],
};

export const EXAMPLE_PAGE: PageNode = {
  type: "page",
  id: "p1",
  props: { title: "Home" },
  children: [
    {
      type: "section",
      id: "s1",
      layout: { paddingY: 24, maxWidth: 1200 },
      children: [
        {
          type: "canvas",
          id: "cv1",
          layout: { canvasHeight: { sm: 720, md: 560 } },
          style: { bg: "linear-gradient(180deg, rgba(0,0,0,0.04), rgba(0,0,0,0))" },
          children: [
            {
              type: "hero",
              id: "h1",
              layout: {
                abs: {
                  sm: { x: 16, y: 28, w: 343, h: 240, z: 2 },
                  md: { x: 24, y: 48, w: 640, h: 260, z: 2 },
                },
              },
              props: {
                title: "Seu produto, rápido.",
                subtitle: "Builder com publish estático e performance alta.",
                ctaLabel: "Começar",
                ctaHref: "#start",
              },
            },
            {
              type: "image",
              id: "img1",
              layout: {
                abs: {
                  sm: { x: 16, y: 300, w: 343, h: 260, z: 1 },
                  md: { x: 720, y: 48, w: 432, h: 360, z: 1 },
                },
              },
              props: { src: "https://picsum.photos/1200/900", alt: "Preview" },
            },
            {
              type: "button",
              id: "btn1",
              layout: {
                abs: {
                  sm: { x: 16, y: 570, w: 343, h: 52, z: 3 },
                  md: { x: 24, y: 330, w: 220, h: 52, z: 3 },
                },
              },
              props: {
                label: "Ver planos",
                href: "/pricing",
                target: "_self",
                style: {
                  display: "block",
                  bg: "#111",
                  color: "#fff",
                  borderStyle: "none",
                  radius: 14,
                  paddingY: 14,
                  paddingX: 18,
                  fontWeight: 700,
                  textAlign: "center",
                },
                cssRaw: "box-shadow: 0 10px 30px rgba(0,0,0,.18);",
              },
            },
            {
              type: "button",
              id: "btn2",
              layout: {
                abs: {
                  sm: { x: 16, y: 634, w: 343, h: 52, z: 3 },
                  md: { x: 260, y: 330, w: 220, h: 52, z: 3 },
                },
              },
              props: {
                label: "Falar comigo",
                href: "#contato",
                target: "_self",
                style: {
                  display: "block",
                  bg: "transparent",
                  color: "#111",
                  borderStyle: "solid",
                  borderWidth: 1,
                  borderColor: "rgba(0,0,0,.35)",
                  radius: 14,
                  paddingY: 14,
                  paddingX: 18,
                  fontWeight: 700,
                  textAlign: "center",
                },
              },
            },
          ],
        },
      ],
    },
  ],
};

function colSpanClasses(colSpan?: Responsive<number>) {
  if (!colSpan) return "";
  if (typeof colSpan === "number") return `col-span-${colSpan}`;
  const parts: string[] = [];
  for (const bp of ["sm", "md", "lg"] as const) {
    const v = (colSpan as any)[bp];
    if (typeof v === "number") parts.push(`${bp}:col-span-${v}`);
  }
  return parts.join(" ");
}

function nodeStyle(n: Node): React.CSSProperties {
  const s: React.CSSProperties = {};
  if (n.style?.bg) s.background = n.style.bg;
  if (n.style?.textColor) s.color = n.style.textColor;
  if (typeof n.layout?.paddingY === "number") (s as any)["--py"] = `${n.layout.paddingY}px`;
  if (typeof n.layout?.paddingX === "number") (s as any)["--px"] = `${n.layout.paddingX}px`;
  if (typeof n.layout?.gap === "number") (s as any)["--gap"] = `${n.layout.gap}px`;
  if (typeof n.layout?.maxWidth === "number") (s as any)["--mw"] = `${n.layout.maxWidth}px`;
  if (n.layout?.align) (s as any)["--align"] = n.layout.align;
  if (typeof n.layout?.cols === "number") (s as any)["--cols"] = String(n.layout.cols);
  return s;
}

function absVars(n: Node): React.CSSProperties {
  const out: React.CSSProperties = {};
  const abs = n.layout?.abs;
  if (!abs) return out;

  const applyRect = (prefix: string, r: AbsRect) => {
    (out as any)[`--${prefix}x`] = `${r.x}px`;
    (out as any)[`--${prefix}y`] = `${r.y}px`;
    (out as any)[`--${prefix}w`] = `${r.w}px`;
    (out as any)[`--${prefix}h`] = `${r.h}px`;
    (out as any)[`--${prefix}z`] = String(r.z ?? 1);
    (out as any)[`--${prefix}rot`] = `${r.rotate ?? 0}deg`;
  };

  if (typeof abs === "object" && "x" in (abs as any)) {
    applyRect("", abs as any);
    return out;
  }

  const rSm = (abs as any).sm as AbsRect | undefined;
  const rMd = (abs as any).md as AbsRect | undefined;
  const rLg = (abs as any).lg as AbsRect | undefined;

  if (rSm) applyRect("sm-", rSm);
  if (rMd) applyRect("md-", rMd);
  if (rLg) applyRect("lg-", rLg);

  const fallback = rSm ?? rMd ?? rLg;
  if (fallback) applyRect("", fallback);

  return out;
}

function canvasHeightVars(n: Extract<Node, { type: "canvas" }>): React.CSSProperties {
  const out: React.CSSProperties = {};
  const h = n.layout?.canvasHeight;
  if (!h) return out;

  if (typeof h === "number") {
    (out as any)["--cvh"] = `${h}px`;
    return out;
  }

  const sm = (h as any).sm;
  const md = (h as any).md;
  const lg = (h as any).lg;

  if (typeof sm === "number") (out as any)["--cvh-sm"] = `${sm}px`;
  if (typeof md === "number") (out as any)["--cvh-md"] = `${md}px`;
  if (typeof lg === "number") (out as any)["--cvh-lg"] = `${lg}px`;

  const fallback = (typeof sm === "number" ? sm : undefined) ?? (typeof md === "number" ? md : undefined) ?? (typeof lg === "number" ? lg : undefined);
  if (typeof fallback === "number") (out as any)["--cvh"] = `${fallback}px`;

  return out;
}

const Blocks: Record<string, (n: any) => React.ReactElement> = {
  hero: (n: Extract<Node, { type: "hero" }>) => (
    <div className="hero">
      <h1>{n.props.title}</h1>
      {n.props.subtitle ? <p className="muted">{n.props.subtitle}</p> : null}
      {n.props.ctaLabel && n.props.ctaHref ? (
        <a className="btn" href={n.props.ctaHref}>
          {n.props.ctaLabel}
        </a>
      ) : null}
    </div>
  ),
  richText: (n: Extract<Node, { type: "richText" }>) => <div className="rich" dangerouslySetInnerHTML={{ __html: n.props.html }} />,
  image: (n: Extract<Node, { type: "image" }>) => <img className="img" src={n.props.src} alt={n.props.alt ?? ""} loading="lazy" />,
  spacer: (n: Extract<Node, { type: "spacer" }>) => <div style={{ height: n.props.h }} />,
  button: (n: Extract<Node, { type: "button" }>) => {
    const s = n.props?.style ?? {};
    const style: React.CSSProperties = {
      display: s.display ?? "inline-block",
      fontSize: typeof s.fontSize === "number" ? `${s.fontSize}px` : undefined,
      fontWeight: s.fontWeight,
      padding: `${s.paddingY ?? 10}px ${s.paddingX ?? 14}px`,
      borderRadius: typeof s.radius === "number" ? `${s.radius}px` : "10px",
      background: s.bg,
      color: s.color,
      borderStyle: s.borderStyle ?? "solid",
      borderWidth: typeof s.borderWidth === "number" ? `${s.borderWidth}px` : s.borderStyle === "none" ? "0" : "1px",
      borderColor: s.borderColor,
      textDecoration: s.textDecoration ?? "none",
      width: s.width,
      height: s.height,
      textAlign: s.textAlign,
      boxSizing: "border-box",
    };

    const href = n.props.href || "#";
    const target = n.props.target ?? "_self";
    const rel = n.props.rel ?? (target === "_blank" ? "noopener noreferrer" : undefined);

    return (
      <>
        {n.props.cssRaw ? <style>{`.b_${n.id}{${n.props.cssRaw}}`}</style> : null}
        <a className={`b_${n.id} btnx ${n.props.className ?? ""}`} href={href} target={target} rel={rel} aria-label={n.props.ariaLabel} style={style}>
          {n.props.label}
        </a>
      </>
    );
  },
};

export function RenderPage({ page }: { page: PageNode }) {
  return (
    <div className="page">
      <style>{BASE_CSS}</style>
      {page.children?.map((c) => (
        <RenderNode key={c.id} node={c} />
      ))}
    </div>
  );
}

function RenderNode({ node }: { node: Node }) {
  switch (node.type) {
    case "section":
      return (
        <section className="section" style={nodeStyle(node)} data-id={node.id}>
          <div className="container">
            {node.children?.map((c) => (
              <RenderNode key={c.id} node={c} />
            ))}
          </div>
        </section>
      );

    case "grid": {
      const cols = node.layout?.cols ?? 12;
      return (
        <div className="grid" style={{ ...nodeStyle(node), ["--cols" as any]: String(cols) }} data-id={node.id}>
          {node.children?.map((c) => (
            <div key={c.id} className={`grid-item ${colSpanClasses(c.layout?.colSpan)}`} data-id={c.id}>
              <RenderNode node={c} />
            </div>
          ))}
        </div>
      );
    }

    case "canvas": {
      const st = { ...nodeStyle(node), ...canvasHeightVars(node as any) } as React.CSSProperties;
      return (
        <div className="canvas" style={st} data-id={node.id}>
          {node.children?.map((c) => (
            <RenderNode key={c.id} node={c} />
          ))}
        </div>
      );
    }

    default: {
      const block = Blocks[node.type];
      const abs = node.layout?.abs;
      const wrapClass = abs ? "abs" : "";
      const st = { ...nodeStyle(node), ...absVars(node) } as React.CSSProperties;

      if (!block) return <div className={`unknown ${wrapClass}`} style={st} data-id={node.id}>{`Unknown block: ${node.type}`}</div>;

      return (
        <div className={`block ${wrapClass}`} style={st} data-id={node.id}>
          {block(node as any)}
        </div>
      );
    }
  }
}

const BASE_CSS = `
.page { font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; line-height: 1.4; }
.section { padding: var(--py, 48px) var(--px, 16px); }
.section .container { max-width: var(--mw, 1100px); margin: 0 auto; }
.grid { display: grid; grid-template-columns: repeat(var(--cols, 12), minmax(0, 1fr)); gap: var(--gap, 24px); align-items: start; }
.grid-item { grid-column: span 12; }
.col-span-12 { grid-column: span 12; }
.col-span-11 { grid-column: span 11; }
.col-span-10 { grid-column: span 10; }
.col-span-9 { grid-column: span 9; }
.col-span-8 { grid-column: span 8; }
.col-span-7 { grid-column: span 7; }
.col-span-6 { grid-column: span 6; }
.col-span-5 { grid-column: span 5; }
.col-span-4 { grid-column: span 4; }
.col-span-3 { grid-column: span 3; }
.col-span-2 { grid-column: span 2; }
.col-span-1 { grid-column: span 1; }

@media (min-width: 640px) {
  .sm\\:col-span-12 { grid-column: span 12; }
  .sm\\:col-span-11 { grid-column: span 11; }
  .sm\\:col-span-10 { grid-column: span 10; }
  .sm\\:col-span-9 { grid-column: span 9; }
  .sm\\:col-span-8 { grid-column: span 8; }
  .sm\\:col-span-7 { grid-column: span 7; }
  .sm\\:col-span-6 { grid-column: span 6; }
  .sm\\:col-span-5 { grid-column: span 5; }
  .sm\\:col-span-4 { grid-column: span 4; }
  .sm\\:col-span-3 { grid-column: span 3; }
  .sm\\:col-span-2 { grid-column: span 2; }
  .sm\\:col-span-1 { grid-column: span 1; }
}
@media (min-width: 768px) {
  .md\\:col-span-12 { grid-column: span 12; }
  .md\\:col-span-11 { grid-column: span 11; }
  .md\\:col-span-10 { grid-column: span 10; }
  .md\\:col-span-9 { grid-column: span 9; }
  .md\\:col-span-8 { grid-column: span 8; }
  .md\\:col-span-7 { grid-column: span 7; }
  .md\\:col-span-6 { grid-column: span 6; }
  .md\\:col-span-5 { grid-column: span 5; }
  .md\\:col-span-4 { grid-column: span 4; }
  .md\\:col-span-3 { grid-column: span 3; }
  .md\\:col-span-2 { grid-column: span 2; }
  .md\\:col-span-1 { grid-column: span 1; }
}
@media (min-width: 1024px) {
  .lg\\:col-span-12 { grid-column: span 12; }
  .lg\\:col-span-11 { grid-column: span 11; }
  .lg\\:col-span-10 { grid-column: span 10; }
  .lg\\:col-span-9 { grid-column: span 9; }
  .lg\\:col-span-8 { grid-column: span 8; }
  .lg\\:col-span-7 { grid-column: span 7; }
  .lg\\:col-span-6 { grid-column: span 6; }
  .lg\\:col-span-5 { grid-column: span 5; }
  .lg\\:col-span-4 { grid-column: span 4; }
  .lg\\:col-span-3 { grid-column: span 3; }
  .lg\\:col-span-2 { grid-column: span 2; }
  .lg\\:col-span-1 { grid-column: span 1; }
}

.canvas { position: relative; width: 100%; height: var(--cvh, 560px); border-radius: 18px; overflow: hidden; }
@media (min-width: 640px) { .canvas { height: var(--cvh-sm, var(--cvh, 560px)); } }
@media (min-width: 768px) { .canvas { height: var(--cvh-md, var(--cvh, 560px)); } }
@media (min-width: 1024px) { .canvas { height: var(--cvh-lg, var(--cvh, 560px)); } }

.abs { position: absolute; left: var(--x, 0px); top: var(--y, 0px); width: var(--w, auto); height: var(--h, auto); z-index: var(--z, 1); transform: rotate(var(--rot, 0deg)); }
@media (min-width: 640px) {
  .abs { left: var(--sm-x, var(--x, 0px)); top: var(--sm-y, var(--y, 0px)); width: var(--sm-w, var(--w, auto)); height: var(--sm-h, var(--h, auto)); z-index: var(--sm-z, var(--z, 1)); transform: rotate(var(--sm-rot, var(--rot, 0deg))); }
}
@media (min-width: 768px) {
  .abs { left: var(--md-x, var(--x, 0px)); top: var(--md-y, var(--y, 0px)); width: var(--md-w, var(--w, auto)); height: var(--md-h, var(--h, auto)); z-index: var(--md-z, var(--z, 1)); transform: rotate(var(--md-rot, var(--rot, 0deg))); }
}
@media (min-width: 1024px) {
  .abs { left: var(--lg-x, var(--x, 0px)); top: var(--lg-y, var(--y, 0px)); width: var(--lg-w, var(--w, auto)); height: var(--lg-h, var(--h, auto)); z-index: var(--lg-z, var(--z, 1)); transform: rotate(var(--lg-rot, var(--rot, 0deg))); }
}

.block { box-sizing: border-box; }
.hero { height: 100%; display: flex; flex-direction: column; justify-content: center; }
.hero h1 { font-size: clamp(32px, 4vw, 56px); margin: 0 0 12px; letter-spacing: -0.02em; }
.muted { opacity: .75; margin: 0 0 18px; font-size: 18px; }
.btn { display: inline-block; padding: 10px 14px; border-radius: 10px; border: 1px solid currentColor; text-decoration: none; }
.btnx { display: inline-block; }
.img { width: 100%; height: 100%; object-fit: cover; border-radius: 16px; display: block; }
.rich :first-child { margin-top: 0; }
.unknown { padding: 12px; border: 1px dashed #999; border-radius: 10px; background: rgba(255,255,255,.6); }
`;
