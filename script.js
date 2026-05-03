const products = [
    { name: "Mechanical Keyboard", category: "keyboard", price: 12000,img:"images/imgKeyboard.jpg"},
    { name: "Gaming Mouse", category: "mouse", price: 5000,img:"images/imgMouse.jpg"},
    { name: "Wireless Earbuds", category: "audio", price: 8000,img:"images/imgEarbuds.jpg"},
    { name: "USB-C Hub", category: "accessory", price: 3000,img:"images/imgHub.jpg"},
];

function displayProducts(list) {
    const container = document.getElementById("product-list");
    container.innerHTML = "";

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

function filterProducts(category) {
    const filtered = category === "all"
    ? products
    : products.filter(p => p.category === category);

    displayProducts(filtered);
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
        //フィルター処理
        filterProducts(cat);

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