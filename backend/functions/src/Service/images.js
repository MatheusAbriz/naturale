import supabase from '../Model/supabaseConnection.js';
export async function add(bucket, filePath, fileBuffer, contentType) {
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
    return { status: true, msg: data };
}
export async function update(bucket, filePath, file) {
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
//# sourceMappingURL=images.js.map