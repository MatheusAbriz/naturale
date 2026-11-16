import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { Button } from "@/styles/buttons";
import { UpgradePrompt } from "@/Components/subscription/upgrade-prompt";
import { hasPlan, useSubscription } from "@/stores/subscription-store";
import { getFavoritesPosts } from "@/services/PostService";
import { Loader } from "@/Components/common/loader";
import { EmptyState } from "@/Components/common/empty-state";
import { useInfiniteScrollSentinel } from "@/lib/useInfiniteScrollSentinel";
import { track } from "@/lib/analytics";
import {
  Header,
  Eyebrow,
  Title,
  Description,
  SearchSection,
  FieldLabel,
  RawInput,
  RawSelect,
  FieldsGrid,
  RecipeGroup,
  RecipeGroupTitle,
  RecipeGroupList,
} from "./styles";

const MAX_TIME_OPTIONS = [
  { label: "Qualquer duração", value: "" },
  { label: "Até 20 min", value: "20" },
  { label: "Até 40 min", value: "40" },
];

export default function PremiumTools() {
  const plan = useSubscription((state) => state.plan);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const isSearch = pathname === "/advanced-search";
  const [ingredient, setIngredient] = useState("");
  const [maxTime, setMaxTime] = useState("");
  const [maxCalories, setMaxCalories] = useState("");
  const [minProtein, setMinProtein] = useState("");
  const [maxCarbs, setMaxCarbs] = useState("");
  const [maxFat, setMaxFat] = useState("");

  useEffect(() => {
    track(hasPlan(plan, "extra") ? "premium_feature_viewed" : "premium_feature_blocked", {
      feature: isSearch ? "advanced_search" : "shopping_list",
      plan,
    });
  }, [isSearch, plan]);

  const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ["favorite-posts"],
    queryFn: ({ pageParam = 1 }) => getFavoritesPosts(pageParam),
    initialPageParam: 1,
    enabled: !isSearch && hasPlan(plan, "extra"),
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.data.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
  });
  const favoritePosts = data?.pages.flatMap((page) => page.data.data) ?? [];
  const sentinelRef = useInfiniteScrollSentinel(() => fetchNextPage(), !!hasNextPage && !isFetchingNextPage);

  function handleSearch() {
    track("advanced_search_submitted", { ingredient, max_time: maxTime });
    const params = new URLSearchParams();
    if (ingredient.trim()) params.set("ingredient", ingredient.trim());
    if (maxTime) params.set("maxTime", maxTime);
    if (hasPlan(plan, "deluxe")) {
      if (maxCalories) params.set("maxCalories", maxCalories);
      if (minProtein) params.set("minProtein", minProtein);
      if (maxCarbs) params.set("maxCarbs", maxCarbs);
      if (maxFat) params.set("maxFat", maxFat);
    }
    navigate(`/home?${params.toString()}`);
  }

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
            <RawInput
              placeholder="Ex.: grão-de-bico"
              value={ingredient}
              onChange={(e) => setIngredient(e.target.value)}
            />
          </FieldLabel>
            <FieldLabel>
              Tempo máximo
              <RawSelect value={maxTime} onChange={(e) => setMaxTime(e.target.value)}>
                {MAX_TIME_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </RawSelect>
            </FieldLabel>

          {hasPlan(plan, "deluxe") && (
            <FieldsGrid>
              <FieldLabel>
                Calorias (máx. kcal)
                <RawInput type="number" min="0" placeholder="Ex.: 400" value={maxCalories} onChange={(e) => setMaxCalories(e.target.value)} />
              </FieldLabel>
              <FieldLabel>
                Proteína (mín. g)
                <RawInput type="number" min="0" placeholder="Ex.: 20" value={minProtein} onChange={(e) => setMinProtein(e.target.value)} />
              </FieldLabel>
              <FieldLabel>
                Carboidrato (máx. g)
                <RawInput type="number" min="0" placeholder="Ex.: 30" value={maxCarbs} onChange={(e) => setMaxCarbs(e.target.value)} />
              </FieldLabel>
              <FieldLabel>
                Gordura (máx. g)
                <RawInput type="number" min="0" placeholder="Ex.: 15" value={maxFat} onChange={(e) => setMaxFat(e.target.value)} />
              </FieldLabel>
            </FieldsGrid>
          )}

          <Button onClick={handleSearch}>
            <Search size={16} /> Buscar receitas
          </Button>
        </SearchSection>
      ) : isLoading ? (
        <Loader size="sm" />
      ) : favoritePosts.length === 0 ? (
        <EmptyState
          title="Nenhum favorito ainda"
          description="Favorite receitas pra gente montar sua lista de compras automaticamente."
        />
      ) : (
        <>
          {favoritePosts.map((post) => {
            const ingredients = post.ingredients.split(",").map((i) => i.trim()).filter(Boolean);
            return (
              <RecipeGroup key={post.postId}>
                <RecipeGroupTitle>{post.title}</RecipeGroupTitle>
                <RecipeGroupList>
                  {ingredients.map((item, i) => <li key={i}>{item}</li>)}
                </RecipeGroupList>
              </RecipeGroup>
            );
          })}
          <div ref={sentinelRef} />
          {isFetchingNextPage && <Loader size="sm" padY={16} />}
        </>
      )}
    </div>
  );
}
