import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ClipboardList, Search, SlidersHorizontal } from "lucide-react";
import { Button } from "@/styles/buttons";
import { UpgradePrompt } from "@/Components/subscription/upgrade-prompt";
import { hasPlan, useSubscription } from "@/stores/subscription-store";
import { track } from "@/lib/analytics";
import {
  Header,
  Eyebrow,
  Title,
  Description,
  Section,
  SearchSection,
  FieldLabel,
  RawInput,
  RawSelect,
  FieldsGrid,
  SectionTitle,
  SectionText,
} from "./styles";

export default function PremiumTools() {
  const plan = useSubscription((state) => state.plan);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const isSearch = pathname === "/advanced-search";

  useEffect(() => {
    track(hasPlan(plan, "extra") ? "premium_feature_viewed" : "premium_feature_blocked", {
      feature: isSearch ? "advanced_search" : "shopping_list",
      plan,
    });
  }, [isSearch, plan]);

  if (!hasPlan(plan, "extra")) {
    return <UpgradePrompt feature={isSearch ? "Busca avançada" : "Lista de compras automática"} />;
  }

  return (
    <div>
      <Header>
        <Eyebrow>Plano Extra</Eyebrow>
        <Title>{isSearch ? "Busca avançada" : "Lista de compras"}</Title>
        <Description>
          {isSearch
            ? "Encontre receitas conforme o que você tem e o tempo disponível."
            : "Ingredientes reunidos a partir das suas receitas favoritas."}
        </Description>
      </Header>

      {isSearch ? (
        <SearchSection>
          <FieldLabel>
            Ingrediente
            <RawInput placeholder="Ex.: grão-de-bico" />
          </FieldLabel>
          <FieldsGrid>
            <FieldLabel>
              Tempo máximo
              <RawSelect>
                <option>Qualquer duração</option>
                <option>Até 20 min</option>
                <option>Até 40 min</option>
              </RawSelect>
            </FieldLabel>
            <FieldLabel>
              Restrição alimentar
              <RawSelect>
                <option>Sem restrição</option>
                <option>Vegetariana</option>
                <option>Sem lactose</option>
                <option>Low carb</option>
              </RawSelect>
            </FieldLabel>
          </FieldsGrid>
          <Button onClick={() => { track("advanced_search_submitted"); navigate("/home"); }}>
            <Search size={16} /> Buscar receitas
          </Button>
        </SearchSection>
      ) : (
        <Section>
          <ClipboardList size={32} color="#2f6b54" />
          <SectionTitle>Sua lista será gerada aqui</SectionTitle>
          <SectionText>
            Ao integrar o backend, ingredientes de receitas favoritas serão agrupados automaticamente, com
            quantidades e itens repetidos unificados.
          </SectionText>
          <Button style={{ marginTop: 20 }} onClick={() => { track("shopping_list_favorites_opened"); navigate("/favorites"); }}>
            <SlidersHorizontal size={16} /> Escolher favoritos
          </Button>
        </Section>
      )}
    </div>
  );
}
