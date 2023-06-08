import type {
  ActionFunction,
  LoaderFunction,
  V2_MetaFunction,
} from "@remix-run/cloudflare";
import { Form, useLoaderData, useNavigation } from "@remix-run/react";
import { db } from "~/utils/db.server";
import { getUserOrRedirect } from "~/utils/user";
import { type CommentType, commentSchema, type UserType } from "~/utils/zod";
import { json, redirect } from "@remix-run/cloudflare";
import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { CgDarkMode } from "react-icons/cg";
import { AiOutlineSend } from "react-icons/ai";
import CommentList from "~/components/CommentsList";

export const meta: V2_MetaFunction = () => {
  return [
    { title: "Demo comments micro-app" },
    { name: "description", content: "Hola blissmo" },
  ];
};

export const action: ActionFunction = async ({ request }) => {
  const user = await getUserOrRedirect(request);
  const formData = await request.formData();
  const text = formData.get("text");
  // building 👨🏻‍💻
  const attempt = {
    userId: user.id,
    text,
  };
  // validating 🚫
  const validated = commentSchema.safeParse(attempt);
  if (!validated.success)
    return json({ ok: false, error: validated.error }, { status: 400 });
  // saving 💾
  await db.comment.create({ data: validated.data });
  throw redirect("/");
};

type LoaderData = {
  comments: CommentType[];
  user: UserType;
};
export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUserOrRedirect(request);
  const comments = await db.comment.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: {
          picture: true,
          name: true,
        },
      },
    },
  });
  // const users = await db.user.count();
  return { comments, user };
};

export default function Index() {
  const navigation = useNavigation();
  // this is the real end to end Type saety
  const { comments, user } = useLoaderData<LoaderData>();
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const toggleTheme = () => {
    if (theme === "dark") {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  };

  return (
    <article className={theme}>
      <div className="dark:bg-slate-900 min-h-screen bg-gray-100">
        <nav className="h-20 p-4 bg-gray-300 flex justify-between dark:bg-gray-800">
          <img
            className="h-full rounded-full border-4 border-black"
            src={user.picture}
            alt="avatar"
          />
          <button
            onClick={toggleTheme}
            className="dark:text-white bg-slate-400 px-3 rounded-xl text-2xl box-border dark:bg-slate-900"
          >
            <CgDarkMode />
          </button>
        </nav>
        <main className={twMerge("max-w-3xl mx-auto mt-20")}>
          <h2 className="text-2xl font-bold dark:text-white">
            Comentarios previos:
          </h2>
          <section className="grid gap-1  max-h-[400px] overflow-y-scroll my-4">
            <CommentList comments={comments} />
          </section>
          <Form method="post" className="grid">
            <label
              className="text-2xl font-bold mb-4 dark:text-white"
              htmlFor="textarea"
            >
              Deja un comentario:
            </label>
            <textarea
              className="border rounded-xl min-h-[200px] mb-4 px-4 py-2 text-xl dark:bg-gray-800 dark:text-white"
              id="textarea"
              placeholder="Escribe aquí tu mensaje"
              name="text"
            ></textarea>
            <button
              disabled={navigation.state !== "idle"}
              type="submit"
              className=" ml-auto disabled:from-gray-200 disabled:text-gray-300 rounded-xl py-2 px-6 bg-gradient-to-tr from-indigo-500 to-indigo-800 w-[200px] text-white uppercase text-xl disabled:hover:scale-100 hover:scale-105 transition-all flex items-center gap-4"
            >
              {"Comentar"} <AiOutlineSend />
            </button>
          </Form>
        </main>
      </div>
    </article>
  );
}
