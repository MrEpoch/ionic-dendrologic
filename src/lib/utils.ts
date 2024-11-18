import { twMerge } from "tailwind-merge";
import { ClassValue, clsx } from "clsx";
import { emailName, passwordResetSessionName, sessionName } from "./config";
import { SecureStoragePlugin } from "capacitor-secure-storage-plugin";
import { useHistory } from "react-router";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function truncateString(
  str: string,
  maxLen: number,
): {
  value: string;
  isTruncated: boolean;
} {
  if (!str) {
    return {
      value: "",
      isTruncated: false,
    };
  }
  return {
    value: str.length <= maxLen ? str : `${str.slice(0, maxLen)}...`,
    isTruncated: !(str.length <= maxLen),
  };
}

export async function errorHandler(errorType: string) {
  const keys = await SecureStoragePlugin.keys();
  const history = useHistory();
  switch (errorType) {
    case "UNAUTHORIZED":
      keys.value.includes(sessionName) &&
        (await SecureStoragePlugin.remove({ key: sessionName }));
      keys.value.includes(emailName) &&
        (await SecureStoragePlugin.remove({ key: emailName }));
      keys.value.includes(passwordResetSessionName) &&
        (await SecureStoragePlugin.remove({ key: passwordResetSessionName }));
      return history.push("/auth/login");
    case "EMAIL_NOT_VERIFIED":
      return history.push("/auth/verify-email");
    case "2FA_NOT_ENABLED":
      return history.push("/auth/2fa/setup");
    case "BAD_REQUEST":
      return "BAD_REQUEST";
    case "FILE_UPLOAD_ERROR":
      // TODO
      return history.push("/");
    case "TOO_MANY_REQUESTS":
      return history.push("/");
    case "EMAIL_NOT_AVAILABLE":
      return "EMAIL_NOT_AVAILABLE";
    case "WEAK_PASSWORD":
      return "WEAK_PASSWORD";
    case "INTERNAL_SERVER_ERROR":
      return history.push("/");
    case "UNKNOWN_GEO_REQUEST":
      return history.push("/");
    case "FORBIDDEN":
      return history.push("/");
    case "INVALID_KEY":
      return "INVALID_KEY";
    case "INVALID_CODE":
      return "INVALID_CODE";
    case "INVALID_RECOVERY_CODE":
      return "INVALID_RECOVERY_CODE";
    default:
      return history.push("/");
  }
}
