class Shop {
	constructor() {
		this.url = "https://dummyjson.com";
		this.categorySidebar = document.querySelector(".sidebar .sidebar-content");
		this.contentProducts = document.querySelector(".content .cards");
		this.infoSidebar = document.querySelector(".info .info-content");
		this.contentTitle = document.querySelector(
			".wrapper-content .flx .content h6"
		);
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
			})
			.catch((err) => console.log(err));
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

			fetch(this.url + "/products/" + ID)
				.then((res) => res.json())
				.then((data) => {
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

					this.showInfoPopover();
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

	showInfoPopover() {
		document
			.querySelector(".info-content button")
			.addEventListener("click", (e) => {
				const productName = e.target
					.closest(".card")
					.querySelector(".name").textContent;

				document.querySelector(
					".popover"
				).textContent = `Товар "${productName}" було додано до кошика`;
				document.querySelector(".popover").classList.add("active");

				setTimeout(() => {
					document.querySelector(".popover").classList.remove("active");
				}, 2000);

				this.contentProducts.innerHTML = "";
				this.infoSidebar.innerHTML = "";

				this.contentTitle.textContent = "All Products";
			});
	}

	init() {
		this.getAndShowCategories();
		this.getAndShowAllProducts();
		this.getProductInfoByClickAndShowInfo();
		this.getProductsByCategory();
	}
}

const shop = new Shop();
shop.init();
