import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Violence Is Never The Answer – English Festival",
  description:
    "An interactive English quiz platform for the school English Festival. Each country has its own quiz on the theme: Violence Is Never The Answer.",
  keywords: ["English festival", "quiz", "violence prevention", "education", "peace"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
