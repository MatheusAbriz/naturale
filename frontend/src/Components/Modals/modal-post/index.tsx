import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import fetchCommentsData from "../../../services/fetchCommentsData";

type ModalPostProps = {
    modalTrigger: React.ReactNode;
    children?: React.ReactNode;
    idPost: number;
}

export const ModalPost = ({ modalTrigger, children, idPost }: ModalPostProps) => {
    const { data } = fetchCommentsData({
        queryKey: ["comentarios", idPost],
        urlParams: `comentarios/lerPorPost/${idPost}`,
        enabled: !!idPost
    })

    return(
        <Dialog>
            <DialogTrigger>{modalTrigger}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Comentários</DialogTitle>
                    <DialogDescription>
                        {data?.map((comentario: any) => (
                            <p>{comentario.texto_comentario}</p>
                        ))}
                        {children}
                    </DialogDescription>
                    </DialogHeader>
            </DialogContent>
        </Dialog>
    )
};