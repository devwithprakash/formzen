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
    "Create stunning forms in minutes. Drag-and-drop builder, powerful analytics, and seamless integrations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className={`${inter.variable} ${playfair.variable} bg-background`}
      >
        <body className="font-sans antialiased">
          <GlobalProviders>
            {children}
            {process.env.NODE_ENV === "production" && <Analytics />}
          </GlobalProviders>
        </body>
      </html>
    </ClerkProvider>
  );
}