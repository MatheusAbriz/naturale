import { useNavigate, useLocation } from "react-router-dom";
import { ClipboardList, Search, SlidersHorizontal } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { UpgradePrompt } from "@/Components/subscription/upgrade-prompt";
import { hasPlan, useSubscription } from "@/stores/subscription-store";

export default function PremiumTools() {
  const plan = useSubscription((state) => state.plan);
  const { pathname } = useLocation(); const navigate = useNavigate();
  const isSearch = pathname === "/advanced-search";
  if (!hasPlan(plan, "extra")) return <UpgradePrompt feature={isSearch ? "Busca avançada" : "Lista de compras automática"} />;
  return <div><div className="mb-6"><p className="text-sm font-bold text-primary">Plano Extra</p><h1 className="mt-1 text-2xl font-extrabold">{isSearch ? "Busca avançada" : "Lista de compras"}</h1><p className="mt-1 text-sm text-muted-foreground">{isSearch ? "Encontre receitas conforme o que você tem e o tempo disponível." : "Ingredientes reunidos a partir das suas receitas favoritas."}</p></div>{isSearch ? <section className="space-y-4 rounded-2xl border border-border bg-white p-5"><label className="grid gap-1.5 text-sm font-bold">Ingrediente<input placeholder="Ex.: grão-de-bico" className="h-10 rounded-xl border border-input px-3 font-normal" /></label><div className="grid gap-4 sm:grid-cols-2"><label className="grid gap-1.5 text-sm font-bold">Tempo máximo<select className="h-10 rounded-xl border border-input bg-white px-3 font-normal"><option>Qualquer duração</option><option>Até 20 min</option><option>Até 40 min</option></select></label><label className="grid gap-1.5 text-sm font-bold">Restrição alimentar<select className="h-10 rounded-xl border border-input bg-white px-3 font-normal"><option>Sem restrição</option><option>Vegetariana</option><option>Sem lactose</option><option>Low carb</option></select></label></div><Button onClick={() => navigate("/home")}><Search className="h-4 w-4" /> Buscar receitas</Button></section> : <section className="rounded-2xl border border-border bg-white p-5"><ClipboardList className="h-8 w-8 text-primary" /><h2 className="mt-3 font-extrabold">Sua lista será gerada aqui</h2><p className="mt-1 text-sm leading-6 text-muted-foreground">Ao integrar o backend, ingredientes de receitas favoritas serão agrupados automaticamente, com quantidades e itens repetidos unificados.</p><Button className="mt-5" onClick={() => navigate("/favorites")}><SlidersHorizontal className="h-4 w-4" /> Escolher favoritos</Button></section>}</div>;
}
