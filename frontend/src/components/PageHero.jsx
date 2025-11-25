import React from "react";

export default function PageHero({ eyebrow, title, description, stats = [], action }) {
  return (
    <div className="glass-card border-0 p-4 d-flex flex-wrap gap-4 align-items-center">
      <div>
        {eyebrow && <p className="text-muted mb-1">{eyebrow}</p>}
        <h3 className="mb-1">{title}</h3>
        {description && <small className="text-muted">{description}</small>}
      </div>
      {(stats?.length ?? 0) > 0 || action ? (
        <div className="ms-auto d-flex flex-wrap gap-4 align-items-center">
          {(stats || []).map((stat) => (
            <div key={stat.label}>
              <p className="text-muted mb-1">{stat.label}</p>
              <h4 className="mb-0">{stat.value}</h4>
            </div>
          ))}
          {action && <div>{action}</div>}
        </div>
      ) : null}
    </div>
  );
}
