import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Book Explorer",
  description: "Search and explore books instantly",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
