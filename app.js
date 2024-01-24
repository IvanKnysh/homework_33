class Shop {
	constructor() {
		this.url = "https://dummyjson.com";
		this.sidebar = document.querySelector(".sidebar");
		this.categorySidebar = document.querySelector(".sidebar .categories");
		this.contentProducts = document.querySelector(".content .cards");
		this.infoSidebar = document.querySelector(".info .info-content");
		this.contentTitle = document.querySelector(
			".wrapper-content .flx .content h6"
		);
		this.getProductInfo = {};
	}

	getAndShowCategories() {
		fetch(this.url + "/products/categories")
			.then((res) => res.json())
			.then((data) => {
				data.forEach((category) => {
					this.categorySidebar.insertAdjacentHTML(
						"beforeend",
						`<label><input type="radio" name="category" value="${category}"><span>${category}</span></label>`
					);
				});
			});
	}

	getAndShowAllProducts() {
		fetch(this.url + "/products")
			.then((res) => res.json())
			.then((data) => {
				data.products.forEach((product) => {
					this.contentProducts.insertAdjacentHTML(
						"beforeend",
						`
						<div class="card" data-id="${product.id}">
							<img src="${product.thumbnail}" alt="${product.title}">
							<div class="name">${product.title}</div>
						</div>
					`
					);
				});
			});
	}

	getProductInfoByClickAndShowInfo() {
		document.querySelector(".cards").addEventListener("click", (e) => {
			const ID = e.target.closest(".card").getAttribute("data-id");
			const dateTimeCurrent = new Date();

			fetch(this.url + "/products/" + ID)
				.then((res) => res.json())
				.then((data) => {
					this.getProductInfo = {
						id: data.id,
						name: data.title,
						price: data.price,
						category: data.category,
						rating: data.rating,
						description: data.description,
						date: dateTimeCurrent.toLocaleString(),
					};

					this.infoSidebar.innerHTML = `
						<h6>Info</h6>
						<div class="card" data-id="${data.id}">
							<img src="${data.thumbnail}" alt="${data.title}">
							<div class="card-content">
								<div class="name">${data.title}</div>
								<div class="price">Price: $${data.price}</div>
								<div class="category">Category: ${data.category}</div>
								<div class="rating">Rating: ${data.rating} / 5</div>
								<div class="description">${data.description}</div>
								<button>Купити</button>
							</div>
						</div>
					`;

					this.orders();
				});
		});
	}

	getProductsByCategory() {
		this.categorySidebar.addEventListener("click", (e) => {
			if (e.target.tagName === "INPUT") {
				this.contentProducts.innerHTML = "";
				this.infoSidebar.innerHTML = "";

				this.contentTitle.textContent = e.target.value;

				fetch(this.url + "/products/category/" + e.target.value)
					.then((res) => res.json())
					.then((data) => {
						data.products.forEach((product) => {
							this.contentProducts.insertAdjacentHTML(
								"beforeend",
								`
								<div class="card" data-id="${product.id}">
									<img src="${product.thumbnail}" alt="${product.title}">
									<div class="name">${product.title}</div>
								</div>
							`
							);
						});
					});
			}
		});
	}

	showOrders() {
		this.sidebar.querySelector("button").addEventListener("click", () => {
			document.querySelector(".orders").classList.toggle("active");
			this.categorySidebar.classList.toggle("active");
		});
	}

	setOrderData() {
		const data = JSON.parse(localStorage.getItem("orders"));
		data.push(this.getProductInfo);
		localStorage.setItem("orders", JSON.stringify(data));
	}

	orderCountInfo() {
		this.sidebar.querySelector("button.my-orders span").textContent =
			JSON.parse(localStorage.getItem("orders")).length;
	}

	showOrderProducts() {
		this.sidebar.querySelector(".orders ul.cart-content").innerHTML = "";

		JSON.parse(localStorage.getItem("orders")).forEach((item) => {
			this.sidebar.querySelector(".orders ul.cart-content").insertAdjacentHTML(
				"beforeend",
				`
					<li data-id="${item.id}">
						<button>X</button>
						${item.name}
						<div class="order-info">
							<div class="price"><span>Price:</span> $${item.price}</div>
							<div class="category"><span>Category:</span> ${item.category}</div>
							<div class="rating"><span>Rating:</span> ${item.rating} / 5</div>
							<div class="description"><span>Description:</span> ${item.description}</div>
							<div class="date"><span>Date:</span> ${item.date}</div>
						</div>
					</li>
				`
			);
		});
	}

	removeOrderItem() {
		this.sidebar
			.querySelector(".orders ul.cart-content")
			.addEventListener("click", (e) => {
				if (e.target.tagName === "BUTTON") {
					const data = JSON.parse(localStorage.getItem("orders"));
					const filteredData = data.filter(
						(item) => item.id != e.target.closest("li").getAttribute("data-id")
					);

					localStorage.setItem("orders", JSON.stringify(filteredData));
					e.target.closest("li").remove();
					this.orderCountInfo();
				}
			});
	}

	showOrderInfo() {
		this.sidebar
			.querySelector(".orders ul.cart-content")
			.addEventListener("click", (e) => {
				if (e.target.tagName === "LI") {
					e.target.querySelector(".order-info").classList.toggle("active");
				}
			});
	}

	showInfoPopover() {
		document.querySelector(
			".popover"
		).textContent = `Товар "${this.getProductInfo.name}" було додано до кошика`;
		document.querySelector(".popover").classList.add("active");

		setTimeout(() => {
			document.querySelector(".popover").classList.remove("active");
		}, 3000);

		this.contentProducts.innerHTML = "";
		this.infoSidebar.innerHTML = "";

		this.contentTitle.textContent = "All Products";
	}

	orders() {
		document
			.querySelector(".info-content button")
			.addEventListener("click", () => {
				this.showInfoPopover();
				this.setOrderData();
				this.showOrderProducts();
				this.orderCountInfo();
			});
	}

	init() {
		if (!JSON.parse(localStorage.getItem("orders"))) {
			localStorage.setItem("orders", "[]");
		}

		this.showOrders();
		this.getAndShowCategories();
		this.getAndShowAllProducts();
		this.getProductInfoByClickAndShowInfo();
		this.getProductsByCategory();
		this.showOrderProducts();
		this.removeOrderItem();
		this.showOrderInfo();
		this.orderCountInfo();
	}
}

const shop = new Shop();
shop.init();
