import type { InterfaceLocale } from "../domain/catalogue/types";
import { ar } from "./ar";
import { en } from "./en";
import { fr } from "./fr";

export const messages = { en, fr, ar };
export type { Messages } from "./en";

export function getDirection(locale: InterfaceLocale): "ltr" | "rtl" {
  return locale === "ar" ? "rtl" : "ltr";
}
