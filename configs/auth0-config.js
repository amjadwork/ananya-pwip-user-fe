const auth0Config = {
  domain: "YOUR_AUTH0_DOMAIN",
  clientId: "YOUR_AUTH0_CLIENT_ID",
  clientSecret: "YOUR_AUTH0_CLIENT_SECRET", // Only needed for server-side calls
  audience: "YOUR_API_IDENTIFIER", // Optional, if you're using an API
};

export default auth0Config;
