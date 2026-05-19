/** @jest-environment jsdom */
/// <reference types="jest" />

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { LoginForm } from "@/app/auth/login/login-form";

const pushMock = jest.fn();
const refreshMock = jest.fn();
const signInMock = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
    refresh: refreshMock,
  }),
}));

jest.mock("next-auth/react", () => ({
  signIn: (...args: unknown[]) => signInMock(...args),
}));

describe("LoginForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.history.replaceState({}, "", "http://localhost/auth/login");
  });

  it("submits valid credentials and navigates on success", async () => {
    signInMock.mockResolvedValue({ error: null, url: "/" });

    render(<LoginForm socialProviders={[]} />);

    fireEvent.change(screen.getByRole("textbox", { name: /email/i }), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "Password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(signInMock).toHaveBeenCalledWith("credentials", {
        email: "john@example.com",
        password: "Password123",
        callbackUrl: "/",
        redirect: false,
      });
    });

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith("/");
      expect(refreshMock).toHaveBeenCalledTimes(1);
    });
  });

  it("shows an error message when credentials are invalid", async () => {
    signInMock.mockResolvedValue({ error: "CredentialsSignin", status: 401, ok: false, url: null });

    render(<LoginForm socialProviders={[]} />);

    fireEvent.change(screen.getByRole("textbox", { name: /email/i }), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "wrong-password" },
    });

    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    expect(await screen.findByText("Invalid email or password.")).toBeTruthy();
    expect(pushMock).not.toHaveBeenCalled();
  });
});
