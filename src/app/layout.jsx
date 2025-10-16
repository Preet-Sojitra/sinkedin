import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { UserProvider } from "@/contexts/UserContext";
import Header from "@/components/Header";
import { cookies } from "next/headers";

const siteUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
export const metadata = {
  title: "Sinkedin: Professional Fails & Career Despair",
  description:
    "The brutally honest, hilariously real anti-professional network. Share job rejection stories, epic interview fails, and career disasters. It's schadenfreude, but for work.",
  // Uncomment when pushin to production
  // keywords: [
  //   "career failure",
  //   "job rejection",
  //   "interview fail",
  //   "layoff stories",
  //   "startup crash",
  //   "professional fuckups",
  //   "work humor",
  //   "dark humor",
  //   "bad boss stories",
  //   "toxic workplace",
  //   "LinkedIn alternative",
  //   "career despair",
  // ],
  // robots: {
  //   // Rules for search engine crawlers
  //   index: true,
  //   follow: true,
  //   googleBot: {
  //     index: true,
  //     follow: true,
  //     "max-video-preview": -1,
  //     "max-image-preview": "large",
  //     "max-snippet": -1,
  //   },
  // },
  // metadataBase: new URL(siteUrl), // Required for absolute URLs in Open Graph
  // openGraph: {
  //   title: "Sinkedin: Professional Fails & Career Despair",
  //   description:
  //     "The LinkedIn antithesis. Share your glorious failures and laugh at the chaos of corporate life.",
  //   url: siteUrl,
  //   siteName: "Sinkedin",
  //   // images: [
  //   //   {
  //   //     url: "/og-image.png", // MUST create this image and place it in your `public` folder
  //   //     width: 1200,
  //   //     height: 630,
  //   //     alt: "Sinkedin Logo with the tagline: Where careers go to die (and get roasted).",
  //   //   },
  //   // ],
  //   locale: "en_US",
  //   type: "website",
  // },
};

export default async function RootLayout({ children }) {
  // Read server cookie to avoid hydration mismatch: if user previously chose dark,
  // render server HTML with the same class so client/hydration match.
  const cookieStore = await cookies();
  const themeCookie = cookieStore.get("theme");
  // Default to dark on the server to match client preference and avoid
  // hydration mismatches when no cookie is set.
  const serverTheme = themeCookie?.value || "dark";

  return (
    // Render either 'dark' or 'light' so the HTML class is deterministic
    <html lang="en" className={serverTheme === "dark" ? "dark" : "light"}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        {/* Inline script to set initial theme class before React hydrates (site defaults to dark)
            Adds 'light' class if localStorage.theme === 'light' or system prefers light. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var c=document.cookie.match(/(?:^|;\\s*)theme=([^;]+)/);var t=c?c[1]:null;if(!t){try{t=localStorage.getItem('theme')}catch(e){}}var prefers=window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches;if(t==='light'){document.documentElement.classList.add('light');document.documentElement.classList.remove('dark')}else if(t==='dark'){document.documentElement.classList.add('dark');document.documentElement.classList.remove('light')}else if(prefers){document.documentElement.classList.add('dark');document.documentElement.classList.remove('light')}else{document.documentElement.classList.add('light');document.documentElement.classList.remove('dark')} }catch(e){} })()`,
          }}
        />
      </head>
      <body>
        <UserProvider>
          <Header />
          {children}
        </UserProvider>
        {process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === "true" && (
          <>
            <Analytics />
            <SpeedInsights />
          </>
        )}
      </body>
    </html>
  );
}
