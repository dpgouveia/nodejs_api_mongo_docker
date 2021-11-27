console.log(`Logging output...`);

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
        outputLog.innerText = 'Erro: ID vazio'
    } else {
        const response = await fetch(`http://localhost:3000/user-account/read/${userId}`);
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

document.querySelector('#buttonSalvarUsuario').onclick = function() {
    console.log(`Button clicked: #buttonSalvarUsuario `);
}

document.querySelector('#buttonLimparFormulario').onclick = function() {
    // console.log(`Button clicked: #buttonLimparFormulario `);

    const inputId = document.querySelector('#inputId');
    const inputName = document.querySelector('#inputName');
    const inputEmail = document.querySelector('#inputEmail');
    const inputInterests = document.querySelector('#inputInterests');
    const txtareaOutputLog = document.querySelector('#txtareaOutputLog');

    inputId.value = '';
    inputName.value = '';
    inputEmail.value = '';
    inputInterests.value = '';
    txtareaOutputLog.innerText = '';  
}
