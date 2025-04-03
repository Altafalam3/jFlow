import NextAuth from "next-auth";
import LinkedInProvider from "next-auth/providers/linkedin";

export default NextAuth({
    providers: [
        LinkedInProvider({
            clientId: process.env.LINKEDIN_CLIENT_ID,
            clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
            authorization: {
                params: {
                    scope: "r_liteprofile r_emailaddress w_member_social",
                },
            },
        }),
    ],
    callbacks: {
        async jwt({ token, account }) {
            if (account) {
                token.accessToken = account.access_token;
            }
            return token;
        },
        async session({ session, token }) {
            session.accessToken = token.accessToken;
            return session;
        },
    },
});
