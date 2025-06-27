import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import clsx from "clsx";
import "./globals.css";
import { Toaster } from "sonner"; // ✅ Import Toaster

const dmSans = DM_Sans({
  variable: "--font-DM_Sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CodeHurdle",
  description: "Level-Up your Problem-Solving",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={clsx(dmSans.className, "antialiased")}>
        {children}
        <Toaster position="top-right" richColors /> {/* ✅ Toast renderer */}
      </body>
    </html>
  );
}
