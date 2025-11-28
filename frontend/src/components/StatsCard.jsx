import React from "react";
import { Card } from "react-bootstrap";

const COLOR_TOKENS = {
  primary: {
    fg: "var(--brand-navy)",
    bg: "rgba(32, 63, 117, 0.15)"
  },
  secondary: {
    fg: "var(--brand-sky)",
    bg: "rgba(106, 180, 221, 0.18)"
  },
  accent: {
    fg: "var(--accent-500)",
    bg: "rgba(244, 114, 182, 0.18)"
  }
};

export default function StatsCard({ title, value, icon, color = "primary", loading = false }) {
  const palette = COLOR_TOKENS[color] || COLOR_TOKENS.primary;

  return (
    <Card className="card-surface mb-3" data-card-accent={color}>
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <span
              className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill mb-2"
              style={{
                background: palette.bg,
                color: palette.fg,
                fontSize: "0.75rem",
                fontWeight: 600
              }}
            >
              <span style={{ width: 8, height: 8, borderRadius: "999px", background: palette.fg }} />
              {title}
            </span>
            <h3 className="mb-0">
              {loading ? (
                <span className="text-muted">—</span>
              ) : (
                value
              )}
            </h3>
          </div>
          {icon && (
            <div
              className="text-muted"
              style={{ fontSize: "2.2rem", opacity: 0.22, color: palette.fg }}
            >
              {icon}
            </div>
          )}
        </div>
      </Card.Body>
    </Card>
  );
}
