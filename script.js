// ==========================================
// CONFIGURAÇÃO DO SUPABASE
// ==========================================

const SUPABASE_URL = "https://msymgjqyaikdmulknmej.supabase.co";

const SUPABASE_KEY = "sb_publishable_grSAHTfs6SCxAge6eUDJhA_x3t0H5Jl";


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

    // Impede o formulário de recarregar a página
    event.preventDefault();


    // Pegar os valores preenchidos
    const nome = document.getElementById("nome").value;
    const planta = document.getElementById("planta").value;
    const equipamento = document.getElementById("equipamento").value;
    const descricao = document.getElementById("descricao").value;


    // Verificar se o tipo existe
    if (!tipo) {
        alert("Tipo de etiqueta não informado.");
        return;
    }


    // Dados que serão enviados para o banco
    const dados = {
        tipo: tipo,
        nome: nome,
        planta: planta,
        equipamento: equipamento,
        descricao: descricao
    };


    try {

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


        // Verificar se houve erro
        if (!resposta.ok) {

            const erro = await resposta.text();

            console.error("Erro do Supabase:", erro);

            alert("Erro ao registrar a etiqueta.");

            return;
        }


        // Sucesso
        alert("Etiqueta registrada com sucesso!");


        // Limpar formulário
        formulario.reset();


    } catch (erro) {

        console.error("Erro:", erro);

        alert("Não foi possível conectar ao banco de dados.");
    }

});