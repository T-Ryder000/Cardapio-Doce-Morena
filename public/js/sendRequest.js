document.addEventListener('DOMContentLoaded', function(){


let btnSendRequest = document.querySelector('#btnEtapaResumo')
let cart = JSON.parse(localStorage.getItem('cart')) || [];
var MEU_CARRINHO = [];

cart.forEach(product => {
  MEU_CARRINHO.push({
    qntd: product.amount,
    name: product.name,
    price: product.price
  })
})

const MEU_ENDERECO = {
  cep: '00000-000',
  endereco: 'Rua Exemplo',
  bairro: 'Bairro Exemplo',
  cidade: 'Cidade Exemplo',
  uf: 'UF',
  numero: '123',
  complemento: 'Apartamento 45'
};

var VALOR_CARRINHO = 0;
var VALOR_ENTREGA = parseFloat(document.querySelector('.frete-price').textContent) || 0;
var CELULAR_EMPRESA = '5575982422604';

// Atualiza o link do botão do WhatsApp
function finalizarPedido() {
  if (MEU_CARRINHO.length > 0 && MEU_ENDERECO) {
    var itens = '';
    MEU_CARRINHO.forEach((e) => {
      // Garantir que price é um número
      let price = parseFloat(e.price);
      if (isNaN(price)) {
        console.error(`O preço '${e.price}' não é um número válido.`);
        return; // Pular este item se o preço não for válido
      }

      itens += `*${e.qntd}x* ${e.name} ....... R$ ${price.toFixed(2).replace('.', ',')} \n`;
      VALOR_CARRINHO += e.qntd * price; // Calcule o valor total do carrinho
    });

    var texto = 'Olá! gostaria de fazer um pedido:';
    texto += `\n*Itens do pedido:*\n\n${itens}`;
    texto += '\n*Endereço de entrega:*';
    texto += `\n${MEU_ENDERECO.endereco}, ${MEU_ENDERECO.numero}, ${MEU_ENDERECO.bairro}`;
    texto += `\n${MEU_ENDERECO.cidade}-${MEU_ENDERECO.uf} / ${MEU_ENDERECO.cep} ${MEU_ENDERECO.complemento}`;
    texto += `\n\n*Total (com entrega): R$ ${(VALOR_CARRINHO + VALOR_ENTREGA).toFixed(2).replace('.', ',')}*`;

    // Converte a URL
    let encode = encodeURI(texto);
    let URL = `https://wa.me/${CELULAR_EMPRESA}?text=${encode}`;

    // Adiciona o atributo href ao elemento com id 'btnEtapaResumo'
    let btnEtapaResumo = document.getElementById('btnEtapaResumo');
    if (btnEtapaResumo) {
      btnEtapaResumo.setAttribute('href', URL);
    } else {
      console.error('Elemento com id "btnEtapaResumo" não encontrado.');
    }
  } else {
    console.error('Carrinho vazio ou endereço não definido.');
  }
}




btnSendRequest.addEventListener('click', finalizarPedido)


});