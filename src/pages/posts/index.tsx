import Head from "next/head";
import styles from "./styles.module.scss";
import Link from "next/link";
import { GetStaticProps } from "next";
import { getPrismicClient } from "@/services/prismic";
import { RichText } from "prismic-dom";

interface PostsProps {
  posts: Post[];
}

interface Post {
  slug: string;
  title: string;
  excerpt: string;
  updatedAt: string;
}

export default function Posts({ posts }: PostsProps) {
  return (
    <>
      <Head>
        <title>Posts | ig.news</title>
      </Head>
      <main className={styles.container}>
        <div className={styles.posts}>
          {posts.map((post) => (
            <Link href={`posts/${post.slug}`} key={post.slug}>
              <time>{post.updatedAt}</time>
              <strong>{post.title}</strong>
              <p>{post.excerpt}</p>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();

  const response = await prismic.getAllByType("publication", {
    fetch: ["publication.title", "publication.content"],
    pageSize: 100,
  });

  const posts = response.map((post) => ({
    slug: post.uid,
    title: RichText.asText(post.data.title),
    excerpt:
      post.data.content.find((content: any) => content.type === "paragraph")
        .text ?? "",
    updatedAt: new Date(post.last_publication_date).toLocaleDateString(
      "pt-BR",
      {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }
    ),
  }));

  return {
    props: {
      posts,
    },
  };
};
