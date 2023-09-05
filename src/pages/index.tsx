import Head from "next/head";
import Image from "next/image";
import styles from "./home.module.scss";
import { SubscribeButton } from "@/components/SubscribeButton";
import { GetServerSideProps } from "next";
import { stripe } from "@/services/stripe";

interface HomeProps {
  product: {
    priceId: string;
    amount: number;
  };
}

export default function Home({ product }: HomeProps) {
  return (
    <>
      <Head>
        <title>Home | ig.news</title>
      </Head>
      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          <span>👏 Hey, welcome</span>
          <h1>
            News about the <span>React</span> world.
          </h1>
          <p>
            Get access to all the publication <br />
            <span>for {product.amount} a month</span>
          </p>

          <SubscribeButton priceId={product.priceId} />
        </section>
        <Image
          src="images/avatar.svg"
          alt="girl coding"
          width={600}
          height={600}
        />
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const price = await stripe.prices.retrieve("price_1Nn3kFBLB33nS2L6BeeLxt9B");

  if (!price.unit_amount) {
    throw new Error("Price not found");
  }

  const product = {
    priceId: price.id,
    amount: new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price.unit_amount / 100),
  };

  return {
    props: {
      product,
    },
  };
};
