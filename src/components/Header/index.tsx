import Image from "next/image";
import Link from "next/link";
import styles from "./styles.module.scss";
import { SignInButton } from "../SignInButton";

export function Header() {
  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <Image src="/images/logo.svg" alt="logo" width={110} height={31} />
        <nav>
          <Link href="/" className={styles.active}>
            Home
          </Link>
          <Link href="/posts">Posts</Link>
        </nav>
        <SignInButton />
      </div>
    </header>
  );
}
