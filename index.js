const express = require('express');
const {Pool} = require('pg');

const app = express();

const PORT = 4000;
app.use(express.json());

// configuraçao do banco de dados
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'ex2backhp',
    password: 'ds564',
    port: 7007,
});

//cria um PERSONAGEM
app.post('/', async (req, res) => {
    const {nome, idade, casa, habilidade, sangue, patrono} = req.body;
    const query = 'INSERT INTO personagens (nome, idade, casa, habilidade, sangue, patrono) VALUES ($1, $2, $3, $4, $5, $6)';
    const values = [nome, idade, casa, habilidade, sangue, patrono];

    let casas = [ 'Grifinória', 'Sonserina', 'Corvinal', 'Lufa-Lufa'];
    let sangues = ['Puro', 'Mestiço', 'Trouxa'];
    let patronos = ['Cao', 'Gato', 'Rato', 'Leão', 'Cervo', 'Coruja', 'Cavalo', 'Lobo', 'Raposa', 'Cisne', 'Bode', 'Tigre', 'Fenix',
        'Cobra', 'Girafa', 'Golfinho', 'Elefante', 'Papagaio', 'Pato', 'Pombo', 'Puma', 'Rena', 'Tartaruga', 'Tubarão', 'Urso', 'Veado'];

    if(!nome || !idade || !casa || !habilidade || !sangue || !patrono){
        return res.status(400).send('Dados incompletos');
    }

    if(!casas.includes(casa)){
        return res.status(400).send('Casa não existe');
    }

    if(!sangues.includes(sangue)){
        return res.status(400).send('Sangue não existe');
    }

    if(!patronos.includes(patrono)){
        return res.status(400).send('Patrono não existe');
    }

    try{
       await pool.query(query, values);
       res.status(201).send('Personagem criado com sucesso!');
    } catch (error) {
        console.error('Erro ao buscar o personagem', error.message);
        res.status(500).send('Ocorreu um erro ao postar o personagem', error.message);
    }
});


// obtem todos os PERSONAGENS
app.get('/personagens', async (req, res) => {

    const casa = req.query.casa; // pega o parametro da URL

    try{
        const resultado = await pool.query('SELECT * FROM personagens');
        res.json(resultado.rows);

    } catch (error) {
        console.error('Erro ao buscar todos os personagens', error.message);
        res.status(500).send('Ocorreu um erro ao buscar os personagens', error.message);
    }
    }
);

//buscar PERSONAGEM por id
app.get('/personagens/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const result = await pool.query('SELECT * FROM personagens WHERE id = $1', [id]);
      if (result.rowCount === 0) {
        res.status(404).send({ mensagem: 'Personagem não encontrado' });
      } else {
        res.json(result.rows[0]);
      }
    } catch (error) {
      console.error('Erro ao obter personagem por ID:', error);
      res.status(500).send('Erro ao obter personagem por ID');
    }
  });



//atualizar um PERSONAGEM
app.put ('/personagens/:id', async (req, res) => {
    try{
        const {id} = req.params;
        const {nome, idade, casa, habilidade, sangue, patrono} = req.body;
        await pool.query('UPDATE personagens SET nome = $1, idade = $2, casa = $3, habilidade = $4, sangue = $5, patrono = $6 WHERE id = $7', [nome, idade, casa, habilidade, sangue, patrono, id]);
        res.send(201,'Personagem atualizado com sucesso!');

    } catch (error) {
        console.error('Erro ao atualizar o personagem', error.message);
        res.status(500).send('Ocorreu um erro ao atualizar o personagem', error.message);
    }
    }
);

//deletar um PERSONAGEM
app.delete('/personagens/:id', async (req, res) => {
    const { id } = req.params;

    // Verificar se 'id' é um número
    if (isNaN(id)) {
        return res.status(400).send('Id inválido');
    }

    const query = 'DELETE FROM personagens WHERE id = $1';
    const values = [id];

    try {
        const result = await pool.query(query, values);
        if (result.rowCount > 0) {
            res.status(200).send(`Personagem com id ${id} deletado com sucesso!`);
        } else {
            res.status(404).send(`Personagem com id ${id} não encontrado.`);
        }
    } catch (error) {
        console.error('Erro ao deletar o personagem', error.message);
        res.status(500).send('Ocorreu um erro ao deletar o personagem');
    }
});


// obtem todos as VARINHAS
app.get('/varinhas', async (req, res) => {

    const materiais = req.query.material; // pega o parametro da URL

    try{
        const resultado = await pool.query('SELECT * FROM varinhas1');
        res.json(resultado.rows);

    } catch (error) {
        console.error('Erro ao buscar todos as varinhas', error.message);
        res.status(500).send('Ocorreu um erro ao buscar as varinhas', error.message);
    }
    }
);
    
//criar varinha
app.post("/varinhas", async (req, res) => {
    const { material, nucleo, comprimento, fab } = req.body;
    const query = "INSERT INTO varinhas1 (material, nucleo, comprimento, fab) VALUES ($1, $2, $3, $4) RETURNING *";
    const values = [material, nucleo, comprimento, fab];

    let materiais = ["Azevinho", "Teixo", "Salgueiro", "Videira", "Vim", "Cerejeira", "Carvalho", "Freixo", "Bétula", "Louro", "Faia", "Sabugueiro",
        "Espinheiro", "Olmo", "Chifre de Unicórnio", "Pelo de Rabo de Testrálio", "Pena de Fênix", "Fibra do Coração de Dragão"];

    let nucleos = [ "Pena de Fênix", "Cabelo de Veela", "Pelo de Rabo de Testrálio", "Dente de Serpente", "Pêlo de cauda de unicórnio", 
     "Cabelo de Veado", "Escama de Dragão", "Pena de Hipogrifo", "Cabelo de Coração de Dragão", "Fibra do Coração de Dragão",
     "Cabelo de Sereiano", "Cabelo de Demiguise", "Cabelo de Thestral", "Rabo de Testrálio", "Pena de Fada", "Fibra de Veela", "Cabelo de Kelpie"];


    if (!material || !nucleo ||  !comprimento || !fab ) {
        return res.status(400).send('Dados incompletos');
    }

    if(!materiais.includes(material)){
        return res.status(400).send('Material não existe');
    }

    if(!nucleos.includes(nucleo)){
        return res.status(400).send("Núcleo não existe");
    }

    try{
        await pool.query(query, values);
        res.status(201).send('Varinha criada com sucesso!');
     } catch (error) {
         console.error('Erro ao buscar o varinha', error);
         res.status(500).send({ message: 'Ocorreu um erro ao postar a varinha', error: error.message });
     }

});

//editar VARINHA
app.put('/varinhas/:id', async (req, res) => {
    try {
       const { id } = req.params;
       const { material, nucleo, comprimento, fab } = req.body;
   
       // Use parameterized query to update the record
       await pool.query('UPDATE varinhas1 SET material = $1, nucleo = $2, comprimento = $3, fab = $4 WHERE id = $5', [material, nucleo, comprimento, fab, id]);
   
       res.status(200).send({ message: 'Atualizado' });
    } catch (error) {
       console.error('Error updating record:', error); // Log the error for debugging
       res.status(500).send({ message: "Erro ao atualizar", error: error.message }); // Send a more specific error message
    }
   });

//buscar VARINHA por id
app.get('/varinhas/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const result = await pool.query('SELECT * FROM varinhas WHERE id = $1', [id]);
      if (result.rowCount === 0) {
        res.status(404).send({ mensagem: 'Varinha não encontrado' });
      } else {
        res.json(result.rows[0]);
      }
    } catch (error) {
      console.error('Erro ao obter varinha por ID:', error);
      res.status(500).send('Erro ao obter varinha por ID');
    }
  });

  //deletar um VARINHA
app.delete('/varinhas/:id', async (req, res) => {
    const { id } = req.params;

    // Verificar se 'id' é um número
    if (isNaN(id)) {
        return res.status(400).send('Id inválido');
    }

    const query = 'DELETE FROM varinhas1 WHERE id = $1';
    const values = [id];

    try {
        const result = await pool.query(query, values);
        if (result.rowCount > 0) {
            res.status(200).send(`Varinha com id ${id} deletada com sucesso!`);
        } else {
            res.status(404).send(`Varinha com id ${id} não encontrada.`);
        }
    } catch (error) {
        console.error('Erro ao deletar a varinha', error.message);
        res.status(500).send('Ocorreu um erro ao deletar a varinha');
    }
});

//buscar por nome
app.get("/personagens/nome/:nome", async (req,res)=>{
    const { nome }= req.params;
    const query="SELECT * FROM personagens WHERE nome LIKE  $1";
    const values=[ `%${nome}%`];
    
    try{
       const results=await pool.query(query,values)
       res.json(results.rows)   
       }catch(err){
        console.log(err)
        res.status(500).send("Houve um erro na busca")  
        }
        })























// Rota de teste
app.get('/', (req, res) => {
    res.send('Servidor Funcionando');
});
//inicializcao do servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    }
);
