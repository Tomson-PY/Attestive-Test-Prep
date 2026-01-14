import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Attestiva | Compliance Assurance Platform",
  description: "Turn policies and procedures into verified understanding. AI-powered explanation, scenario-based verification, and defensible proof that your workforce comprehends and can apply critical information.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${jakarta.variable} antialiased font-sans bg-[var(--bg-surface)] text-[var(--text-main)]`}
      >
        <div className="bg-noise" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
