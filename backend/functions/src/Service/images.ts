import supabase from '../Model/supabaseConnection.js';
import { FileBody } from '../types/images/index.js';

export async function add(bucket: string, filePath: string, fileBuffer: FileBody, contentType: string) {
    const { data, error } = await supabase
        .storage
        .from(bucket)
        .upload(filePath, fileBuffer, {
            contentType,
            cacheControl: '3600',
            upsert: false
        });
    
    if (error) {
        console.error(error.message);
        return { status: false, msg: `Erro ao inserir imagem ${error.message}` };
    }

    const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(data.path);

    return { status: true, msg: { path: data.path, publicUrl: publicUrlData.publicUrl } };
}

export async function update(bucket: string, filePath: string, file: FileBody) {
    const { data, error } = await supabase
        .storage
        .from(bucket)
        .upload(filePath, file, {
            upsert: true
        });

    if (error) {
        console.error(error);
        return { status: false, msg: `Erro ao alterar imagem ${error}` };
    }

    return { status: true, msg: data };
}