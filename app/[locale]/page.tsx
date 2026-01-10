import { redirect } from "@/i18n/routing";

export default function RootPage() {
  redirect({href: "/users", locale: "en"}); // Or just redirect("/users") and let it default? standard redirect takes string. next-intl redirect takes string or object.
}
