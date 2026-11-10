import { NextResponse } from "next/server";
import { verifyAdmin } from "@/utils/supabase/admin-auth";

// GET: ดึงรายการคอร์สทั้งหมด (รวม Draft และ Published)
export async function GET() {
  const auth = await verifyAdmin();
  if (!auth.isAdmin) {
    return NextResponse.json({ error: auth.error }, { status: 403 });
  }

  const { supabase } = auth;

  try {
    const { data: courses, error } = await supabase
      .from("courses")
      .select("*")
      .order("order_number", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ courses });
  } catch (err: any) {
    console.error("Admin Courses GET Error:", err);
    return NextResponse.json({ error: err.message || "Failed to fetch courses" }, { status: 500 });
  }
}

// POST: เพิ่มคอร์สใหม่ หรือ อัปเดตคอร์ส
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
      title,
      slug,
      description,
      thumbnail_url,
      instructor,
      content_type,
      required_tier,
      github_repo_url,
      demo_url,
      is_published,
      order_number,
    } = body;

    if (!title || !slug) {
      return NextResponse.json({ error: "ต้องระบุชื่อคอร์ส (title) และ slug" }, { status: 400 });
    }

    if (id) {
      // Update
      const { error } = await supabase
        .from("courses")
        .update({
          title,
          slug,
          description: description || "",
          thumbnail_url: thumbnail_url || null,
          instructor: instructor || "AI Academy",
          content_type: content_type || "course",
          required_tier: required_tier || "standard",
          github_repo_url: github_repo_url || null,
          demo_url: demo_url || null,
          is_published: is_published ?? true,
          order_number: parseInt(order_number || "0", 10),
        })
        .eq("id", id);

      if (error) throw error;
      return NextResponse.json({ success: true, message: "อัปเดตคอร์สเรียนสำเร็จ" });
    } else {
      // Insert
      const { error } = await supabase
        .from("courses")
        .insert({
          title,
          slug,
          description: description || "",
          thumbnail_url: thumbnail_url || null,
          instructor: instructor || "AI Academy",
          content_type: content_type || "course",
          required_tier: required_tier || "standard",
          github_repo_url: github_repo_url || null,
          demo_url: demo_url || null,
          is_published: is_published ?? true,
          order_number: parseInt(order_number || "0", 10),
        });

      if (error) throw error;
      return NextResponse.json({ success: true, message: "สร้างคอร์สเรียนใหม่สำเร็จ" });
    }
  } catch (err: any) {
    console.error("Admin Courses POST Error:", err);
    return NextResponse.json({ error: err.message || "Failed to save course" }, { status: 500 });
  }
}

// DELETE: ลบคอร์ส
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
      return NextResponse.json({ error: "ต้องระบุ id ของคอร์ส" }, { status: 400 });
    }

    const { error } = await supabase.from("courses").delete().eq("id", id);
    if (error) throw error;

    return NextResponse.json({ success: true, message: "ลบคอร์สเรียนเรียบร้อยแล้ว" });
  } catch (err: any) {
    console.error("Admin Courses DELETE Error:", err);
    return NextResponse.json({ error: err.message || "Failed to delete course" }, { status: 500 });
  }
}
