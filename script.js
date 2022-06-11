const c = (el) => document.querySelector(el);
const ca = (el) => document.querySelectorAll(el);

let cart = [];
let modalKey = 0;
let modalQt = 1; // quantidade itens modal

// Listagem pizzas
pizzaJson.map((pizza, index) => {
  let pizzaItem = c(".models .pizza-item").cloneNode(true);

  pizzaItem.setAttribute("data-key", index);
  pizzaItem.querySelector(".pizza-item--img img").src = pizza.img;
  pizzaItem.querySelector(
    ".pizza-item--price"
  ).innerHTML = `R$ ${pizza.price.toFixed(2)}`;
  pizzaItem.querySelector(".pizza-item--name").innerHTML = pizza.name;
  pizzaItem.querySelector(".pizza-item--desc").innerHTML = pizza.description;

  pizzaItem.querySelector("a").addEventListener("click", (e) => {
    e.preventDefault();
    let key = e.target.closest(".pizza-item").getAttribute("data-key");
    modalQt = 1;
    modalKey = key;

    c(".pizzaBig img").src = pizzaJson[key].img;
    c(".pizzaInfo h1").innerHTML = pizzaJson[key].name;
    c(".pizzaInfo--desc").innerHTML = pizzaJson[key].description;
    c(".pizzaInfo--actualPrice").innerHTML =
      "R$ " + pizzaJson[key].price.toFixed(2);
    c(".pizzaInfo--size.selected").classList.remove("selected");
    ca(".pizzaInfo--size").forEach((size, sizeIndex) => {
      if (sizeIndex == 2) {
        size.classList.add("selected");
      }
      size.querySelector("span").innerHTML = pizzaJson[key].sizes[sizeIndex];
    });

    c(".pizzaInfo--qt").innerHTML = modalQt;

    c(".pizzaWindowArea").style.opacity = 0;
    c(".pizzaWindowArea").style.display = "flex";
    setTimeout(() => {
      c(".pizzaWindowArea").style.opacity = 1;
    }, 100);
  });

  c(".pizza-area").append(pizzaItem);
});

// Eventos Modal
function closeModal() {
  let modal = c(".pizzaWindowArea");
  modal.style.opacity = 0;
  setTimeout(() => {
    modal.style.display = "none";
  }, 400);
}

ca(".pizzaInfo--cancelButton", "pizzaInfo--cancelMobileButton").forEach(
  (item) => {
    item.addEventListener("click", closeModal);
  }
);

document.addEventListener("keydown", (event) => {
  const keyName = event.key;
  if (keyName == "Escape") {
    closeModal();
  }
});

c(".pizzaInfo--qtmenos").addEventListener("click", () => {
  if (modalQt > 1) {
    modalQt--;
    c(".pizzaInfo--qt").innerHTML = modalQt;
  }
});
c(".pizzaInfo--qtmais").addEventListener("click", () => {
  modalQt++;
  c(".pizzaInfo--qt").innerHTML = modalQt;
});
ca(".pizzaInfo--size").forEach((size, sizeIndex) => {
  size.addEventListener("click", (e) => {
    c(".pizzaInfo--size.selected").classList.remove("selected");
    size.classList.add("selected");
  });
});
c(".pizzaInfo--addButton").addEventListener("click", () => {
  let size = parseInt(c(".pizzaInfo--size.selected").getAttribute("data-key"));
  let identifier = pizzaJson[modalKey].id + "@" + size;
  let key = cart.findIndex((item) => item.identifier == identifier); // verificando os identifier do cart, se achar ele retorna o index, se n retorna -1;
  if (key > -1) {
    // se tiver uma msm pizza de msm tamanho no cart, ele so att a quantidade.
    cart[key].qt += modalQt;
  } else {
    // senao ele add nova pizza ao cart
    cart.push({
      identifier,
      id: pizzaJson[modalKey].id,
      size: size,
      qt: modalQt,
    });
  }
  closeModal();
  updateCart();
});

c(".menu-openner").addEventListener("click", () => {
  c("aside").style.left = "0";
  c("aside").classList.toggle("show");
  if(cart.length == 0){ // remover ao implementar tela para cart vazio!
    c(".cart").innerHTML = "";
    c(".subtotal span:last-child").innerHTML = '';
    c(".total span:last-child").innerHTML = '';
    c(".desconto span:last-child").innerHTML = '';
  }
});
c(".menu-closer").addEventListener("click", () => {
  c("aside").style.left = "100vw";
});

// Cart
function updateCart() {
  c(".menu-openner span").innerHTML = cart.length;

  if (cart.length > 0) {
    c("aside").classList.add("show");
    c(".cart").innerHTML = "";

    let subtotal = 0;
    let desconto = 0;
    let total = 0;

    for (let i in cart) {
      let pizzaItem = pizzaJson.find((item) => item.id == cart[i].id);
      subtotal += pizzaItem.price * cart[i].qt;

      let cartItem = c(".models .cart--item").cloneNode(true);
      let pizzaSizeName;

      switch (cart[i].size) {
        case 0:
          pizzaSizeName = "P";
          break;

        case 1:
          pizzaSizeName = "M";
          break;

        case 2:
          pizzaSizeName = "G  ";
          break;
      }

      let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;

      cartItem.querySelector("img").src = pizzaItem.img;
      cartItem.querySelector(".cart--item-nome").innerHTML = pizzaName;
      cartItem.querySelector(".cart--item--qt").innerHTML = cart[i].qt;
      cartItem
        .querySelector(".cart--item-qtmais")
        .addEventListener("click", () => {
          cart[i].qt++;
          updateCart();
        });
      cartItem
        .querySelector(".cart--item-qtmenos")
        .addEventListener("click", () => {
          if (cart[i].qt > 1) {
            cart[i].qt--;
          } else {
            cart.splice(i, 1);
          }
          updateCart();
        });

      c(".cart").append(cartItem);
    }

    desconto = subtotal * 0.1;
    total = subtotal - desconto;

    c(".subtotal span:last-child").innerHTML = `R$ ${subtotal.toFixed(2)}`;
    c(".desconto span:last-child").innerHTML = `R$ ${desconto.toFixed(2)}`;
    c(".total span:last-child").innerHTML = `R$ ${total.toFixed(2)}`;
  } else {
    c("aside").classList.remove("show");
    c("aside").style.left = "100vw";
    cart = [];
  }
}
