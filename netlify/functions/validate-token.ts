// import { Handler } from "@netlify/functions";
// import { PrivyClient } from "@privy-io/server-auth";

// const privy = new PrivyClient(
//   process.env.NEXT_PUBLIC_PRIVY_APP_ID!,
//   process.env.PRIVY_APP_SECRET!,
// );

// export const handler: Handler = async (event) => {
//   const token = event.queryStringParameters?.token;

//   if (!token) {
//     return {
//       statusCode: 401,
//       body: JSON.stringify({ message: "Unauthorized: No token provided" }),
//     };
//   }

//   try {
//     const authTokenClaims = await privy.verifyAuthToken(token);
//     const userId = authTokenClaims.userId.replace("did:privy:", "");
//     const adminIds = JSON.parse(process.env.ADMIN_PRIVY_IDS || "[]");

//     if (!adminIds.includes(userId)) {
//       return {
//         statusCode: 403,
//         body: JSON.stringify({ message: "Forbidden: Not an admin" }),
//       };
//     }

//     return {
//       statusCode: 200,
//       body: JSON.stringify({ message: "Authorized" }),
//     };
//   } catch (error) {
//     console.error("Token verification error:", error);
//     return {
//       statusCode: 500,
//       body: JSON.stringify({ message: "Internal Server Error" }),
//     };
//   }
// };
