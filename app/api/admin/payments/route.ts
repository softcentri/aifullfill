import { NextResponse } from "next/server";
import { verifyAdmin } from "@/utils/supabase/admin-auth";

export const dynamic = "force-dynamic";

// GET: ดึงรายการแจ้งโอนและสลิปทั้งหมดสำหรับ Admin
export async function GET() {
  const auth = await verifyAdmin();
  if (!auth.isAdmin) {
    return NextResponse.json({ error: auth.error || "Unauthorized" }, { status: 403 });
  }

  const { supabase } = auth;

  try {
    const { data: orders, error } = await supabase
      .from("payment_orders")
      .select(`
        *,
        profiles:user_id (
          full_name,
          email
        )
      `)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ orders: orders || [] });
  } catch (error: any) {
    console.error("Admin fetch payment orders error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PATCH: อนุมัติ (approved) หรือ ปฏิเสธ (rejected) สลิปโอนเงิน
export async function PATCH(request: Request) {
  const auth = await verifyAdmin();
  if (!auth.isAdmin) {
    return NextResponse.json({ error: auth.error || "Unauthorized" }, { status: 403 });
  }

  const { supabase } = auth;

  try {
    const body = await request.json();
    const { orderId, action, adminNote } = body;

    if (!orderId || !["approved", "rejected"].includes(action)) {
      return NextResponse.json(
        { error: "ข้อมูลไม่ครบถ้วน หรือคำสั่งไม่ถูกต้อง" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase.rpc("admin_review_payment_order", {
      p_order_id: orderId,
      p_action: action,
      p_admin_note: adminNote || null,
    });

    if (error) throw error;

    return NextResponse.json({
      success: true,
      result: data,
      message:
        action === "approved"
          ? "อนุมัติสลิปและยืนยันสิทธิ์สมาชิก + คำนวณค่าคอมมิชชั่นเรียบร้อยแล้ว"
          : "ปฏิเสธสลิปและระงับสิทธิ์ชั่วคราวเรียบร้อยแล้ว",
    });
  } catch (error: any) {
    console.error("Admin review payment order error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
