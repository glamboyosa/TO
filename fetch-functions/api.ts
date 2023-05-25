import { UserAuthType } from "@/types/user"

export const Auth = {
  fetchUser: (): Promise<UserAuthType> =>
    fetch("/api/users").then((res) => res.json()),
}
