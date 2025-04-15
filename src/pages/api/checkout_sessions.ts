import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    const { letterId, customerData, planId, planPrice } = req.body;

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

    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error("Erro ao criar checkout:", error);
    res.status(500).json({ error: "Erro ao criar sessão de pagamento." });
  }
}
