import React, { useEffect, useMemo, useRef, useState } from "react";
import { RenderPage, EMPTY_PAGE, type PageNode, type Node, type AbsRect } from "./render-page";

function uid(prefix = "id") {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

function deepClone<T>(v: T): T {
  if (typeof structuredClone === "function") return structuredClone(v);
  return JSON.parse(JSON.stringify(v));
}

function ensureSectionAndCanvas(page: PageNode): PageNode {
  const next = deepClone(page);

  let section = next.children?.find((n) => n.type === "section") as any;
  if (!section) {
    section = { type: "section", id: uid("section"), layout: { paddingY: 24, maxWidth: 1200 }, children: [] };
    next.children = [...(next.children ?? []), section];
  }

  let canvas = section.children?.find((n: any) => n.type === "canvas") as any;
  if (!canvas) {
    canvas = { type: "canvas", id: uid("canvas"), layout: { canvasHeight: { sm: 720, md: 560 } }, children: [] };
    section.children = [...(section.children ?? []), canvas];
  }

  return next;
}

function addToCanvas(page: PageNode, block: Node): PageNode {
  const next = ensureSectionAndCanvas(page);
  const section = next.children?.find((n) => n.type === "section") as any;
  const canvas = section.children?.find((n: any) => n.type === "canvas") as any;
  canvas.children = [...(canvas.children ?? []), block];
  return next;
}

function getCanvasNode(page: PageNode) {
  const section = page.children?.find((n) => n.type === "section") as any;
  const canvas = section?.children?.find((n: any) => n.type === "canvas") as any;
  return canvas as (Node & { type: "canvas" }) | undefined;
}

function flatten(page: PageNode): Node[] {
  const out: Node[] = [];
  const walk = (n: Node) => {
    out.push(n);
    n.children?.forEach(walk);
  };
  page.children?.forEach(walk as any);
  return out;
}

function updateNodeById(page: PageNode, id: string, fn: (n: any) => void): PageNode {
  const next = deepClone(page);
  const walk = (n: any) => {
    if (n.id === id) fn(n);
    n.children?.forEach(walk);
  };
  next.children?.forEach(walk);
  return next;
}

function getAbs(n: any): AbsRect {
  const abs = n?.layout?.abs;
  if (!abs) return { x: 0, y: 0, w: 200, h: 80, z: 1, rotate: 0 };
  if (abs && typeof abs === "object" && "x" in abs) return abs as AbsRect;
  const candidate = (abs as any).md ?? (abs as any).sm ?? (abs as any).lg;
  if (candidate) return candidate as AbsRect;
  return { x: 0, y: 0, w: 200, h: 80, z: 1, rotate: 0 };
}

function setAbsForAllBreakpoints(n: any, rect: AbsRect) {
  n.layout = n.layout ?? {};
  n.layout.abs = { sm: rect, md: rect, lg: rect };
}

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

export default function Builder() {
  const [page, setPage] = useState<PageNode>(() => ensureSectionAndCanvas(EMPTY_PAGE));
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const nodes = useMemo(() => flatten(page), [page]);
  const selected = selectedId ? nodes.find((n) => n.id === selectedId) : null;

  const previewRef = useRef<HTMLDivElement | null>(null);

  const canvasId = useMemo(() => getCanvasNode(page)?.id ?? null, [page]);
  const canvasElRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!previewRef.current || !canvasId) return;
    const el = previewRef.current.querySelector(`[data-id="${canvasId}"]`) as HTMLElement | null;
    canvasElRef.current = el;
  }, [canvasId, page]);

  const dragRef = useRef<{
    id: string;
    startMouseX: number;
    startMouseY: number;
    startX: number;
    startY: number;
    canvasLeft: number;
    canvasTop: number;
    canvasW: number;
    canvasH: number;
  } | null>(null);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const d = dragRef.current;
      if (!d) return;
      e.preventDefault();

      const dx = e.clientX - d.startMouseX;
      const dy = e.clientY - d.startMouseY;

      const nextX = clamp(d.startX + dx, 0, d.canvasW - 10);
      const nextY = clamp(d.startY + dy, 0, d.canvasH - 10);

      setPage((p) =>
        updateNodeById(p, d.id, (n) => {
          const cur = getAbs(n);
          const rect = { ...cur, x: Math.round(nextX), y: Math.round(nextY) };
          setAbsForAllBreakpoints(n, rect);
        })
      );
    };

    const onUp = () => {
      dragRef.current = null;
    };

    window.addEventListener("pointermove", onMove, { passive: false });
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove as any);
      window.removeEventListener("pointerup", onUp as any);
    };
  }, []);

  const startDrag = (id: string, e: React.PointerEvent) => {
    const canvasEl = canvasElRef.current;
    if (!canvasEl) return;

    const canvasRect = canvasEl.getBoundingClientRect();
    const nodeEl = previewRef.current?.querySelector(`[data-id="${id}"]`) as HTMLElement | null;
    if (!nodeEl) return;

    const n = nodes.find((x) => x.id === id) as any;
    if (!n) return;

    const abs = getAbs(n);

    dragRef.current = {
      id,
      startMouseX: e.clientX,
      startMouseY: e.clientY,
      startX: abs.x,
      startY: abs.y,
      canvasLeft: canvasRect.left,
      canvasTop: canvasRect.top,
      canvasW: canvasRect.width,
      canvasH: canvasRect.height,
    };

    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const addHero = () => {
    const id = uid("hero");
    setPage((p) =>
      addToCanvas(p, {
        type: "hero",
        id,
        layout: {
          abs: {
            sm: { x: 16, y: 24, w: 343, h: 220, z: 2, rotate: 0 },
            md: { x: 24, y: 40, w: 640, h: 240, z: 2, rotate: 0 },
          },
        },
        props: { title: "Título", subtitle: "Subtítulo", ctaLabel: "CTA", ctaHref: "#cta" },
      } as any)
    );
    setSelectedId(id);
  };

  const addImage = () => {
    const id = uid("img");
    setPage((p) =>
      addToCanvas(p, {
        type: "image",
        id,
        layout: {
          abs: {
            sm: { x: 16, y: 270, w: 343, h: 260, z: 1, rotate: 0 },
            md: { x: 720, y: 40, w: 432, h: 360, z: 1, rotate: 0 },
          },
        },
        props: { src: "https://picsum.photos/1200/900", alt: "Imagem" },
      } as any)
    );
    setSelectedId(id);
  };

  const addButton = () => {
    const id = uid("btn");
    setPage((p) =>
      addToCanvas(p, {
        type: "button",
        id,
        layout: {
          abs: {
            sm: { x: 16, y: 560, w: 343, h: 52, z: 3, rotate: 0 },
            md: { x: 24, y: 320, w: 220, h: 52, z: 3, rotate: 0 },
          },
        },
        props: {
          label: "Botão",
          href: "#",
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
      } as any)
    );
    setSelectedId(id);
  };

  const setSelectedAbs = (patch: Partial<AbsRect>) => {
    if (!selectedId) return;
    setPage((p) =>
      updateNodeById(p, selectedId, (n) => {
        const cur = getAbs(n);
        const next = { ...cur, ...patch };
        setAbsForAllBreakpoints(n, next);
      })
    );
  };

  const updateSelectedProps = (patch: Record<string, any>) => {
    if (!selectedId) return;
    setPage((p) =>
      updateNodeById(p, selectedId, (n) => {
        n.props = n.props ?? {};
        Object.assign(n.props, patch);
      })
    );
  };

  const updateSelectedButtonStyle = (patch: Record<string, any>) => {
    if (!selectedId) return;
    setPage((p) =>
      updateNodeById(p, selectedId, (n) => {
        n.props = n.props ?? {};
        n.props.style = n.props.style ?? {};
        Object.assign(n.props.style, patch);
      })
    );
  };

  const removeSelected = () => {
    if (!selectedId) return;
    setPage((p) => {
      const next = deepClone(p);
      const canvas = getCanvasNode(next) as any;
      if (!canvas?.children) return next;
      canvas.children = canvas.children.filter((c: any) => c.id !== selectedId);
      return next;
    });
    setSelectedId(null);
  };

  const canvasChildren = useMemo(() => {
    const canvas = getCanvasNode(page) as any;
    return (canvas?.children ?? []) as Node[];
  }, [page]);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "360px 1fr", minHeight: "calc(100vh - 120px)" }}>
      <div style={{ padding: 16, borderRight: "1px solid #ddd", overflow: "auto" }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
          <button onClick={addHero}>+ Hero</button>
          <button onClick={addImage}>+ Imagem</button>
          <button onClick={addButton}>+ Button</button>
          <button onClick={removeSelected} disabled={!selectedId}>
            Remover
          </button>
        </div>

        <div style={{ marginBottom: 12 }}>
          <div style={{ fontWeight: 700, marginBottom: 6 }}>Selecionar</div>
          <select style={{ width: "100%", padding: 8 }} value={selectedId ?? ""} onChange={(e) => setSelectedId(e.target.value || null)}>
            <option value="">(nenhum)</option>
            {canvasChildren.map((b) => (
              <option key={b.id} value={b.id}>
                {b.type} — {b.id}
              </option>
            ))}
          </select>
        </div>

        {selected ? (
          <div style={{ display: "grid", gap: 10 }}>
            <div style={{ fontWeight: 700 }}>Bloco: {selected.type}</div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              <label>
                X
                <input type="number" value={getAbs(selected as any).x} onChange={(e) => setSelectedAbs({ x: Number(e.target.value) })} style={{ width: "100%" }} />
              </label>
              <label>
                Y
                <input type="number" value={getAbs(selected as any).y} onChange={(e) => setSelectedAbs({ y: Number(e.target.value) })} style={{ width: "100%" }} />
              </label>
              <label>
                W
                <input type="number" value={getAbs(selected as any).w} onChange={(e) => setSelectedAbs({ w: Number(e.target.value) })} style={{ width: "100%" }} />
              </label>
              <label>
                H
                <input type="number" value={getAbs(selected as any).h} onChange={(e) => setSelectedAbs({ h: Number(e.target.value) })} style={{ width: "100%" }} />
              </label>
              <label>
                Z
                <input type="number" value={getAbs(selected as any).z ?? 1} onChange={(e) => setSelectedAbs({ z: Number(e.target.value) })} style={{ width: "100%" }} />
              </label>
              <label>
                Rot
                <input type="number" value={getAbs(selected as any).rotate ?? 0} onChange={(e) => setSelectedAbs({ rotate: Number(e.target.value) })} style={{ width: "100%" }} />
              </label>
            </div>

            {selected.type === "hero" ? (
              <>
                <label>
                  Título
                  <input value={(selected as any).props?.title ?? ""} onChange={(e) => updateSelectedProps({ title: e.target.value })} style={{ width: "100%" }} />
                </label>
                <label>
                  Subtítulo
                  <input value={(selected as any).props?.subtitle ?? ""} onChange={(e) => updateSelectedProps({ subtitle: e.target.value })} style={{ width: "100%" }} />
                </label>
              </>
            ) : null}

            {selected.type === "image" ? (
              <>
                <label>
                  src
                  <input value={(selected as any).props?.src ?? ""} onChange={(e) => updateSelectedProps({ src: e.target.value })} style={{ width: "100%" }} />
                </label>
                <label>
                  alt
                  <input value={(selected as any).props?.alt ?? ""} onChange={(e) => updateSelectedProps({ alt: e.target.value })} style={{ width: "100%" }} />
                </label>
              </>
            ) : null}

            {selected.type === "button" ? (
              <>
                <label>
                  Label
                  <input value={(selected as any).props?.label ?? ""} onChange={(e) => updateSelectedProps({ label: e.target.value })} style={{ width: "100%" }} />
                </label>
                <label>
                  Href
                  <input value={(selected as any).props?.href ?? ""} onChange={(e) => updateSelectedProps({ href: e.target.value })} style={{ width: "100%" }} />
                </label>
                <label>
                  Target
                  <select value={(selected as any).props?.target ?? "_self"} onChange={(e) => updateSelectedProps({ target: e.target.value })} style={{ width: "100%", padding: 8 }}>
                    <option value="_self">_self</option>
                    <option value="_blank">_blank</option>
                  </select>
                </label>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  <label>
                    BG
                    <input value={(selected as any).props?.style?.bg ?? ""} onChange={(e) => updateSelectedButtonStyle({ bg: e.target.value })} style={{ width: "100%" }} />
                  </label>
                  <label>
                    Color
                    <input value={(selected as any).props?.style?.color ?? ""} onChange={(e) => updateSelectedButtonStyle({ color: e.target.value })} style={{ width: "100%" }} />
                  </label>
                  <label>
                    Radius
                    <input type="number" value={(selected as any).props?.style?.radius ?? 10} onChange={(e) => updateSelectedButtonStyle({ radius: Number(e.target.value) })} style={{ width: "100%" }} />
                  </label>
                  <label>
                    FontWeight
                    <input type="number" value={(selected as any).props?.style?.fontWeight ?? 600} onChange={(e) => updateSelectedButtonStyle({ fontWeight: Number(e.target.value) })} style={{ width: "100%" }} />
                  </label>
                </div>

                <label>
                  cssRaw (sem chaves)
                  <textarea value={(selected as any).props?.cssRaw ?? ""} onChange={(e) => updateSelectedProps({ cssRaw: e.target.value })} style={{ width: "100%", minHeight: 110 }} />
                </label>
              </>
            ) : null}
          </div>
        ) : (
          <div style={{ opacity: 0.7 }}>Selecione um bloco no preview ou no dropdown.</div>
        )}

        <div style={{ marginTop: 14 }}>
          <div style={{ fontWeight: 700, marginBottom: 6 }}>JSON</div>
          <pre style={{ fontSize: 12, background: "#f6f6f6", padding: 12, overflow: "auto", maxHeight: 280 }}>{JSON.stringify(page, null, 2)}</pre>
        </div>
      </div>

      <div style={{ padding: 16 }}>
        <div style={{ marginBottom: 10, opacity: 0.7 }}>Clique em um bloco e arraste para mover. (MVP: move X/Y e mantém no canvas)</div>

        <div
          ref={previewRef}
          onPointerDown={(e) => {
            const target = e.target as HTMLElement;
            const blockEl = target.closest("[data-id]") as HTMLElement | null;
            if (!blockEl) return;

            const id = blockEl.getAttribute("data-id");
            if (!id) return;

            const n = nodes.find((x) => x.id === id);
            if (!n) return;

            if (n.type === "section" || n.type === "canvas") return;

            setSelectedId(id);
            startDrag(id, e);
          }}
          style={{ userSelect: "none" }}
        >
          <RenderPage page={page} />
        </div>
      </div>
    </div>
  );
}
