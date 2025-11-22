<<<<<<< HEAD
import { GoogleGenerativeAI } from "@google/generative-ai";
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);
export const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
=======
// lib/gemini.ts
import { GoogleGenerativeAI } from "@google/generative-ai";

// 1. 금고에서 API 키 꺼내기
const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY!;

// 2. AI 도구 상자(genAI) 초기화
const genAI = new GoogleGenerativeAI(apiKey);

// 3. 사용할 모델(셰프) 지정: "gemini-2.0-flash" (빠르고 똑똑함)
export const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

>>>>>>> e015ee542e35cc8973d9c13800d9198d9a3a3695
