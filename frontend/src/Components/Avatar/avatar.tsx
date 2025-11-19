import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu"
import type { AvatarProps } from "../../types/types";
import { StyledUserAvatar } from "../../pages/PostDetails";

//Componente de Avatar com Dropdown
const Avatar = ({ img, options } : AvatarProps) =>{
    return(
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <StyledUserAvatar src={img} alt={"imagem usuario"} className="w-100 h-auto rounded-full cursor-pointer max-h-[32px] max-w-[32px] object-cover"/>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                <DropdownMenuLabel className="avatar-item">{options.label}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                {options.item.map((item:any) =>(
                    <DropdownMenuItem 
                        key={item.id}
                        className="avatar-item cursor-pointer" 
                        onClick={item.onClick}
                        >
                            {item.texto}
                        </DropdownMenuItem>
                ))}
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default Avatar;