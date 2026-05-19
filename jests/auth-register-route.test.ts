import { POST } from "@/app/api/auth/register/route";

const findUniqueMock = jest.fn();
const createMock = jest.fn();
const hashMock = jest.fn();

jest.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: (...args: unknown[]) => findUniqueMock(...args),
      create: (...args: unknown[]) => createMock(...args),
    },
  },
}));

jest.mock("bcryptjs", () => ({
  hash: (...args: unknown[]) => hashMock(...args),
}));

describe("POST /api/auth/register", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns 400 for invalid payload", async () => {
    const request = new Request("http://localhost/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "bad-email",
        password: "short",
      }),
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error).toBe("Invalid registration payload.");
    expect(findUniqueMock).not.toHaveBeenCalled();
    expect(createMock).not.toHaveBeenCalled();
  });

  it("returns 409 when email already exists", async () => {
    findUniqueMock.mockResolvedValue({ id: "u1" });

    const request = new Request("http://localhost/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Jane Doe",
        email: "jane@example.com",
        password: "Password123",
        confirmPassword: "Password123",
      }),
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(409);
    expect(body.error).toBe("Email is already in use.");
    expect(createMock).not.toHaveBeenCalled();
  });

  it("creates a user and returns 201 for valid payload", async () => {
    findUniqueMock.mockResolvedValue(null);
    hashMock.mockResolvedValue("hashed-password");
    createMock.mockResolvedValue({
      id: "u2",
      name: "Jane Doe",
      email: "jane@example.com",
    });

    const request = new Request("http://localhost/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Jane Doe",
        email: "JANE@EXAMPLE.COM",
        password: "Password123",
        confirmPassword: "Password123",
      }),
    });

    const response = await POST(request);
    const body = await response.json();

    expect(findUniqueMock).toHaveBeenCalledWith({ where: { email: "jane@example.com" } });
    expect(hashMock).toHaveBeenCalledWith("Password123", 12);
    expect(createMock).toHaveBeenCalledWith({
      data: {
        name: "Jane Doe",
        email: "jane@example.com",
        password: "hashed-password",
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    expect(response.status).toBe(201);
    expect(body.user).toEqual({
      id: "u2",
      name: "Jane Doe",
      email: "jane@example.com",
    });
  });
});
