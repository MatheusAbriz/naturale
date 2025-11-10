import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu"
import type { AvatarProps } from "../../types/types";

//Componente de Avatar com Dropdown
const Avatar = ({ img, options } : AvatarProps) =>{
    return(
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <img src={ img } alt="imagem usuario" className="w-100 h-auto rounded-full cursor-pointer max-h-[32px] max-w-[32px] object-cover"/>  
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                <DropdownMenuLabel className="avatar-item">{options.label}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                {options.item.map((item:any) =>(
                    <DropdownMenuItem className="avatar-item cursor-pointer" key={item.id}>{item.texto}</DropdownMenuItem>
                ))}
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default Avatar;