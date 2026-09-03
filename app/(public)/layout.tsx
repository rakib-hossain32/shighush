import { Footer } from "@/components/footer";
import { Header } from "@/components/header";

/**
 * `PageFrame` already renders the `<main>` landmark for every content page, so this
 * wrapper uses a plain `<div>`. Having both produced nested `<main>` elements on every
 * page that used `PageFrame` — invalid HTML, and two "main" landmarks for a screen reader.
 */
export default function PublicLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex-auto">{children}</div>
      <Footer />
    </div>
  );
}
