import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kinance",
  description: "Kinance",
  icons: {
    icon: { url: "/kinance-favicon.jpg", type: "image/jpeg" },
    shortcut: "/kinance-favicon.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
