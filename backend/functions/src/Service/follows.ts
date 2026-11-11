import pool from "../Model/pool.js";
import { Filters } from "../types/shared/index.js";

export async function followUser(followerId: number | string, followedId: number | string) {
    if (Number(followerId) === Number(followedId)) {
        return { status: false, msg: "Você não pode seguir a si mesmo" };
    }

    try {
        await pool`
            INSERT INTO follows (follower_id, followed_id)
            VALUES (${followerId}, ${followedId})
            ON CONFLICT (follower_id, followed_id) DO NOTHING
        `;
        return { status: true, msg: "Agora você está seguindo este usuário" };
    } catch (err) {
        console.error("Erro ao seguir usuário:", err);
        return { status: false, msg: `${err}` };
    }
}

export async function unfollowUser(followerId: number | string, followedId: number | string) {
    try {
        await pool`
            DELETE FROM follows
            WHERE follower_id = ${followerId} AND followed_id = ${followedId}
        `;
        return { status: true, msg: "Você deixou de seguir este usuário" };
    } catch (err) {
        console.error("Erro ao deixar de seguir usuário:", err);
        return { status: false, msg: `${err}` };
    }
}

export async function getFollowers(targetId: number | string, viewerId: number | string, filters: Filters) {
    const { page, limit } = filters;
    const offSet = (page - 1) * limit;

    try {
        const results = await pool`
            SELECT
                u.id,
                u.name,
                u.username,
                u.avatar,
                u.type,
                EXISTS(
                    SELECT 1 FROM follows f2
                    WHERE f2.follower_id = ${viewerId} AND f2.followed_id = u.id
                ) AS "isFollowedByMe"
            FROM follows f
            INNER JOIN users u ON u.id = f.follower_id
            WHERE f.followed_id = ${targetId}
            ORDER BY f.id DESC
            LIMIT ${limit} OFFSET ${offSet}
        `;

        const totalResult = await pool`SELECT COUNT(*) FROM follows WHERE followed_id = ${targetId}`;
        const total = Number(totalResult[0].count);

        return {
            data: results,
            pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
        };
    } catch (err) {
        console.error("Erro ao listar seguidores:", err);
        return false;
    }
}

export async function getFollowing(targetId: number | string, viewerId: number | string, filters: Filters) {
    const { page, limit } = filters;
    const offSet = (page - 1) * limit;

    try {
        const results = await pool`
            SELECT
                u.id,
                u.name,
                u.username,
                u.avatar,
                u.type,
                EXISTS(
                    SELECT 1 FROM follows f2
                    WHERE f2.follower_id = ${viewerId} AND f2.followed_id = u.id
                ) AS "isFollowedByMe"
            FROM follows f
            INNER JOIN users u ON u.id = f.followed_id
            WHERE f.follower_id = ${targetId}
            ORDER BY f.id DESC
            LIMIT ${limit} OFFSET ${offSet}
        `;

        const totalResult = await pool`SELECT COUNT(*) FROM follows WHERE follower_id = ${targetId}`;
        const total = Number(totalResult[0].count);

        return {
            data: results,
            pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
        };
    } catch (err) {
        console.error("Erro ao listar seguindo:", err);
        return false;
    }
}
