import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function CreatePostFab() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate("/postForm")}
      className="fixed bottom-20 right-5 z-30 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-white shadow-[0_10px_24px_rgba(47,107,84,0.35)] transition-transform hover:scale-105 hover:bg-primary/90 lg:bottom-8 lg:right-8"
      aria-label="Nova receita"
    >
      <Plus className="h-6 w-6" />
    </button>
  );
}
