import React from "react";

// Big Exposure Athletics social accounts.
export const SOCIALS = [
  { id: "instagram", label: "Instagram", handle: "@bigexposureathletics", url: "https://www.instagram.com/bigexposureathletics" },
  { id: "tiktok", label: "TikTok", handle: "@bigexposureathletics", url: "https://www.tiktok.com/@bigexposureathletics" },
  { id: "facebook", label: "Facebook", handle: "Big Exposure Athletics", url: "https://www.facebook.com/share/19ykwXyNGU/" },
  { id: "youtube", label: "YouTube", handle: "@bigexposureathletics", url: "https://www.youtube.com/@bigexposureathletics" },
];

const PATHS = {
  instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="1.9" />
      <circle cx="12" cy="12" r="4.2" fill="none" stroke="currentColor" strokeWidth="1.9" />
      <circle cx="17.4" cy="6.6" r="1.2" fill="currentColor" />
    </>
  ),
  tiktok: <path fill="currentColor" d="M16.6 5.8A4.3 4.3 0 0 1 15.5 3h-3v12.4a2.6 2.6 0 1 1-2.6-2.6c.3 0 .5 0 .8.1V9.8a5.7 5.7 0 1 0 4.8 5.6V9.1a7.3 7.3 0 0 0 4.2 1.3V7.4a4.3 4.3 0 0 1-3.1-1.6Z" />,
  facebook: (
    <>
      <circle cx="12" cy="12" r="10" fill="currentColor" />
      <path fill="var(--icon-cut, #1a1714)" d="M13.4 21.9V14.6h2.3l.4-2.8h-2.7v-1.8c0-.8.3-1.4 1.4-1.4h1.4V6.1a18 18 0 0 0-2.1-.1c-2.1 0-3.5 1.3-3.5 3.6v2.2H8.3v2.8h2.3v7.3Z" />
    </>
  ),
  youtube: (
    <>
      <rect x="2" y="5" width="20" height="14" rx="4" fill="currentColor" />
      <path fill="var(--icon-cut, #1a1714)" d="M10 9v6l5.2-3L10 9Z" />
    </>
  ),
};

export function SocialIcon({ id, size = 20 }) {
  return (
    <svg className="social-icon" width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      {PATHS[id]}
    </svg>
  );
}

// variant "buttons": labeled buttons (page CTAs). variant "icons": compact icon row (strips, footer).
export function SocialLinks({ variant = "icons", className = "" }) {
  return (
    <ul className={`socials socials-${variant} ${className}`.trim()} aria-label="Big Exposure Athletics on social media">
      {SOCIALS.map((s) => (
        <li key={s.id}>
          <a href={s.url} target="_blank" rel="noopener noreferrer" aria-label={variant === "icons" ? `Big Exposure Athletics on ${s.label}` : undefined}>
            <SocialIcon id={s.id} size={variant === "icons" ? 20 : 18} />
            {variant === "buttons" ? <span>{s.label}</span> : null}
          </a>
        </li>
      ))}
    </ul>
  );
}
