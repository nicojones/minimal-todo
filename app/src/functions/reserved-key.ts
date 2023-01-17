import { SpecialProjectUrl } from "interfaces";

export const reservedKey = (
  projectKey: string | undefined
): projectKey is SpecialProjectUrl => {
  return (
    [
      SpecialProjectUrl.INBOX,
      SpecialProjectUrl.PRIORITY,
      SpecialProjectUrl.DEADLINE,
      SpecialProjectUrl.TODAY,
    ].indexOf(projectKey as unknown as SpecialProjectUrl) >= 0
  );
};
