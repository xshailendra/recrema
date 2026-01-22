import type { Metadata } from "next";
import { Inter, Anton } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-anton",
});

export const metadata: Metadata = {
  title: "Recrema | Coffee Upcycling Revolution",
  description: "Recrema is a sustainable initiative that upcycles spent coffee grounds into eco-friendly extracts, promoting a circular economy and reducing waste.",
  icons: {
    icon: "/favicon.ico",
  },
};

import { ExitIntentModal } from "@/components/ui/ExitIntentModal";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${anton.variable} antialiased`} suppressHydrationWarning>
        {children}
        <ExitIntentModal />
      </body>
    </html>
  );
}
