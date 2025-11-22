"use client";

import { useState, useRef, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { usePathname } from "next/navigation";

export default function AiSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const pathname = usePathname();

  // 대화 기록
  const [messages, setMessages] = useState<{role: string, text: string}[]>([
    { role: "ai", text: "안녕하세요! AiBee입니다. 무엇을 도와드릴까요? 🐝" }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 스크롤 자동 이동
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 페이지 바뀔 때마다 대화 초기화
  useEffect(() => { 
    setMessages([{ role: "ai", text: "새로운 페이지군요! 무엇이 궁금하신가요? 🐝" }]); 
  }, [pathname]);

  // [핵심 수정] 현재 페이지의 '문맥(Context)'을 가져오는 함수
  const getCurrentContext = async () => {
    
    // 1. 문서 페이지인 경우 (/docs/...)
    if (pathname.startsWith('/docs/')) {
      const pageId = pathname.split('/')[2];
      if (!pageId) return "";

      const { data } = await supabase
        .from('pages')
        .select('content')
        .eq('id', pageId)
        .single();

      if (!data || !data.content) return "";
      
      // 문서 블록들을 텍스트로 변환
      const blocks = data.content;
      if (!Array.isArray(blocks)) return "";
      return "현재 보고 있는 문서 내용:\n" + blocks.map((block: any) => {
        if (Array.isArray(block.content)) {
          return block.content.map((c: any) => c.text).join(" ");
        }
        return "";
      }).join("\n");
    }

    // 2. [추가됨] 채팅 채널인 경우 (/channels/...)
    if (pathname.startsWith('/channels/')) {
      const channelId = pathname.split('/')[2]; // URL에서 채널 ID 추출
      if (!channelId) return "";

      // 최근 채팅 메시지 30개를 가져옵니다.
      const { data } = await supabase
        .from('messages')
        .select('content, user_nickname, created_at')
        .eq('channel_id', channelId)
        .order('created_at', { ascending: false }) // 최신순으로 가져와서
        .limit(30);

      if (!data || data.length === 0) return "";

      // AI가 읽기 좋게 "누가: 무슨말" 형태로 정리 (순서는 과거 -> 최신으로 다시 뒤집음)
      const chatLog = data.reverse().map(msg => 
        `[${msg.user_nickname || '익명'}]: ${msg.content}`
      ).join("\n");

      return "현재 채팅방의 최근 대화 내용:\n" + chatLog;
    }

    return ""; // 그 외 페이지는 정보 없음
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userQuestion = input;
    
    setMessages(prev => [...prev, { role: "user", text: userQuestion }]);
    setInput("");
    setIsLoading(true);

    try {
      // [수정] 위에서 만든 똑똑한 함수(getCurrentContext)를 실행
      const currentContext = await getCurrentContext();

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, { role: "user", text: userQuestion }], 
          pageContent: currentContext, // 여기에 문서 내용 혹은 채팅 로그가 들어갑니다!
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      setMessages(prev => [...prev, { role: "ai", text: data.result }]);

    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, { role: "ai", text: "오류가 발생했습니다." }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (pathname === "/login") return null;

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed top-4 right-4 z-50 p-3 rounded-full shadow-lg transition-colors
          ${isOpen ? "bg-gray-200 text-gray-600" : "bg-indigo-600 text-white hover:bg-indigo-700"}
        `}
      >
        {isOpen ? "❌" : "🤖"}
      </button>

      <div className={`fixed top-0 right-0 h-screen w-80 bg-white shadow-2xl border-l border-gray-200 transform transition-transform duration-300 ease-in-out z-40 flex flex-col ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="p-4 border-b bg-indigo-50">
          <h2 className="font-bold text-indigo-800 flex items-center gap-2">🤖 AiBee</h2>
          <p className="text-xs text-indigo-600 mt-1">문서와 채팅을 모두 이해해요!</p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[85%] p-3 rounded-lg text-sm shadow-sm whitespace-pre-wrap ${msg.role === "user" ? "bg-indigo-500 text-white rounded-tr-none" : "bg-white text-gray-800 border border-gray-200 rounded-tl-none"}`}>
                {msg.text}
              </div>
            </div>
          ))}
          {isLoading && <div className="text-xs text-gray-400 p-2">분석 중... 💭</div>}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-3 border-t bg-white">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              className="flex-1 p-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
              placeholder="무엇이든 물어보세요"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
            />
            <button type="submit" disabled={isLoading} className="bg-indigo-600 text-white p-2 rounded">⬆</button>
          </form>
        </div>
      </div>
    </>
  );
}