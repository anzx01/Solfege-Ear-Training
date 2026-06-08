import type { Metadata, Viewport } from "next";
import { Footer } from "@/components/Footer";
import { SiteHeader } from "@/components/SiteHeader";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Movable Do Solfege Ear Training Online",
    template: "%s | Solfege Ear Trainer"
  },
  description:
    "Practice movable-do solfege online. Hear a key, identify Do, Re, Mi, Fa, Sol, La, or Ti, and improve your relative pitch.",
  applicationName: "Solfege Ear Trainer",
  alternates: {
    canonical: "/"
  },
  openGraph: {
    title: "Movable Do Solfege Ear Training Online",
    description:
      "Hear a key, identify Do, Re, Mi, Fa, Sol, La, or Ti, and improve your relative pitch.",
    url: "/",
    siteName: "Solfege Ear Trainer",
    type: "website"
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f7f3ea"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <SiteHeader />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
