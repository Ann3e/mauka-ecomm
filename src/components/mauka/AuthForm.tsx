import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { isValidEmail } from "@/lib/validation";
import { btn, DemoNote, field, FieldError, label, Logo } from "./ui";
import { cn } from "@/lib/utils";

const safe = (r: string) => (r.startsWith("/") && !r.startsWith("//") ? r : "/account");

export function AuthForm({ mode, redirect }: { mode: "signin" | "signup"; redirect: string }) {
  const { signIn, signUp } = useStore();
  const navigate = useNavigate();
  const [f, setF] = useState({ name: "", email: "", password: "" });
  const [err, setErr] = useState<Record<string, string>>({});
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const er: Record<string, string> = {};
    if (mode === "signup" && !f.name.trim()) er["name"] = "Enter your name.";
    if (!isValidEmail(f.email)) er["email"] = "Enter a valid email address.";
    if (f.password.length < 6) er["password"] = "Password needs at least 6 characters.";
    if (!Object.keys(er).length) {
      const msg = mode === "signin" ? signIn(f.email, f.password) : signUp({ name: f.name.trim(), email: f.email.trim(), password: f.password });
      if (msg) er["form"] = msg;
    }
    setErr(er);
    if (!Object.keys(er).length) navigate({ href: safe(redirect) });
  };
  const inp = (k: "name" | "email" | "password", l: string, type = "text") => (
    <div>
      <label htmlFor={k} className={label}>{l}</label>
      <input id={k} type={type} value={f[k]} onChange={(e) => setF({ ...f, [k]: e.target.value })} aria-invalid={!!err[k]} className={cn(field, err[k] && "border-destructive")} />
      <FieldError msg={err[k]} />
    </div>
  );
  return (
    <div className="grid min-h-[75vh] place-items-center px-4 py-12">
      <form onSubmit={submit} noValidate className="reveal w-full max-w-md space-y-5 rounded-[2rem] bg-card p-8 shadow-lift sm:p-10">
        <div className="text-center"><Logo className="text-4xl" /><h1 className="mt-4 font-display text-4xl">{mode === "signin" ? "Welcome back" : "Create your account"}</h1></div>
        {mode === "signup" && inp("name", "Name")}
        {inp("email", "Email", "email")}
        {inp("password", "Password", "password")}
        <FieldError msg={err["form"]} />
        <button type="submit" className={cn(btn({ variant: "primary", size: "lg" }), "w-full")}>{mode === "signin" ? "Sign in" : "Sign up"}</button>
        <p className="text-center text-sm">
          {mode === "signin" ? "New to Mauka? " : "Already have an account? "}
          <Link to={mode === "signin" ? "/signup" : "/signin"} search={{ redirect }} className="font-medium underline">{mode === "signin" ? "Sign up" : "Sign in"}</Link>
        </p>
        <DemoNote>Browser-local demo account. Try <strong>demo@mauka.in</strong> / <strong>mauka123</strong>. Don’t use a real password.</DemoNote>
      </form>
    </div>
  );
}
