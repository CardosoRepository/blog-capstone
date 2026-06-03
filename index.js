import express from "express";

const app = express();
const port = 3000;
const posts = [
    {
        id: 1,
        title: "Primeiro post",
        content:
            "Este é o primeiro post do blog. Ele serve para testar a estrutura inicial da aplicação e a navegação entre os textos.",
        createdAt: new Date()
    },
    {
        id: 2,
        title: "Criando um projeto com Node.js",
        content:
            "Neste projeto, estou praticando rotas com Express, páginas dinâmicas com EJS e estilização com CSS.",
        createdAt: new Date()
    },
    {
        id: 3,
        title: "Próximos passos",
        content:
            "Depois de montar a interface inicial, vou implementar a criação, a edição e a exclusão de posts.",
        createdAt: new Date()
    }
];
let nextId = posts.length + 1;

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