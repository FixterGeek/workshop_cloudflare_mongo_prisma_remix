import { useEffect } from "react";
import { getRelativeTime } from "~/utils/relativeTime";
import type { CommentType } from "~/utils/zod";

export default function CommentList({ comments }: { comments: CommentType[] }) {
  useEffect(() => {
    const node = document.querySelector("#index-0");
    node?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [comments]);

  return (
    <>
      {comments.map((comment, index) => (
        <div
          id={`index-${index}`}
          key={comment.id}
          className="bg-indigo-100 rounded-xl border-indigo-400 border p-4 dark:bg-indigo-900 dark:text-white"
        >
          <div className="mb-2 flex gap-2 items-center">
            <img
              className="h-8 rounded-full border-2 border-indigo-700 "
              src={comment.user?.picture}
              alt="avatar"
            />
            <p className="text-xs font-medium">{comment.user?.name}</p>
            <p className="text-xs text-gray-500 ">
              {getRelativeTime(
                new Date(comment.createdAt ?? new Date()).getTime()
              )}
            </p>
          </div>
          <p className="px-12 text-gray-800 dark:text-indigo-200">
            {comment.text}
          </p>
        </div>
      ))}
    </>
  );
}
