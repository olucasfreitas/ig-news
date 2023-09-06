import { stripe } from "@/services/stripe";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const session = await getSession({ req });

    if (!session?.user?.email) {
      return res.status(400).json({
        message: "Logged user does not have an e-mail",
      });
    }

    const stripeCostumer = await stripe.customers.create({
      email: session?.user?.email,
    });

    if (
      process.env.STRIPE_SUCCESS_URL === undefined ||
      process.env.STRIPE_CANCEL_URL === undefined
    ) {
      return res.status(500).json({ error: "Stripe urls not defined" });
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      customer: stripeCostumer.id,
      payment_method_types: ["card"],
      billing_address_collection: "required",
      line_items: [
        {
          price: "price_1Nn3kFBLB33nS2L6BeeLxt9B",
          quantity: 1,
        },
      ],
      mode: "subscription",
      allow_promotion_codes: true,
      success_url: process.env.STRIPE_SUCCESS_URL,
      cancel_url: process.env.STRIPE_CANCEL_URL,
    });

    return res.status(200).json({ sessionId: checkoutSession.id });
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method not allowed");
  }
}
