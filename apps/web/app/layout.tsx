import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { GlobalProviders } from "@/providers/global";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "FormZen — Beautiful Form Builder for Modern Teams",
  description:
    "Create stunning forms in minutes. Drag-and-drop builder, powerful analytics, and seamless integrations. Built for teams who value simplicity and design.",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${inter.variable} ${playfair.variable} bg-background`}>
        <body className="font-sans antialiased">
          <GlobalProviders>
            {" "}
            {/* ✅ add this */}
            {children}
            {process.env.NODE_ENV === "production" && <Analytics />}
          </GlobalProviders>
        </body>
      </html>
    </ClerkProvider>
  );
}
