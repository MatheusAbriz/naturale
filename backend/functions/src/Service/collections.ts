import pool from '../Model/pool.js';
import { FavoriteCollectionDTO } from '../types/collections/index.js';

export async function listMyCollections(userId: number): Promise<FavoriteCollectionDTO[]> {
    const rows = await pool`
        SELECT
            fc.id,
            fc.name,
            COALESCE(array_agg(fcp.post_id) FILTER (WHERE fcp.post_id IS NOT NULL), '{}') AS post_ids
        FROM favorite_collection fc
        LEFT JOIN favorite_collection_post fcp ON fcp.collection_id = fc.id
        WHERE fc.user_id = ${userId}
        GROUP BY fc.id, fc.name
        ORDER BY fc.created_at ASC
    `;

    return rows.map(row => ({
        id: Number(row.id),
        name: row.name as string,
        postIds: (row.post_ids as number[]).map(Number),
    }));
}

export async function createCollection(userId: number, name: string): Promise<{ status: boolean; msg: string | FavoriteCollectionDTO }> {
    const trimmed = name?.trim();

    if (!trimmed) {
        return { status: false, msg: 'Informe um nome para a coleção' };
    }

    try {
        const inserted = await pool`
            INSERT INTO favorite_collection (user_id, name)
            VALUES (${userId}, ${trimmed.slice(0, 60)})
            RETURNING id, name
        `;

        return {
            status: true,
            msg: { id: Number(inserted[0].id), name: inserted[0].name, postIds: [] },
        };
    } catch (err) {
        console.error('Erro ao criar coleção:', err);
        return { status: false, msg: 'Erro ao criar coleção' };
    }
}

export async function togglePostInCollection(userId: number, collectionId: number, postId: number): Promise<{ status: boolean; msg: string }> {
    const owned = await pool`
        SELECT id FROM favorite_collection WHERE id = ${collectionId} AND user_id = ${userId}
    `;

    if (owned.count === 0) {
        return { status: false, msg: 'Coleção não encontrada' };
    }

    try {
        const existing = await pool`
            SELECT 1 FROM favorite_collection_post WHERE collection_id = ${collectionId} AND post_id = ${postId}
        `;

        if (existing.count > 0) {
            await pool`
                DELETE FROM favorite_collection_post WHERE collection_id = ${collectionId} AND post_id = ${postId}
            `;
            return { status: true, msg: 'Receita removida da coleção' };
        }

        await pool`
            INSERT INTO favorite_collection_post (collection_id, post_id) VALUES (${collectionId}, ${postId})
        `;
        return { status: true, msg: 'Receita adicionada à coleção' };
    } catch (err) {
        console.error('Erro ao organizar coleção:', err);
        return { status: false, msg: 'Erro ao organizar coleção' };
    }
}
