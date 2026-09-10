import type { Metadata } from "next";
import { Outfit, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import ThemeToggle from "@/shared/components/ThemeToggle";
import { SessionProvider } from "next-auth/react";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "KopaWee+ | NYSC Companion App",
  description: "The proactive companion for Nigerian Corps Members — camp guides, PPA logbooks, accommodation, safety, and marketplace.",
};

// Blocking script injected before paint to prevent FOUC.
// Reads localStorage.kopawee_theme and applies .dark class synchronously.
const themeScript = `
(function() {
  try {
    var t = localStorage.getItem('kopawee_theme');
    var sys = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (t === 'dark' || (t === 'system' && sys) || (!t && sys)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  } catch(e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${outfit.variable} ${jakarta.variable} h-full antialiased`}
    >
      <head>
        {/* Blocking theme script — must run before body renders to prevent FOUC */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body suppressHydrationWarning className="min-h-full flex flex-col font-sans">
        <SessionProvider>
          {children}
        </SessionProvider>
        {/* Global floating theme toggle — fixed bottom-right on every page */}
        <div
          className="fixed bottom-6 right-6 z-[9999]"
          style={{ filter: "drop-shadow(0 4px 16px rgba(0,0,0,0.25))" }}
          aria-label="Theme toggle"
        >
          <ThemeToggle size="13px" />
        </div>
      </body>
    </html>
  );
}
