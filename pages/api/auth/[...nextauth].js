import NextAuth from "next-auth";
import Auth0Provider from "next-auth/providers/auth0";

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    Auth0Provider({
      clientId: process.env.AUTH0_CLIENT_ID,
      clientSecret: process.env.AUTH0_CLIENT_SECRET,
      issuer: process.env.AUTH0_ISSUER_BASE_URL,
      audience: process.env.AUTH0_AUDIENCE,
      idToken: true,
      useRefreshTokens: true,
      cacheLocation: "localstorage",
      token: {
        params: {
          audience: process.env.AUTH0_AUDIENCE,
        },
      },
      authorization: {
        params: {
          audience: encodeURI(process.env.AUTH0_AUDIENCE),
          scope: "openid email profile offline_access refresh_token",
        },
      },
    }),
  ],
  secret: process.env.AUTH0_SECRET,
  session: {
    strategy: "jwt",
    jwt: true,
    secret: process.env.NEXTAUTH_SECRET,
  },
  callbacks: {
    async signIn() {
      return true;
    },
    async redirect({ url, baseUrl }) {
      return url.startsWith(baseUrl)
        ? Promise.resolve(url)
        : Promise.resolve(baseUrl);
    },
    async session({ session, token }) {
      if (token) {
        session.user = { ...token };
        delete session.user["accessToken"];
        session.accessToken = token.accessToken;
        session.error = token.error;
      }
      return session;
    },
    async jwt({ token, account }) {
      // Persist the OAuth access_token to the token right after signin
      if (account || token) {
        token.accessToken = account?.access_token || token?.accessToken || null;
        token.refreshToken =
          account?.refresh_token || token?.refreshToken || null; // to include refresh token
      }

      return token;
    },
  },
};
export default NextAuth(authOptions);
