import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");
  const protocol = requestHeaders.get("x-forwarded-proto") ?? "https";
  const baseUrl = host ? `${protocol}://${host}` : "http://localhost:3000";

  return {
    metadataBase: new URL(baseUrl),
    title: "Kinance",
    description:
      "A private salary-cycle finance and relative-strength tracker.",
    icons: {
      icon: { url: "/kinance-favicon.jpg", type: "image/jpeg" },
      shortcut: "/kinance-favicon.jpg",
    },
    openGraph: {
      title: "Kinance",
      description: "Finance and strength, clearly.",
      images: [{ url: `${baseUrl}/og.png`, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Kinance",
      description: "Finance and strength, clearly.",
      images: [`${baseUrl}/og.png`],
    },
  };
}

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
