let shop = document.getElementById("shop");
let label = document.getElementById("label");
let ShoppingCart = document.getElementById("shopping-cart");
let balance;
let remainingBalance;

let basket = JSON.parse(localStorage.getItem("data")) || [];

let products = [
  {
    productId: 1,
    name: "Party Wear Shirt",
    price: 45,
    desc: "Lorem ipsum dolor sit amet consectetur adipisicing.",
    image: "images/img-1.jpg",
    quantity: 0
  },
  {
    productId: 2,
    name: "Dark Black Anime t-Shirt",
    price: 100,
    desc: "Lorem ipsum dolor sit amet consectetur adipisicing.",
    image: "images/img-2.jpg",
    quantity: 0
  },
  {
    productId: 3,
    name: "T Shirt",
    price: 25,
    desc: "Lorem ipsum dolor sit amet consectetur adipisicing.",
    image: "images/img-3.jpg",
    quantity: 0
  },
  {
    productId: 4,
    name: "Luffy One Peice Shirt",
    price: 300,
    desc: "Lorem ipsum dolor sit amet consectetur adipisicing.",
    image: "images/img-4.jpg",
    quantity: 0
  },
];


let generateShop = () => {
  return (shop.innerHTML = products
    .map((x) => {
      let { productId, name, price, desc, image } = x;
      let search = basket.find((x) => x.productId === productId) || [];
      return `
    <div id=product-id-${productId} class="item">
        <img width="220" src=${image} alt="">
        <div class="details">
          <h3>${name}</h3>
          <p>${desc}</p>
          <div class="price-quantity">
            <h2>$ ${price} </h2>
            <div class="buttons">
              <i onclick="decreaseQuantity(${productId})" class="bi bi-dash-lg"></i>
              <div id=${productId} class="quantity">
              ${search.item === undefined ? 0 : search.item}
              </div>
              <i onclick="increaseQuantity(${productId})" class="bi bi-plus-lg"></i>
            </div>
          </div>
        </div>
      </div>
    `;
    })
    .join(""));
};

generateShop();

let generateCartItems = () => {
  if (basket.length !== 0) {
    return (ShoppingCart.innerHTML = basket
      .map((x) => {
        let { productId, item } = x;
        let search = products.find((y) => y.productId === productId) || [];
        return `
      <div class="cart-item">
        <img width="100" src=${search.image} alt="" />
        <div class="details">

          <div class="title-price-x">
              <h4 class="title-price">
                <p>${search.name}</p>
                <p class="cart-item-price">$ ${search.price}</p>
              </h4>
              <i onclick="removeProductFromCart(${productId})" class="bi bi-x-lg"></i>
          </div>

          <div class="buttons">
              <i onclick="decreaseQuantity(${productId})" class="bi bi-dash-lg"></i>
              <div id=${productId} class="quantity">${item}</div>
              <i onclick="increaseQuantity(${productId})" class="bi bi-plus-lg"></i>
          </div>

          <h3>$ ${item * search.price}</h3>
        </div>
      </div>
      `;
      })
      .join(""));
  } else {
    ShoppingCart.innerHTML = ``;
    label.innerHTML = `
    <h2>Cart is Empty</h2>
    <a href="index.html">
      <button class="HomeBtn">Back to home</button>
    </a>
    `;
  }
};

generateCartItems();

let increaseQuantity = (productId) => {
  let selectedItem = productId;
  let search = basket.find((x) => x.productId === selectedItem);
  if (search === undefined) {
    basket.push({
      productId: selectedItem,
      item: 1,
    });
  } else {
    search.item += 1;
  }

  generateCartItems();
  update(selectedItem);
  localStorage.setItem("data", JSON.stringify(basket));
};

let decreaseQuantity = (productId) => {
  let selectedItem = productId;
  let search = basket.find((x) => x.productId === selectedItem);

  if (search === undefined) return;
  else if (search.item === 0) return;
  else {
    search.item -= 1;
  }

  update(selectedItem);
  basket = basket.filter((x) => x.item !== 0);
  generateCartItems();
  localStorage.setItem("data", JSON.stringify(basket));
};

let cartTotal = () => {
  if (basket.length !== 0) {
    let amount = basket
      .map((x) => {
        let { item, productId } = x;
        let search = products.find((y) => y.productId === productId) || [];

        return item * search.price;
      })
      .reduce((x, y) => x + y, 0);
    label.innerHTML = `
    <h2>Total Bill : $ ${amount}</h2>
    <button class="checkout" onclick="pay()">Checkout</button>
    <button onclick="clearCart()" class="removeAll">Clear Cart</button>
    `;
    return amount;
  } else return;
};
cartTotal();

let update = (productId) => {
  let search = basket.find((x) => x.productId === productId);
  
  document.getElementById(productId).innerText = search.item;
  calculation();
  cartTotal();
};

let removeProductFromCart = (productId) => {
  let selectedItem = productId;
  basket = basket.filter((x) => x.productId !== selectedItem);
  generateCartItems();
  cartTotal();
  localStorage.setItem("data", JSON.stringify(basket));
};

let clearCart = () => {
  basket = [];
  generateCartItems();
  calculation();
  localStorage.setItem("data", JSON.stringify(basket));
  document.getElementById("amount").value = "";
  document.getElementById("remaining-balance").innerText = "";
}


let calculation = () => {
  let cartIcon = document.getElementById("cartAmount");
  cartIcon.innerHTML = basket.map((x) => x.item).reduce((x, y) => x + y, 0);
};

calculation();

const pay = () => {
  let amount = document.getElementById("amount").value;
  remainingBalance = amount - cartTotal();
  const remainingBalanceField = document.getElementById("remaining-balance");
  remainingBalanceField.innerText = "Remaining Balance: "+ "$" + remainingBalance ;
}
