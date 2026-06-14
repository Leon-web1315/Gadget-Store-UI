//商品データ
const products = [
    { name: "Mechanical Keyboard", category: "keyboard", price: 12000,img:"images/imgKeyboard.jpg",description: "シンプルなキーボード"},
    { name: "Gaming Mouse", category: "mouse", price: 5000,img:"images/imgMouse.jpg",description: "握りやすいゲーミングマウス"},
    { name: "Wireless Earbuds", category: "audio", price: 8000,img:"images/imgEarbuds.jpg",description: "高音質なワイヤレスイヤホン"},
    { name: "USB-C Hub", category: "accessory", price: 3000,img:"images/imgHub.jpg",description: "使いやすいUSB-Cハブ"},
];


//DOM取得
const categories = ["all","keyboard","mouse","audio","accessory"];
const btnContainer = document.getElementById("buttons");
const searchInput = document.getElementById("search");
const sortButtons = document.querySelectorAll("#sort-low, #sort-high");
const cartButton = document.getElementById("cart-button");
const cartModal = document.getElementById("cart-modal");
const closeModal = document.getElementById("close-modal");
const modalContent = document.querySelector(".modal-content");
const checkoutButton =document.getElementById("checkout-btn");
const themeButton = document.getElementById("theme-toggle");
const closeDetail =document.getElementById("close-detail");
const detailModal = document.getElementById("detail-modal");

//状態管理
let cartCount = 0;
let cartItems = [];
let favorites = [];
let showFavoritesOnly = false;
let currentCategory = "all";
let currentKeyword = "";
let currentSort = "default";


//LocalStorage読み込み
const savedCart =
localStorage.getItem("cartItems");
if (savedCart) {

    cartItems = JSON.parse(savedCart);

    cartItems.forEach(item => {
        cartCount += item.quantity;
    });

    updateCart();
}

const savedTheme =
localStorage.getItem("theme");

if (savedTheme === "dark") {

    document.body.classList.add("dark");
}

const savedFavorites =
localStorage.getItem("favorites");

if (savedFavorites) {

    favorites =
    JSON.parse(savedFavorites);
}


//関数
function toggleFavorite(p) {

    if (favorites.includes(p.name)) {

        favorites =
        favorites.filter(
            name => name !== p.name
        );

    } else {

        favorites.push(p.name);

    }
    localStorage.setItem(
        "favorites",
        JSON.stringify(favorites)
    );

    applyFilters();
}


function updateFavoriteCount() {
    const favoriteCount = document.getElementById("favorites-filter");
    favoriteCount.textContent = `❤お気に入り(${favorites.length})`;
}


function applyFilters(){
    let filtered = [...products];

    //カテゴリ
    if (currentCategory !== "all") {
        filtered = filtered.filter(p => p.category === currentCategory);
    }

    //検索
    if (currentKeyword !== "") {
        filtered = filtered.filter(p => 
            p.name.toLowerCase().includes(currentKeyword)
        );
    }

    //並び替え
    if (currentSort === "low") {
    filtered.sort((a,b) => a.price - b.price);
    } else if (currentSort === "high") {
    filtered.sort((a,b) => b.price - a.price);
    }

    //お気に入りフィルター
    if (showFavoritesOnly) {

        filtered = filtered.filter(p =>
            favorites.includes(p.name)
        );
    }

    displayProducts(filtered);
}


function handleAddClick(e, p) {

    e.stopPropagation();
    addToCart(p);
}


function handleFavoriteClick(
    e,
    p,
    button
) {
    e.stopPropagation();

    toggleFavorite(p);

    button.textContent =
    favorites.includes(p.name)
        ? "❤"
        : "♡";
}


function openDetailModal(p) {
           
            const detailContent =
            document.getElementById("detail-content");

            //カード詳細内容
            detailContent.innerHTML = `
             <div class="detail-layout">
                <img src="${p.img}" class="detail-img">

                <div class="detail-info">

                    <button id="detail-favorite-btn">
                        ${favorites.includes(p.name) ? "❤" : "♡"}
                    </button>
                
                    <h2>${p.name}</h2>
                
                    <p>¥${p.price}</p>
                
                    <p>${p.description}</p>

                    <button id="detail-add-btn">
                        Add to Cart
                    </button>

                </div>

             </div>
            `;
            
            const detailAddBtn = 
            document.getElementById("detail-add-btn");
            
            detailAddBtn.onclick = (e) => {

                handleAddClick(e, p);

            };

            
            const detailFavoriteBtn =
            document.getElementById("detail-favorite-btn");

            
            detailFavoriteBtn.onclick = (e) => {

                handleFavoriteClick(
                    e,
                    p,
                    detailFavoriteBtn
                );
            };
            

            
            detailModal.style.display = "flex";
}



function createProductCard(p) {

    const card = document.createElement("div");
        card.className = "card";
        
        card.innerHTML = `
        <button class="favorite-btn">
            ${favorites.includes(p.name) ? "❤": "♡"}
        </button>

        <img src="${p.img}">
        <h3>${p.name}</h3>
        <p>¥${p.price}</p>
        <button class="cart-btn">Add to Cart</button>
        `;

        
        card.onclick = () => {
            openDetailModal(p);
        };


    
    const button = card.querySelector(".cart-btn");

    button.onclick = (e) => {

           handleAddClick(e, p);

    };


    
    const favoriteBtn =
    card.querySelector(".favorite-btn");

    favoriteBtn.onclick = (e) => {

           handleFavoriteClick(
            e,
            p,
            favoriteBtn
           );
    };

    return card;
}



function displayProducts(list) {

    const container = document.getElementById("product-list");
    const count = document.getElementById("result-count");
    
    container.innerHTML = "";

    
    count.textContent = `${list.length}件表示中`;
    
    if (list.length === 0) {
        container.innerHTML = "<p>該当する商品がありません</p>";
        
        return;
    }

    
    list.forEach(p => {
        const card = createProductCard(p);

        
        container.appendChild(card);
    });

    updateFavoriteCount();

};



function addToCart(p) {

    //同じ商品があるか探す
    const existingItem =
    cartItems.find(item => item.name === p.name);

    if (existingItem) {

        existingItem.quantity++;

    } else {

        cartItems.push({
            ...p,
            quantity: 1
        });
    }

    //カート件数更新
    cartCount++;

    updateCart();
}



function createCartItem(item,index) {
    return `
        <div class="cart-item">
                    
                    <img src="${item.img}" class="cart-img">

                        <div>
                            <p>${item.name} ×${item.quantity}</p>
                            <p>¥${item.price}</p>

                            <div class="quantity-controls">

                                <button class="minus-btn"
                                   data-index="${index}">
                                       -
                                </button>

                                <span>${item.quantity}</span>

                                <button class="plus-btn"
                                   data-index="${index}">
                                       +
                                </button>

                            </div>

                        </div>

        </div>
    `
}


function handleMinusClick(index) {

    //カートアイテム減らす
    cartItems[index].quantity--;

    //０になったら削除
    if (cartItems[index].quantity === 0) {
        cartItems.splice(index,1);
    }

    //カート件数も減らす
    cartCount--;

    updateCart();
}


function handlePlusClick(index) {

    //カートアイテム増やす
    cartItems[index].quantity++;

    //カート件数も増やす
    cartCount++;

    updateCart();
}



function updateCart() {
    document.getElementById("cart-count").textContent =
        cartCount;

          
        const cartList = document.getElementById("cart-items");

            //カート初期化
            cartList.innerHTML = "";

            //カート０の場合
            if (cartItems.length === 0) {

                //カート０メッセージ
                cartList.innerHTML =
                "<p>🛒 Cart is empty</p>";

                document.getElementById("cart-total").textContent =
                "Total: ¥0";

                document.getElementById("cart-total-item").textContent =
                "0 items";

                //処理終了
                return;
            }

            //カート内のアイテムを一つずつ処理
            cartItems.forEach((item,index) => {
                //カート内UI
                cartList.innerHTML += createCartItem(item,index);
            });

        //カート内マイナスボタン
        const minusButtons =
            document.querySelectorAll(".minus-btn");

            minusButtons.forEach(button => {
                button.onclick = () => {

                    const index = 
                    Number(button.dataset.index);

                    handleMinusClick(index);

                };
            });

        //カート内プラスボタン
        const plusButtons =
        document.querySelectorAll(".plus-btn");

        plusButtons.forEach(button => {

            button.onclick = () => {

                const index = 
                Number(button.dataset.index);

               handlePlusClick(index);

            };
        });


    //カート合計金額計算
    let total = 0;
    cartItems.forEach(item => {
        total += item.price * item.quantity;
    });

    //合計金額
    document.getElementById("cart-total").textContent =
    `Total: ¥${total.toLocaleString()}`;

    //合計アイテム数
    const cartCountDisplay = document.getElementById("cart-total-item")
    cartCountDisplay.textContent =`${cartCount} ${
        cartCount === 1 ? "item" : "items"
    }`;


    //LocalStorage保存
    localStorage.setItem(
        "cartItems",
        JSON.stringify(cartItems)
    );
}



//イベント設定
const favoritesFilter =
document.getElementById("favorites-filter");

favoritesFilter.onclick = () => {

    showFavoritesOnly =
    !showFavoritesOnly;

    if (showFavoritesOnly) {

        favoritesFilter.classList.add("active");

    } else {

        favoritesFilter.classList.remove("active");
        
    }

    applyFilters();
};


categories.forEach(cat => {
    const btn = document.createElement("button");
    btn.textContent = cat;
    if (cat === "all"){
        btn.classList.add("active");
    };

    btn.onclick = () => {
        currentCategory = cat;

        //フィルター処理
        applyFilters();

        //activeリセット
        document.querySelectorAll("#buttons button").forEach(b => {
            b.classList.remove("active");
        });

        //押したやつだけactive
        btn.classList.add("active");
    };

    btnContainer.appendChild(btn);
});

displayProducts(products);



searchInput.addEventListener("input", () => {
    currentKeyword = searchInput.value.toLowerCase();
    applyFilters();
});


document.getElementById("sort-low").onclick = () => {

    if (currentSort === "low"){
        currentSort = "default";

        sortButtons.forEach(b => b.classList.remove("active"));
    } else{
        currentSort = "low";

        sortButtons.forEach(b => b.classList.remove("active")); 
        document.getElementById("sort-low").classList.add("active");
    }
    applyFilters();   
};


document.getElementById("sort-high").onclick = () => {

    if (currentSort === "high"){
        currentSort = "default";

        sortButtons.forEach(b => b.classList.remove("active"));
    } else{currentSort = "high";

        sortButtons.forEach(b => b.classList.remove("active"));
        document.getElementById("sort-high").classList.add("active");
    }
    applyFilters();
};


cartButton.onclick = () => {
    cartModal.style.display = "flex";

    setTimeout(() => {
        modalContent.style.transform = "translateX(0)";
    }, 10);
};

closeModal.onclick = () => {
    modalContent.style.transform = "translateX(100%)";

    setTimeout(() => {
        cartModal.style.display = "none";
    }, 300);
};


checkoutButton.onclick = () => {

    if (cartItems.length === 0) {

        alert("Your cart is empty");

        return;
    }

    const toast =
    document.getElementById("toast");

    toast.style.opacity = "1";
    toast.style.transform = "translateY(0)";

    setTimeout(() => {

        toast.style.opacity = "0";
        toast.style.transform = "translateY(20px)";
    },3000);

    //カート初期化
    cartItems = [];

    cartCount = 0;

    //LocalStorage削除
    localStorage.removeItem("cartItems");

    updateCart();
};


themeButton.onclick = () => {

    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {

        localStorage.setItem("theme","dark");

    } else {
        localStorage.setItem("theme","light");
    }
};


closeDetail.onclick = () => {

    document.getElementById("detail-modal")
    .style.display = "none";
};


window.onclick = (e) => {

    //カートモーダル
    if (e.target === cartModal) {

        modalContent.style.transform =
        "translate(100%)";

        setTimeout(() => {

            cartModal.style.display = "none";
        },300);
    }

    //詳細モーダル
    if (e.target === detailModal) {

        detailModal.style.display = "none";
    }
};


document.addEventListener("keydown", (e) => {

    if (e.key === "Escape") {

        //カートモーダル閉じる
        if (cartModal.style.display === "flex") {

            modalContent.style.transform = 
            "translateX(100%)";

            setTimeout(() => {

                cartModal.style.display = "none";
            },300);
        }

        //詳細モーダル
        detailModal.style.display = "none";
    }
});