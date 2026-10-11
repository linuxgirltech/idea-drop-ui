import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Lightbulb } from "lucide-react";

export const Route = createFileRoute("/(auth)")({
  component: AuthLayout,
});

function AuthLayout() {
  return (
    <div className="flex flex-col md:flex-row items-start justify-between gaps-10 p-6 text-blue-600">
      <div className="flex flex-col items-start gap-4">
        <Lightbulb className="w-16 h-16 text-yellow-400" />
        <h1 className="text-4xl font-bold text-gray-800">
          Welcome to Idea Drop
        </h1>
        <h4 className="text-gray-600 max-w-xs">
          Share, explore, and build on the best startup ideas and side hustles
        </h4>
      </div>

      <section className="flex-1 text-gray-700">
        <Outlet />
      </section>
    </div>
  );
}
