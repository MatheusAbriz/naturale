import supabase from '../Model/supabaseConnection.js';

export async function inserirImagem(bucket, filePath, fileBuffer, contentType){
    const { data, error } = await supabase.storage.from(bucket).upload(filePath, fileBuffer, {
        contentType: contentType,
        cacheControl: '3600',
        upsert: false
    });
    
    if(error){
        console.error(error.message);
        return { status: false, message: `Erro ao inserir imagem ${error.message}` };
    }
    return { status: true, msg: data };
};

export async function alterarImagem(bucket, filePath, file){
    const { data, error } = await supabase.storage.from(bucket).upload(filePath, file, {
        upsert: true
    });
    if(error){
        console.log(error);
        return { status: false, message: `Erro ao alterar imagem ${error}` };
    }
    return { status: true, msg: data };
};