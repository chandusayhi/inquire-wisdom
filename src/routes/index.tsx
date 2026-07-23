import { createFileRoute } from "@tanstack/react-router";
import { ChatWindow } from "@/components/chat-window";
import kleLogo from "@/assets/kle-logo.png";
import collegeLogo from "@/assets/college-logo.png";
import heroBg from "@/assets/hero-bg.jpg";
import { Toaster } from "@/components/ui/sonner";

const COLLEGE_NAME = "KLE Society's GH BCA College, Haveri";
const COLLEGE_TAGLINE = "Learn · To · Progress";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: `${COLLEGE_NAME} — AI Assistant` },
      {
        name: "description",
        content: `Chat with the official AI assistant of ${COLLEGE_NAME}. Get instant answers about our college, admissions guidance and student life.`,
      },
      { property: "og:title", content: `${COLLEGE_NAME} — AI Assistant` },
      {
        property: "og:description",
        content: `Ask the ${COLLEGE_NAME} AI assistant anything — from campus life to academics.`,
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      {/* Ambient background */}
      <div
        aria-hidden
        className="absolute inset-0 hero-aurora"
      />
      <div
        aria-hidden
        className="absolute inset-0 opacity-30 mix-blend-screen"
        style={{
          backgroundImage: `url(${heroBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      {/* Floating orbs */}
      <div
        aria-hidden
        className="orb h-96 w-96"
        style={{
          top: "-8rem",
          left: "-6rem",
          background:
            "radial-gradient(circle, oklch(0.78 0.14 82 / 0.55), transparent 70%)",
        }}
      />
      <div
        aria-hidden
        className="orb h-[28rem] w-[28rem]"
        style={{
          bottom: "-10rem",
          right: "-8rem",
          background:
            "radial-gradient(circle, oklch(0.5 0.18 260 / 0.6), transparent 70%)",
          animationDelay: "-4s",
        }}
      />
      {/* Grid overlay */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex-1 px-4 pb-10 pt-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <div className="mb-8 text-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-surface px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                AI That Never Sleeps . Your Campus AI Assistant
              </span>
              <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
                Meet the <span className="gold-text">College AI</span> Assistant
              </h1>
              <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
                Your friendly guide to {COLLEGE_NAME}. Ask a question below and
                get answers in seconds — powered by Lovable AI.
              </p>
            </div>

            <ChatWindow />
          </div>
        </main>
        <SiteFooter />
      </div>
      <Toaster />
    </div>
  );
}

function SiteHeader() {
  return (
    <header className="glass-panel sticky top-3 z-20 mx-3 mt-3 rounded-2xl px-4 py-3 sm:mx-6 sm:px-6">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
        <img
          src={kleLogo}
          alt="KLE Educational Society logo"
          width={56}
          height={56}
          className="h-12 w-12 shrink-0 rounded-full bg-white/95 p-1 shadow-md sm:h-14 sm:w-14"
        />

        <div className="min-w-0 flex-1 text-center">
          <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-primary/80 sm:text-xs">
            KLE SOCIETY's
          </p>
          <h2 className="truncate font-display text-base font-bold tracking-tight text-foreground sm:text-xl md:text-2xl">
            {COLLEGE_NAME}
          </h2>
          <p className="hidden text-[10px] italic tracking-wide text-muted-foreground sm:block sm:text-xs">
            {COLLEGE_TAGLINE}
          </p>
        </div>

        <img
          src={collegeLogo}
          alt={`${COLLEGE_NAME} logo`}
          width={56}
          height={56}
          className="h-12 w-12 shrink-0 rounded-full bg-white/95 p-1 shadow-md sm:h-14 sm:w-14"
        />
      </div>
    </header>
  );
}

function SiteFooter() {
  return (
    <footer className="border-t border-border/40 px-6 py-6 text-center text-xs text-muted-foreground">
      <p>
        © {new Date().getFullYear()} {COLLEGE_NAME} · Built with care · Powered
        by KLE Team
      </p>
    </footer>
  );
}
