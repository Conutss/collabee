// login/page.tsx (충돌 해결 버전)
"use client";

import { supabase } from "@/lib/supabase";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState(""); // 닉네임 State는 유지
  const router = useRouter();

  // 로그인/회원가입 처리 함수 (닉네임 기능 포함)
  const handleAuth = async (type: 'login' | 'signup') => {
    if (type === 'signup' && !nickname) return alert("닉네임을 입력하세요");
    const { error } = type === 'login' 
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password, options: { data: { nickname } } });
    
    if (error) alert(error.message);
    else {
      if (type === 'signup') alert("가입 성공! 로그인해주세요.");
      router.push("/");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-lg w-96 text-center space-y-4">
        <h1 className="text-3xl font-bold text-indigo-600">🐝 Collabee</h1>
        {/* 닉네임 입력창 */}
        <input className="w-full p-3 border rounded" placeholder="닉네임 (가입시)" value={nickname} onChange={e => setNickname(e.target.value)} />
        {/* 이메일/비번 입력창 */}
        <input className="w-full p-3 border rounded" placeholder="이메일" value={email} onChange={e => setEmail(e.target.value)} />
        <input className="w-full p-3 border rounded" placeholder="비밀번호" type="password" value={password} onChange={e => setPassword(e.target.value)} />
        
        <div className="flex gap-2">
          <button onClick={() => handleAuth('login')} className="flex-1 bg-indigo-600 text-white py-3 rounded">로그인</button>
          <button onClick={() => handleAuth('signup')} className="flex-1 bg-gray-200 text-gray-800 py-3 rounded">회원가입</button>
        </div>
      </div>
    </div>
  );
}