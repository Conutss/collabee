<<<<<<< HEAD
"use client";
=======
// components/Sidebar.tsx
"use client";

>>>>>>> e015ee542e35cc8973d9c13800d9198d9a3a3695
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { User } from "@supabase/supabase-js";

export default function Sidebar() {
  const [pages, setPages] = useState<any[]>([]);
  const [channels, setChannels] = useState<any[]>([]);
  const [user, setUser] = useState<User | null>(null);
<<<<<<< HEAD
  const router = useRouter();
  const pathname = usePathname(); 

  useEffect(() => {
    const fetchData = async () => {
      const { data: p } = await supabase.from('pages').select('id, title').order('created_at', { ascending: true });
      if (p) setPages(p);
      const { data: c } = await supabase.from('channels').select('id, name').order('created_at', { ascending: true });
      if (c) setChannels(c);
=======
  
  const router = useRouter();
  const pathname = usePathname(); 

  // 1. 데이터 가져오기
  useEffect(() => {
    const fetchData = async () => {
      const { data: pagesData } = await supabase
        .from('pages')
        .select('id, title')
        .order('created_at', { ascending: true });
      if (pagesData) setPages(pagesData);

      const { data: channelsData } = await supabase
        .from('channels')
        .select('id, name')
        .order('created_at', { ascending: true });
      if (channelsData) setChannels(channelsData);

>>>>>>> e015ee542e35cc8973d9c13800d9198d9a3a3695
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchData();
  }, []);

<<<<<<< HEAD
  const handleCreate = async (type: 'pages' | 'channels') => {
    const name = prompt(type === 'pages' ? "새 페이지 제목:" : "새 채널 이름:");
    if (!name) return;
    const { data, error } = await supabase.from(type).insert(type === 'pages' ? { title: name, content: null } : { name }).select().single();
    if (error) return alert("생성 실패");
    
    if (type === 'pages') {
      setPages(prev => [...prev, data]);
      router.push(`/docs/${data.id}`);
    } else {
      setChannels(prev => [...prev, data]);
      router.push(`/channels/${data.id}`);
    }
  };

  const handleDelete = async (e: any, id: string, type: 'pages' | 'channels') => {
    e.preventDefault(); e.stopPropagation();
    if (!confirm("삭제하시겠습니까?")) return;
    await supabase.from(type).delete().eq('id', id);
    if (type === 'pages') {
      setPages(prev => prev.filter(p => p.id !== id));
      router.push('/');
    } else {
      setChannels(prev => prev.filter(c => c.id !== id));
=======
  // --- [수정됨] 페이지 만들기 (제목 먼저 묻기) ---
  const handleCreatePage = async () => {
    // 1. 제목 입력받기
    const title = prompt("새 페이지 제목을 입력하세요:");
    if (!title) return; // 취소하면 종료

    // 2. 입력받은 제목으로 DB에 저장
    const { data, error } = await supabase
      .from('pages')
      .insert({ 
        title: title, // 입력한 제목
        content: null 
      })
      .select()
      .single();

    if (error) {
      alert("페이지 생성 실패");
      return;
    }
    setPages((prev) => [...prev, data]);
    router.push(`/docs/${data.id}`);
  };

  // [기존 유지] 채널 만들기
  const handleCreateChannel = async () => {
    const name = prompt("새 채널 이름을 입력하세요:");
    if (!name) return;

    const { data, error } = await supabase.from('channels').insert({ name }).select().single();
    if (error) {
      alert("채널 생성 실패");
      return;
    }
    setChannels((prev) => [...prev, data]);
    router.push(`/channels/${data.id}`);
  };

  // --- [추가됨] 이름 수정 기능 (페이지) ---
  const handleRenamePage = async (e: React.MouseEvent, pageId: string, oldTitle: string) => {
    e.preventDefault(); e.stopPropagation(); // 이동 막기
    
    const newTitle = prompt("페이지 이름을 수정하세요:", oldTitle);
    if (!newTitle || newTitle === oldTitle) return; // 변경 없으면 종료

    // DB 업데이트
    const { error } = await supabase
      .from('pages')
      .update({ title: newTitle })
      .eq('id', pageId);

    if (error) {
      alert("수정 실패");
    } else {
      // 화면 목록 업데이트
      setPages((prev) => prev.map(p => p.id === pageId ? { ...p, title: newTitle } : p));
    }
  };

  // --- [추가됨] 이름 수정 기능 (채널) ---
  const handleRenameChannel = async (e: React.MouseEvent, channelId: string, oldName: string) => {
    e.preventDefault(); e.stopPropagation();
    
    const newName = prompt("채널 이름을 수정하세요:", oldName);
    if (!newName || newName === oldName) return;

    const { error } = await supabase
      .from('channels')
      .update({ name: newName })
      .eq('id', channelId);

    if (error) {
      alert("수정 실패");
    } else {
      setChannels((prev) => prev.map(c => c.id === channelId ? { ...c, name: newName } : c));
    }
  };

  // --- 삭제 기능들 (기존 동일) ---
  const handleDeletePage = async (e: React.MouseEvent, pageId: string) => {
    e.preventDefault(); e.stopPropagation();
    if (!confirm("정말 삭제하시겠습니까?")) return;
    const { error } = await supabase.from('pages').delete().eq('id', pageId);
    if (!error) {
      setPages((prev) => prev.filter((p) => p.id !== pageId));
>>>>>>> e015ee542e35cc8973d9c13800d9198d9a3a3695
      router.push('/');
    }
  };

<<<<<<< HEAD
  const handleRename = async (e: any, id: string, oldName: string, type: 'pages' | 'channels') => {
    e.preventDefault(); e.stopPropagation();
    const newName = prompt("수정할 이름:", oldName);
    if (!newName) return;
    await supabase.from(type).update(type === 'pages' ? { title: newName } : { name: newName }).eq('id', id);
    if (type === 'pages') setPages(prev => prev.map(p => p.id === id ? { ...p, title: newName } : p));
    else setChannels(prev => prev.map(c => c.id === id ? { ...c, name: newName } : c));
=======
  const handleDeleteChannel = async (e: React.MouseEvent, channelId: string) => {
    e.preventDefault(); e.stopPropagation();
    if (!confirm("정말 삭제하시겠습니까?")) return;
    await supabase.from('channels').delete().eq('id', channelId);
    setChannels((prev) => prev.filter((c) => c.id !== channelId));
    router.push('/');
>>>>>>> e015ee542e35cc8973d9c13800d9198d9a3a3695
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push('/login');
  };

  if (pathname === "/login") return null;

  return (
<<<<<<< HEAD
    <nav className="w-64 bg-gray-50 h-screen border-r p-4 flex flex-col fixed left-0 top-0 z-50">
      <Link href="/" className="text-xl font-bold text-indigo-600 mb-6 px-2 block">🐝 Collabee</Link>
      
      {user ? (
        <div className="mb-4 p-2 bg-white rounded border shadow-sm">
          <div className="text-xs text-gray-500">로그인 계정</div>
          <div className="text-sm font-bold truncate">{user.email}</div>
          <button onClick={handleLogout} className="text-xs text-red-500 hover:underline mt-1">로그아웃</button>
        </div>
      ) : (
        <Link href="/login" className="block w-full bg-indigo-600 text-white text-center py-2 rounded mb-4 text-sm font-bold">로그인 하기</Link>
      )}

      <div className="flex-1 overflow-y-auto space-y-6">
        {[
          { title: "채팅 채널", list: channels, type: "channels" as const, icon: "💬", link: "/channels/" },
          { title: "개인 페이지", list: pages, type: "pages" as const, icon: "📄", link: "/docs/" }
        ].map((section) => (
          <div key={section.title}>
            <div className="flex justify-between px-2 py-1 mb-1 text-sm font-semibold text-gray-500">
              {section.title} <button onClick={() => handleCreate(section.type)}>+</button>
            </div>
            {section.list.map((item) => (
              <Link key={item.id} href={`${section.link}${item.id}`} className={`group flex justify-between items-center w-full px-2 py-1.5 text-sm rounded mb-1 ${pathname === `${section.link}${item.id}` ? "bg-indigo-100 text-indigo-900" : "hover:bg-gray-200"}`}>
                <div className="flex items-center gap-2 overflow-hidden flex-1"><span>{section.icon}</span><span className="truncate">{item.title || item.name}</span></div>
                <div className="flex opacity-0 group-hover:opacity-100 gap-1">
                  <button onClick={(e) => handleRename(e, item.id, item.title || item.name, section.type)} className="p-1 text-gray-400 hover:text-blue-500">✏️</button>
                  <button onClick={(e) => handleDelete(e, item.id, section.type)} className="p-1 text-gray-400 hover:text-red-500">🗑️</button>
                </div>
              </Link>
            ))}
          </div>
        ))}
=======
    <nav className="w-64 bg-gray-50 h-screen border-r border-gray-200 p-4 flex flex-col fixed left-0 top-0 overflow-y-hidden">
      <div className="mb-6 px-2">
        <Link href="/" className="text-xl font-bold text-indigo-600">🐝 Collabee</Link>
      </div>

      {user ? (
        <div className="mb-4 px-2 py-2 bg-white rounded border border-gray-200 shadow-sm">
          <div className="text-xs text-gray-500">로그인 계정</div>
          <div className="text-sm font-bold truncate" title={user.email}>{user.email}</div>
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
        
        {/* 1. 채팅 채널 목록 */}
        <div>
          <div className="flex items-center justify-between px-2 py-1 mb-1">
            <div className="text-sm font-semibold text-gray-500">채팅 채널</div>
            <button onClick={handleCreateChannel} className="text-gray-400 hover:text-indigo-600 text-lg leading-none">+</button>
          </div>
          
          {channels.map((channel) => {
            const isActive = pathname === `/channels/${channel.id}`;
            return (
              <Link 
                key={channel.id} 
                href={`/channels/${channel.id}`}
                className={`group flex items-center justify-between w-full text-left px-2 py-1.5 text-sm rounded mb-1 transition-colors ${isActive ? "bg-indigo-100 text-indigo-900 font-medium" : "text-gray-700 hover:bg-gray-200"}`}
              >
                <div className="flex items-center gap-2 overflow-hidden flex-1">
                  <span>💬</span>
                  <span className="truncate">{channel.name}</span>
                </div>
                
                {/* 버튼 그룹 (수정/삭제) - 마우스 올리면 보임 */}
                <div className="flex opacity-0 group-hover:opacity-100 transition-opacity">
                  {/* [추가] 이름 수정 버튼 */}
                  <button 
                    onClick={(e) => handleRenameChannel(e, channel.id, channel.name)} 
                    className="p-1 text-gray-400 hover:text-blue-500" title="이름 변경"
                  >
                    ✏️
                  </button>
                  {/* 삭제 버튼 */}
                  <button 
                    onClick={(e) => handleDeleteChannel(e, channel.id)} 
                    className="p-1 text-gray-400 hover:text-red-500" title="삭제"
                  >
                    🗑️
                  </button>
                </div>
              </Link>
            );
          })}
        </div>

        {/* 2. 개인 페이지 목록 */}
        <div>
          <div className="flex items-center justify-between px-2 py-1 mb-1">
            <div className="text-sm font-semibold text-gray-500">개인 페이지</div>
            <button onClick={handleCreatePage} className="text-gray-400 hover:text-indigo-600 text-lg leading-none">+</button>
          </div>
          
          {pages.map((page) => {
            const isActive = pathname === `/docs/${page.id}`;
            return (
              <Link 
                key={page.id} 
                href={`/docs/${page.id}`}
                className={`group flex items-center justify-between w-full text-left px-2 py-1.5 text-sm rounded mb-1 transition-colors ${isActive ? "bg-indigo-100 text-indigo-900 font-medium" : "text-gray-700 hover:bg-gray-200"}`}
              >
                <div className="flex items-center gap-2 overflow-hidden flex-1">
                  <span>📄</span>
                  <span className="truncate">{page.title || "제목 없음"}</span>
                </div>

                {/* 버튼 그룹 (수정/삭제) */}
                <div className="flex opacity-0 group-hover:opacity-100 transition-opacity">
                  {/* [추가] 이름 수정 버튼 */}
                  <button 
                    onClick={(e) => handleRenamePage(e, page.id, page.title)} 
                    className="p-1 text-gray-400 hover:text-blue-500" title="이름 변경"
                  >
                    ✏️
                  </button>
                  <button 
                    onClick={(e) => handleDeletePage(e, page.id)} 
                    className="p-1 text-gray-400 hover:text-red-500" title="삭제"
                  >
                    🗑️
                  </button>
                </div>
              </Link>
            );
          })}
        </div>

>>>>>>> e015ee542e35cc8973d9c13800d9198d9a3a3695
      </div>
    </nav>
  );
}