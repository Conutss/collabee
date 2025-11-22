"use client";

import { useState, useEffect, FormEvent, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import { useParams } from "next/navigation";

export default function ChannelPage() {
  const { id } = useParams();
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [channelName, setChannelName] = useState("");
  
  // 스크롤 자동 내리기용 Ref
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1. 유저 정보 가져오기
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    
    // 2. 채널 이름 가져오기
    supabase.from("channels").select("name").eq("id", id).single().then(({ data }) => { 
      if(data) setChannelName(data.name);
    });
    
    // 3. 메시지 가져오기
    const fetchMessages = async () => {
      const { data } = await supabase
        .from("messages")
        .select("*")
        .eq("channel_id", id)
        .order("created_at", { ascending: true });
      if (data) setMessages(data);
    };
    fetchMessages();

    // 4. 실시간 구독
    const channel = supabase.channel(`room_${id}`)
      .on("postgres_changes", { 
        event: "INSERT", 
        schema: "public", 
        table: "messages", 
        filter: `channel_id=eq.${id}` 
      }, 
      (payload) => setMessages(prev => [...prev, payload.new]))
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [id]);

  // 메시지가 추가될 때마다 스크롤 내리기
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !user) return;

    // 메타데이터에서 닉네임 가져오기 (없으면 이메일 앞부분)
    const nickname = user.user_metadata?.nickname || user.email?.split('@')[0] || "익명";

    await supabase.from("messages").insert({ 
      content: text, 
      user_email: user.email, 
      channel_id: id, 
      user_nickname: nickname 
    });
    
    setText("");
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* 헤더 */}
      <div className="p-4 border-b flex justify-between items-center bg-white shadow-sm z-10">
        <h1 className="text-xl font-bold text-gray-800"># {channelName || "로딩 중..."}</h1>
        <div className="text-sm text-gray-500">
          {user ? `${user.user_metadata?.nickname || user.email} 님` : "로그인 필요"}
        </div>
      </div>

      {/* 메시지 목록 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map(msg => {
          const isMe = user?.email === msg.user_email;
          return (
            <div key={msg.id} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
              <div className={`max-w-[70%] px-4 py-2 rounded-lg text-sm shadow-sm whitespace-pre-wrap ${isMe ? "bg-indigo-500 text-white rounded-tr-none" : "bg-white text-gray-800 border border-gray-200 rounded-tl-none"}`}>
                {msg.content}
              </div>
              <span className="text-xs text-gray-400 mt-1 px-1">
                {msg.user_nickname || (msg.user_email ? msg.user_email.split('@')[0] : "익명")}
              </span>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* 입력창 */}
      <div className="p-4 bg-white border-t">
        <form onSubmit={handleSubmit} className="flex gap-2 max-w-4xl mx-auto">
          <input 
            type="text" 
            className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black" 
            value={text} 
            onChange={e => setText(e.target.value)} 
            placeholder={`#${channelName}에 메시지 보내기...`} 
          />
          <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-indigo-700 transition-colors">
            전송
          </button>
        </form>
      </div>
    </div>
  );
}