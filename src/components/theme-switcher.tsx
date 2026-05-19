"use client";

import { Switch, makeStyles, tokens } from "@fluentui/react-components";

type ThemeMode = "light" | "dark";

type ThemeSwitcherProps = {
  mode: ThemeMode;
  onToggle: (nextMode: ThemeMode) => void;
};

const useStyles = makeStyles({
  switch: {
    backgroundColor: tokens.colorNeutralBackground1,
    borderRadius: tokens.borderRadiusLarge,
    paddingTop: tokens.spacingVerticalXS,
    paddingBottom: tokens.spacingVerticalXS,
    paddingLeft: tokens.spacingHorizontalSNudge,
    paddingRight: tokens.spacingHorizontalSNudge,
    boxShadow: tokens.shadow4,
  },
});

export function ThemeSwitcher({ mode, onToggle }: ThemeSwitcherProps) {
  const styles = useStyles();

  return (
    <Switch
      checked={mode === "dark"}
      label={mode === "dark" ? "Dark" : "Light"}
      labelPosition="before"
      className={styles.switch}
      onChange={(_, data) => onToggle(data.checked ? "dark" : "light")}
    />
  );
}
