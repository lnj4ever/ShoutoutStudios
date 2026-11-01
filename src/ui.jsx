import React from "react";
import { TIERS, money } from "./catalog.js";
import markUrl from "./assets/logo-mark.webp";

export const go = (path) => {
  window.location.hash = path.startsWith("#") ? path : `#/${path.replace(/^\//, "")}`;
};

export function Link({ to, className, children, onClick, ...rest }) {
  return (
    <a href={`#/${to}`} className={className} onClick={onClick} {...rest}>
      {children}
    </a>
  );
}

export function Button({ to, variant = "primary", children, ...rest }) {
  const cls = `btn btn-${variant}`;
  if (to) return <Link to={to} className={cls} {...rest}>{children}</Link>;
  return <button className={cls} {...rest}>{children}</button>;
}

export function Wordmark({ compact }) {
  return (
    <span className={`wordmark${compact ? " compact" : ""}`} aria-label="Shoutout Studios">
      <img className="wm-mark" src={markUrl} alt="" width="44" height="44" />
      <span className="wm-text">
        <span className="wm-main">SHOUTOUT</span>
        <span className="wm-sub">STUDIOS</span>
      </span>
    </span>
  );
}

// Provenance seal. Placeholder geometry until the approved vector seal is supplied.
export function Seal({ size = 64, label = "OFFICIAL COLLECTIBLE", tone = "gold" }) {
  const id = `arc-${size}-${tone}`;
  return (
    <svg className={`seal seal-${tone}`} width={size} height={size} viewBox="0 0 100 100" role="img" aria-label={`Shoutout Studios ${label.toLowerCase()} seal`}>
      <defs>
        <path id={id} d="M50,50 m-36,0 a36,36 0 1,1 72,0 a36,36 0 1,1 -72,0" />
      </defs>
      <circle cx="50" cy="50" r="48" className="seal-ring" />
      <circle cx="50" cy="50" r="27" className="seal-core" />
      <text className="seal-arc">
        <textPath href={`#${id}`} startOffset="0">SHOUTOUT STUDIOS · {label} ·</textPath>
      </text>
      <text x="50" y="58" textAnchor="middle" className="seal-mono">SS</text>
    </svg>
  );
}

export function CardArt({ art, tier, size = "md" }) {
  const { school } = art;
  const limited = TIERS[tier]?.limited;
  const style = { "--c1": school.c1, "--c2": school.c2, "--focus": art.focus };
  if (art.kind === "poster") {
    return (
      <div className={`art art-poster art-${size}`} style={style} aria-hidden="true">
        <div className="poster-photo" />
        <div className="poster-type">
          <span className="poster-kicker">{school.school} {school.mascot} · {art.number}</span>
          <span className="poster-title">{art.title}</span>
          <span className="poster-line">{art.sport}{art.line ? ` · ${art.line}` : ""}</span>
        </div>
        <Seal size={size === "lg" ? 54 : 34} tone={limited ? "purple" : "gold"} />
      </div>
    );
  }
  if (art.kind === "frame") {
    return (
      <div className={`art art-frame art-${size}${limited ? " is-limited" : ""}`} style={style} aria-hidden="true">
        <div className="frame-mat">
          <div className="frame-photo" />
          <div className="frame-plate">
            {art.name} · #{art.number} · {school.school} {art.sport}
            {art.edition ? <em> · {art.edition}</em> : null}
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className={`art art-card art-${size}${limited ? " is-limited" : ""}`} style={style} aria-hidden="true">
      <div className="card-inner">
        <div className="card-photo" />
        <div className="card-band">
          <span className="card-name">{art.name}</span>
          <span className="card-meta">
            {school.school} {school.mascot}
            {art.pos ? ` · ${art.pos}` : ""}
            {art.number ? ` · #${art.number}` : ""}
          </span>
        </div>
        <span className="card-year">{art.year}</span>
        {art.edition ? <span className="card-edition">{art.edition}</span> : null}
        {art.signed ? <span className="card-sig">R. Shaw</span> : null}
        <div className="card-seal"><Seal size={size === "lg" ? 46 : 30} tone={limited ? "purple" : "gold"} /></div>
      </div>
      <span className="shine" />
    </div>
  );
}

export function TierBadge({ tier }) {
  const t = TIERS[tier];
  return <span className={`tier-badge${t.limited ? " limited" : ""}`}>{t.name}</span>;
}

export function ProductTile({ product }) {
  return (
    <Link to={`product/${product.id}`} className={`tile${TIERS[product.tier].limited ? " limited" : ""}`}>
      <div className="tile-art"><CardArt art={product.art} tier={product.tier} /></div>
      <div className="tile-body">
        <TierBadge tier={product.tier} />
        <h3>{product.name}</h3>
        <p>{product.tagline}</p>
        <span className="tile-price">
          {product.quote ? product.quote : <>{product.options.some((o) => o.values.length > 1) ? "From " : ""}{money(product.price)}</>}
          {product.unit ? <small> {product.unit}</small> : null}
          {product.later ? <small> · opens later</small> : null}
        </span>
      </div>
    </Link>
  );
}

export function SectionHead({ eyebrow, title, children, center }) {
  return (
    <div className={`section-head${center ? " center" : ""}`}>
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <h2>{title}</h2>
      {children ? <p className="lede">{children}</p> : null}
    </div>
  );
}
