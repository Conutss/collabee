import { model } from "@/lib/gemini";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // 프론트에서 보낸 '채팅 로그 리스트'를 받습니다.
    const { messages } = await req.json();

    if (!messages || messages.length === 0) {
      return NextResponse.json({ result: "분석할 대화 내용이 없습니다." });
    }

    // AI에게 보낼 프롬프트 (여기가 핵심입니다!)
    const prompt = `
    다음은 팀원들이 나눈 채팅 대화 로그입니다.
    이 대화 내용을 바탕으로 다음 3가지를 수행해주세요:
    
    1. **📋 3줄 요약**: 대화의 핵심 내용을 3줄로 요약하세요.
    2. **✅ 할 일 정리**: 대화 중 결정된 사항이나 해야 할 일이 있다면 정리하세요.
    3. **💡 새로운 시각**: 이 대화에서 놓치고 있는 점이나, 더 좋은 아이디어가 있다면 제안하세요.

    ---
    [대화 로그]
    ${messages.map((m: any) => `${m.user_id || '익명'}: ${m.content}`).join("\n")}
    ---
    
    답변은 보기 좋게 Markdown 형식으로 작성해주세요.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ result: text });

  } catch (error) {
    console.error("Analysis Error:", error);
    return NextResponse.json({ error: "분석 중 오류가 발생했습니다." }, { status: 500 });
  }
}