import { model } from "@/lib/gemini";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { messages, pageContent } = await req.json();

    // 1. 마지막 메시지는 '현재 질문'이므로 따로 뺍니다.
    const lastMessage = messages[messages.length - 1];

    // 2. 나머지 메시지들은 '기억(History)'으로 만듭니다.
    // (마지막 질문을 제외한 앞부분 전체)
    let history = messages.slice(0, -1).map((msg: any) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.text }],
    }));

    // [중요 수정] "AI가 두 번 연속 말하기 금지" 규칙 준수
    // 만약 기억의 첫 번째가 "AI의 인사말(model)"이라면, 과감하게 지워버립니다.
    // (시스템 프롬프트와 충돌하지 않게 하기 위함)
    if (history.length > 0 && history[0].role === "model") {
      history.shift(); 
    }

    // 3. 시스템 프롬프트 (AI의 뇌세팅)
    const systemPrompt = `
    [지시사항]
    당신은 'AiBee'라는 이름의 AI 비서입니다.
    
    1. 현재 사용자가 보고 있는 문서 내용:
    """
    ${pageContent ? pageContent : "(현재 문서는 비어있습니다)"}
    """
    
    2. 위 문서 내용을 바탕으로 답변하되, 문서에 없더라도 사용자와의 **이전 대화 맥락(History)**을 최우선으로 기억하고 답변하세요.
    3. 사용자가 "아까 내가 뭐라고 했어?"라고 물으면 대화 기록을 보고 정확히 대답하세요.
    `;

    // 4. 채팅 시작 (기억 주입)
    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: systemPrompt }],
        },
        {
          role: "model",
          parts: [{ text: "네, 문서 내용과 이전 대화 내역을 모두 숙지했습니다." }],
        },
        ...history, // 여기에 이제 안전하게 정리된 대화 기록이 들어갑니다.
      ],
    });

    // 5. 질문 던지기
    const result = await chat.sendMessage(lastMessage.text);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ result: text });

  } catch (error) {
    console.error("AI Error:", error);
    return NextResponse.json({ error: "AI 처리 중 오류 발생" }, { status: 500 });
  }
}