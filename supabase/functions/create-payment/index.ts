import { serve } from "https://deno.land/std/http/server.ts";
import Stripe from "https://esm.sh/stripe@12.0.0?target=deno";
import "https://deno.land/std@0.177.0/dotenv/load.ts";

const stripe = Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
});

serve(async (req) => {
  try {
    const { letterId, customerData, planId, planPrice } = await req.json();

    if (!letterId || !customerData || !customerData.email || !planId || !planPrice) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: customerData.email,
      line_items: [
        {
          price_data: {
            currency: "brl",
            product_data: {
              name: `Carta de Amor (${planId})`,
              description: `Carta ID: ${letterId}`,
            },
            unit_amount: Math.round(planPrice * 100),
          },
          quantity: 1,
        },
      ],
      metadata: {
        letterId,
        customerName: customerData.name || "",
        phone: customerData.phone || "",
      },
      success_url: `https://seusite.com/carta/${letterId}?payment_success=true`,
      cancel_url: `https://seusite.com/create?payment_cancelled=true`,
    });

    return new Response(
      JSON.stringify({ url: session.url }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Erro na função:", err);
    return new Response(
      JSON.stringify({ error: "Erro ao criar sessão de pagamento" }),
      { status: 500 }
    );
  }
});
