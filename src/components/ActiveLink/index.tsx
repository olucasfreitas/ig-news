import Link, { LinkProps } from "next/link";
import { useRouter } from "next/router";

interface ActiveLinkProps extends LinkProps {
  children: React.ReactNode;
  activeClassName: string;
}

export function ActiveLink({
  children,
  activeClassName,
  ...rest
}: ActiveLinkProps) {
  const { asPath } = useRouter();

  const classname = asPath === rest.href ? activeClassName : "";

  return (
    <Link className={classname} {...rest}>
      {children}
    </Link>
  );
}
