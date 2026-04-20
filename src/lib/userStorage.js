export const CURRENT_USER_KEY = "currentUser";

export const DEFAULT_USER_AVATAR =
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=faces&auto=format&q=80";

/** 手机号脱敏：138****1234；含 86 时按国内 11 位处理 */
export function maskPhone(phone) {
  if (!phone || typeof phone !== "string") return "";
  let digits = phone.replace(/\D/g, "");
  if (digits.startsWith("86") && digits.length >= 13) {
    digits = digits.slice(2);
  }
  if (digits.length >= 11) {
    return `${digits.slice(0, 3)}****${digits.slice(-4)}`;
  }
  if (digits.length >= 7) {
    return `${digits.slice(0, 2)}****${digits.slice(-2)}`;
  }
  return "****";
}

export function buildCurrentUser(countryCode, phoneRaw) {
  const phoneDigits = String(phoneRaw).replace(/\s/g, "");
  const fullPhone = `${countryCode}${phoneDigits}`;
  const suffix = Math.floor(1000 + Math.random() * 9000);
  return {
    phone: fullPhone,
    nickname: `设计新星_${suffix}`,
    avatar: DEFAULT_USER_AVATAR,
  };
}
