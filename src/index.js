console.log(`Logging output...`);

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


document.querySelector('#buttonBuscarUsuario').onclick = async function () {
    console.log(`Button clicked: #buttonBuscarUsuario `);
    
    // Obtendo componente de output
    const outputLog = document.querySelector('#txtareaOutputLog');

    // Obtendo campos da tela
    const inputId = document.querySelector('#inputId');
    const inputName = document.querySelector('#inputName');
    const inputEmail = document.querySelector('#inputEmail');
    const inputInterests = document.querySelector('#inputInterests');

    // Obtendo ID
    const userId = document.querySelector('#inputId').value;
    //console.log(userId);
    if(userId == "" || userId == null || userId == undefined) {
        outputLog.innerText = 'ID inválido ou vazio (não foi preenchido)'
    } else {

        // Enviando requisicao para busca do usuario
        const response = await fetch(`http://localhost:3000/user-account/read/${userId}`, {
                                      method: 'GET', 
                                    });
        if(response.ok) {
            const obj = await response.json();
            ///console.log(obj);

            inputId.value        = obj.user._id;
            inputName.value      = obj.user.name;
            inputEmail.value     = obj.user.email;
            inputInterests.value = obj.user.interests;

            outputLog.innerText = `Usuário com ID encontrado na base de dados. Informações do usuário carregadas na tela!`;

        } else {

            inputName.value      = '';
            inputEmail.value     = '';
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
}

document.querySelector('#buttonRemoverUsuario').onclick = async function() {
    console.log(`Button clicked: #buttonRemoverUsuario `);

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
    if(userId == "" || userId == null || userId == undefined) {
        outputLog.innerText = 'ID inválido ou vazio (não foi preenchido)'
    } else {

        // Enviando requisicao para remnocao do usuario
        const response = await fetch(`http://localhost:3000/user-account/delete/${userId}`, {
                                      method: 'DELETE',                     
        });

        // Validando resposta da requisicao
        if(response.ok) {
            const obj = await response.json();
            ///console.log(obj);

            outputLog.innerText = `Usuário com ID ${userId} removido na base de dados com sucesso!`;

            inputId.value        = '';
            inputName.value      = '';
            inputEmail.value     = '';
            inputInterests.value = '';

        } else {

            inputName.value      = '';
            inputEmail.value     = '';
            inputInterests.value = ''; 

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
}

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
    console.log(requisicao);

    // Criando um objeto json a partir dos dados na tela
    const user = JSON.stringify({ name: inputName.value, email: inputEmail.value, interests: inputInterests.value });
    console.log(user);

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
}
