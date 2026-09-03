// ==========================================
// CONFIGURAÇÃO DO SUPABASE
// ==========================================

const SUPABASE_URL =
    "https://msymgjqyaikdmulknmej.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_grSAHTfs6SCxAge6eUDJhA_x3t0H5Jl";


// ==========================================
// FUNÇÃO DE UPLOAD DA FOTO
// ==========================================

async function uploadFoto(arquivo) {

    // Pega a extensão da imagem
    const extensao =
        arquivo.name.split(".").pop();

    // Cria um nome único para o arquivo
    const nomeArquivo =
        `${Date.now()}.${extensao}`;

    // Envia a imagem para o Storage
    const resposta = await fetch(
        `${SUPABASE_URL}/storage/v1/object/etiquetas/${nomeArquivo}`,
        {
            method: "POST",

            headers: {
                "apikey": SUPABASE_KEY,

                "Authorization":
                    `Bearer ${SUPABASE_KEY}`,

                "Content-Type":
                    arquivo.type
            },

            body: arquivo
        }
    );


    // Verifica se o upload deu erro
    if (!resposta.ok) {

        const erro =
            await resposta.text();

        console.error(
            "Erro no upload da foto:",
            erro
        );

        throw new Error(
            "Erro ao enviar a foto."
        );
    }


    // Retorna a URL pública da imagem
    return `${SUPABASE_URL}/storage/v1/object/public/etiquetas/${nomeArquivo}`;
}



// ==========================================
// PEGAR O FORMULÁRIO
// ==========================================

const formulario =
    document.getElementById("formEtiqueta");



// ==========================================
// PEGAR OS PARÂMETROS DO QR CODE
// ==========================================

const parametros =
    new URLSearchParams(
        window.location.search
    );


// Tipo da etiqueta
const tipo =
    parametros.get("tipo");


// Planta
const planta =
    parametros.get("planta");


// Equipamento
const equipamento =
    parametros.get("equipamento");



// ==========================================
// PREENCHER PLANTA
// ==========================================

if (planta) {

    document.getElementById("planta").value =
        planta;
}



// ==========================================
// PREENCHER EQUIPAMENTO
// ==========================================

if (equipamento) {

    document.getElementById("equipamento").value =
        equipamento;
}



// ==========================================
// ENVIAR FORMULÁRIO
// ==========================================

formulario.addEventListener(
    "submit",
    async function (event) {

        // Impede a página de recarregar
        event.preventDefault();


        // ==================================
        // PEGAR DADOS DO FORMULÁRIO
        // ==================================

        const nome =
            document
                .getElementById("nome")
                .value
                .trim();


        const matricula =
            document
                .getElementById("matricula")
                .value
                .trim();


        const descricao =
            document
                .getElementById("descricao")
                .value
                .trim();


        const arquivoFoto =
            document
                .getElementById("foto")
                .files[0];


        const plantaFormulario =
            document
                .getElementById("planta")
                .value
                .trim();


        const equipamentoFormulario =
            document
                .getElementById("equipamento")
                .value
                .trim();



        // ==================================
        // VALIDAR TIPO
        // ==================================

        if (!tipo) {

            alert(
                "Tipo de etiqueta não informado."
            );

            return;
        }



        // ==================================
        // VALIDAR PLANTA
        // ==================================

        if (!plantaFormulario) {

            alert(
                "Planta não identificada. Acesse o formulário através do QR Code do equipamento."
            );

            return;
        }



        // ==================================
        // VALIDAR EQUIPAMENTO
        // ==================================

        if (!equipamentoFormulario) {

            alert(
                "Equipamento não identificado. Acesse o formulário através do QR Code do equipamento."
            );

            return;
        }



        // ==================================
        // VALIDAR MATRÍCULA
        // ==================================

        if (!/^[0-9]+$/.test(matricula)) {

            alert(
                "A matrícula deve conter somente números."
            );

            return;
        }



        // ==================================
        // INÍCIO DO ENVIO
        // ==================================

        try {

            // ==================================
            // VARIÁVEL PARA GUARDAR A FOTO
            // ==================================

            let fotoUrl = null;



            // ==================================
            // FAZER UPLOAD DA FOTO
            // ==================================

            if (arquivoFoto) {

                fotoUrl =
                    await uploadFoto(
                        arquivoFoto
                    );
            }



            // ==================================
            // DADOS QUE SERÃO SALVOS
            // ==================================

            const dados = {

                tipo: tipo,

                nome: nome,

                matricula: matricula,

                planta: plantaFormulario,

                equipamento:
                    equipamentoFormulario,

                descricao: descricao,

                foto_url: fotoUrl
            };



            // ==================================
            // ENVIAR PARA A TABELA
            // ==================================

            const resposta =
                await fetch(
                    `${SUPABASE_URL}/rest/v1/etiqueta`,
                    {
                        method: "POST",

                        headers: {

                            "Content-Type":
                                "application/json",

                            "apikey":
                                SUPABASE_KEY,

                            "Authorization":
                                `Bearer ${SUPABASE_KEY}`,

                            "Prefer":
                                "return=minimal"
                        },

                        body:
                            JSON.stringify(dados)
                    }
                );



            // ==================================
            // VERIFICAR ERRO DO SUPABASE
            // ==================================

            if (!resposta.ok) {

                const erro =
                    await resposta.text();

                console.error(
                    "Erro do Supabase:",
                    erro
                );

                alert(
                    "Erro ao registrar a etiqueta."
                );

                return;
            }



            // ==================================
            // SUCESSO
            // ==================================

            alert(
                "Etiqueta registrada com sucesso!"
            );



            // ==================================
            // LIMPAR FORMULÁRIO
            // ==================================

            formulario.reset();



            // ==================================
            // RESTAURAR DADOS DO QR CODE
            // ==================================

            document
                .getElementById("planta")
                .value =
                planta || "";


            document
                .getElementById("equipamento")
                .value =
                equipamento || "";

        }

        // ==================================
        // ERRO GERAL
        // ==================================

        catch (erro) {

            console.error(
                "Erro:",
                erro
            );

            alert(
                "Não foi possível enviar a foto ou salvar a etiqueta."
            );
        }

    }
);
