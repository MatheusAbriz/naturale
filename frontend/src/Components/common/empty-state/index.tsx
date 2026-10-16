type EmptyStateProps = {
  title?: string;
  description?: string;
};

export function EmptyState({
  title = "Nenhum resultado encontrado",
  description = "Tente novamente mais tarde.",
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
      <p className="text-lg font-semibold">{title}</p>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
