"use client";

import { useState, useRef, useEffect } from "react";
import { model } from "@/lib/gemini";
import { supabase } from "@/lib/supabase";
import { usePathname } from "next/navigation";

export default function AiSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const pathname = usePathname();

  const [messages, setMessages] = useState<{role: string, text: string}[]>([
    { role: "ai", text: "안녕하세요! 저는 AI 비서 AiBee입니다. 현재 보고 계신 문서에 대해 무엇이든 물어보세요! 🐝" }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 페이지 바뀔 때마다 대화 초기화
  useEffect(() => { 
    setMessages([{ role: "ai", text: "안녕하세요! AiBee입니다. 🐝" }]); 
  }, [pathname]);

  const getPageContext = async () => {
    if (!pathname.startsWith('/docs/')) return "";

    const pageId = pathname.split('/')[2];
    if (!pageId) return "";

    const { data } = await supabase
      .from('pages')
      .select('content')
      .eq('id', pageId)
      .single();

    if (!data || !data.content) return "";

    const blocks = data.content;
    if (!Array.isArray(blocks)) return "";

    const fullText = blocks.map((block: any) => {
      if (Array.isArray(block.content)) {
        return block.content.map((c: any) => c.text).join(" ");
      }
      return "";
    }).join("\n");

    return fullText;
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userQuestion = input;
    
    setMessages(prev => [...prev, { role: "user", text: userQuestion }]);
    setInput("");
    setIsLoading(true);

    try {
      const pageContext = await getPageContext();
      
      let finalPrompt = userQuestion;

      if (pageContext) {
        finalPrompt = `
현재 사용자가 보고 있는 문서 내용:
"""
${pageContext}
"""

사용자의 질문: "${userQuestion}"

위 문서 내용을 바탕으로 사용자의 질문에 답변해줘.
`;
      }

      console.log("AI에게 보낸 전체 프롬프트:", finalPrompt);

      const result = await model.generateContent(finalPrompt);
      const response = await result.response;
      const aiText = response.text();

      setMessages(prev => [...prev, { role: "ai", text: aiText }]);

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
          <p className="text-xs text-indigo-600 mt-1">문서 내용을 다 알고 있어요!</p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[85%] p-3 rounded-lg text-sm shadow-sm whitespace-pre-wrap ${msg.role === "user" ? "bg-indigo-500 text-white rounded-tr-none" : "bg-white text-gray-800 border border-gray-200 rounded-tl-none"}`}>
                {msg.text}
              </div>
            </div>
          ))}
          {isLoading && <div className="text-xs text-gray-400 p-2">생각 중... 💭</div>}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-3 border-t bg-white">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              className="flex-1 p-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
              placeholder="이 문서에서 보완할 점은?"
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