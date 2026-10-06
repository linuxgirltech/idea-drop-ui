import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  queryOptions,
  useSuspenseQuery,
  useMutation,
} from "@tanstack/react-query";

import { fetchIdea, deleteIdea } from "@/api/ideas";

import clsx from "clsx";

const ideaQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ["idea", id],
    queryFn: () => fetchIdea(id),
  });

export const Route = createFileRoute("/ideas/$ideaId/")({
  component: IdeaDetailsPage,
  loader: async ({ params, context: { queryClient } }) => {
    return queryClient.query(ideaQueryOptions(params.ideaId));
  },
});

function IdeaDetailsPage() {
  const navigate = useNavigate();
  const { ideaId } = Route.useParams();
  const { data: idea } = useSuspenseQuery(ideaQueryOptions(ideaId));

  const { mutateAsync: deleteMutate, isPending } = useMutation({
    mutationFn: () => deleteIdea(ideaId),
    onSuccess: () => {
      navigate({ to: "/ideas" });
    },
  });

  const buttonView = clsx({
    "Deleting Idea...": isPending,
    "Delete": !isPending,
  });

  const handleDelete = async (): Promise<void> => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this idea?",
    );

    if (confirmDelete) {
      await deleteMutate();
    }
  };

  return (
      <div className="p-4">
        <Link to="/ideas" className="text-blue-500 underline block mb-4">
          Back to Ideas
        </Link>
        <h2 className="text-2xl font-bold">{idea.title}</h2>
        <p className="mt-2">{idea.description}</p>
        {/* Edit Link */}
        <Link
          to="/ideas/$ideaId/edit"
          params={{ ideaId }}
          className="inline-block text-sm bg-yellow-500
          hover:bg-yellow-600 text-gray-50
          mt-4 mr-2 px-4 py-2 rounded transition"
        >
          Edit
        </Link>

        {/* Delete Button */}
        <button
          onClick={handleDelete}
          disabled={isPending}
          className="text-sm bg-red-600 text-gray-50
          mt-4 px-4 py-2 rounded transition
          hover:bg-red-800 disabled:opacity:50"
        >
          {buttonView}
        </button>
      </div>
  );
}
