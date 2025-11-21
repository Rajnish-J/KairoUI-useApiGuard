import { httpMessages } from "./httpMessage";

export function normalizationStatus(
  status: number | null,
  isSuccess: boolean
): string {
  if (status == null) {
    return isSuccess ? "Request Completed" : "NO Response from server";
  }

  if (httpMessages[status]) {
    return httpMessages[status];
  }

  return isSuccess ? "Request Successful" : "Request failed";
}
