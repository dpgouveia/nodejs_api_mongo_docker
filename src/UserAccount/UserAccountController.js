const userAccountController = require('express').Router();
const UserAccount = require('./UserAccount');
const ObjectId = require('mongoose').Types.ObjectId;  

// define functions
function isValidObjectId(id){
    if(ObjectId.isValid(id)) {
        if((String)(new ObjectId(id)) === id) {
           return true;        
        }
        return false;
    }
    return false;
}


// route: test api
userAccountController.get('/', async (request, response) => { 
    try {
        response.status(200).json({mensagem: "It Works!!!"});
    } catch (error) {
        response.status(500).json({error: error});
    }
});

// route: create user
userAccountController.post('/create/', async (request, response) => { 

    try {

        // Obtendo os dados do usuario da requisicao
        // Validando o nome
        const {name, email, interests} = request.body;
        if(name == null || name === undefined || name == "") {
            throw {status: 400, message: "Erro: nome de usuario invalido"};
        }
        const newUser = {name, email, interests};

        // Criando usuario na base de dados
        try {
           await UserAccount.create(newUser);
        } catch(error) {
            throw {status: 500, message: error};
        }
        response.status(200).json({message: `Usuario criado com sucesso!`});
        
    } catch(error) {
        response.status(error.status).json({error: error.message});
    }

});

// route: get all users
userAccountController.get('/read/', async (request, response) => { 
    try {        

        // Buscando todos os usuario na base
        const users = await UserAccount.find();
        if(users.length <= 0) {
            response.status(204).json({});
            return;
        }

        response.status(200).json(users);
    } catch (error) {
        response.status(500).json({error: error});
    }
});


// route: get user by mongodb id
userAccountController.get('/read/:id', async (request, response) => { 
    try {        

        // Validando ID da requisicao
        if(!isValidObjectId(request.params.id)) {
            throw {status: 400, message: `Erro: ID invalido. Causa: ID deve ser compativel com objeto ObjectID do MongoDB!`};
        }
        const id = request.params.id;
        
        // Buscando ID da base
        const user = await UserAccount.findOne( {_id: id} );
        if(user == null || user == undefined) {
            throw {status: 404, message: "Usuario com ID nao encontrado na base de dados!" };
        }
        response.status(200).json(user);
    } catch (error) {
        response.status(error.status).json({error: error.message});
    }
});


// route: update user by mongodb id
userAccountController.patch('/update/:id', async (request, response) => { 
    try {        

        // Validando ID da requisicao
        if(!isValidObjectId(request.params.id)) {
            throw {status: 400, message: `Erro: ID invalido. Causa: ID deve ser compativel com objeto ObjectID do MongoDB!`};
        }
        const id = request.params.id;
        
        // Buscando ID da base
        const user = await UserAccount.findOne( {_id: id} );
        if(user == null || user == undefined) {
            throw {status: 404, message: "Usuario com ID nao encontrado na base de dados!" };
        }

        // Obtendo os dados do usuario da requisicao
        // Validando o nome
        const {name, email, interests} = request.body;
        if(name == null || name === undefined || name == "") {
            throw {status: 400, message: "Erro: nome de usuario invalido"};
        }
        const updatedUser = {name, email, interests};

        // Atualizando usuario na base de dados
        try {
           await UserAccount.updateOne( {_id: id}, updatedUser);
        } catch(error) {
            throw {status: 500, message: error};
        }
        response.status(200).json({message: `Usuario atualizado com sucesso!`});

    } catch (error) {
        response.status(error.status).json({error: error.message});
    }
});


// route: delete user by mongodb id
userAccountController.delete('/delete/:id', async (request, response) => { 
    try {        

        // Validando ID da requisicao
        if(!isValidObjectId(request.params.id)) {
            throw {status: 400, message: `Erro: ID invalido. Causa: ID deve ser compativel com objeto ObjectID do MongoDB!`};
        }
        const id = request.params.id;
        
        // Buscando ID da base
        const user = await UserAccount.findOne( {_id: id} );
        if(user == null || user == undefined) {
            throw {status: 404, message: "Usuario com ID nao encontrado na base de dados!" };
        }

        // Removendo usuario da base
        try {
            await UserAccount.deleteOne({_id: id});
        } catch(error) {
            throw {status: 500, message: `Erro inesperado durante o processamento da funcao deleteOne(id). Causa ${error}`};
        }        
        response.status(200).json({message: `Usuario removido com sucesso!`});
    } catch (error) {
        response.status(error.status).json({error: error.message});
    }
});

module.exports = userAccountController;