import Head from "next/head";
import styles from "./styles.module.scss";
import Link from "next/link";

export default function Posts() {
  return (
    <>
      <Head>
        <title>Posts | ig.news</title>
      </Head>
      <main className={styles.container}>
        <div className={styles.posts}>
          <Link href={"#"}>
            <time>12 de março de 2021</time>
            <strong>Creating a Monorepo with Lerna & Yarn Workspaces</strong>
            <p>
              in this guide we will create a Monorepo to manage multiple
              packages
            </p>
          </Link>
          <Link href={"#"}>
            <time>12 de março de 2021</time>
            <strong>Creating a Monorepo with Lerna & Yarn Workspaces</strong>
            <p>
              in this guide we will create a Monorepo to manage multiple
              packages
            </p>
          </Link>
          <Link href={"#"}>
            <time>12 de março de 2021</time>
            <strong>Creating a Monorepo with Lerna & Yarn Workspaces</strong>
            <p>
              in this guide we will create a Monorepo to manage multiple
              packages
            </p>
          </Link>
        </div>
      </main>
    </>
  );
}
