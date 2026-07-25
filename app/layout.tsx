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
    title: "Kinance — Your salary-cycle money, clearly",
    description:
      "A private, responsive salary-cycle finance tracker for expenses, salary and savings goals.",
    icons: {
      icon: { url: "/kinance-favicon.jpg", type: "image/jpeg" },
      shortcut: "/kinance-favicon.jpg",
    },
    openGraph: {
      title: "Kinance — Every euro has a place.",
      description: "Salary-cycle money, clearly.",
      images: [{ url: `${baseUrl}/og.png`, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Kinance — Every euro has a place.",
      description: "Salary-cycle money, clearly.",
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
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
