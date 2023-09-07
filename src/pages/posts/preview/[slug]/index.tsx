import { getPrismicClient } from "@/services/prismic";
import { GetServerSideProps, GetStaticPaths, GetStaticProps } from "next";
import { getSession, useSession } from "next-auth/react";
import Head from "next/head";
import { RichText } from "prismic-dom";
import styles from "./styles.module.scss";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

interface PostProps {
  post: Post;
}

interface Post {
  slug: string;
  title: string;
  content: string;
  updatedAt: string;
}

export default function Post({ post }: PostProps) {
  const { data: session } = useSession();
  const router = useRouter();

  React.useEffect(() => {
    if (session?.activeSubscription) {
      router.push(`/posts/${post.slug}`);
    }
  }, [session]);

  return (
    <>
      <Head>
        <title>{post.title}</title>
      </Head>
      <main className={styles.container}>
        <article className={styles.post}>
          <h1>{post.title}</h1>
          <time>{post.updatedAt}</time>
          <div
            className={`${styles.postContent} ${styles.previewContent}`}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <div className={styles.continueReading}>
            Wanna continue reading?
            <Link href="/">Subscribe now 🤗</Link>
          </div>
        </article>
      </main>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug;

  const prismic = getPrismicClient();

  const response = await prismic.getByUID("publication", String(slug), {});

  const post = {
    slug,
    title: RichText.asText(response.data.title),
    content: RichText.asHtml(response.data.content.splice(0, 3)),
    updatedAt: new Date(response.last_publication_date).toLocaleDateString(
      "pt-BR",
      {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }
    ),
  };

  return {
    revalidate: 60 * 30, // 30 minutes
    props: {
      post,
    },
  };
};
