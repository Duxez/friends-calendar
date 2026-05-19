"use client";

import {
  Body1,
  Button,
  Card,
  CardHeader,
  Caption1,
  Divider,
  Link as FluentLink,
  Text,
  makeStyles,
  tokens,
} from "@fluentui/react-components";
import { LogoutButton } from "@/components/logout-button";

type ProfileCardProps = {
  signedIn: boolean;
  name: string;
  email: string;
};

const useStyles = makeStyles({
  card: {
    display: "flex",
    flexDirection: "column",
    rowGap: tokens.spacingVerticalM,
  },
  signedInSection: {
    display: "flex",
    flexDirection: "column",
    rowGap: tokens.spacingVerticalS,
  },
  signedOutSection: {
    display: "flex",
    flexDirection: "column",
    rowGap: tokens.spacingVerticalM,
  },
  hintCard: {
    backgroundColor: tokens.colorNeutralBackground2,
  },
});

export function ProfileCard({ signedIn, name, email }: ProfileCardProps) {
  const styles = useStyles();

  return (
    <Card className={styles.card}>
      <CardHeader
        header={<Text weight="semibold" size={600}>Friends Calendar</Text>}
        description={<Body1>Your profile and session status.</Body1>}
      />

      {signedIn ? (
        <div className={styles.signedInSection}>
          <Body1>
            Signed in as <Text weight="semibold">{name}</Text>
          </Body1>
          <Caption1>Email: {email}</Caption1>
          <LogoutButton />
        </div>
      ) : (
        <div className={styles.signedOutSection}>
          <Body1>Sign in to access your account and start managing your calendar.</Body1>
          <Button as="a" href="/auth/login" appearance="primary">
            Log in
          </Button>
        </div>
      )}

      <Divider />

      <Card className={styles.hintCard}>
        <Body1>
          JWT auth is handled by the application database with optional social login providers.
        </Body1>
        {!signedIn ? (
          <Body1>
            New here? <FluentLink href="/auth/register">Create an account</FluentLink>
          </Body1>
        ) : null}
      </Card>
    </Card>
  );
}
