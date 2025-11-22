<<<<<<< HEAD
"use client";
import { useState, useEffect, FormEvent } from "react";
import { supabase } from "@/lib/supabase";
import { useParams } from "next/navigation";

export default function ChannelPage() {
  const { id } = useParams();
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState("");
  const [user, setUser] = useState<any>(null);
  const [roomName, setRoomName] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    supabase.from("channels").select("name").eq("id", id).single().then(({ data }) => { if(data) setRoomName(data.name) });
    
    const fetchMsgs = async () => {
      const { data } = await supabase.from("messages").select("*").eq("channel_id", id).order("created_at", { ascending: true });
      if (data) setMessages(data);
    };
    fetchMsgs();

    const channel = supabase.channel(`room_${id}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages", filter: `channel_id=eq.${id}` }, 
      (payload) => setMessages(prev => [...prev, payload.new]))
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [id]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !user) return;
    const nickname = user.user_metadata?.nickname || user.email?.split('@')[0];
    await supabase.from("messages").insert({ content: text, user_email: user.email, channel_id: id, user_nickname: nickname });
=======
// app/channels/[id]/page.tsx
"use client";

import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import { useParams } from "next/navigation"; // [핵심] URL에서 id 가져오기

export default function ChannelPage() {
  const { id } = useParams(); // URL의 [id] 값을 가져옵니다 (예: 1, 2...)
  
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState("");
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [channelName, setChannelName] = useState("");

  useEffect(() => {
    // 1. 현재 로그인한 유저 확인
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);
    };
    fetchUser();

    // 2. 이 채널의 이름 가져오기 (제목 표시용)
    const fetchChannelName = async () => {
      const { data } = await supabase
        .from("channels")
        .select("name")
        .eq("id", id)
        .single();
      if (data) setChannelName(data.name);
    };
    fetchChannelName();

    // 3. [중요] 이 방(channel_id === id)의 메시지들만 가져오기!
    const fetchMessages = async () => {
      const { data } = await supabase
        .from("messages")
        .select("*")
        .eq("channel_id", id) // ★ 필터링!
        .order("created_at", { ascending: true });
      if (data) setMessages(data);
    };
    fetchMessages();

    // 4. [중요] 실시간 구독 (이 방의 변화만 감시!)
    const channel = supabase
      .channel(`room_${id}`)
      .on(
        "postgres_changes",
        { 
          event: "INSERT", 
          schema: "public", 
          table: "messages",
          filter: `channel_id=eq.${id}` // ★ 내 방 번호와 같은 것만 알림 받기!
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id]);

  // 메시지 전송 함수
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (text.trim() === "") return;
    if (!currentUser) {
      alert("로그인이 필요합니다.");
      return;
    }

    // [중요] 보낼 때 'channel_id'를 꼭 붙여서 보냄!
    await supabase.from("messages").insert({
      content: text,
      user_email: currentUser.email,
      channel_id: id, // ★ 방 번호표 붙이기
    });

>>>>>>> e015ee542e35cc8973d9c13800d9198d9a3a3695
    setText("");
  };

  return (
    <div className="flex flex-col h-screen bg-white">
<<<<<<< HEAD
      <div className="p-4 border-b font-bold text-lg bg-white sticky top-0"># {roomName}</div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map(msg => {
          const isMe = user?.email === msg.user_email;
          return (
            <div key={msg.id} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
              <div className={`max-w-[70%] px-4 py-2 rounded-lg text-sm shadow-sm ${isMe ? "bg-indigo-500 text-white" : "bg-white border"}`}>{msg.content}</div>
              <span className="text-xs text-gray-400 mt-1 px-1">{msg.user_nickname || "익명"}</span>
            </div>
          );
        })}
      </div>
      <div className="p-4 border-t bg-white">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input className="flex-1 p-2 border rounded" value={text} onChange={e => setText(e.target.value)} />
          <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded">전송</button>
=======
      {/* 채널 제목 헤더 */}
      <div className="p-4 border-b flex items-center justify-between bg-white shadow-sm z-10">
        <h1 className="text-xl font-bold text-gray-800">
          # {channelName || "로딩 중..."}
        </h1>
        <div className="text-sm text-gray-500">
          {currentUser ? `${currentUser.email}님 접속 중` : "로그인 필요"}
        </div>
      </div>

      {/* 메시지 목록 영역 (스크롤 가능) */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((msg) => {
          // 내가 쓴 글인지 확인
          const isMyMessage = currentUser?.email === msg.user_email;
          
          return (
            <div 
              key={msg.id} 
              className={`flex flex-col ${isMyMessage ? "items-end" : "items-start"}`}
            >
              {/* 말풍선 */}
              <div 
                className={`max-w-[70%] px-4 py-2 rounded-lg shadow-sm text-sm
                  ${isMyMessage 
                    ? "bg-indigo-500 text-white rounded-tr-none" // 내꺼: 파란색
                    : "bg-white text-gray-800 border border-gray-200 rounded-tl-none" // 남꺼: 흰색
                  }
                `}
              >
                {msg.content}
              </div>
              
              {/* 보낸 사람 정보 */}
              <span className="text-xs text-gray-400 mt-1 px-1">
                {msg.user_email ? msg.user_email.split("@")[0] : "익명"}
              </span>
            </div>
          );
        })}
        
        {messages.length === 0 && (
          <div className="text-center text-gray-400 mt-10">
            아직 메시지가 없습니다. 첫 마디를 남겨보세요! 👋
          </div>
        )}
      </div>

      {/* 입력창 영역 */}
      <div className="p-4 bg-white border-t">
        <form onSubmit={handleSubmit} className="flex gap-2 max-w-4xl mx-auto">
          <input
            type="text"
            className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={`#${channelName}에 메시지 보내기`}
          />
          <button 
            type="submit" 
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-bold"
          >
            전송
          </button>
>>>>>>> e015ee542e35cc8973d9c13800d9198d9a3a3695
        </form>
      </div>
    </div>
  );
}