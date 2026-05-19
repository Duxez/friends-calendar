/** @jest-environment jsdom */

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { RegisterForm } from "@/app/auth/register/register-form";

const pushMock = jest.fn();
const refreshMock = jest.fn();
const signInMock = jest.fn();
const fetchMock = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
    refresh: refreshMock,
  }),
}));

jest.mock("next-auth/react", () => ({
  signIn: (...args: unknown[]) => signInMock(...args),
}));

describe("RegisterForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = fetchMock as unknown as typeof fetch;
  });

  it("creates account and signs in automatically on success", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({ user: { id: "u1" } }),
    });
    signInMock.mockResolvedValue({ error: null, url: "/" });

    render(<RegisterForm />);

    fireEvent.change(screen.getByRole("textbox", { name: /name/i }), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByRole("textbox", { name: /email/i }), {
      target: { value: "john@example.com" },
    });

    const passwordInputs = screen.getAllByLabelText(/password/i);
    fireEvent.change(passwordInputs[0], { target: { value: "Password123" } });
    fireEvent.change(passwordInputs[1], { target: { value: "Password123" } });

    fireEvent.click(screen.getByRole("button", { name: /create account/i }));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "John Doe",
          email: "john@example.com",
          password: "Password123",
          confirmPassword: "Password123",
        }),
      });
    });

    await waitFor(() => {
      expect(signInMock).toHaveBeenCalledWith("credentials", {
        email: "john@example.com",
        password: "Password123",
        callbackUrl: "/",
        redirect: false,
      });
      expect(pushMock).toHaveBeenCalledWith("/");
      expect(refreshMock).toHaveBeenCalledTimes(1);
    });
  });

  it("shows API error message when registration fails", async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      json: async () => ({ error: "Email is already in use." }),
    });

    render(<RegisterForm />);

    fireEvent.change(screen.getByRole("textbox", { name: /name/i }), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByRole("textbox", { name: /email/i }), {
      target: { value: "john@example.com" },
    });

    const passwordInputs = screen.getAllByLabelText(/password/i);
    fireEvent.change(passwordInputs[0], { target: { value: "Password123" } });
    fireEvent.change(passwordInputs[1], { target: { value: "Password123" } });

    fireEvent.click(screen.getByRole("button", { name: /create account/i }));

    expect(await screen.findByText("Email is already in use.")).toBeTruthy();
    expect(signInMock).not.toHaveBeenCalled();
    expect(pushMock).not.toHaveBeenCalled();
  });
});
