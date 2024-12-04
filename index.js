const sectionCenter = document.querySelector(".one");
const body = document.querySelector("body");
let cart = [];

window.addEventListener("DOMContentLoaded", function () {
    displayMenu(foodMenu);
});

// runs everytime the windows is resized
window.addEventListener("resize", function() {
    displayMenu(foodMenu)
})

// add the menu dynamically
function displayMenu(menu) {
    let menuItems = menu.map(function (item, index) {
    let imageUrl = isMobileView() ? item.image.mobile : item.image.desktop;

    return ` <div class="menu-parent" data-id="${index}">
        <div class="img-parent">
        <img src= ${imageUrl} alt="${item.category}" class="menu-img">
        <button class="btn" data-id="${index}">
            <img src="assets/images/icon-add-to-cart.svg" alt="cart">
            Add to Cart
        </button>

        <div class="quantity">
            <button class="decrement" data-id="${index}"><img src="assets/images/icon-decrement-quantity.svg" alt="decrement"></button>
            <p class="qty">1</p>
            <button class="increment" data-id="${index}"><img src="assets/images/icon-increment-quantity.svg" alt="increment"></button>
        </div>
        </div>

        <div class="info">
        <p class=category>${item.category}</p>
        <p class="menu-name"> ${item.name}</p>
        <p class="price">$${item.price}</p>
        </div>
    </div>`;
    });
    menuItems = menuItems.join("");
    sectionCenter.innerHTML = menuItems;

    addtoCartFunction(menu);
}




// add to cart button function 
function addtoCartFunction(menu) {
    const addToCartBtn = sectionCenter.querySelectorAll(".btn");
    addToCartBtn.forEach(function (btn) {
        btn.addEventListener("click", function () {
            // hide empty cart when the add to cart is clicked
            const emptyCart = document.querySelector(".empty");
            emptyCart.classList.add("none");
            const orderedCart = document.querySelector(".ordered");
            orderedCart.classList.add("block");
            // show the filled cart
            var parent = btn.closest(".menu-parent");
            const quantityBar = parent.querySelector(".quantity");  
            const qtyBtn = quantityBar.querySelector(".quantity")
            const itemId = btn.dataset.id;         

            if(quantityBar.style.display ==="none" || !quantityBar.style.display || cart.length!==0) {
                quantityBar.style.display = "flex";
                quantityBar.style.zIndex = "20";
                btn.style.display = "none";
            } else {
                quantityBar.style.display = "none";
                btn.style.display = "flex";
            }
           
            // create the object to store extracted details
            const cartItem ={
                ...menu[itemId],
                qty: 1,
            };

            
            // push to the cart array and count
            cart.push(cartItem);
            updateCart();
            orderCount();

        })
    })

    // to get qty
    const allQuantities = document.querySelectorAll(".quantity");
    allQuantities.forEach(function (quantity) {
        const increaseBtn = quantity.querySelector(".increment");
        const decreaseBtn = quantity.querySelector(".decrement");

        // increase button
        increaseBtn.addEventListener("click", function() {
            var parent = quantity.closest(".menu-parent");
            const itemName = parent.querySelector(".menu-name").textContent;
            let itemPrice = quantity.querySelector("p");


            // find the selected menu 
            const cartContent = cart.find(function (item) {
                return item.name.trim() == itemName.trim();
            })
            if(cartContent) {
                cartContent.qty++;
                itemPrice.innerText = cartContent.qty;
            }
            updateCart()
        })
        
        // decrease button
        decreaseBtn.addEventListener("click", function () {
            var parent = quantity.closest(".menu-parent");
            const itemName = parent.querySelector(".menu-name").textContent;
            let itemPrice = quantity.querySelector("p");


            // find the selected menu 
            const cartContent = cart.find(function (item) {
                return item.name.trim() == itemName.trim();
            })

            if(cartContent.qty >=1) {
                cartContent.qty--;
                itemPrice.innerText = cartContent.qty;
                console.log(cartContent.qty);
            }
            updateCart()
        })

    }) 


}

// takes care of the cart UI 
function updateCart() {
    let cartBar = document.querySelector(".order-parent");
    // let cartParent = document.querySelector(".ordered");

    let order = cart.map(function (item) {
        return `      <div class="order">
        <div class="order-info">
          <h3>${item.name}</h3>
          <div class="miscellanous">
            <p class="amount">${item.qty}x</p>
            <p class="unit-price">@ $${item.price}</p>
            <p class="total">${item.qty * item.price}</p>
          </div>
        </div>
          <img src="assets/images/icon-remove-item.svg" alt="${item.name}" class="remove-btn">
      </div>
      <hr>`
    }).join("");
    cartBar.innerHTML = order;

    let sum = 0
    const priceArray = cart.map(function (item) {
        return item.qty * item.price
    })

    for (let i = 0; i < priceArray.length; i++) {
      sum += priceArray[i];   
    }
    //    fix the total price
    let total = document.querySelector(".total-val");
    total.innerText = `$${sum}`;   
    removeFunc(cartBar);
    orderCount();
}

// remove btn; adds event listener on the remove button on the cart bar
function removeFunc(value) {
    const removeBtns = value.querySelectorAll("img");
    removeBtns.forEach(function (btn) {
        btn.addEventListener("click", function () {
            const order = btn.closest(".order");
            const orderName = order.querySelector("h3").textContent;

            cart = cart.filter(function (item) {
                return item.name.trim() !== orderName.trim();
            })
            resetBtns(orderName);
            updateCart();

        })
    })
}


// the function for roderCount and then changes the UI when the cart is empty
function orderCount() {
    const orderCount = document.querySelector(".ordered span");
    orderCount.textContent = `(${cart.length})`;

    if (cart.length == 0) {
        const emptyCart = document.querySelector(".empty");
        emptyCart.classList.remove("none");
        const orderedCart = document.querySelector(".ordered");
        orderedCart.classList.remove("block");      
    }
    // addtoCartFunction(menu)
}

// reset the quantitybar to the add to cart btns
function resetBtns (orderName) {
    const menuParent = document.querySelectorAll(".menu-parent");

    menuParent.forEach(function (parent) {
        const item = parent.querySelector(".menu-name").textContent;


        if(item.trim() === orderName.trim()) {
            // declare
            const addToCart = parent.querySelector(".btn");
            const quantityBtn = parent.querySelector(".quantity");
            const qtyCount = quantityBtn.querySelector("p");

            // reset
            addToCart.style.display = "flex";
            quantityBtn.style.display = "none";
            qtyCount.textContent = 1;
        }
    })
}




// function for confirm button to confirm order
const confirmBtn = document.querySelector(".confirm-btn");
const confirmedParent = document.querySelector(".confirmed-parent");
confirmBtn.addEventListener("click", function () {
    const modal = document.querySelector(".modal");
    const orderTotal = document.querySelector(".total-value");
    const confirmedOrderParent = document.querySelector(".confirmedOrderParent");
    const confirmedOrder = cart.map(function (item) {
        return `<div class="confirm-order">
          <img src="${item.image.thumbnail}" alt="${item.name}">
          <div class="info">
            <h3>${item.name}</h3>
            <div class="others">
              <p class="number">${item.qty}x</p>
              <p class="unit-prices">@${item.price}</p>
            </div>
          </div>
          <p class="total-val">$${item.qty * item.price}</p>
        </div>`
    }).join("");
    confirmedOrderParent.innerHTML = confirmedOrder;
    modal.style.display = "block";
    body.style.overflow = "hidden";
    confirmedParent.style.display = "flex";
    confirmedParent.style.position = "absolute";
    orderTotal.textContent = `${document.querySelector(".total-val").textContent}`;
    if(window.innerWidth <=800) {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }
})


// functionality for the start btn
const startBtn = document.querySelector(".start-btn");
startBtn.addEventListener("click", function () {
    // declare the declare-ables
    const modal = document.querySelector(".modal");
    const confirmedParent = document.querySelector(".confirmed-parent");
    const menuParent = document.querySelectorAll(".menu-parent");

    cart = [];
    updateCart();
    menuParent.forEach(function (parent) {
        const addToCart = parent.querySelector(".btn");
        const quantityBtn = parent.querySelector(".quantity");
        const qtyCount = quantityBtn.querySelector("p");

        // reset
        addToCart.style.display = "flex";
        quantityBtn.style.display = "none";
        qtyCount.textContent = 1;
    })
    modal.style.display = "none";
    confirmedParent.style.display = "none";
    body.style.overflow = "visible";
})

// functionality for getting window size
function isMobileView() {
    return window.matchMedia("(max-width: 768px)").matches;
}















// quantity bar function 
function quantityFunc() {
    // attach event listener for increment and decrement
}
 
        // let cartCount = e.target.nextElementSibling.children[1];
        // const quantity = e.target.nextElementSibling;
        // quantity.style.display = "flex";
        // btn.style.display = "none";


        // increaseBtn.forEach(function (btn) {
        //     btn.addEventListener("click", function (){
        //         count++;
        //         cartCount.innerHTML = count;
        //     })
        // })

 



