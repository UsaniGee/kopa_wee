/** Contact fields selected for roommate matches; removed again unless the interest was accepted. */
export const CONTACT_SELECT = { phone: true, email: true } as const;

/** Phone and email are shared only after the request owner accepts the interest. */
export function contactIfAccepted<T extends { phone?: string | null; email?: string }>(status: string, person: T) {
  if (status === "ACCEPTED") return person;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- strip contact fields
  const { phone, email, ...rest } = person;
  return rest;
}
