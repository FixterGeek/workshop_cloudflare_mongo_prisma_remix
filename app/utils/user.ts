import { db } from "./db.server";
import { getSession } from "./sessions";
import { redirect } from "@remix-run/cloudflare";
import type { UserType } from "./zod";

export const ifUserRedirect = async (
  request: Request,
  redirectUrl: string = "/"
): Promise<null> => {
  const session = await getSession(request.headers.get("Cookie"));
  if (session.has("userId")) throw redirect(redirectUrl);
  return null;
};

export const getUserOrRedirect = async (
  request: Request,
  redirectUrl: string = "/login"
): Promise<UserType> => {
  const session = await getSession(request.headers.get("Cookie"));
  if (!session.has("userId")) throw redirect(redirectUrl);
  const user = await db.user.findUnique({
    where: { id: session.get("userId") },
  });
  if (!user) throw redirect(redirectUrl);
  return user as UserType;
};

export const getUserOrNull = async (
  request: Request
): Promise<UserType | null> => {
  const session = await getSession(request.headers.get("Cookie"));
  if (!session.has("userId")) return null;
  return await db.user.findUnique({ where: { id: session.get("userId") } });
};
