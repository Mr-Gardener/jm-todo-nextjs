import { render, screen, waitFor } from "@testing-library/react";
import TaskListPage from "../app/tasks/page"; 
import { AuthProvider } from "../app/context/AuthContext";
import axios from "axios";

jest.mock("axios");

beforeEach(() => {
  // since task is under protectedroute, mock a token so TaskListPage can fetch tasks
  window.localStorage.setItem("token", "fake-token");
});

afterEach(() => {
  window.localStorage.clear();
  jest.clearAllMocks();
});

describe("Task List Page", () => {
  it("displays tasks heading", async () => {
    (axios.get as jest.Mock).mockResolvedValue({ data: [] });

    render(
      <AuthProvider>
        <TaskListPage />
      </AuthProvider>
    );

    await waitFor(() =>
      expect(
        screen.getByRole("heading", { name: /task list/i })
      ).toBeInTheDocument()
    );
  });

  it("shows sample tasks if available", async () => {
    (axios.get as jest.Mock).mockResolvedValue({
      data: [
        { id: 1, title: "Sample Task", description: "test", isCompleted: false },
      ],
    });

    render(
      <AuthProvider>
        <TaskListPage />
      </AuthProvider>
    );

    await waitFor(() =>
      expect(screen.getByText(/sample task/i)).toBeInTheDocument()
    );
  });
});
