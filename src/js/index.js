// 1) Mensagem de boas-vindas ao usuário

window.alert("Olá! Bem-vindo ao meu projeto de fundo mágico com IA!");

// 2) Log no console quando o conteúdo da página for totalmente carregado

document.addEventListener("DOMContentLoaded", function() {
    console.log("O conteúdo da página foi totalmente carregado e analisado.");
});

// 3) Variáveis e seleção de elementos do DOM

const form = document.querySelector(".form-group");
const descricaoInput = document.getElementById("description");
const codigoHtml = document.getElementById("html-code");
const codigoCss = document.getElementById("css-code");
const secaoPreview = document.getElementById("preview-section");

// 4) Manipulação do evento de envio do formulário - principal funcionalidade

form.addEventListener("submit", async function(event){
    event.preventDefault(); // Impede o envio padrão do formulário
    console.log("Formulário enviado!");

    const descricao = descricaoInput.value.trim(); // trim() => Tira os espaços em branco
    console.log("Descrição fornecida:", descricao);

    if(!descricao){
        alert("Por favor, insira uma descrição válida para gerar o background.");
        return;
    }

    mostrarCarregamento(true);

    try {
        const resposta = await fetch("https://guitavs7.app.n8n.cloud/webhook/fundo-magico", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ descricao })    
        })

        const dados = await resposta.json();

        codigoHtml.textContent = dados.html || "<!-- Nenhum código HTML gerado -->";
        codigoCss.textContent = dados.css || "/* Nenhum código CSS gerado */";

        secaoPreview.style.display = "block";
        secaoPreview.innerHTML = dados.html || "";

        let tagEstilo = document.getElementById("estilo-dinamico");

        // Se a tag de estilo já existir, remova-a antes de criar uma nova

        if(tagEstilo){
            tagEstilo.remove();
        }

        // Criando a tag de estilo dinamicamente -> css injetado na página

        if(dados.css){
            tagEstilo = document.createElement("style");
            tagEstilo.id = "estilo-dinamico";
            tagEstilo.textContent = dados.css;
            document.head.appendChild(tagEstilo);
        }

        console.log("Resposta da API recebida:", dados);
        
    } catch (error) {
        console.error("Erro ao enviar a requisição:", error);
		codigoHtml.textContent = "Não consegui gerar o HTML, tente novamente.";
		codigoCss.textContent = "Não consegui gerar o CSS, tente novamente.";
		secaoPreview.innerHTML = "";
        alert("Ocorreu um erro ao gerar o background. Por favor, tente novamente.");
    } finally {
        mostrarCarregamento(false);
    }
});

// 5) Função para mostrar o estado de carregamento no botão

function mostrarCarregamento(estaCarregando) {

    const botaoEnviar = document.getElementById("generate-btn");

    if(estaCarregando){
        botaoEnviar.textContent = "Carregando Background...";
    }
    else{
        botaoEnviar.textContent = "Gerar Background Mágico";
    }
}