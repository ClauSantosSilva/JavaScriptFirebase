 // Configure o Firebase com suas credenciais
 const firebaseConfig = {
    apiKey: "AIzaSyDLN_zo4KCY0pH9tsfOWFASFGZUPgCSG80",
    authDomain: "claudia-4f47b.firebaseapp.com",
    projectId: "claudia-4f47b",
    storageBucket: "claudia-4f47b.appspot.com",
    messagingSenderId: "161304870806",
    appId: "1:161304870806:web:b7b385ed8c6cd405cd27b7"
  };


  firebase.initializeApp(firebaseConfig); // Inicialize o Firebase

const database = firebase.database(); // Inicialize o banco de dados
const storage = firebase.storage(); // Inicialize o storage

// Função para enviar dados para o Firebase
function enviarDadosParaFirebase() {
    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const telefone = document.getElementById('telefone').value;
    const doacao = document.getElementById('doacao').value;
    const imagem = document.getElementById('imagem').files[0]; // Obtém o arquivo de imagem

    if (imagem) {
        const storageRef = storage.ref('imagens/' + imagem.name);
        storageRef.put(imagem).then(snapshot => {
            snapshot.ref.getDownloadURL().then(downloadURL => {
                const dados = {
                    nome: nome,
                    email: email,
                    telefone: telefone,
                    doacao: doacao,
                    imagemURL: downloadURL // Salva a URL da imagem
                };

                database.ref('pessoas').push(dados)
                    .then(() => {
                        alert('Dados enviados com sucesso!');
                        document.getElementById('nome').value = '';
                        document.getElementById('email').value = '';
                        document.getElementById('telefone').value = '';
                        document.getElementById('doacao').value = '';
                        document.getElementById('imagem').value = '';
                    })
                    .catch(error => {
                        console.error('Erro ao enviar os dados: ', error);
                    });
            });
        }).catch(error => {
            console.error('Erro ao fazer upload da imagem: ', error);
        });
    } else {
        alert('Por favor, selecione uma imagem.');
    }
}


// Função para consultar dados dos alunos
function consultarPessoaPorNome() {
    const nome = document.getElementById('nomePessoa').value.trim().toLowerCase(); // Convertendo para minúsculas para busca case insensitive
    const pessoasRef = database.ref('pessoas');
    pessoasRef.once('value', snapshot => {
        const lista = document.getElementById('listaPessoas');
        //lista.innerHTML = ''; // Limpar lista anterior
        let encontrado = false;

        snapshot.forEach(childSnapshot => {
            const pessoa = childSnapshot.val();

            // Verifica se o nome do aluno inclui o texto buscado
            if (pessoa.nomePessoa.toLowerCase().includes(nome)) {
                encontrado = true;
                const item = document.createElement('li');
                item.innerHTML = `Nome: ${pessoa.nomePessoa}, Email: ${pessoa.email}, Telefone: ${pessoa.telefone}, Doacao: ${pessoa.doacao}, Imagem: <img src="${pessoa.imagemURL}" alt="Imagem da Doação" style="width:100px; height:auto;">`;
                lista.appendChild(item);
            }
        });

        if (!encontrado) {
            lista.innerHTML = '<li>Nenhuma pessoa encontrada com esse nome.</li>';
        }
    }).catch(error => {
        console.error('Erro ao buscar nomes: ', error);
    });
}





