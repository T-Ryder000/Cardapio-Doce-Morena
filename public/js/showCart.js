
function displayCart() {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  let cartContainer = document.querySelector('#cart-list');
  let totalPriceElement = document.querySelector('.total-price');
  let productPriceElement = document.querySelector('.product-price')
  let fretePriceElement = document.querySelector('.frete-price')
  let productPrice = 0
  let fretePrice = 7;
  let totalPrice = 0;

  cartContainer.innerHTML = '';

  cart.forEach(product => {
    // Calcula o preço total multiplicado pela quantidade de cada produto
    productPrice += parseFloat(product.price) * product.amount;
    totalPrice = productPrice + fretePrice;

    let productItem = document.createElement('div');
    productItem.classList.add('cart-item');
    productItem.innerHTML = `
      <img src="${product.image}" alt="Produto 1">
      <div class="item-details">
        <h2>${product.name}</h2>
        <p class="item-price">${product.price} R$</p>
      </div>
      <div class="item-quantity">
          <label class="add-quantity-label" for="quantity-${product.id}">Quantidade:</label>
          <input class="add-quantity" type="number" id="quantity-${product.id}" value="${product.amount}" min="1">
          <input type="hidden" name="idProduct" value="${product.id}" id="idProduct" />
      </div>
      <button class="remove-item remove-from-cart" data-id="${product.id}"><i class="fa-solid fa-xmark"></i></button>
    `;

    cartContainer.appendChild(productItem);


    // Aplica o evento de remoção diretamente ao botão criado
    let removeButton = productItem.querySelector('.remove-from-cart');
    removeButton.addEventListener('click', function() {
      let productId = this.getAttribute('data-id');
      removeFromCart(productId);
    });

    // Evento para atualizar a quantidade do produto
    let quantityInput = productItem.querySelector('.add-quantity');
    quantityInput.addEventListener('change', function() {
      let newQuantity = parseInt(this.value);

      // Atualiza a quantidade do produto no carrinho
      updateProductQuantity(product.id, newQuantity);
    });

  });

  // Atualiza o elemento de preço total no HTML
  productPriceElement.textContent = `${productPrice.toFixed(2)}`;
  fretePriceElement.textContent = `${fretePrice.toFixed(2)}`;
  totalPriceElement.textContent = `${totalPrice.toFixed(2)}`;

}

function updateProductQuantity(productId, newQuantity) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  // Atualiza a quantidade do produto correspondente no array do carrinho
  cart = cart.map(product => {
    if (product.id === productId) {
      product.amount = newQuantity;
    }
    return product;
  });

  // Atualiza o localStorage com a nova quantidade
  localStorage.setItem('cart', JSON.stringify(cart));

  // Reexibe o carrinho com os valores atualizados
  displayCart();

}

function removeFromCart(productId) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  cart = cart.filter(product => product.id !== productId);
  localStorage.setItem('cart', JSON.stringify(cart));
  displayCart(); // Atualiza a exibição após a remoção
}

document.addEventListener('DOMContentLoaded', displayCart);

