<<<<<<< HEAD
"use client";
import { useState, useRef, useEffect } from "react";
import { model } from "@/lib/gemini";
import { supabase } from "@/lib/supabase";
import { usePathname } from "next/navigation";
=======
// components/AiSidebar.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { model } from "@/lib/gemini";
import { supabase } from "@/lib/supabase"; // DB 접근용
import { usePathname } from "next/navigation"; // 주소 확인용
>>>>>>> e015ee542e35cc8973d9c13800d9198d9a3a3695

export default function AiSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
<<<<<<< HEAD
  const [messages, setMessages] = useState<{role: string, text: string}[]>([{ role: "ai", text: "안녕하세요! AiBee입니다. 🐝" }]);
  const pathname = usePathname();
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);
  useEffect(() => { setMessages([{ role: "ai", text: "안녕하세요! AiBee입니다. 🐝" }]); }, [pathname]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    const q = input;
    setMessages(p => [...p, { role: "user", text: q }]);
    setInput(""); setIsLoading(true);

    try {
      let context = "";
      if (pathname.startsWith('/docs/')) {
        const id = pathname.split('/')[2];
        const { data } = await supabase.from('pages').select('content').eq('id', id).single();
        if (data?.content && Array.isArray(data.content)) {
          context = data.content.map((b: any) => Array.isArray(b.content) ? b.content.map((c: any) => c.text).join(" ") : "").join("\n");
        }
      }
      const prompt = context ? `문서 내용:\n"""${context}"""\n\n질문: "${q}"\n답변해줘.` : q;
      const res = await model.generateContent(prompt);
      setMessages(p => [...p, { role: "ai", text: res.response.text() }]);
    } catch (e) { setMessages(p => [...p, { role: "ai", text: "오류가 발생했습니다." }]); }
    setIsLoading(false);
  };

  if (pathname === "/login") return null;

  return (
    <>
      <button onClick={() => setIsOpen(!isOpen)} className={`fixed top-4 right-4 z-50 p-3 rounded-full shadow-lg ${isOpen ? "bg-gray-200" : "bg-indigo-600 text-white"}`}>{isOpen ? "❌" : "🤖"}</button>
      <div className={`fixed top-0 right-0 h-screen w-80 bg-white shadow-2xl border-l transform transition-transform duration-300 z-40 flex flex-col ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="p-4 border-b bg-indigo-50 font-bold text-indigo-800">🤖 AiBee</div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[85%] p-3 rounded-lg text-sm shadow-sm whitespace-pre-wrap ${m.role === "user" ? "bg-indigo-500 text-white" : "bg-white border"}`}>{m.text}</div>
            </div>
          ))}
          {isLoading && <div className="text-xs text-gray-400 p-2">생각 중...</div>}
          <div ref={endRef} />
        </div>
        <div className="p-3 border-t bg-white">
          <form onSubmit={handleSend} className="flex gap-2">
            <input className="flex-1 p-2 border rounded text-sm" value={input} onChange={e => setInput(e.target.value)} disabled={isLoading} />
=======
  
  // 현재 주소 확인 (/docs/1 인지 확인하기 위해)
  const pathname = usePathname();

  const [messages, setMessages] = useState<{role: string, text: string}[]>([
    { role: "ai", text: "안녕하세요! 저는 AI 비서 AiBee입니다. 현재 보고 계신 문서에 대해 무엇이든 물어보세요! 🐝" }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // [핵심 함수] 현재 보고 있는 페이지의 내용을 DB에서 가져오기
  const getPageContext = async () => {
    // 1. 주소가 '/docs/' 로 시작하는지 확인 (문서 페이지인지?)
    if (!pathname.startsWith('/docs/')) return "";

    // 2. 주소에서 ID 꺼내기 (예: /docs/5 -> 5)
    const pageId = pathname.split('/')[2];
    if (!pageId) return "";

    // 3. DB에서 해당 페이지 내용 가져오기
    const { data } = await supabase
      .from('pages')
      .select('content')
      .eq('id', pageId)
      .single();

    if (!data || !data.content) return "";

    // 4. 블록(JSON)을 텍스트(String)로 변환 (Editor.tsx에서 썼던 그 로직!)
    // (DB에 저장된 데이터는 배열 형태일 수 있으므로 확인)
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
    
    // 1. 화면에 내 질문 표시
    setMessages(prev => [...prev, { role: "user", text: userQuestion }]);
    setInput("");
    setIsLoading(true);

    try {
      // 2. [업그레이드] 현재 문서 내용 가져오기 (맥락 확보)
      const pageContext = await getPageContext();
      
      let finalPrompt = userQuestion;

      // 3. 문서 내용이 있다면 프롬프트를 똑똑하게 합치기
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

      console.log("AI에게 보낸 전체 프롬프트:", finalPrompt); // 콘솔에서 확인 가능

      // 4. AI에게 전송
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
>>>>>>> e015ee542e35cc8973d9c13800d9198d9a3a3695
            <button type="submit" disabled={isLoading} className="bg-indigo-600 text-white p-2 rounded">⬆</button>
          </form>
        </div>
      </div>
    </>
  );
}