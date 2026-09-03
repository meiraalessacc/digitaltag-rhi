// ==========================================
// CONFIGURAÇÃO DO SUPABASE
// ==========================================

const SUPABASE_URL = "https://msymgjqyaikdmulknmej.supabase.co";

const SUPABASE_KEY = "sb_publishable_grSAHTfs6SCxAge6eUDJhA_x3t0H5Jl";


// ==========================================
// ELEMENTO DA TABELA
// ==========================================

const tabela = document.getElementById("tabelaRegistros");


// ==========================================
// BUSCAR REGISTROS
// ==========================================

async function carregarRegistros() {

    try {

        const resposta = await fetch(
            `${SUPABASE_URL}/rest/v1/etiqueta?select=*&order=data_registro.desc`,
            {
                method: "GET",

                headers: {
                    "apikey": SUPABASE_KEY,
                    "Authorization": `Bearer ${SUPABASE_KEY}`
                }
            }
        );


        // ==========================================
        // VERIFICAR ERRO
        // ==========================================

        if (!resposta.ok) {

            const erro = await resposta.text();

            console.error("Erro do Supabase:", erro);

            tabela.innerHTML = `
                <tr>
                    <td colspan="7">
                        Erro ao carregar os registros.
                    </td>
                </tr>
            `;

            return;
        }


        // ==========================================
        // CONVERTER RESPOSTA PARA JSON
        // ==========================================

        const registros = await resposta.json();


        // ==========================================
        // SE NÃO HOUVER REGISTROS
        // ==========================================

        if (registros.length === 0) {

            tabela.innerHTML = `
                <tr>
                    <td colspan="7">
                        Nenhuma etiqueta cadastrada.
                    </td>
                </tr>
            `;

            return;
        }


        // ==========================================
        // LIMPAR TABELA
        // ==========================================

        tabela.innerHTML = "";


        // ==========================================
        // CRIAR LINHAS
        // ==========================================

        registros.forEach(registro => {

            const linha = document.createElement("tr");


            // ==========================================
            // IMAGEM
            // ==========================================

            let imagemHTML = "-";


            if (registro.foto_url) {

                imagemHTML = `
                    <img
                        src="${registro.foto_url}"
                        class="imagem-relatorio"
                        alt="Imagem da etiqueta"
                        onclick="window.open('${registro.foto_url}', '_blank')"
                    >
                `;

            }


            // ==========================================
            // MONTAR LINHA
            // ==========================================

            linha.innerHTML = `

                <td>
                    ${formatarTipo(registro.tipo)}
                </td>

                <td>
                    ${registro.nome || "-"}
                </td>

                <td>
                    ${registro.planta || "-"}
                </td>

                <td>
                    ${registro.equipamento || "-"}
                </td>

                <td>
                    ${registro.descricao || "-"}
                </td>

                <td>
                    ${formatarData(registro.data_registro)}
                </td>

                <td>
                    ${imagemHTML}
                </td>

            `;


            // ==========================================
            // ADICIONAR LINHA À TABELA
            // ==========================================

            tabela.appendChild(linha);

        });


    } catch (erro) {

        console.error("Erro:", erro);

        tabela.innerHTML = `
            <tr>
                <td colspan="7">
                    Não foi possível conectar ao banco de dados.
                </td>
            </tr>
        `;

    }

}


// ==========================================
// FORMATAR TIPO
// ==========================================

function formatarTipo(tipo) {

    if (tipo === "vermelha") {
        return "🔴 Vermelha";
    }

    if (tipo === "azul") {
        return "🔵 Azul";
    }

    if (tipo === "amarela") {
        return "🟡 Amarela";
    }

    return tipo || "-";
}


// ==========================================
// FORMATAR DATA
// ==========================================

function formatarData(data) {

    if (!data) {
        return "-";
    }

    const dataObj = new Date(data);

    return dataObj.toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });

}


// ==========================================
// INICIAR
// ==========================================

carregarRegistros();
