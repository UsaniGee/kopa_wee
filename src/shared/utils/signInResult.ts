/** The result of next-auth/react `signIn(..., { redirect: false })`. */
export interface SignInResultLike {
  ok: boolean;
  status: number;
  error?: string;
  code?: string;
  url: string | null;
}

/**
 * The failure code of a credentials sign-in, or null on success.
 * NextAuth v5 answers a wrong password with HTTP 200, so `ok` is true and the failure is only in
 * `error`/`code`; checking `ok` alone treats a bad password as a successful sign-in.
 */
export function signInFailureCode(result: SignInResultLike | undefined): string | null {
  if (!result) return "UNKNOWN";
  if (result.error) return result.code || result.error;
  return result.ok ? null : "UNKNOWN";
}
