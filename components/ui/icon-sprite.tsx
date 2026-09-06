export function IconSprite() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" style={{ display: "none" }} aria-hidden="true">
      <defs>
        <symbol id="i-logo" viewBox="0 0 40 44">
          <path d="M3 3h27v28H18L7 41V31H3V3Z" fill="var(--foreground)" />
          <path d="M11 11h12v3H11zm0 7h9v3h-9z" fill="var(--background)" />
          <path d="M30 3h7v20h-7z" fill="var(--primary)" />
        </symbol>

        <symbol id="i-arrow-up-right" viewBox="0 0 24 24">
          <path d="M7 17 17 7M6 7h11v11" />
        </symbol>

        <symbol id="i-arrow-right" viewBox="0 0 24 24">
          <path d="M4 12h16m-6-6 6 6-6 6" />
        </symbol>

        <symbol id="i-arrow-down" viewBox="0 0 24 24">
          <path d="M12 4v16m-6-6 6 6 6-6" />
        </symbol>

        <symbol id="i-search" viewBox="0 0 24 24">
          <circle cx="10.5" cy="10.5" r="6.5" />
          <path d="m16 16 5 5" />
        </symbol>

        {/* Shield WITH checkmark inside — two paths required */}
        <symbol id="i-shield" viewBox="0 0 24 24">
          <path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6l8-3Z" />
          <path d="m8.5 12 2.5 2.5 4.5-5" />
        </symbol>

        <symbol id="i-file" viewBox="0 0 24 24">
          <path d="M13 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V10Z" />
          <path d="M13 3v7h7M8 14h8m-8 3h5" />
        </symbol>

        <symbol id="i-clip" viewBox="0 0 24 24">
          <path d="m8 13 6-6a3 3 0 0 1 4.2 4.2L10 19.4a5 5 0 0 1-7.1-7.1L12 3.2a6 6 0 0 1 8.5 8.5L12 20" />
        </symbol>

        <symbol id="i-lock" viewBox="0 0 24 24">
          <rect x="5" y="10" width="14" height="11" rx="2" />
          <path d="M8 10V7a4 4 0 0 1 8 0v3m-4 5v2" />
        </symbol>

        <symbol id="i-check" viewBox="0 0 24 24">
          <path d="m5 12 4 4L19 6" />
        </symbol>

        <symbol id="i-plus" viewBox="0 0 24 24">
          <path d="M12 5v14M5 12h14" />
        </symbol>

        <symbol id="i-close" viewBox="0 0 24 24">
          <path d="m6 6 12 12M6 18 18 6" />
        </symbol>

        <symbol id="i-menu" viewBox="0 0 24 24">
          <path d="M4 7h16M4 12h16M4 17h16" />
        </symbol>

        <symbol id="i-moon" viewBox="0 0 24 24">
          <path d="M20.4 13.1A8.5 8.5 0 0 1 10.9 3.6 8.5 8.5 0 1 0 20.4 13.1Z" />
        </symbol>

        <symbol id="i-sun" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5" />
        </symbol>

        <symbol id="i-download" viewBox="0 0 24 24">
          <path d="M12 3v12m-4-4 4 4 4-4M5 15v5h14v-5" />
        </symbol>

        <symbol id="i-copy" viewBox="0 0 24 24">
          <rect x="9" y="9" width="12" height="12" rx="2" />
          <path d="M15 9V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h4" />
        </symbol>

        <symbol id="i-info" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 11v6m0-10v.5" />
        </symbol>

        <symbol id="i-folder" viewBox="0 0 24 24">
          <path d="M3 7V5a2 2 0 0 1 2-2h5l2 3h7a2 2 0 0 1 2 2v2M3 7h8l2 3h8l-3 11H3V7Z" />
        </symbol>

        <symbol id="i-upload" viewBox="0 0 24 24">
          <path d="M12 16V3m-5 5 5-5 5 5M4 16v5h16v-5" />
        </symbol>
      </defs>
    </svg>
  );
}
