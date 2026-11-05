import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Fab } from "./styles";

export function CreatePostFab() {
  const navigate = useNavigate();

  return (
    <Fab onClick={() => navigate("/postForm")} aria-label="Nova receita">
      <Plus size={24} />
    </Fab>
  );
}
