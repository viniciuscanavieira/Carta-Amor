
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@12.18.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.33.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Create a Supabase client with the service role key (to bypass RLS)
const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
  apiVersion: "2023-10-16",
});

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    const { sessionId } = await req.json();
    
    if (!sessionId) {
      throw new Error("Missing required data: sessionId is required");
    }
    
    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Get session data from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    // Determine payment status
    let paymentStatus = "pending";
    if (session.payment_status === "paid") {
      paymentStatus = "completed";
    } else if (session.status === "expired" || session.status === "canceled") {
      paymentStatus = "failed";
    }
    
    // Get letter details
    const { data: letterData, error: letterError } = await supabase
      .from("paid_letters")
      .select("letter_id, plan_type")
      .eq("payment_intent_id", sessionId)
      .single();
      
    if (letterError) {
      throw new Error(`Error fetching letter data: ${letterError.message}`);
    }
    
    // Update payment status in database
    const { error } = await supabase
      .from("paid_letters")
      .update({ payment_status: paymentStatus })
      .eq("payment_intent_id", sessionId);
    
    if (error) {
      throw new Error(`Error updating payment status: ${error.message}`);
    }
    
    return new Response(
      JSON.stringify({ 
        status: paymentStatus,
        plan_type: letterData?.plan_type || "basic",
        letter_id: letterData?.letter_id,
        success: true 
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200 
      }
    );
  } catch (error) {
    console.error("Error updating payment status:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400 
      }
    );
  }
});
