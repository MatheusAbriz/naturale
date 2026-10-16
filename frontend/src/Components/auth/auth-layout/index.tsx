import type { ReactNode } from "react";
import { Leaf } from "lucide-react";
import { Link } from "react-router-dom";

type AuthLayoutProps = {
  image: string;
  imageAlt: string;
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
};

export function AuthLayout({ image, imageAlt, eyebrow, title, description, children }: AuthLayoutProps) {
  return (
    <div className="min-h-svh bg-background lg:grid lg:grid-cols-2">
      <main className="flex min-h-svh items-center px-5 py-10 sm:px-10 lg:px-16 xl:px-24">
        <div className="mx-auto w-full max-w-lg">
          <Link to="/login" className="mb-10 inline-flex items-center gap-2 text-lg font-extrabold tracking-tight text-primary">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground"><Leaf className="h-4 w-4" /></span>
            naturale
          </Link>
          <p className="text-sm font-bold text-primary">{eyebrow}</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">{title}</h1>
          <p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground sm:text-base">{description}</p>
          <div className="mt-8">{children}</div>
        </div>
      </main>
      <aside className="relative hidden min-h-svh overflow-hidden lg:block">
        <img src={image} alt={imageAlt} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-primary/10" />
      </aside>
    </div>
  );
}
