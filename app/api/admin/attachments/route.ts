import { NextResponse } from "next/server";
import { verifyAdmin } from "@/utils/supabase/admin-auth";

// GET: ดึงไฟล์แนบของคอร์ส
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
    const { data: attachments, error } = await supabase
      .from("course_attachments")
      .select("*")
      .eq("course_id", courseId)
      .order("order_number", { ascending: true });

    if (error) throw error;

    return NextResponse.json({ attachments: attachments || [] });
  } catch (err: any) {
    console.error("Admin Attachments GET Error:", err);
    return NextResponse.json({ error: err.message || "Failed to fetch attachments" }, { status: 500 });
  }
}

// POST: เพิ่มหรือแก้ไขไฟล์แนบ
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
      episode_id,
      title,
      file_url,
      file_type,
      file_size,
      order_number,
    } = body;

    if (!course_id || !title || !file_url) {
      return NextResponse.json({ error: "ต้องระบุ course_id, title และ file_url" }, { status: 400 });
    }

    const payload = {
      course_id,
      episode_id: episode_id || null,
      title,
      file_url,
      file_type: file_type || "zip",
      file_size: file_size || null,
      order_number: parseInt(order_number || "0", 10),
    };

    if (id) {
      const { data, error } = await supabase
        .from("course_attachments")
        .update(payload)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return NextResponse.json({ success: true, message: "อัปเดตไฟล์แนบสำเร็จ", attachment: data });
    } else {
      const { data, error } = await supabase
        .from("course_attachments")
        .insert(payload)
        .select()
        .single();

      if (error) throw error;
      return NextResponse.json({ success: true, message: "เพิ่มไฟล์แนบสำเร็จ", attachment: data });
    }
  } catch (err: any) {
    console.error("Admin Attachments POST Error:", err);
    return NextResponse.json({ error: err.message || "Failed to save attachment" }, { status: 500 });
  }
}

// DELETE: ลบไฟล์แนบ
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
      return NextResponse.json({ error: "ต้องระบุ id ของไฟล์แนบ" }, { status: 400 });
    }

    const { error } = await supabase.from("course_attachments").delete().eq("id", id);
    if (error) throw error;

    return NextResponse.json({ success: true, message: "ลบไฟล์แนบเรียบร้อยแล้ว" });
  } catch (err: any) {
    console.error("Admin Attachments DELETE Error:", err);
    return NextResponse.json({ error: err.message || "Failed to delete attachment" }, { status: 500 });
  }
}
