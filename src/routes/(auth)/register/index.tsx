import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import clsx from "clsx";

import { registerUser } from "@/api/auth";
import { useAuth } from "@/context/AuthContext";

export const Route = createFileRoute("/(auth)/register/")({
  component: RegisterPage,
});

function RegisterPage() {
  const navigate = useNavigate();

  const { setAccessToken, setUser } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      setAccessToken(data.accessToken);
      setUser(data.user);
      navigate({ to: "/ideas" });
    },
    onError: (err: any) => setError(err.message),
  });

  const registerButtonView = clsx({
    "Registering...": isPending,
    Register: !isPending,
  });

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    try {
      await mutateAsync({ name, email, password });
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-6">Register</h1>
      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          className="w-full border border-gray rounded-md p-2"
          placeholder="Please Enter Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="off"
        />
        <input
          type="email"
          className="w-full border border-gray rounded-md p-2"
          placeholder="Please Enter a Valid Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="off"
        />
        <input
          type="password"
          className="w-full border border-gray rounded-md p-2"
          placeholder="Please Set a Password (At Least 8 Characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="off"
        />
        <button
          disabled={isPending}
          className="bg-blue-600 hover:bg-blue-800 text-gray-50 font-semibold px-4 py-2 rounded-md w-full disabled:opacity-50"
        >
          {registerButtonView}
        </button>
      </form>
      <p className="text-sm text-center mt-4">
        Already have an account?{" "}
        <Link to="/login" className="text-blue-600 hover:underline font-medium">
          Login
        </Link>
      </p>
    </div>
  );
}
