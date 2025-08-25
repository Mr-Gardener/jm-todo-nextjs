import axios from "axios";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useRouter } from "next/navigation";
import { AuthProvider } from "../app/context/AuthContext"
import LoginPage from "@/app/auth/login/page";

jest.mock("axios");
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("Login Page", () => {
  it("renders login form", () => {
    render(
      <AuthProvider>
        <LoginPage />
      </AuthProvider>
    );
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  jest.useFakeTimers();

it("shows success message when login succeeds", async () => {
  const mockPush = jest.fn();
  (useRouter as jest.Mock).mockReturnValue({ push: mockPush });

  // Mock axios response
  (axios.post as jest.Mock).mockResolvedValue({
    data: {
      user: { id: 1, name: "Test User", email: "test@test.com" },
      access_token: "fake-token",
    },
  });

  render(
    <AuthProvider>
      <LoginPage />
    </AuthProvider>
  );

  fireEvent.change(screen.getByPlaceholderText(/email/i), {
    target: { value: "test@test.com" },
  });
  fireEvent.change(screen.getByPlaceholderText(/password/i), {
    target: { value: "123456" },
  });
  fireEvent.click(screen.getByRole("button", { name: /login/i }));

  await waitFor(() =>
    expect(screen.getByText(/login successful!/i)).toBeInTheDocument()
  );

  jest.runAllTimers();

  expect(mockPush).toHaveBeenCalledWith("/tasks");
});

});
