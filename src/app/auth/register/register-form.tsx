"use client";

import { FormEvent, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import {
  Body1,
  Button,
  Card,
  CardHeader,
  Field,
  Input,
  Link as FluentLink,
  Text,
  makeStyles,
  tokens,
} from "@fluentui/react-components";

const useStyles = makeStyles({
  card: {
    display: "flex",
    flexDirection: "column",
    rowGap: tokens.spacingVerticalM,
    backgroundColor: tokens.colorNeutralBackground1,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    rowGap: tokens.spacingVerticalM,
  },
  footer: {
    color: tokens.colorNeutralForeground3,
  },
  errorText: {
    color: tokens.colorPaletteRedForeground1,
  },
});

export function RegisterForm() {
  const router = useRouter();
  const styles = useStyles();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const formData = new FormData(event.currentTarget);
    const payload = {
      name: String(formData.get("name") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      password: String(formData.get("password") ?? ""),
      confirmPassword: String(formData.get("confirmPassword") ?? ""),
    };

    startTransition(async () => {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as { error?: string } | null;
        setError(body?.error ?? "Unable to create account.");
        return;
      }

      const signInResult = await signIn("credentials", {
        email: payload.email,
        password: payload.password,
        callbackUrl: "/",
        redirect: false,
      });

      if (!signInResult || signInResult.error) {
        setError("Account created, but automatic sign-in failed. Please log in.");
        router.push("/auth/login");
        return;
      }

      router.push(signInResult.url ?? "/");
      router.refresh();
    });
  };

  return (
    <Card className={styles.card}>
      <CardHeader
        header={<Text weight="semibold" size={500}>Create account</Text>}
        description={<Body1>Set up your account to use Friends Calendar.</Body1>}
      />

      <form onSubmit={onSubmit} className={styles.form}>
        <Field label="Name" required>
          <Input name="name" required autoComplete="name" />
        </Field>

        <Field label="Email" required>
          <Input name="email" type="email" required autoComplete="email" />
        </Field>

        <Field label="Password" required>
          <Input
            name="password"
            type="password"
            minLength={8}
            required
            autoComplete="new-password"
          />
        </Field>

        <Field label="Confirm password" required>
          <Input
            name="confirmPassword"
            type="password"
            minLength={8}
            required
            autoComplete="new-password"
          />
        </Field>

        {error ? <Text className={styles.errorText}>{error}</Text> : null}

        <Button type="submit" appearance="primary" disabled={isPending}>
          {isPending ? "Creating account..." : "Create account"}
        </Button>
      </form>

      <Body1 className={styles.footer}>
        Already have an account? <FluentLink href="/auth/login">Log in</FluentLink>
      </Body1>
    </Card>
  );
}
