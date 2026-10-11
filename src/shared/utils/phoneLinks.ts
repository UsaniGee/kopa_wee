/** Digits in international form (2348031234567), or null if the number can't be dialled. */
function internationalDigits(phone: string | null | undefined): string | null {
  const digits = (phone ?? "").replace(/\D/g, "");
  const intl = digits.startsWith("0") ? `234${digits.slice(1)}` : digits;
  return intl.length >= 10 && intl.length <= 15 ? intl : null;
}

export function whatsAppLink(phone: string | null | undefined, message?: string): string | null {
  const intl = internationalDigits(phone);
  if (!intl) return null;
  return `https://wa.me/${intl}${message ? `?text=${encodeURIComponent(message)}` : ""}`;
}

export function telLink(phone: string | null | undefined): string | null {
  const intl = internationalDigits(phone);
  return intl ? `tel:+${intl}` : null;
}
