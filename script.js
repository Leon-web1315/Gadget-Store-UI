const products = [
    { name: "Mechanical Keyboard", category: "keyboard", price: 12000,img:"images/imgKeyboard.jpg"},
    { name: "Gaming Mouse", category: "mouse", price: 5000,img:"images/imgMouse.jpg"},
    { name: "Wireless Earbuds", category: "audio", price: 8000,img:"images/imgEarbuds.jpg"},
    { name: "USB-C Hub", category: "accessory", price: 3000,img:"images/imgHub.jpg"},
];


let currentCategory = "all";
let currentKeyword = "";

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

    displayProducts(filtered);
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
        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
        <img src="${p.img}">
        <h3>${p.name}</h3>
        <p>¥${p.price}</p>
        `;

        container.appendChild(card);
    });
};


const categories = ["all","keyboard","mouse","audio","accessory"];

const btnContainer = document.getElementById("buttons");

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


const searchInput = document.getElementById("search");

searchInput.addEventListener("input", () => {
    currentKeyword = searchInput.value.toLowerCase();
    applyFilters();
});



let currentSort = "default";

const sortButtons = document.querySelectorAll("#sort-low, #sort-high");

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

