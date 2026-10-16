import { cn } from "@/lib/utils";

type LoaderProps = {
  size?: "sm" | "md";
  className?: string;
};

export function Loader({ size = "md", className }: LoaderProps) {
  return (
    <div className={cn("flex items-center justify-center py-8", className)}>
      <div
        className={cn(
          "animate-spin rounded-full border-emerald-600 border-t-transparent",
          size === "sm" ? "h-5 w-5 border-2" : "h-8 w-8 border-4"
        )}
      />
    </div>
  );
}
