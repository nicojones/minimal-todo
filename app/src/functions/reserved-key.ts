import { SpecialProjectUrl } from "interfaces";

export const reservedKey = (
  projectKey: string | undefined
): projectKey is SpecialProjectUrl => {
  return (
    [SpecialProjectUrl.INBOX, SpecialProjectUrl.PRIORITY].indexOf(
      projectKey as unknown as SpecialProjectUrl
    ) >= 0
  );
};
