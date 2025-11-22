import { GoogleGenerativeAI } from "@google/generative-ai";

// 1. 금고에서 API 키 꺼내기 (없을 경우를 대비해 빈 문자열 처리를 합니다)
const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";

// [안전 장치] 키가 제대로 안 불러와졌으면 경고 메시지를 띄웁니다.
if (!apiKey) {
  console.error("⚠️ 경고: .env 파일에 NEXT_PUBLIC_GEMINI_API_KEY가 없습니다!");
}

// 2. AI 도구 상자(genAI) 초기화
const genAI = new GoogleGenerativeAI(apiKey);

// 3. 사용할 모델(셰프) 지정: "gemini-2.0-flash"
// (이 모델이 가성비가 좋고 속도가 빨라서 실시간 협업 툴에 적합합니다)
export const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });