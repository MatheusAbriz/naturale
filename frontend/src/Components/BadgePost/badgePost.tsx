import { Plus } from "lucide-react";
import { PostBadge, Tooltip } from "./";
import { useNavigate } from "react-router-dom";

export const BadgePost = () => {
    const navigate = useNavigate();
    const handleNavigate = () => {
        navigate('/registerPost');
    }
    return(
        <PostBadge onClick={handleNavigate} className="cursor-pointer">
            <Plus className="size-6 text-white cursor-pointer"/>
            <Tooltip>Adicionar Post</Tooltip>
        </PostBadge>
    )
};