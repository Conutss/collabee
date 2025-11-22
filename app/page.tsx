<<<<<<< HEAD
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) router.replace("/login");
      else setLoading(false);
    });
  }, [router]);

  if (loading) return <div className="flex h-screen items-center justify-center">로딩 중...</div>;

  return (
    <main className="flex flex-col items-center justify-center h-full text-center">
      <h1 className="text-5xl font-extrabold text-indigo-600 mb-4">Collabee</h1>
      <p className="text-xl text-gray-700">AI와 함께하는 실시간 협업 툴 🐝</p>
      <div className="mt-10 p-4 bg-white border rounded text-gray-500">👈 왼쪽 메뉴에서 시작하세요!</div>
=======
// app/page.tsx
"use client";

//import Header from "@/components/Header";
import Link from "next/link";

// 👇 [수정] 여기에 원하는 이미지 주소(URL)를 넣으세요! 👇
// 예시: 구글에서 이미지 우클릭 -> '이미지 주소 복사' 해서 붙여넣기
const HERO_IMAGE_URL = "data:image/png;base64,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"; 

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center h-full text-center p-8 bg-gray-50 text-gray-800">
      

      {/* 이미지 영역 */}
      <div className="mb-6">
        {/* 표준 img 태그를 사용해서 어떤 외부 링크든 허용되게 함 */}
        <img 
          src={HERO_IMAGE_URL} 
          alt="Collabee Hero" 
          className="w-48 h-48 object-contain mx-auto hover:scale-110 transition-transform duration-300"
        />
      </div>

      {/* 프로젝트 제목 */}
      <h1 className="text-5xl font-extrabold text-indigo-600 mb-4">
        Collabee
      </h1>

      {/* 슬로건 */}
      <p className="text-xl text-gray-700 mb-8 max-w-xl">
        함께 생각하고, 함께 쓰고, 함께 성장하는 AI 협업 비서 🐝
      </p>

      {/* 프로젝트 설명 */}
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

      {/* 시작 버튼/링크 */}
      <div className="flex gap-4">
        {/* (참고) 페이지 만들기는 '제목 입력' 과정이 필요하므로 사이드바를 이용하라고 안내하는 게 자연스럽습니다.
            여기서는 편의상 목록 페이지나 특정 안내로 보내거나, 
            단순히 버튼을 눌렀을 때 사이드바의 + 버튼을 누르도록 유도할 수도 있습니다.
            일단은 가장 기본적인 '/channels/new' (없는 주소지만 예시) 대신
            사이드바를 이용해달라는 안내 느낌으로 두거나, 
            기존대로 버튼을 두되, 클릭 시 알림을 띄울 수도 있습니다.
            
            하지만 가장 깔끔한 건 그냥 버튼을 유지하고, 
            사용자가 사이드바를 통해 진입하는 흐름을 익히게 두는 것입니다.
         */}
      </div>
      
      {/* 안내 문구 추가 */}
      <div className="mt-8 p-4 bg-white rounded-lg shadow-sm border border-gray-200 text-sm text-gray-500">
        👈 왼쪽 사이드바에서 <b>[+ 새 페이지 만들기]</b>를 눌러 시작해보세요!
      </div>

>>>>>>> e015ee542e35cc8973d9c13800d9198d9a3a3695
    </main>
  );
}