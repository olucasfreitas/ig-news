import Image from "next/image";
import Link from "next/link";
import styles from "./styles.module.scss";
import { SignInButton } from "../SignInButton";
import { useRouter } from "next/router";
import { ActiveLink } from "@/components/ActiveLink";

export function Header() {
  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <Image src="/images/logo.svg" alt="logo" width={110} height={31} />
        <nav>
          <ActiveLink href="/" activeClassName={styles.active}>
            Home
          </ActiveLink>
          <ActiveLink href="/posts" activeClassName={styles.active}>
            Posts
          </ActiveLink>
        </nav>
        <SignInButton />
      </div>
    </header>
  );
}
