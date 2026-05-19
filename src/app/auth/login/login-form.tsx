"use client";

import { FormEvent, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import {
  Body1,
  Button,
  Card,
  CardHeader,
  Divider,
  Field,
  Input,
  Link as FluentLink,
  Text,
  makeStyles,
  tokens,
} from "@fluentui/react-components";

type SocialProvider = {
  id: string;
  label: string;
};

type LoginFormProps = {
  socialProviders: SocialProvider[];
};

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
  socialSection: {
    display: "flex",
    flexDirection: "column",
    rowGap: tokens.spacingVerticalS,
  },
  footer: {
    color: tokens.colorNeutralForeground3,
  },
  errorText: {
    color: tokens.colorPaletteRedForeground1,
  },
});

export function LoginForm({ socialProviders }: LoginFormProps) {
  const router = useRouter();
  const styles = useStyles();

  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const getCallbackUrl = () => {
    if (typeof window === "undefined") {
      return "/";
    }

    const searchParams = new URLSearchParams(window.location.search);
    return searchParams.get("callbackUrl") ?? "/";
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");
    const callbackUrl = getCallbackUrl();

    startTransition(async () => {
      const result = await signIn("credentials", {
        email,
        password,
        callbackUrl,
        redirect: false,
      });

      if (!result || result.error) {
        setError("Invalid email or password.");
        return;
      }

      router.push(result.url ?? callbackUrl);
      router.refresh();
    });
  };

  return (
    <Card className={styles.card}>
      <CardHeader
        header={<Text weight="semibold" size={500}>Log in</Text>}
        description={<Body1>Use your email and password to sign in.</Body1>}
      />

      <form onSubmit={onSubmit} className={styles.form}>
        <Field label="Email" required>
          <Input name="email" type="email" required autoComplete="email" />
        </Field>

        <Field label="Password" required>
          <Input
            name="password"
            type="password"
            required
            autoComplete="current-password"
          />
        </Field>

        {error ? <Text className={styles.errorText}>{error}</Text> : null}

        <Button type="submit" appearance="primary" disabled={isPending}>
          {isPending ? "Signing in..." : "Sign in"}
        </Button>
      </form>

      {socialProviders.length > 0 ? (
        <div className={styles.socialSection}>
          <Divider>or continue with</Divider>
          {socialProviders.map((provider) => (
            <Button
              key={provider.id}
              type="button"
              appearance="secondary"
              disabled={isPending}
              onClick={() => signIn(provider.id, { callbackUrl: getCallbackUrl() })}
            >
              Continue with {provider.label}
            </Button>
          ))}
        </div>
      ) : null}

      <Body1 className={styles.footer}>
        Don&apos;t have an account? <FluentLink href="/auth/register">Create one</FluentLink>
      </Body1>
    </Card>
  );
}
