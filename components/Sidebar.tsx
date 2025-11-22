// components/Sidebar.tsx (충돌 해결 완료 버전)
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { User } from "@supabase/supabase-js";

export default function Sidebar() {
  const [pages, setPages] = useState<any[]>([]);
  const [channels, setChannels] = useState<any[]>([]);
  const [user, setUser] = useState<User | null>(null);
  
  const router = useRouter();
  const pathname = usePathname(); 

  useEffect(() => {
    const fetchData = async () => {
      // 1. 페이지 목록 가져오기
      const { data: pagesData } = await supabase
        .from('pages')
        .select('id, title')
        .order('created_at', { ascending: true });
      if (pagesData) setPages(pagesData);

      // 2. 채널 목록 가져오기
      const { data: channelsData } = await supabase
        .from('channels')
        .select('id, name')
        .order('created_at', { ascending: true });
      if (channelsData) setChannels(channelsData);

      // 3. 유저 정보 가져오기
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchData();
  }, []);

  // 통합 생성 핸들러 (페이지 & 채널)
  const handleCreate = async (type: 'pages' | 'channels') => {
    const name = prompt(type === 'pages' ? "새 페이지 제목:" : "새 채널 이름:");
    if (!name) return;

    // pages 테이블엔 title, channels 테이블엔 name 컬럼 사용
    const payload = type === 'pages' ? { title: name, content: null } : { name: name };
    
    const { data, error } = await supabase
      .from(type)
      .insert(payload)
      .select()
      .single();

    if (error) {
      alert("생성 실패");
      return;
    }
    
    if (type === 'pages') {
      setPages(prev => [...prev, data]);
      router.push(`/docs/${data.id}`);
    } else {
      setChannels(prev => [...prev, data]);
      router.push(`/channels/${data.id}`);
    }
  };

  // 통합 삭제 핸들러
  const handleDelete = async (e: any, id: string, type: 'pages' | 'channels') => {
    e.preventDefault(); e.stopPropagation();
    if (!confirm("삭제하시겠습니까?")) return;
    
    await supabase.from(type).delete().eq('id', id);
    
    if (type === 'pages') {
      setPages(prev => prev.filter(p => p.id !== id));
    } else {
      setChannels(prev => prev.filter(c => c.id !== id));
    }
    router.push('/');
  };

  // 통합 이름 변경 핸들러
  const handleRename = async (e: any, id: string, oldName: string, type: 'pages' | 'channels') => {
    e.preventDefault(); e.stopPropagation();
    const newName = prompt("수정할 이름:", oldName);
    if (!newName) return;

    const payload = type === 'pages' ? { title: newName } : { name: newName };
    await supabase.from(type).update(payload).eq('id', id);

    if (type === 'pages') {
      setPages(prev => prev.map(p => p.id === id ? { ...p, title: newName } : p));
    } else {
      setChannels(prev => prev.map(c => c.id === id ? { ...c, name: newName } : c));
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push('/login');
  };

  if (pathname === "/login") return null;

  return (
    <nav className="w-64 bg-gray-50 h-screen border-r border-gray-200 p-4 flex flex-col fixed left-0 top-0 overflow-y-hidden z-50">
      <div className="mb-6 px-2">
        <Link href="/" className="text-xl font-bold text-indigo-600">🐝 Collabee</Link>
      </div>

      {user ? (
        <div className="mb-4 px-2 py-2 bg-white rounded border border-gray-200 shadow-sm">
          <div className="text-xs text-gray-500">로그인 계정</div>
          <div className="text-sm font-bold truncate">{user.email}</div>
          <button onClick={handleLogout} className="text-xs text-red-500 hover:underline mt-1">로그아웃</button>
        </div>
      ) : (
        <div className="mb-4 px-2">
          <Link href="/login" className="block w-full bg-indigo-600 text-white text-center py-2 rounded hover:bg-indigo-700 font-bold text-sm transition-colors">
            로그인 하러 가기
          </Link>
        </div>
      )}

      <div className="flex-1 overflow-y-auto space-y-6">
        
        {/* 채팅 채널 목록 */}
        <div>
          <div className="flex justify-between items-center px-2 py-1 mb-1 text-sm font-semibold text-gray-500">
            채팅 채널 
            <button onClick={() => handleCreate('channels')} className="text-gray-400 hover:text-indigo-600">+</button>
          </div>
          
          {channels.map((channel) => (
            <Link 
              key={channel.id} 
              href={`/channels/${channel.id}`} 
              className={`group flex justify-between items-center w-full px-2 py-1.5 text-sm rounded mb-1 transition-colors 
                ${pathname === `/channels/${channel.id}` ? "bg-indigo-100 text-indigo-900 font-medium" : "text-gray-700 hover:bg-gray-200"}`}
            >
              <div className="flex items-center gap-2 overflow-hidden flex-1">
                <span>💬</span><span className="truncate">{channel.name}</span>
              </div>
              <div className="flex opacity-0 group-hover:opacity-100 gap-1 transition-opacity">
                <button onClick={(e) => handleRename(e, channel.id, channel.name, 'channels')} className="p-1 text-gray-400 hover:text-blue-500">✏️</button>
                <button onClick={(e) => handleDelete(e, channel.id, 'channels')} className="p-1 text-gray-400 hover:text-red-500">🗑️</button>
              </div>
            </Link>
          ))}
        </div>

        {/* 개인 페이지 목록 */}
        <div>
          <div className="flex justify-between items-center px-2 py-1 mb-1 text-sm font-semibold text-gray-500">
            개인 페이지 
            <button onClick={() => handleCreate('pages')} className="text-gray-400 hover:text-indigo-600">+</button>
          </div>
          
          {pages.map((page) => (
            <Link 
              key={page.id} 
              href={`/docs/${page.id}`} 
              className={`group flex justify-between items-center w-full px-2 py-1.5 text-sm rounded mb-1 transition-colors 
                ${pathname === `/docs/${page.id}` ? "bg-indigo-100 text-indigo-900 font-medium" : "text-gray-700 hover:bg-gray-200"}`}
            >
              <div className="flex items-center gap-2 overflow-hidden flex-1">
                <span>📄</span><span className="truncate">{page.title || "제목 없음"}</span>
              </div>
              <div className="flex opacity-0 group-hover:opacity-100 gap-1 transition-opacity">
                <button onClick={(e) => handleRename(e, page.id, page.title, 'pages')} className="p-1 text-gray-400 hover:text-blue-500">✏️</button>
                <button onClick={(e) => handleDelete(e, page.id, 'pages')} className="p-1 text-gray-400 hover:text-red-500">🗑️</button>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </nav>
  );
}