import { ActionArgs, LoaderArgs } from "@remix-run/node";
import { authenticator } from "~/services/auth.server";

export async function loader({ params, request }: LoaderArgs) {
  if (typeof params.provider !== "string") throw new Error("invalid provder");

  return await authenticator.authenticate(params.provider, request, {
    successRedirect: "/chat",
    failureRedirect: "/",
  });
}
