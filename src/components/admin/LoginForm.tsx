"use client";

import { useActionState } from "react";
import { loginAction, type LoginState } from "@/app/actions/auth";

export default function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(
    loginAction,
    undefined
  );

  return (
    <form action={action} className="flex w-full max-w-sm flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label htmlFor="password" className="text-sm text-muted">
          Lösenord
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoFocus
          className="rounded border border-border bg-background-elevated px-4 py-2 text-foreground outline-none focus:border-accent"
        />
      </div>

      {state?.error && <p className="text-sm text-accent-deep">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="rounded border border-accent/40 bg-accent/10 px-4 py-2 font-display text-accent transition-colors hover:bg-accent/20 disabled:opacity-50"
      >
        {pending ? "Loggar in…" : "Logga in"}
      </button>
    </form>
  );
}
