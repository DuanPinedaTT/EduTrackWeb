import React from "react";
import { Card } from "react-bootstrap";

export default function StatsCard({ title, value, icon, color = "primary", loading = false }) {
  return (
    <Card className="card-surface mb-3" style={{ borderLeft: `4px solid var(--${color}-color)` }}>
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <p className="text-muted mb-1" style={{ fontSize: "0.85rem" }}>
              {title}
            </p>
            <h3 className="mb-0">
              {loading ? (
                <span className="text-muted">—</span>
              ) : (
                value
              )}
            </h3>
          </div>
          {icon && (
            <div className="text-muted" style={{ fontSize: "2.2rem", opacity: 0.28 }}>
              {icon}
            </div>
          )}
        </div>
      </Card.Body>
    </Card>
  );
}
