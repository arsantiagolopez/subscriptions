import { TypeORMLegacyAdapter } from "@next-auth/typeorm-legacy-adapter";
import { NextApiRequest, NextApiResponse } from "next";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import "reflect-metadata";
import * as entities from "../../../entities";
import { connection } from "../../../utils/database";

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  return await NextAuth(req, res, {
    // Configure one or more authentication providers
    providers: [
      // Google one-click login
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID || "",
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        profile(profile) {
          return {
            id: profile?.sub,
            name: profile?.name,
            firstName: profile?.given_name,
            lastName: profile?.family_name,
            email: profile?.email,
            image: profile?.picture,
          };
        },
      }),
    ],
    // TypeORM database
    adapter: TypeORMLegacyAdapter(connection, { entities }),
    secret: process.env.SECRET,
    session: {
      // Seconds - How long until an idle session expires and is no longer valid.
      maxAge: 60 * 60 * 24 * 30, // 1 month
      // Seconds - Throttle how frequently to write to database to extend a session.
      // Use it to limit write operations. Set to 0 to always update the database.
      updateAge: 60 * 60 * 24 * 30, // 1 month
    },
    pages: {
      signIn: "/",
      error: "/",
    },
    // Cookies only accessible from HTTPS URLS
    useSecureCookies: process.env.NODE_ENV !== "development",
    // Production only cookie modifiers
    cookies:
      process.env.NODE_ENV !== "development"
        ? {
            sessionToken: {
              name: `__Secure-next-auth.session-token`,
              options: {
                httpOnly: true,
                sameSite: "lax",
                path: "/",
                secure: true,
                domain: process.env.DOMAIN,
              },
            },
          }
        : undefined,
    // Debugging
    debug: true,
    // Callbacks
    callbacks: {
      // Return userId on session
      async session({ session, user }) {
        session.userId = user.id;
        return Promise.resolve(session);
      },
    },
  });
}
