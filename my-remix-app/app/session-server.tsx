import { createCookieSessionStorage, redirect } from "@remix-run/node";

// 🛑 Create a secure session storage
const sessionSecret =  "default_secret_key";

export const { getSession, commitSession, destroySession } = createCookieSessionStorage({
  cookie: {
    name: "_session",
    secrets: [sessionSecret],
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24, // 1 day
  },
});

// 🛑 Protect routes: Redirect to login if no session exists
export async function requireUserSession(request: Request) {
  const session = await getSession(request.headers.get("Cookie"));
  const userId = session.get("authtoken");
  
  if (!userId) {
    throw redirect("/login");
  }

  return userId;
}
