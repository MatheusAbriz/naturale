import { Roles } from "../../enums/RolesEnum.js"

export type Posts = {
    id: number
    title: string
    text: string
    ingredients: string
    image: string
    time: string
    likes_count: number
    status: boolean
    name: string
    username: string
    avatar: string
    type: Roles
}

export type CreatePostDTO = {
    userId: number | string,
    title: string,
    text: string,
    ingredients: string,
    image: string,
    time: string,
    status: boolean
}
  