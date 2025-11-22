"use client";

import dynamic from "next/dynamic";

// 서버 사이드 렌더링(SSR)을 끄고 브라우저에서만 실행되도록 설정
const Editor = dynamic(() => import("./Editor"), { ssr: false });

export default Editor;