export type Comments = {
    id: string | number,
    user_id: string | number,
    post_id: string | number,
    parent_comment_id: string | number,
    text: string,
    created_at: string,
    status: boolean,
    edited: boolean,
    replies?: Reply[]
}

//TODO: Terminar tipagem, não lembro corretamente oq retorna aqui
export type Reply = {
    id: string | number,
    user_id: string | number,
    post_id: string | number,
    parent_comment_id: string | number,
    text: string,
    created_at: string,
    status: boolean,
    edited: boolean,
}