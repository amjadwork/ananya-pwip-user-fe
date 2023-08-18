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
      authorization: {
        params: {
          audience: encodeURI(process.env.AUTH0_AUDIENCE),
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
    async redirect({ baseUrl }) {
      return baseUrl;
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
      if (account) {
        token.accessToken = account.access_token;
      }

      return token;
    },
  },
};
export default NextAuth(authOptions);
