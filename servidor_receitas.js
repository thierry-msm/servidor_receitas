// Importar as dependências
const express = require('express');
const dotenv = require('dotenv');

dotenv.config({ path: './porta.env' });

// Lista inicial de receitas
let receitas = [
    { id: 1, nome: 'Bolo de Cenoura', ingredientes: ['cenoura', 'açúcar', 'farinha'], tipo: 'sobremesa' },
    { id: 2, nome: 'Lasanha', ingredientes: ['massa', 'queijo', 'molho de tomate'], tipo: 'prato principal' },
    { id: 3, nome: 'Salada Grega', ingredientes: ['pepino', 'tomate', 'queijo feta'], tipo: 'entrada' }
];

// Inicialização do servidor Express
const app = express();
app.use(express.json());

// Rota para listar todas as receitas
app.get('/receitas', (req, res) => {
    if (req.query.ingrediente) {
        const filtradas = receitas.filter(receita =>
            receita.ingredientes.includes(req.query.ingrediente.toLowerCase())
        );
        return res.json(filtradas);
    }
    res.json(receitas);
});

// Rota para obter uma receita específica por ID
app.get('/receitas/:id', (req, res) => {
    const { id } = req.params;
    const receita = receitas.find(r => r.id == id);
    if (receita) {
        res.json(receita);
    } else {
        res.status(404).json({ mensagem: 'Receita não encontrada' });
    }
});

// Rota para adicionar uma nova receita
app.post('/receitas', (req, res) => {
    const { nome, ingredientes, tipo } = req.body;
    if (!nome || !ingredientes || !tipo) {
        return res.status(422).json({ mensagem: 'Faltam parâmetros para criar a receita' });
    }
    const novaReceita = {
        id: receitas.length ? receitas.at(-1).id + 1 : 1,
        nome,
        ingredientes,
        tipo
    };
    receitas.push(novaReceita);
    res.status(201).json(novaReceita);
});

// Rota para atualizar uma receita por ID
app.put('/receitas/:id', (req, res) => {
    const { id } = req.params;
    const { nome, ingredientes, tipo } = req.body;
    const receitaIndex = receitas.findIndex(r => r.id == id);
    if (receitaIndex === -1) {
        return res.status(404).json({ mensagem: 'Receita não encontrada' });
    }
    const receitaAtualizada = { ...receitas[receitaIndex], nome, ingredientes, tipo };
    receitas[receitaIndex] = receitaAtualizada;
    res.json(receitaAtualizada);
});

// Rota para deletar uma receita por ID
app.delete('/receitas/:id', (req, res) => {
    const { id } = req.params;
    const receitaIndex = receitas.findIndex(r => r.id == id);
    if (receitaIndex === -1) {
        return res.status(404).json({ mensagem: 'Receita não encontrada' });
    }
    receitas.splice(receitaIndex, 1);
    res.status(204).end();
});

// Inicializar o servidor HTTP normal (sem SSL)
app.listen(process.env.PORT || 3000, () => {
     console.log(`Servidor ouvindo na porta ${process.env.PORT || 3000}`);
});