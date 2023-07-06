import type { User } from "@prisma/client";
import { Authenticator } from "remix-auth";
import { GitHubStrategy, SocialsProvider } from "remix-auth-socials";
import { db } from "~/db.server";
import { sessionStorage } from "~/services/session.server";

// Create an instance of the authenticator, pass a generic with what
// strategies will return and will store in the session
export let authenticator = new Authenticator<User>(sessionStorage, {
  throwOnError: true,
});

const getCallback = (provider: SocialsProvider) => {
  return `http://localhost:3000/auth/${provider}/callback`;
};

authenticator.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_SECRET_KEY as string,
      callbackURL: getCallback(SocialsProvider.GITHUB),
    },
    async ({ profile }) => {
      let user = await db.user.findUnique({
        where: {
          email: profile.emails[0].value,
        },
      });

      if (!user) {
        user = await db.user.create({
          data: {
            email: profile.emails[0].value,
            imageUrl: profile._json.avatar_url,
            username: profile._json.login,
          },
        });

        if (!user) throw new Error("Unable to create the user");
      }

      return user;
    }
  )
);
