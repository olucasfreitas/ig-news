import { fauna } from "@/services/fauna";
import { query as q } from "faunadb";
import { stripe } from "@/services/stripe";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

type User = {
  ref: {
    id: string;
  };
  data: {
    stripe_costumer_id: string;
  };
};

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

    const user = await fauna.query<User>(
      q.Get(q.Match(q.Index("user_by_email"), q.Casefold(session.user.email)))
    );

    let stripeCostumerId = user.data.stripe_costumer_id;

    if (!stripeCostumerId) {
      const stripeCostumer = await stripe.customers.create({
        email: session.user.email,
      });

      await fauna.query(
        q.Update(q.Ref(q.Collection("users"), user.ref.id), {
          data: {
            stripe_costumer_id: stripeCostumer.id,
          },
        })
      );

      stripeCostumerId = stripeCostumer.id;
    }

    if (
      process.env.STRIPE_SUCCESS_URL === undefined ||
      process.env.STRIPE_CANCEL_URL === undefined
    ) {
      return res.status(500).json({ error: "Stripe urls not defined" });
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      customer: stripeCostumerId,
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
