import { useEffect } from "react";

const ACCENT_PALETTES = [
  {
    from: "var(--accent-500)",
    to: "rgba(236, 72, 153, 0.9)",
    shadow: "0 25px 55px rgba(236, 72, 153, 0.22)"
  },
  {
    from: "var(--brand-sky)",
    to: "rgba(14, 165, 233, 0.9)",
    shadow: "0 25px 55px rgba(14, 165, 233, 0.2)"
  },
  {
    from: "rgba(99, 102, 241, 0.95)",
    to: "var(--brand-navy)",
    shadow: "0 25px 55px rgba(32, 63, 117, 0.2)"
  },
  {
    from: "var(--teal-500)",
    to: "rgba(94, 234, 212, 0.9)",
    shadow: "0 25px 55px rgba(20, 184, 166, 0.2)"
  }
];

const TARGETS = [
  {
    selector: ".glass-card",
    radius: "24px",
    background: "linear-gradient(165deg, rgba(255,255,255,0.98), rgba(248,249,255,0.87))",
    priority: "specific"
  },
  {
    selector: ".card-surface",
    radius: "22px",
    background: "linear-gradient(165deg, rgba(255,255,255,0.96), rgba(247,249,255,0.85))",
    priority: "specific"
  },
  {
    selector: ".sidebar-card",
    radius: "24px",
    background: "linear-gradient(180deg, rgba(255,255,255,0.97), rgba(247,247,255,0.88))",
    priority: "specific"
  },
  {
    selector: ".table-card",
    radius: "22px",
    background: "rgba(255,255,255,0.97)",
    priority: "specific",
    extraStyles: { overflow: "hidden" }
  },
  {
    selector: ".history-card",
    radius: "22px",
    background: "linear-gradient(165deg, rgba(255,255,255,0.98), rgba(255,247,252,0.9))",
    priority: "specific"
  },
  {
    selector: ".role-card",
    radius: "22px",
    background: "linear-gradient(165deg, rgba(255,255,255,0.98), rgba(247,249,255,0.9))",
    priority: "specific"
  },
  {
    selector: ".course-card",
    radius: "22px",
    background: "linear-gradient(165deg, rgba(255,255,255,0.98), rgba(247,249,255,0.9))",
    priority: "specific"
  },
  {
    selector: ".card",
    radius: "22px",
    background: "linear-gradient(165deg, rgba(255,255,255,0.99), rgba(247,249,255,0.88))",
    priority: "fallback"
  }
];

// Aplica gradientes y bordes combinando la paleta seleccionada con la configuración del target.
const decorate = (element, palette, options) => {
  const { radius, background, borderWidth = "2px", extraStyles } = options;

  element.style.borderRadius = radius || "22px";
  element.style.border = `${borderWidth} solid transparent`;
  element.style.borderImageSlice = 1;
  element.style.borderImageSource = `linear-gradient(120deg, ${palette.from}, ${palette.to})`;
  element.style.borderColor = palette.to;
  element.style.background = background || element.style.background;
  element.style.boxShadow = palette.shadow;

  if (extraStyles) {
    Object.entries(extraStyles).forEach(([prop, value]) => {
      element.style[prop] = value;
    });
  }
};

// Hook visual que pinta bordes/accentos adaptativos en tarjetas y superficies.
export default function useSurfaceAccents() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const root = document.getElementById("root");
    if (!root) return;

    let frame = null;

    const applyAccents = () => {
      frame = null;
      TARGETS.forEach((targetConfig, targetIndex) => {
        const nodes = root.querySelectorAll(targetConfig.selector);
        nodes.forEach((node, nodeIndex) => {
          if (
            targetConfig.priority === "fallback" &&
            node.dataset.accentPriority === "specific"
          ) {
            return;
          }

          const palette = ACCENT_PALETTES[(targetIndex + nodeIndex) % ACCENT_PALETTES.length];
          decorate(node, palette, targetConfig);

          if (targetConfig.priority === "specific") {
            node.dataset.accentPriority = "specific";
          } else if (!node.dataset.accentPriority) {
            node.dataset.accentPriority = "fallback";
          }
        });
      });
    };

    // Agrupa múltiples cambios en el mismo frame para evitar repaints innecesarios.
    const schedule = () => {
      if (frame) return;
      frame = requestAnimationFrame(applyAccents);
    };

    schedule();

    const observer = new MutationObserver(schedule);
    observer.observe(root, { childList: true, subtree: true });

    window.addEventListener("resize", schedule);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", schedule);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);
}
