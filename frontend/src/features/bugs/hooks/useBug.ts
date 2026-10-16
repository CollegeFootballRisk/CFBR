import { useMutation } from "@tanstack/react-query";
import { createBug } from "../api/bug";

export function useCreateBug() {
  return useMutation({
    mutationFn: createBug,
    retry: false,
  });
}
