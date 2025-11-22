import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// 컴포넌트 가져오기
import Sidebar from "@/components/Sidebar";
import AiSidebar from "@/components/AiSidebar";

// 1. 폰트 설정 (Next.js 기본 폰트)
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Collabee",
  description: "Notion + Slack Clone with AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* 2. 폰트 변수 적용 및 레이아웃 설정 */}
      <body
        className={`${geistSans.variable} ${geistMono.variable} flex h-screen overflow-hidden antialiased`}
      >
        {/* 왼쪽 사이드바 (고정) */}
        <Sidebar />

        {/* 메인 콘텐츠 영역 */}
        {/* ml-64: 사이드바 너비만큼 왼쪽 여백 확보 */}
        <div className="flex-1 ml-64 overflow-y-auto p-8 bg-white text-black">
          {children}
        </div>

        {/* AI 사이드바 (우측/플로팅) */}
        <AiSidebar />
      </body>
    </html>
  );
}