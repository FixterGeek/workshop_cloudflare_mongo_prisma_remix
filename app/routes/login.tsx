import {
  redirect,
  type ActionFunction,
  type LoaderArgs,
} from "@remix-run/cloudflare";
import { Form } from "@remix-run/react";
import { AiOutlineGoogle } from "react-icons/ai";
import { db } from "~/utils/db.server";
import {
  getAccessToken,
  getExtraData,
  redirectToGoogle,
} from "~/utils/google-login";
import { commitSession, getSession } from "~/utils/sessions";
import { ifUserRedirect } from "~/utils/user";
import { userWithoutId } from "~/utils/zod";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const intent = formData.get("intent");
  if (intent === "google-login") {
    return redirectToGoogle<typeof redirect>(redirect);
  }
  return null;
};

export const loader = async ({ request }: LoaderArgs) => {
  // await ifUserRedirect(request); // not a very good idea to bounce redirections
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  if (code) {
    const data = await getAccessToken(code);
    // check for errors @TODO
    const extra = await getExtraData(data.access_token);
    const body = {
      email: extra.email,
      name: extra.name,
      picture: extra.picture,
      access_token: extra.access_token,
    };
    // validate user data
    const validated = userWithoutId.safeParse(body);
    if (!validated.success) return null; // what should we do when google data is insufficient?
    console.log("Saving");
    const user = await db.user.upsert({
      where: {
        email: extra.email,
      },
      create: body,
      update: body,
    });
    // set cookie
    const session = await getSession(request.headers.get("Cookie"));
    session.set("userId", user.id);
    return redirect("/", {
      headers: {
        "set-cookie": await commitSession(session),
      },
    });
  }
  return null;
};

export default function Index() {
  return (
    <Form
      method="post"
      className="flex justify-center items-center min-h-screen"
    >
      <button
        name="intent"
        value="google-login"
        type="submit"
        className="bg-blue-200 py-2 px-8 text-lg rounded-md hover:bg-blue-300 flex items-center gap-2"
      >
        <span>
          <AiOutlineGoogle />
        </span>
        <span>Login con Google</span>
      </button>
    </Form>
  );
}
