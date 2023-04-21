var Ecommerce ={
    Apis:{
        categoriApi: "https://dummyjson.com/products/categories",
        productsApi: "https://dummyjson.com/products",
    },
    Elements:{
        categoryPlace: document.getElementById("category-place"),
        categoryList: document.getElementById("category-list"),
        productPlace: document.getElementById("product-place"),
        productList: document.getElementById("product-list"),
        showMore: document.getElementById("show-more-button"),
        sortSelected: document.getElementById("sort-select"),
        cleareButton: document.getElementById("cleare-button"),
    },
    Status:{
        categories: [],
        products:[],
        productSearchValue:"",
        selectedCategory: [],
        limit: 30,
        skip:0
    },
    Actions:{
        init: () => {
            Ecommerce.Actions.getAllCategories();
            const apiUrl = Ecommerce.Apis.productsApi + "?limit=" + Ecommerce.Status.limit + "&skip=" + Ecommerce.Status.skip;
            Ecommerce.Actions.getAllProducts(apiUrl); 
            
        },
        handleProductSearch: (sender) =>{
            Ecommerce.Status.productSearchValue = sender.value;
            Ecommerce.Actions.filter()
        },
        handleCategorySearch: (sender) =>{
            var allSelectedLi = document.querySelectorAll("#category-place li");
            console.log(Ecommerce.Status.products.length)

            for(let i = 0; i < allSelectedLi.length; i++){
                const element = allSelectedLi[i];
                var categoryName = element.querySelector("label").innerText;
                if(categoryName.toLocaleLowerCase().includes(sender.value.toLocaleLowerCase())){
                    element.style.display= "flex"
                }
                else{
                    element.style.display= "none";
                    element.querySelector("input").checked =false;
                }
            }
        },
        handleCategoryChange: () =>{
            const checkedCategories = document.querySelectorAll("#category-place input:checked");
            const checkedIds = []
            for (let i = 0; i < checkedCategories.length; i++) {
                const element = checkedCategories[i];
                checkedIds.push(element.getAttribute("id"))
            }
            Ecommerce.Status.selectedCategory = checkedIds;
            Ecommerce.Elements.showMore.style.display = "none"
            Ecommerce.Actions.filter()

        },
        handleSortProduct: (sender) => {
            var products = Ecommerce.Status.products;
            if (sender.value) {
                Ecommerce.Elements.cleareButton.classList.add("block")
                if(sender.value === "descPrice"){
                    products = products.sort((a,b) => b.price - a.price);
                }
                else if (sender.value ==="ascPrice"){
                    products = products.sort((a,b) => a.price - b.price);
                }
                else if(sender.value === "descRate"){
                    products = products.sort((a,b) => b.rating - a.rating)
                }
                else if(sender.value === "descDiscount"){
                    products = products.sort((a,b) => b.discountPercentage - a.discountPercentage)
                }
            }
                Ecommerce.Actions.appendProductsToHtml();
         
           
        },
        filter: () =>{
            let apiUrlNew = "";
            var searchValue = Ecommerce.Status.productSearchValue;
            if (searchValue) {
                apiUrlNew= Ecommerce.Apis.productsApi + "/search?q=" +  Ecommerce.Status.productSearchValue;
            }
            else{
                apiUrlNew = Ecommerce.Apis.productsApi;
            }

            fetch(apiUrlNew)
            .then(res => res.json())
            .then(res => {
              var selectedCategory =  Ecommerce.Status.selectedCategory;

              if (selectedCategory.length > 0) {
                Ecommerce.Status.products = res.products.filter(x => selectedCategory.includes(x.category))
                apiUrlNew = Ecommerce.Status.products;
              }
              else{
                Ecommerce.Status.products =  res.products
              }
              Ecommerce.Actions.appendProductsToHtml();
            })
        },
        appendCategoriesToHtml: () =>{
            Ecommerce.Elements.categoryPlace.innerHTML= "";
            for(let i=0; i< Ecommerce.Status.categories.length; i++){
                const eachCtg= Ecommerce.Status.categories[i];

                var categoryListDiv = document.createElement("div");
                categoryListDiv.innerHTML=Ecommerce.Elements.categoryList.innerHTML;
                categoryListDiv.querySelector("input").setAttribute("id",eachCtg);
                categoryListDiv.querySelector("label").setAttribute("for",eachCtg);

                var text = eachCtg.replaceAll("-", " ");
                var firstChar= text.charAt(0).toLocaleUpperCase();
                text = firstChar + text.substring(1);

                categoryListDiv.querySelector("label").innerText=text;
                Ecommerce.Elements.categoryPlace.appendChild(categoryListDiv.querySelector("li"))

            }     
          
        },
        appendProductsToHtml: () =>{
                Ecommerce.Elements.productPlace.innerHTML="";
            for(let i=0; i<Ecommerce.Status.products.length; i++){
                const product = Ecommerce.Status.products[i];
                
                var productsListDiv = document.createElement("div")
                productsListDiv.innerHTML= Ecommerce.Elements.productList.innerHTML;
                productsListDiv.querySelector("a").setAttribute("href", "/ProductDetails.html?id=" + product.id);
                productsListDiv.querySelector("img").setAttribute("src", product.thumbnail);
                productsListDiv.querySelector("img").setAttribute("alt", product.title);
                productsListDiv.querySelector("h5").innerText= product.title;
                productsListDiv.querySelector("p").innerText= product.description;
                productsListDiv.querySelector("div").innerHTML =
                   "<span>" + "Price:" + product.price + "</span>" +
                   "<span>" + "Rating: " + product.rating + "</span>" +
                   "<span>" + "Discount: " + product.discountPercentage + "%"; "</span>" 

                Ecommerce.Elements.productPlace.appendChild(productsListDiv.querySelector("a"));
            }
        },
        //kategoriyi api'den çekiyoruz
        getAllCategories: () => {
            fetch(Ecommerce.Apis.categoriApi)
            .then(res=>res.json())  
            .then(res=>{
                Ecommerce.Status.categories=res;
                Ecommerce.Actions.appendCategoriesToHtml()
            })
        },
        //ürünleri api'den çekiyoruz    
        getAllProducts: (apiUrl) => {
            fetch(apiUrl)
            .then(res => res.json())
            .then(res=>{
                Ecommerce.Status.products=res.products;
                if((res.limit + res.skip) < res.total){
                    Ecommerce.Elements.showMore.style.display ="block"
                }
                else{
                    Ecommerce.Elements.showMore.style.display= "none";
                }
                Ecommerce.Actions.appendProductsToHtml();
            });
        },
        showMore: () => {
            const skip = Ecommerce.Status.skip + Ecommerce.Status.limit;
            Ecommerce.Status.skip = skip;
            const apiUrl = Ecommerce.Apis.productsApi + "?limit=" + Ecommerce.Status.limit + "&skip=" + skip;
            Ecommerce.Actions.getAllProducts(apiUrl); //  get all products
        },
        cleare: () => {
            Ecommerce.Elements.sortSelected.value = "" 
            Ecommerce.Actions.init();
            Ecommerce.Elements.cleareButton.classList.remove("block")
        }
    },
}

Ecommerce.Actions.init();