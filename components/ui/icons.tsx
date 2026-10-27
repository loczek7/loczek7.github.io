// Inline SVG icons from the prototype (stroke-based, 24x24 viewBox).
type IconProps = { size?: number };

function Icon({ size = 22, d }: IconProps & { d: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={d} />
    </svg>
  );
}

export function MenuIcon({ size = 22 }: IconProps) {
  return <Icon size={size} d="M4 7h16M4 12h16M4 17h16" />;
}

export function CloseIcon({ size = 20 }: IconProps) {
  return <Icon size={size} d="M6 6l12 12M18 6L6 18" />;
}

export function DownloadIcon({ size = 18 }: IconProps) {
  return <Icon size={size} d="M12 4v11M7 11l5 5 5-5M5 20h14" />;
}

export function ArrowRightIcon({ size = 18 }: IconProps) {
  return <Icon size={size} d="M5 12h14M13 6l6 6-6 6" />;
}
