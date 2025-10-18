import "./globals.css"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { UserProvider } from "@/contexts/UserContext"

const siteUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
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
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <UserProvider>
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
  )
}
