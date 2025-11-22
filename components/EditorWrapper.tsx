<<<<<<< HEAD
"use client";
import dynamic from "next/dynamic";
const Editor = dynamic(() => import("./Editor"), { ssr: false });
=======
// components/EditorWrapper.tsx
"use client"; // ★ 여기가 핵심! 클라이언트 환경이라고 선언합니다.

import dynamic from "next/dynamic";

// 여기서 dynamic import를 수행합니다.
const Editor = dynamic(() => import("./Editor"), { ssr: false });

>>>>>>> e015ee542e35cc8973d9c13800d9198d9a3a3695
export default Editor;