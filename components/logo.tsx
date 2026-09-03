import type React from "react";

type LogoProps = React.ComponentProps<"svg">;

/** The standalone mark: a protected public record with a verified entry. */
export function LogoIcon(props: LogoProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      <path
        d="M24 3.5 41 9.7v12.1c0 10.7-6.7 18.8-17 22.7C13.7 40.6 7 32.5 7 21.8V9.7L24 3.5Z"
        fill="currentColor"
      />
      <path d="M16 12.5h12.8l4.2 4.2v15.8H16V12.5Z" fill="var(--background)" />
      <path
        d="M28.8 12.5v4.3h4.2"
        stroke="var(--primary)"
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
      <path
        d="m19.6 23.2 2.7 2.7 5.8-6.1"
        stroke="var(--primary)"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19.6 29.3h9.1"
        stroke="var(--secondary)"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Primary wordmark used in the header and footer. */
export function Logo(props: LogoProps) {
  return (
    <svg
      viewBox="0 0 192 48"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="শিঘুষ"
      {...props}
    >
      <g transform="translate(1 1)">
        <LogoIcon width="46" height="46" />
      </g>
      <text
        x="59"
        y="29"
        fill="currentColor"
        fontFamily="var(--font-bangla), sans-serif"
        fontSize="25"
        fontWeight="800"
        letterSpacing="-.75"
      >
        শিঘুষ
      </text>
      <text
        x="60"
        y="41"
        fill="currentColor"
        fillOpacity=".62"
        fontFamily="var(--font-bangla), sans-serif"
        fontSize="7.2"
        fontWeight="700"
        letterSpacing="1.2"
      >
        নাগরিক নথি · শিবচর
      </text>
    </svg>
  );
}
