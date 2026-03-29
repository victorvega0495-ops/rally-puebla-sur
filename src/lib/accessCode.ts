const ACCESS_KEY = "rally-access";
const EXPIRY_DAYS = 7;

interface AccessData {
  code: string;
  section: string;
  expiresAt: number;
}

export const checkLocalAccess = (section: "exclusive" | "classes" | "both"): boolean => {
  try {
    const raw = localStorage.getItem(ACCESS_KEY);
    if (!raw) return false;
    const data: AccessData = JSON.parse(raw);
    if (Date.now() > data.expiresAt) {
      localStorage.removeItem(ACCESS_KEY);
      return false;
    }
    return data.section === "both" || data.section === section;
  } catch {
    return false;
  }
};

export const saveLocalAccess = (code: string, section: string) => {
  const data: AccessData = {
    code,
    section,
    expiresAt: Date.now() + EXPIRY_DAYS * 24 * 60 * 60 * 1000,
  };
  localStorage.setItem(ACCESS_KEY, JSON.stringify(data));
};

export const clearLocalAccess = () => {
  localStorage.removeItem(ACCESS_KEY);
};
