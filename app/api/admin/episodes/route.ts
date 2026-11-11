import { NextResponse } from "next/server";
import { verifyAdmin } from "@/utils/supabase/admin-auth";
import { parseVideoUrl } from "@/utils/video-helper";

// GET: ดึงตอนเรียนของคอร์ส
export async function GET(request: Request) {
  const auth = await verifyAdmin();
  if (!auth.isAdmin) {
    return NextResponse.json({ error: auth.error }, { status: 403 });
  }

  const { supabase } = auth;
  const { searchParams } = new URL(request.url);
  const courseId = searchParams.get("course_id");

  if (!courseId) {
    return NextResponse.json({ error: "ต้องระบุ course_id" }, { status: 400 });
  }

  try {
    const { data: episodes, error } = await supabase
      .from("course_episodes")
      .select("*")
      .eq("course_id", courseId)
      .order("order_number", { ascending: true })
      .order("created_at", { ascending: true });

    if (error) throw error;

    return NextResponse.json({ episodes: episodes || [] });
  } catch (err: any) {
    console.error("Admin Episodes GET Error:", err);
    return NextResponse.json({ error: err.message || "Failed to fetch episodes" }, { status: 500 });
  }
}

// POST: เพิ่มหรือแก้ไขตอนเรียน
export async function POST(request: Request) {
  const auth = await verifyAdmin();
  if (!auth.isAdmin) {
    return NextResponse.json({ error: auth.error }, { status: 403 });
  }

  const { supabase } = auth;

  try {
    const body = await request.json();
    const {
      id,
      course_id,
      title,
      video_url,
      duration_minutes,
      is_free_preview,
      order_number,
      content_html,
      prompts,
    } = body;

    if (!course_id || !title) {
      return NextResponse.json({ error: "ต้องระบุ course_id และ title" }, { status: 400 });
    }

    // Auto-detect video type
    const videoInfo = parseVideoUrl(video_url);

    const payload = {
      course_id,
      title,
      video_url: video_url || null,
      video_type: videoInfo.provider,
      duration_minutes: parseInt(duration_minutes || "0", 10),
      is_free_preview: Boolean(is_free_preview),
      order_number: parseInt(order_number || "0", 10),
      content_html: content_html || "",
      prompts: Array.isArray(prompts) ? prompts : [],
    };

    if (id) {
      const { data, error } = await supabase
        .from("course_episodes")
        .update(payload)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return NextResponse.json({ success: true, message: "อัปเดตบทเรียนสำเร็จ", episode: data });
    } else {
      const { data, error } = await supabase
        .from("course_episodes")
        .insert(payload)
        .select()
        .single();

      if (error) throw error;
      return NextResponse.json({ success: true, message: "เพิ่มบทเรียนใหม่สำเร็จ", episode: data });
    }
  } catch (err: any) {
    console.error("Admin Episodes POST Error:", err);
    return NextResponse.json({ error: err.message || "Failed to save episode" }, { status: 500 });
  }
}

// DELETE: ลบตอนเรียน
export async function DELETE(request: Request) {
  const auth = await verifyAdmin();
  if (!auth.isAdmin) {
    return NextResponse.json({ error: auth.error }, { status: 403 });
  }

  const { supabase } = auth;

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ต้องระบุ id ของตอนเรียน" }, { status: 400 });
    }

    const { error } = await supabase.from("course_episodes").delete().eq("id", id);
    if (error) throw error;

    return NextResponse.json({ success: true, message: "ลบบทเรียนเรียบร้อยแล้ว" });
  } catch (err: any) {
    console.error("Admin Episodes DELETE Error:", err);
    return NextResponse.json({ error: err.message || "Failed to delete episode" }, { status: 500 });
  }
}
