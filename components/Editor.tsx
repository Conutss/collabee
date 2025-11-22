"use client";

import { useEffect, useMemo, useState } from "react";
import { BlockNoteView } from "@blocknote/mantine";
import { useCreateBlockNote } from "@blocknote/react";
import "@blocknote/mantine/style.css";
import { supabase } from "@/lib/supabase";
import * as Y from "yjs";
import LiveblocksYjsProvider from "@liveblocks/yjs"; 
import { createClient } from "@liveblocks/client";

interface EditorProps {
  initialContent?: any;
  pageId: string;
}

const client = createClient({
  publicApiKey: process.env.NEXT_PUBLIC_LIVEBLOCKS_KEY!,
});

const getRandomColor = () => {
  const colors = ["#ff0000", "#00ff00", "#0000ff", "#ffa500", "#800080", "#008080", "#ff1493"];
  return colors[Math.floor(Math.random() * colors.length)];
};

// [1] 알맹이 컴포넌트
function CollaborativeEditor({ pageId, provider, userInfo, doc }: any) {
  const editor = useCreateBlockNote({
    collaboration: {
      fragment: doc.getXmlFragment("document-store"),
      user: {
        name: userInfo.name,
        color: userInfo.color,
      },
      provider,
      renderCursor: (user: any) => {
        const cursor = document.createElement("span");
        cursor.style.backgroundColor = user.color;
        cursor.style.color = "white";
        cursor.style.padding = "2px";
        cursor.style.fontSize = "10px";
        cursor.textContent = user.name;
        return cursor;
      },
    },
  });

  const handleSave = async () => {
    const blocks = editor.document;
    const { error } = await supabase
      .from('pages')
      .update({ content: blocks })
      .eq('id', pageId);

    if (error) alert("DB 저장 실패!");
    else alert("백업 완료! ✅");
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg min-h-[500px]">
      <div className="mb-2 text-xs text-gray-400 flex justify-between items-center">
        <span className="flex items-center gap-2">
          <span className="animate-pulse text-green-500">●</span> 
          Liveblocks 실시간 동기화 중
        </span>
        <span>내 닉네임: <span className="font-bold text-indigo-600">{userInfo.name}</span></span>
      </div>

      <BlockNoteView editor={editor} theme={"light"} />
      
      <div className="mt-4 flex justify-end gap-2">
        <button onClick={handleSave} className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 shadow-sm">
          DB에 저장하기 (백업)
        </button>
      </div>
    </div>
  );
}

// [2] 껍데기 컴포넌트
export default function Editor({ initialContent, pageId }: EditorProps) {
  const [userInfo, setUserInfo] = useState({ name: "Loading...", color: getRandomColor() });
  const [provider, setProvider] = useState<any>(null);
  const doc = useMemo(() => new Y.Doc(), []); 

  useEffect(() => {
    const getUserInfo = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const nickname = user.user_metadata?.nickname || user.email?.split('@')[0] || "익명";
        setUserInfo(prev => ({ ...prev, name: nickname }));
      } else {
        setUserInfo(prev => ({ ...prev, name: "Guest " + Math.floor(Math.random() * 100) }));
      }
    };
    getUserInfo();
  }, []);

  useEffect(() => {
    const room = (client as any).enter(`collabee-room-${pageId}`, {
        initialPresence: {},
    });

    const myProvider = new LiveblocksYjsProvider(room as any, doc);
    setProvider(myProvider);

    return () => {
        (client as any).leave(`collabee-room-${pageId}`);
        myProvider.destroy(); 
    };
  }, [doc, pageId]);

  if (!provider) {
    return <div className="p-10 text-center text-gray-400">⚡ Liveblocks 서버 연결 중...</div>;
  }

  return (
    <CollaborativeEditor 
      pageId={pageId} 
      provider={provider} 
      userInfo={userInfo}
      doc={doc} 
    />
  );
}