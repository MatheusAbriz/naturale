import { Muted } from "@/styles/texts";
import { Wrap, Title } from "./styles";

type EmptyStateProps = {
  title?: string;
  description?: string;
};

export function EmptyState({
  title = "Nenhum resultado encontrado",
  description = "Tente novamente mais tarde.",
}: EmptyStateProps) {
  return (
    <Wrap>
      <Title>{title}</Title>
      <Muted>{description}</Muted>
    </Wrap>
  );
}
