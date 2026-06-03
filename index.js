import express from "express";

const app = express();
const port = 3000;
const posts = [
    {
        id: 1,
        title: "Estruturando uma aplicação com Node.js e Express",
        content: `Ao iniciar uma aplicação com Node.js e Express, uma das primeiras decisões envolve a organização das responsabilidades do servidor.

    Neste projeto, o Express é responsável por definir as rotas, receber dados enviados pelos formulários e renderizar páginas dinâmicas com EJS. A aplicação mantém uma estrutura simples, adequada ao objetivo inicial: praticar a criação, a leitura, a edição e a exclusão de publicações.

    Mesmo sem banco de dados, a separação entre arquivos públicos, templates e lógica do servidor já ajuda a manter o código organizado. Essa base poderá ser evoluída posteriormente com persistência de dados, autenticação e testes automatizados.`,
        createdAt: new Date("2026-05-27T10:00:00")
    },
    {
        id: 2,
        title: "Renderização dinâmica com EJS",
        content: `O EJS permite gerar páginas HTML com dados fornecidos pelo servidor. Isso torna possível reutilizar a mesma estrutura visual para exibir conteúdos diferentes.

    Na página inicial, a aplicação percorre o array de posts para construir a listagem lateral. Quando o usuário seleciona uma publicação, o servidor identifica o item correspondente e envia seus dados para o template.

    Também foram criados partials para o cabeçalho e o rodapé. Essa abordagem reduz repetição de código e facilita futuras alterações na identidade visual do projeto.`,
        createdAt: new Date("2026-05-29T14:30:00")
    },
    {
        id: 3,
        title: "Criando um CRUD sem banco de dados",
        content: `Este projeto implementa as operações básicas de um CRUD utilizando apenas um array armazenado em memória.

    Cada publicação possui um identificador, um título, um conteúdo e uma data de criação. A partir desses dados, a aplicação permite cadastrar novos posts, visualizar um item específico, alterar textos existentes e remover publicações.

    Essa solução não é adequada para um ambiente de produção, pois os dados desaparecem quando o servidor é reiniciado. Ainda assim, ela é útil para compreender o fluxo de requisições antes da introdução de um banco de dados.`,
        createdAt: new Date("2026-05-31T09:15:00")
    },
    {
        id: 4,
        title: "Responsividade e experiência de leitura",
        content: `A interface foi planejada para funcionar de forma adequada em diferentes tamanhos de tela.

    No desktop, a página utiliza duas colunas. A listagem de posts permanece à esquerda e os detalhes da publicação selecionada aparecem à direita. Quando o conteúdo ultrapassa o espaço disponível, cada área possui seu próprio scroll.

    Em telas menores, a estrutura é reorganizada para preservar espaço e facilitar a navegação por toque. A lista de posts continua acessível, enquanto a área de leitura recebe prioridade visual.

    Esse cuidado evita que textos longos ultrapassem os limites da página ou fiquem escondidos atrás do rodapé.`,
        createdAt: new Date("2026-06-01T16:45:00")
    },
    {
        id: 5,
        title: "Validação de formulários no servidor",
        content: `Ao criar ou editar uma publicação, o servidor verifica se o título e o conteúdo foram preenchidos corretamente.

    Essa validação é importante mesmo quando os campos HTML utilizam o atributo required. O navegador pode ajudar a impedir envios incompletos, mas o servidor continua sendo responsável por validar os dados recebidos.

    Antes de salvar um post, a aplicação também remove espaços desnecessários no início e no final dos campos com o método trim(). Caso algum valor esteja vazio, o formulário é renderizado novamente com uma mensagem de erro e os dados já digitados são preservados.`,
        createdAt: new Date("2026-06-02T11:20:00"),
        updatedAt: new Date("2026-06-03T08:40:00")
    },
    {
        id: 6,
        title: "Próximas etapas do projeto",
        content: `A versão atual cumpre o objetivo principal do projeto: demonstrar o funcionamento de uma aplicação de blog construída com Node.js, Express e EJS.

    Os próximos passos incluem adicionar persistência com banco de dados, criar testes automatizados, tratar rotas inexistentes com uma página 404 e substituir ações baseadas em POST por métodos HTTP mais específicos quando necessário.

    Também será importante preparar o deploy em um serviço capaz de executar aplicações Node.js continuamente. Como o projeto depende de um servidor Express, uma hospedagem estática isolada não seria suficiente.

    A documentação no GitHub deverá apresentar o objetivo da aplicação, as tecnologias utilizadas, as rotas disponíveis, instruções de execução e capturas de tela da interface.`,
        createdAt: new Date("2026-06-03T13:00:00")
    }
];

let nextId = Math.max(...posts.map((post) => post.id), 0) + 1;

app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.render("index", {
        posts,
        selectedPost: posts[0] || null
    });
});

app.get("/posts/new", (req, res) => {
    res.render("new-post", {
        error: null,
        formData: {
            title: "",
            content: ""
        }
    });
});

app.post("/posts", (req, res) => {
    const title = req.body.title?.trim();
    const content = req.body.content?.trim();

    if (!title || !content) {
        return res.status(400).render("new-post", {
            error: "Preencha o título e o conteúdo antes de publicar.",
            formData: {
                title: title || "",
                content: content || ""
            }
        });
    }

    const newPost = {
        id: nextId++,
        title,
        content,
        createdAt: new Date()
    };

    posts.push(newPost);

    return res.redirect(`/posts/${newPost.id}`);
});

app.get("/posts/:id/edit", (req, res) => {
    const postId = Number(req.params.id);
    const post = posts.find(post => post.id === postId);

    if (!post) {
        return res.status(404).send("Post não encontrado.")
    }

    res.render("edit-post", {
        error: null,
        formData: {
            title: post.title,
            content: post.content
        },
        post
    })
})

app.post("/posts/:id/edit", (req, res) => {
    const postId = Number(req.params.id);
    const post = posts.find(post => post.id === postId);

    if (!post) {
        return res.status(404).send("Post não encontrado.");
    }

    const title = req.body.title?.trim();
    const content = req.body.content?.trim();

    if (!title || !content) {
        return res.status(400).render("edit-post", {
            error: "Preencha o título e o conteúdo antes de salvar.",
            formData: {
                title: title || "",
                content: content || ""
            },
            post
        })
    }

    post.title = title;
    post.content = content;
    post.updatedAt = new Date();

    return res.redirect(`/posts/${postId}`);
})

app.post("/posts/:id/delete", (req, res) => {
    const postId = Number(req.params.id);
    const postIndex = posts.findIndex(post => post.id === postId);

    if (postIndex === -1) {
        return res.status(404).send("Post não encontrado");
    }

    posts.splice(postIndex, 1);

    return res.redirect("/");
})

app.get("/posts/:id", (req, res) => {
    const postId = Number(req.params.id);

    const selectedPost = posts.find((post) => post.id === postId);

    res.status(selectedPost ? 200 : 404).render("index", {
        posts,
        selectedPost: selectedPost || null
    });
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});