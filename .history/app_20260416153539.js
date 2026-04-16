document.addEventListener("DOMContentLoaded", () => {
    const page = window.location.pathname;

    if(page.includes("index.html") || page === "/"){
        buscarPratos()
    }
    if(page.includes("detail.html")){
        detalhesPratos()
        sugestao()
    }
    if (page.includes("menu.html")){
        listarPratos()
    }

    async function buscarPratos(){
        const sessao = document.getElementById("destaques-showcase");

        try{
            const resposta = await fetch(`https://api-restaurante-5iqb.onrender.com/api/produtos`)
            const listarPratos = await resposta.json();

            sessao.innerHTML = "";

            listarPratos
            .filter(prato => prato.destacado)
            .sort((a, b) => a.preco - b.preco)
            .slice(0,6)
            .forEach(prato =>{
                if(prato.destacado === true){
                     sessao.innerHTML += 
                        `<div class="card" onclick="window.location.href='detail.html?id=${prato.id}'" style="cursor: pointer">
                            <img src="${prato.imagem}" alt="${prato.nome}" class="card-image" onerror="this.src='https://placehold.co/300x200?text=Sem+Imagem'">
                            <div class="card-body">
                                <span class="card-category text-muted">${prato.categoria}</span>
                                <h3 class="card-title">${prato.nome}</h3>
                                <p class="card-desc">${prato.descricao}</p>
                                <div class="card-footer">
                                    <span class="price">R$ ${prato.preco.toFixed(2)}</span>
                                    <button class="btn btn-secondary" onclick="event.stopPropagation(); window.location.href='detail.html?id=${prato.id}'">
                                        Ver Mais
                                    </button>
                                </div>
                            </div>
                        </div>` 
                }
            });
        }catch(error){
            sessao.innerHTML = "<p>Erro ao carregar pratos!</p>";
        }
    }

    async function listarPratos(){
        const sessao = document.getElementById("catalogo-wrapper");

        try{
            const resposta = await fetch(`https://api-restaurante-5iqb.onrender.com/api/produtos`)
            const lista = await resposta.json();

            sessao.innerHTML = "";

            const categorias = {};

            lista.forEach(prato =>{

                if(!categorias[prato.categoria]){
                    categorias[prato.categoria] = [];
                }

                categorias[prato.categoria].push(prato);
            });

            Object.keys(categorias).forEach(categoria => {
                const itens = categorias[categoria];

                sessao.innerHTML +=
                    `<div class="bloco-grupo-pratos" style="margin-bottom: 3rem;">
                    
                    <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #333; padding-bottom:1rem; margin-bottom:2rem;">
                        <h2>${categoria} 
                            <span style="font-size:1rem; color:#888;">
                                (${itens.length} itens)
                            </span>
                        </h2>

                        <select onchange="ordenarCategoria('${categoria}', this.value)" 
                            style="padding:0.5rem; border-radius:4px;">
                            <option value="asc">Menor Preço</option>
                            <option value="desc">Maior Preço</option>
                        </select>
                    </div>

                    <div id="categoria-${categoria}" class="grid"></div>
                </div>`;

                    renderizarCategoria(itens, categoria);
            });

            window.renderizarCategoria = function(items, categoria){
                const container = document.getElementById(`categoria-${categoria}`);
                container.innerHTML = "";

                itens.forEach(prato => {
                    container.innerHTML += `<div class="card" onclick="window.location.href='detail.html?id=${prato.id}'" style="cursor:pointer">
                    <img src="${prato.imagem}" class="card-image">
                    <div class="card-body">
                        <span class="card-category">${prato.categoria}</span>
                        <h3>${prato.nome}</h3>
                        <p>${prato.descricao}</p>
                        <span class="price">R$ ${prato.preco.toFixed(2)}</span>
                    </div>
                </div>`;
                });
            }

            window.ordenarCategoria = function(categoria, ordem){
                const itens = categorias[categoria];

                itens.sort((a, b) => {
                    
                })
            }
            
        }catch(error){
            sessao.innerHTML = "<p>Erro ao carregar pratos!</p>";
        }
    }

    async function detalhesPratos(){
        const parametro = new URLSearchParams(window.location.search);
        const id = parametro.get("id");
        const sessao = document.getElementById("info-prato-view")

        try{
            const resposta = await fetch(`https://api-restaurante-5iqb.onrender.com/api/produtos/${id}`)
            const prato = await resposta.json();

            sessao.innerHTML = 
            `<div class="detail-container">
                <img src="${prato.imagem}" alt="${prato.nome}" class="detail-image" onerror="this.src='https://placehold.co/600x400?text=Sem+Imagem'">
                <div class="detail-info">
                <span class="badge">${prato.categoria}</span>
                <h1 style="margin-top: 1rem; font-size: 2.5rem;">Nome do Produto</h1>
                <p class="detail-price">R$ ${prato.preco.toFixed(2)}</p>
                <p style="font-size: 1.1rem; color: var(--text-muted); margin-bottom: 2rem;">
                    ${prato.descricao}
                </p>
                <p style="color: var(--text-muted); font-size: 0.9rem">ID: ${prato.id}</p>
                <p style="color: var(--primary-color); margin-top: 10px"><i class="fas fa-star"></i> Item em Destaque</p>
                </div>
            </div>`
        }catch(error){
            sessao.innerHTML = "<p>Erro ao buscar descrição!</p>";
        }
    }

    async function sugestao(){
        const parametro = new URLSearchParams(window.location.search);
        console.log(parametro)
        const atual = parametro.get("categoria");
        const sessao = document.getElementById("sugestoes-grid")

        try{
            const resposta = await fetch(`https://api-restaurante-5iqb.onrender.com/api/produtos/categoria/${atual}`)
            const prato = await resposta.json();

            sessao.innerHTML = 
            `<div class="card" onclick="window.location.href='detail.html?id=123'" style="cursor: pointer">
                <img src="${prato.imagem}" alt="Nome do Produto" class="card-image" onerror="this.src='https://placehold.co/300x200?text=Sem+Imagem'">
                <div class="card-body">
                <span class="card-category text-muted">${prato.categoria}</span>
                <h3 class="card-title">${prato.nome}</h3>
                <p class="card-desc">${prato.descricao}</p>
                <div class="card-footer">
                    <span class="price">R$ ${prato.preco}</span>
                    <button class="btn btn-secondary" onclick="event.stopPropagation(); window.location.href='detail.html?id=123'">
                    Ver Mais
                    </button>
                </div>
                </div>
            </div>`
        }catch(error){
            sessao.innerHTML = "<p>Erro ao buscar descrição!</p>";
        }
    }

});