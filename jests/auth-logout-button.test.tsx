/** @jest-environment jsdom */

import { fireEvent, render, screen } from "@testing-library/react";
import { LogoutButton } from "@/components/logout-button";

const signOutMock = jest.fn();

jest.mock("next-auth/react", () => ({
  signOut: (...args: unknown[]) => signOutMock(...args),
}));

describe("LogoutButton", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("calls signOut with auth callback URL", () => {
    render(<LogoutButton />);

    fireEvent.click(screen.getByRole("button", { name: /log out/i }));

    expect(signOutMock).toHaveBeenCalledWith({ callbackUrl: "/auth/login" });
  });
});
