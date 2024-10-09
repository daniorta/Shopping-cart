window.addEventListener("load", () => {

    let layoutProducts = document.querySelector(".layout__products");
    let layoutCart = document.querySelector(".layout__cart");
    let cartProducts = document.querySelector(".cart__products");
    let totalPrice = document.querySelector(".total__price");
    let cartIco =  document.querySelector(".cart__ico");
    let cartBtn = document.querySelector(".cart__btn");



    //Creaciónm de array de objetos con los productos
    let products = [
        {
            id: 0,
            title: "Camiseta",
            img: "assets/img/product-1.jpg",
            stock: 5,
            price: 14.99
        },

        {
            id: 1,
            title: "Camara",
            img: "assets/img/product-2.jpg",
            stock: 7,
            price: 49.99
        },

        {
            id: 2,
            title: "Portatil",
            img: "assets/img/product-3.jpg",
            stock: 8,
            price: 499.99
        },

        {
            id: 3,
            title: "Zapatillas",
            img: "assets/img/product-4.jpg",
            stock: 3,
            price: 29.99
        }
    ];

    // variable de objeto 
    let cart = [];

    //------ funcion para restar elementos del carro---------
    function removeCart(id) {
        let cartProduct = findCart(id);

        
        if (cartProduct) {
            cartProduct.quantity--;

            if (cartProduct.quantity <= 0) {
                cart = cart.filter(item => item.id !== parseInt(id));
            }

            localStorage.setItem("cart", JSON.stringify(cart));

            // limpiamos el carrito
            if (getTotal() <= 0) {
                cart = [];
                localStorage.removeItem("cart");
                layoutCart.classList.add("layout__cart--hide");
            }

        }

    };


    // -----calcular total
    function getTotal() {

        let total = 0;

        cart.forEach(productCart => {
            let product = findProduct(productCart.id);
            // console.log(product);
            let subtotal = product.price * productCart.quantity;

            total += subtotal;

        });
        return total.toFixed(2);

    }


    //--------- funcion showCart-------
    // nos listara todo el carrito
    function showCart() {

        if (cart.length > 0) {
            layoutCart.classList.remove("layout__cart--hide");
        } else {
            layoutCart.classList.add("layout__cart--hide")
        }

        cartProducts.innerHTML = "";

        cart.find(cartProduct => {
            let product = findProduct(cartProduct.id);
            let subtotal = product.price * cartProduct.quantity;

            cartProducts.innerHTML += `
            
            <article class="cart__item">

                <div class="cart__container--img">
                    <img  class="cart__img" src="${product.img}"/>
                </div>

                <div class="cart__content">
                    <h3 class="cart__product-title">${product.title}</h3> 
                
                    <button class="cart__btn-quantity">
                        <i class="btn-quantity__ico-minus fa-solid fa-minus" data-id="${product.id}"></i>

                        <span class="btn-quantity__number"> ${cartProduct.quantity}</span>

                        <i class="btn-quantity__ico-plus fa-solid fa-plus" data-id="${product.id}"></i>
                    </button>

                    <p class="cart__subtotal">${Math.trunc(subtotal * 100) / 100}€ </p>

                </div>

            </article>
            `;

            // actualizara la compra total cada vez que se itere con el producto
            let total = getTotal()
            totalPrice.textContent = total + "€";
            
            //capturamos el boton de restar producto
            let iconsMinus = document.querySelectorAll(".btn-quantity__ico-minus");

            iconsMinus.forEach(ico => {
                ico.addEventListener("click", () => {

                    let productId = ico.getAttribute("data-id");

                    removeCart(productId);

                    showCart();

                });
            });

            //capturamos el boton de sumar producto
            let iconsPLus = document.querySelectorAll(".btn-quantity__ico-plus");

            iconsPLus.forEach(ico => {
                ico.addEventListener("click", () => {

                    let productId = ico.getAttribute("data-id");

                    addCart(productId);

                    showCart();

                });
            });


        });
    }


    //------- funcion para añadir los elementos al carro---------
    // del localStorage
    function loadCart() {
        let myCart = JSON.parse(localStorage.getItem("cart"));

        if (myCart) {
            cart = myCart;
            showCart();
        }
        if (cart.length > 0) {
            layoutCart.classList.remove("layout__cart--hide");
        }
    }



    // --------funcion para añadir al carrito el product-------
    function addCart(id) {

        let cartProduct = findCart(id);

        let product = findProduct(id);

        // si el resultado es null, añadiremos al carrito ese producto xk 
        // no existe ese objeto dentro del carrito
        if (cartProduct == null) {
            cart.push({
                id: id,
                quantity: 1
            });

            // si ya existe ese producto en el carrito, 
            // sumaremos un articulo mas en el carrito, pero no se añade nuevamente
        } else {
            cartProduct.quantity++;

            // si superamos el stock, nos debe de dar una alerta de la no disponibilidad
            if (cartProduct.quantity > product.stock) {
                alert("Solo tenemos " + product.stock + " disponibles");
                // actualizamos el stock
                cartProduct.quantity = product.stock;
            }
        }

        localStorage.setItem("cart", JSON.stringify(cart));


    }

    // -----funcion que buscara dentro del carro si existe ya ese producto o no,--- 
    // si no existe lo mete si existe solo suma
    function findCart(id) {
        let exists = cart.findIndex(productCart => productCart.id == id);

        if (exists != -1) {
            return cart[exists]
        } else {
            return null;
        }
    }




    //---- va a recorrer los productos con find(), hata que encuentre la primera coincidencia-----
    function findProduct(id) {
        return products.find(product => product.id == id)
    }

    // funcion para añadir los articulos a la web
    function showProducts() {

        products.forEach(product => {
            layoutProducts.innerHTML += `
            <article class="products__product">

                <div class="product__container-img">

                    <img class="product__img" src="${product.img}" />
                    
                    <div class="product__title">${product.title}</div>

                    <div class="product__price">${product.price}</div>

                    <button class="product__btn" data-id="${product.id}">cart__btn</button>
                </div>
            
            </article>
            
            `

        });

        // seleccionar todos los botones "cart__btn"
        let allBtnBuy = document.querySelectorAll(".product__btn");

        //--------- recorremos todos los botones--------
        allBtnBuy.forEach(btn => {

            btn.addEventListener("click", () => {

                // debemos de sacar el id del producto
                let productId = parseInt(btn.getAttribute("data-id"));

                // producId es el parametro que tenemos en la funcion findProduct.
                // obtendriamos el objeto completo con ese id
                let product = findProduct(productId);

                if (product.stock > 0) {

                    // añado al carrito el producto
                    addCart(productId);
                    showCart();

                }

            });

        });
    }

    // boton de X  del menu aside
    cartIco.addEventListener("click", () => {
        layoutCart.classList.toggle("layout__cart--hide");
    });

    // boton de cart__btn todo
    cartBtn.addEventListener("click", () => {
        cart = [];
        localStorage.removeItem("cart");
        localStorage.clear();
        layoutCart.classList.toggle("layout__cart--hide");


    });


    showProducts();
    loadCart()


});