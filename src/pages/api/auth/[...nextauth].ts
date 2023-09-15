import NextAuth, {Session} from 'next-auth'
import Google from 'next-auth/providers/google'
import type { DefaultSession } from 'next-auth';

export default NextAuth({
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET

        })
    ],
    callbacks: {
        jwt: async (params) => {
            console.log("Running 'jwt' callback")

            let apiTokens: { accessToken: string, refreshToken: string } = {}

            const accessToken = (params.token as any).accessToken;
            const refreshToken = (params.token as any).refreshToken;
            if (!accessToken) {
                const tokens = await signInWithApi(params.account?.id_token!)
                apiTokens.accessToken = tokens.accessToken;
                apiTokens.refreshToken = tokens.refreshToken;
            } else
                // if(isAccessTokenExpired(accessToken))
            {
                const tokens = await renewTokens(refreshToken)
                apiTokens.accessToken = tokens.accessToken;
                apiTokens.refreshToken = tokens.refreshToken;
            }

            const newToken = {
                ...params.token,
                accessToken: apiTokens.accessToken,
                refreshToken: apiTokens.refreshToken,
            }

            // TODO: replace the Google Identity times for the ones of the API
            delete newToken.iat
            delete newToken.exp
            delete newToken.jti
            return newToken;
        },
        session: params => {
            console.log("Running 'session' callback\n")
            const session: Session = {
                user: params.session.user,
                expires: params.session.expires,
                accessToken: (params.token as any).accessToken,
            }
            return session
        }
    }
})


async function signInWithApi(idToken: string) {
    console.log("signing in with idToken: " + idToken)
    return {
        accessToken: "randomAccessToken_" + Date.now() * 4,
        refreshToken: "randomRefreshToken_" + Date.now() * 2
    }
}

async function renewTokens(refreshToken: string) {
    console.log("renewing tokens with refreshToken: " + refreshToken)
    return {
        accessToken: "randomAccessToken_" + Date.now() * 4,
        refreshToken: "randomRefreshToken_" + Date.now() * 2
    }
}

declare module 'next-auth' {
    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface Session {
        accessToken: string
        user: DefaultSession['user'];
    }
}