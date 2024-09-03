let idProduct;
let nameProduct;
let priceProduct;
let descriptionProduct;
let amountProduct;
let imageProduct;
let additionalProduct;
let flavorProduct;

function writeModal(element){

  let type = element.getAttribute('data-type');
  console.log(type)

  if (type === 'search') {
      // Pegando os valores a partir do elemento clicado
    nameProduct = element.querySelector('#title-search').value;
    descriptionProduct = element.querySelector('#description-search').value;
    idProduct = element.querySelector('#idProduct-search').value;
    priceProduct = element.querySelector('#price-search').value;
    imageProduct = element.querySelector('#image-search').value;
    
  } else if (type === 'sample') {
      // Pegando os valores a partir do elemento clicado
    nameProduct = element.querySelector('#title-sample').value;
    descriptionProduct = element.querySelector('#description-sample').value;
    idProduct = element.querySelector('#idProduct-sample').value;
    priceProduct = element.querySelector('#price-sample').value;
    imageProduct = element.querySelector('#image-sample').value;
  }

  // Selecionando os elementos do modal
  let titleModal = document.querySelector('.title-modal');
  let descriptionModal = document.querySelector('.description-modal');
  let imageModal = document.querySelector('.img-modal')

  // Atualizando o conteúdo do modal
  titleModal.innerHTML = nameProduct;
  descriptionModal.innerHTML = descriptionProduct;
  imageModal.src = imageProduct;
}


const btnAddCart = document.querySelector('#btnAddCart')

function addToCart(product){
  let cart = JSON.parse(localStorage.getItem('cart'))|| []

  cart.push(product)

  localStorage.setItem('cart', JSON.stringify(cart))
}

btnAddCart.addEventListener('click', function(){
  amountProduct = document.getElementById('quantity1').value;
  
  let product = {
    id: idProduct,
    name: nameProduct,
    price: priceProduct,
    amount: amountProduct,
    image: imageProduct
  };
  addToCart(product);
})

