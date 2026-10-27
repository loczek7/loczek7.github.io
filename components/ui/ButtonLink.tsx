import type { ComponentPropsWithoutRef } from "react";
import styles from "./Button.module.css";

type ButtonLinkProps = ComponentPropsWithoutRef<"a"> & {
  variant?: "primary" | "ghost";
};

export function ButtonLink({
  variant = "primary",
  className,
  ...props
}: ButtonLinkProps) {
  const classes = [styles.btn, styles[variant], className]
    .filter(Boolean)
    .join(" ");
  return <a className={classes} {...props} />;
}
