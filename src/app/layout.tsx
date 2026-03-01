import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { Sidebar, MobileNav } from "@/components/layout/navigation";

export const metadata: Metadata = {
  title: "小葡萄成长记录",
  description: "记录小葡萄的每一个珍贵瞬间",
};

export const dynamic = "force-dynamic";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className={GeistSans.className}>
      <body className="antialiased bg-white min-h-screen">
        <Sidebar />
        <main className="md:pl-60 pb-20 md:pb-0 min-h-screen">
          <div className="mx-auto max-w-5xl px-4 py-6 md:px-8 md:py-8">
            {children}
          </div>
        </main>
        <MobileNav />
      </body>
    </html>
  );
}
