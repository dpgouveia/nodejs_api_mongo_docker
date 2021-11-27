console.log(`Logging output...`);

document.querySelector('#buttonBuscarUsuario').onclick = function () {
    console.log(`Button clicked: #buttonBuscarUsuario `);
    
    // Obtendo componente de output
    const outputLog = document.querySelector('#txtareaOutputLog');

    // Obtendo ID
    const value = document.querySelector('#inputId').value;
    console.log(value);
    if(value == "" || value == null || value == undefined) {
        outputLog.innerText = 'Erro: ID vazio'
    } else {
        outputLog.innerText = `TODO: Buscando registro no banco e apresentando na tela`;
    }

}

document.querySelector('#buttonSaveUsuario').onclick = function() {
    console.log(`Button clicked: #buttonSaveUsuario `);
}

document.querySelector('#buttonLimparFormulario').onclick = function() {
    console.log(`Button clicked: #buttonLimparFormulario `);
}
