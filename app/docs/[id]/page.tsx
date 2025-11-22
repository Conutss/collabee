<<<<<<< HEAD
import { supabase } from "@/lib/supabase";
import EditorWrapper from "@/components/EditorWrapper";

export default async function DocPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data: page } = await supabase.from("pages").select("title, content").eq("id", id).single();
  if (!page) return <div className="p-10">페이지를 찾을 수 없습니다.</div>;
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">{page.title}</h1>
      <EditorWrapper initialContent={page.content} pageId={id} key={id} />
=======
// app/docs/[id]/page.tsx
import { supabase } from "@/lib/supabase";
// [수정] dynamic import를 지우고, 우리가 만든 Wrapper를 가져옵니다.
import EditorWrapper from "@/components/EditorWrapper";

export default async function DocPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data: page } = await supabase
    .from("pages")
    .select("title, content")
    .eq("id", id)
    .single();

  if (!page) {
    return <div className="p-10">페이지를 찾을 수 없습니다.</div>;
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        {page.title || "제목 없음"}
      </h1>

      {/* [수정] Editor 대신 EditorWrapper를 사용합니다 */}
      <EditorWrapper 
        initialContent={page.content} 
        pageId={id} 
        key={id} 
      />
>>>>>>> e015ee542e35cc8973d9c13800d9198d9a3a3695
    </div>
  );
}