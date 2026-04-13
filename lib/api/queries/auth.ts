import { useMutation } from "@tanstack/react-query"
import { api } from "@/lib/api/client"

export interface RegisterInput {
  email: string
  password: string
  firstName: string
  arrondissement?: number
}

export function useRegister() {
  return useMutation({
    mutationFn: (input: RegisterInput) =>
      api.post<{ id: string }>("/api/auth/register", input),
  })
}
