console.log(`Logging output...`);

// Function definition

/* buscarUsuario(userId): Trazer os dados do usuário selecionado na lista de usuários
 *                 Input: userId - MongoDB ID do usuário
 */
async function buscarUsuario(userId) {
    console.log(`Iniciando buscarUsuario()....`);
    
    // Obtendo componente de output
    const outputLog = document.querySelector('#txtareaOutputLog');

    // Obtendo campos da tela
    const inputId = document.querySelector('#inputId');
    const inputName = document.querySelector('#inputName');
    const inputEmail = document.querySelector('#inputEmail');
    const inputInterests = document.querySelector('#inputInterests');

    // Enviando requisicao para busca do usuario
    const response = await fetch(`http://localhost:3000/user-account/read/${userId}`, {
        method: 'GET',
    });
    if (response.ok) {
        const user = await response.json();
        console.log(user);

        inputId.value = user._id;
        inputName.value = user.name;
        inputEmail.value = user.email;
        inputInterests.value = user.interests;

        outputLog.innerText = `Usuário com ID encontrado na base de dados. Informações do usuário carregadas na tela!`;

    } else {

        inputName.value = '';
        inputEmail.value = '';
        inputInterests.value = '';

        switch (response.status) {
            case 400:
                outputLog.innerText = `ID Inválido`;
                break;

            case 404:
                outputLog.innerText = `Usuário com ID ${userId} não foi encontrado na base`;
                break;

            default:
                outputLog.innerText = `Erro inesperado durante a busca do usuário. Status: ${response.status}. Causa: ${response.statusText}`;
                break;
        }
    }
}

/*
 * removerUsuario(userId): Remove o usuário da base dado o ID informado no campo ID
 */
async function removerUsuario(userId) {

    // Obtendo componente de output
    const outputLog = document.querySelector('#txtareaOutputLog');

    // Obtendo campos da tela
    const inputId = document.querySelector('#inputId');
    const inputName = document.querySelector('#inputName');
    const inputEmail = document.querySelector('#inputEmail');
    const inputInterests = document.querySelector('#inputInterests');

    // Obtendo ID
    if(userId == "" || userId == null || userId == undefined) {
        outputLog.innerText = 'ID inválido ou vazio (não foi preenchido)'
    } else {

        // Enviando requisicao para remnocao do usuario
        const response = await fetch(`http://localhost:3000/user-account/delete/${userId}`, {
                                      method: 'DELETE',                     
        });

        // Validando resposta da requisicao
        if(response.ok) {

            outputLog.innerText = `Usuário com ID ${userId} removido na base de dados com sucesso!`;
        
        } else {

            switch (response.status) {
                case 400:
                    outputLog.innerText = `ID Inválido`;
                    break;

                case 404:
                    outputLog.innerText = `Usuário com ID ${userId} não foi encontrado na base`;
                    break;
            
                default:
                    outputLog.innerText = `Erro inesperado durante a remoção do usuário na base. Status: ${response.status}. Causa: ${response.statusText}`;
                    break;
            }   
        }
    }

    // Limpando os campos (precaução)
    inputId.value        = '';
    inputName.value      = '';
    inputEmail.value     = '';
    inputInterests.value = '';

    // Atualizando lista de usuários no final da operação
    listarUsuarios();
}

/* 
 * ListarUsuario(): Imprimr lista de funcionarios na pagina principal da aplicacao
 */
async function listarUsuarios() {

    const outputLog = document.querySelector('#txtareaOutputLog');
    const table = document.querySelector('#tableUserData');
    table.innerText = '';
 
    // Gerando tabela dinamica com os usuários cadastros no sistema
    const rowHeader = document.createElement('tr');
    const deleteHeader = document.createElement('th');
    const nameHeader = document.createElement('th');
    const emailHeader = document.createElement('th');
    const interestsHeader = document.createElement('th');
    deleteHeader.innerText = 'Remover Registro?'
    nameHeader.innerText = 'Name'
    emailHeader.innerText = 'Email'
    interestsHeader.innerText = 'Interests'
    rowHeader.append(deleteHeader);
    rowHeader.append(nameHeader);
    rowHeader.append(emailHeader);
    rowHeader.append(interestsHeader);
    table.append(rowHeader);

    // Requisitando a lista de usuarios cadastrados na solucao
    try {
        
        const users = await (await fetch(`http://localhost:3000/user-account/read/`, { method: 'GET', })).json();
        console.log(users);

        // Preenchendo linhas na tabela de acordo como cada usuario da lista
        let row;
        let deleteData, nameData, emailData, interestsData, nameButton, deleteButton;
        users.forEach(user => {
            //console.log(element);
            row           = document.createElement('tr');
            deleteData    = document.createElement('td');
            nameData      = document.createElement('td');
            emailData     = document.createElement('td');
            interestsData = document.createElement('td');
            nameButton    = document.createElement('button');
            deleteButton  = document.createElement('button');

            deleteButton.innerText = '-'
            deleteButton.onclick = () => { removerUsuario(user._id) };
            deleteData.align = 'center'; // TODO: deprecated property -> futuramente deve ser feito via CSS
            deleteData.append(deleteButton);

            nameButton.innerText = user.name;
            nameButton.onclick = () => { buscarUsuario(user._id); };
            nameData.align = 'center'; // TODO: deprecated property -> futuramente deve ser feito via CSS
            nameData.append(nameButton);

            emailData.innerText     = user.email;
            interestsData.innerText = user.interests;

            row.append(deleteData);
            row.append(nameData);
            row.append(emailData);
            row.append(interestsData);
            table.append(row);
        });

    } catch(error) {
        outputLog.innerText = `Erro durante a busca da lista de usuários cadastrados. Causa: ${error}`;
    }
}

/* 
 * LimparFormulario(): Limpa todos os campos da tela da aplicacao
 */
document.querySelector('#buttonLimparFormulario').onclick = function() {
    console.log(`Button clicked: #buttonLimparFormulario `);

    // Obtendo campos da tela
    const inputId = document.querySelector('#inputId');
    const inputName = document.querySelector('#inputName');
    const inputEmail = document.querySelector('#inputEmail');
    const inputInterests = document.querySelector('#inputInterests');
    const txtareaOutputLog = document.querySelector('#txtareaOutputLog');

    // Limpando os campos da tela
    inputId.value = '';
    inputName.value = '';
    inputEmail.value = '';
    inputInterests.value = '';
    txtareaOutputLog.innerText = '';

}


/* 
 * SalvarUsuário(): Cria um usuário ou atualiza um existente, caso seja informado um ID válido.
 */
document.querySelector('#buttonSalvarUsuario').onclick = async function() {
    console.log(`Button clicked: #buttonSalvarUsuario`);

    // Obtendo componente de output
    const outputLog = document.querySelector('#txtareaOutputLog');

    // Obtendo campos da tela
    const inputId = document.querySelector('#inputId');
    const inputName = document.querySelector('#inputName');
    const inputEmail = document.querySelector('#inputEmail');
    const inputInterests = document.querySelector('#inputInterests');

    // Obtendo ID
    const userId = inputId.value;
    //console.log(userId);

    // Validando se o ID do usuario foi preenchido para definir a requisicao
    // Requisicao padrao sera sempre criar um usuario novo
    let requisicao = { url: 'http://localhost:3000/user-account/create', method: 'POST' };
    if(userId != null && userId != undefined && userId != "" ) {
        requisicao.url = `http://localhost:3000/user-account/update/${userId}`;
        requisicao.method = 'PATCH';
    }
    //console.log(requisicao);

    // Criando um objeto json a partir dos dados na tela
    const user = JSON.stringify({ name: inputName.value, email: inputEmail.value, interests: inputInterests.value });
    //console.log(user);

    // Enviando requisicao para criacao/atualizacao do usuario
    const response = await fetch(requisicao.url, {
                                 method: requisicao.method,
                                 headers: {
                                   'Content-type': 'application/json'
                                 },                     
                                 body: user
    });

    // Validando resposta da requisicao
    if(response.ok) {
        outputLog.innerText = 'Novo usuário criado/atualizado com sucesso!';
    } else {
        switch (response.status) {
            case 400:
                outputLog.innerText = `Nome do usuário é inválido (vazio). "Name" é um campo obrigatório`;
                break;

            case 404:
                outputLog.innerText = `Não foi possível atualizar o usuário, pois o ID ${userId} não foi encontrado na base`;
                break;
        
            default:
                outputLog.innerText = `Erro inesperado durante a criação/atualização do usuário na base. Status: ${response.status}. Causa: ${response.statusText}`;
                break;
        }
    }

    // Se foi criado um novo usuário, limpar os campos para evitar "falsa atualização" de registro recem criado
    if(userId == null || userId == undefined || userId == "" ) {
        inputId.value        = '';
        inputName.value      = '';
        inputEmail.value     = '';
        inputInterests.value = '';
    }

    // Atualizar lista de usuário no final da operação
    listarUsuarios();
}

// Main function
listarUsuarios(); // Ao carregar a aplicação na primeira vez, trazer a lista de usuários cadastrados na base
