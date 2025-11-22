import type { Metadata } from "next";
<<<<<<< HEAD
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import AiSidebar from "@/components/AiSidebar";

export const metadata: Metadata = { title: "Collabee", description: "AI Collaboration Tool" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex h-screen overflow-hidden">
        <Sidebar />
        <div className="flex-1 ml-64 overflow-y-auto p-8 bg-white text-black">{children}</div>
        <AiSidebar />
      </body>
    </html>
  );
}
=======
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// 사이드바 가져오기
import Sidebar from "@/components/Sidebar";
// AI 사이드바 가져오기
import AiSidebar from "@/components/AiSidebar";

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
  description: "Notion + Slack Clone",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* body 태그에 flex를 줘서 옆으로 나란히 배치되게 합니다 */}
      <body className="flex h-screen overflow-hidden">
        
        {/* 1. 왼쪽에 사이드바 고정 */}
        <Sidebar />

        {/* 2. 오른쪽 본문 영역 (children이 우리가 만든 page.tsx입니다) */}
        {/* 사이드바 너비(w-64 = 16rem)만큼 왼쪽 여백(ml-64)을 줍니다. */}
        <div className="flex-1 ml-64 overflow-y-auto p-8 bg-white text-black">
          {children}
        </div>

        {/* [추가] AI 사이드바는 화면 위에 둥둥 떠있으므로(fixed) 여기에 둡니다 */}
        <AiSidebar />

      </body>
    </html>
  );
}
>>>>>>> e015ee542e35cc8973d9c13800d9198d9a3a3695
