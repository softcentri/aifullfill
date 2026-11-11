import { NextResponse } from "next/server";
import { verifyAdmin } from "@/utils/supabase/admin-auth";

export const dynamic = "force-dynamic";

// GET: Fetch all affiliates and payouts
export async function GET() {
  const auth = await verifyAdmin();
  if (!auth.isAdmin) {
    return NextResponse.json({ error: auth.error || "Unauthorized" }, { status: 403 });
  }

  const { supabase } = auth;

  try {
    // 1. Fetch all affiliates
    const { data: affiliates, error: affError } = await supabase
      .from("affiliates")
      .select("*, profiles:user_id(full_name, email)")
      .order("created_at", { ascending: false });

    if (affError) throw affError;

    // 2. Fetch payouts
    const { data: payouts, error: payError } = await supabase
      .from("affiliate_payouts")
      .select("*, affiliates:affiliate_id(code, bank_name, bank_account_no, bank_account_name, profiles:user_id(full_name, email))")
      .order("created_at", { ascending: false });

    if (payError) throw payError;

    // 3. Fetch recent commissions
    const { data: commissions, error: commError } = await supabase
      .from("affiliate_commissions")
      .select("*, affiliates:affiliate_id(code)")
      .order("created_at", { ascending: false })
      .limit(50);

    if (commError) throw commError;

    return NextResponse.json({
      affiliates: affiliates || [],
      payouts: payouts || [],
      commissions: commissions || [],
    });
  } catch (error: any) {
    console.error("Admin affiliates fetch error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PATCH: Approve or update payout status
export async function PATCH(request: Request) {
  const auth = await verifyAdmin();
  if (!auth.isAdmin) {
    return NextResponse.json({ error: auth.error || "Unauthorized" }, { status: 403 });
  }

  const { supabase } = auth;

  try {
    const body = await request.json();
    const { payout_id, status, notes, slip_url } = body;

    if (!payout_id || !status) {
      return NextResponse.json({ error: "Missing payout_id or status" }, { status: 400 });
    }

    // Get payout record first
    const { data: payout, error: getError } = await supabase
      .from("affiliate_payouts")
      .select("*")
      .eq("id", payout_id)
      .single();

    if (getError || !payout) {
      return NextResponse.json({ error: "Payout not found" }, { status: 404 });
    }

    // Update payout
    const updateData: any = {
      status,
      notes: notes || payout.notes,
      slip_url: slip_url || payout.slip_url,
    };
    if (status === "approved" || status === "paid") {
      updateData.processed_at = new Date().toISOString();
    }

    const { error: updateError } = await supabase
      .from("affiliate_payouts")
      .update(updateData)
      .eq("id", payout_id);

    if (updateError) throw updateError;

    // If rejected, refund the unpaid_balance back to affiliate
    if (status === "rejected" && payout.status === "pending") {
      try {
        const { error: rpcError } = await supabase.rpc("increment_affiliate_balance", {
          aff_id: payout.affiliate_id,
          amount_to_add: payout.amount,
        });
        if (rpcError) throw rpcError;
      } catch {
        // Fallback if RPC doesn't exist
        const { data: aff } = await supabase
          .from("affiliates")
          .select("unpaid_balance")
          .eq("id", payout.affiliate_id)
          .single();
        if (aff) {
          await supabase
            .from("affiliates")
            .update({ unpaid_balance: (aff.unpaid_balance || 0) + payout.amount })
            .eq("id", payout.affiliate_id);
        }
      }
    }

    return NextResponse.json({ success: true, message: `Payout status updated to ${status}` });
  } catch (error: any) {
    console.error("Admin payout update error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
