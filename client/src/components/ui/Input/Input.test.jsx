import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import Input from "./Input";

describe("Input", () => {
  it("keeps the password field enabled and interactive", () => {
    const handleChange = vi.fn();

    render(
      <Input
        label="Password"
        type="password"
        name="password"
        placeholder="Enter your password"
        value=""
        onChange={handleChange}
      />,
    );

    const input = screen.getByPlaceholderText("Enter your password");

    expect(input).toHaveAttribute("type", "password");
    expect(input).not.toBeDisabled();

    fireEvent.change(input, { target: { value: "secret" } });

    expect(handleChange).toHaveBeenCalledTimes(1);
  });
});
