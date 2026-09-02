// ==========================================
// CONFIGURAÇÃO DO SUPABASE
// ==========================================

const SUPABASE_URL = "https://msymgjqyaikdmulknmej.supabase.co";

const SUPABASE_KEY = "sb_publishable_grSAHTfs6SCxAge6eUDJhA_x3t0H5Jl";

// ==========================================
// FUNÇÃO DE UPLOAD DE FOTO
// ==========================================

async function uploadFoto(arquivo) {

    const extensao = arquivo.name.split(".").pop();

    const nomeArquivo = `${Date.now()}.${extensao}`;

    const resposta = await fetch(
        `${SUPABASE_URL}/storage/v1/object/etiquetas/${nomeArquivo}`,
        {
            method: "POST",
            headers: {
                "apikey": SUPABASE_KEY,
                "Authorization": `Bearer ${SUPABASE_KEY}`,
                "Content-Type": arquivo.type
            },
            body: arquivo
        }
    );

    if (!resposta.ok) {
        const erro = await resposta.text();
        console.error("Erro upload:", erro);
        throw new Error("Erro ao enviar foto");
    }

    return `${SUPABASE_URL}/storage/v1/object/public/etiquetas/${nomeArquivo}`;
}

// ==========================================
// FORMULÁRIO
// ==========================================

const formulario = document.getElementById("formEtiqueta");

// ==========================================
// PEGAR O TIPO DA ETIQUETA PELA URL
// ==========================================

const parametros = new URLSearchParams(window.location.search);

const tipo = parametros.get("tipo");

// ==========================================
// ENVIAR FORMULÁRIO
// ==========================================

formulario.addEventListener("submit", async function (event) {

    event.preventDefault();

    const nome = document.getElementById("nome").value;
    const planta = document.getElementById("planta").value;
    const equipamento = document.getElementById("equipamento").value;
    const descricao = document.getElementById("descricao").value;

    const arquivoFoto =
        document.getElementById("foto").files[0];

    if (!tipo) {
        alert("Tipo de etiqueta não informado.");
        return;
    }

    try {

        let fotoUrl = null;

        if (arquivoFoto) {
            fotoUrl = await uploadFoto(arquivoFoto);
        }

        const dados = {
            tipo: tipo,
            nome: nome,
            planta: planta,
            equipamento: equipamento,
            descricao: descricao,
            foto_url: fotoUrl
        };

        const resposta = await fetch(
            `${SUPABASE_URL}/rest/v1/etiqueta`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    "apikey": SUPABASE_KEY,
                    "Authorization": `Bearer ${SUPABASE_KEY}`,
                    "Prefer": "return=minimal"
                },

                body: JSON.stringify(dados)
            }
        );

        if (!resposta.ok) {

            const erro = await resposta.text();

            console.error("Erro do Supabase:", erro);

            alert("Erro ao registrar a etiqueta.");

            return;
        }

        alert("Etiqueta registrada com sucesso!");

        formulario.reset();

    } catch (erro) {

        console.error("Erro:", erro);

        alert("Não foi possível enviar a foto ou salvar a etiqueta.");
    }

});
