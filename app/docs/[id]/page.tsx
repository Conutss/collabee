import { supabase } from "@/lib/supabase";
import EditorWrapper from "@/components/EditorWrapper";

export default async function DocPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // 1. URL 파라미터에서 문서 ID 가져오기
  const { id } = await params;

  // 2. Supabase에서 해당 ID의 문서 데이터(제목, 내용) 조회
  const { data: page } = await supabase
    .from("pages")
    .select("title, content")
    .eq("id", id)
    .single();

  // 3. 페이지가 없으면 에러 메시지 표시
  if (!page) {
    return <div className="p-10">페이지를 찾을 수 없습니다.</div>;
  }

  // 4. 정상적으로 데이터가 있으면 렌더링
  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* 제목이 비어있을 경우 '제목 없음'으로 표시하는 안전 장치 포함 */}
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        {page.title || "제목 없음"}
      </h1>

      <EditorWrapper 
        initialContent={page.content} 
        pageId={id} 
        key={id} 
      />
    </div>
  );
}