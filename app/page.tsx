"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

// 예쁜 벌 이미지 주소
const HERO_IMAGE_URL = "https://cdn-icons-png.flaticon.com/512/4712/4712109.png"; 

export default function Home() {
  const router = useRouter();
  // 로그인 체크 로딩 상태
  const [loading, setLoading] = useState(true);

  // [기능] 페이지 켜지자마자 로그인 검사
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        // 로그인이 안 되어 있으면 로그인 페이지로 보냄
        router.replace("/login");
      } else {
        // 로그인 되어 있으면 화면 보여줌
        setLoading(false);
      }
    };
    checkSession();
  }, [router]);

  // 로딩 중일 때는 흰 화면 (깜빡임 방지)
  if (loading) return <div className="flex h-screen items-center justify-center text-gray-400">로딩 중...</div>;

  // [디자인] 로그인 된 사람에게 보여줄 메인 화면
  return (
    <main className="flex flex-col items-center justify-center h-full text-center p-8 bg-gray-50 text-gray-800">
      
      {/* 1. 이미지 영역 */}
      <div className="mb-6">
        <img 
          src={HERO_IMAGE_URL} 
          alt="Collabee Hero" 
          className="w-48 h-48 object-contain mx-auto hover:scale-110 transition-transform duration-300"
        />
      </div>

      {/* 2. 제목 */}
      <h1 className="text-5xl font-extrabold text-indigo-600 mb-4">
        Collabee
      </h1>

      {/* 3. 슬로건 */}
      <p className="text-xl text-gray-700 mb-8 max-w-xl">
        함께 생각하고, 함께 쓰고, 함께 성장하는 AI 협업 비서 🐝
      </p>

      {/* 4. 설명 문구 */}
      <div className="space-y-4 max-w-2xl text-lg text-gray-600 mb-10">
        <p>
          Collabee는 벌들이 협력하여 꿀을 모으듯, 팀원들이 하나의 목표를 향해
          지식을 공유하고 아이디어를 발전시키는 공간입니다.
        </p>
        <p>
          AI 비서 AiBee가 항상 여러분 곁에서 문서 요약, 브레인스토밍, 번역 등
          다양한 방식으로 협업을 돕습니다.
        </p>
        <p>
          이제 복잡한 과정 없이, 오직 창의적인 생각과 소통에 집중하세요.
        </p>
      </div>
      
      {/* 5. 안내 박스 */}
      <div className="mt-8 p-4 bg-white rounded-lg shadow-sm border border-gray-200 text-sm text-gray-500">
        👈 왼쪽 사이드바에서 <b>[+ 새 페이지 만들기]</b>를 눌러 시작해보세요!
      </div>

    </main>
  );
}