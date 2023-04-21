var Details={
    Apis:{
        products: "https://dummyjson.com/products/",
    },

    Elements:{
        bigImg: document.getElementById("big-img-container"),
        smallImg: document.getElementById("small-img-container"),
        rating: document.getElementById("rating"),
        price: document.getElementById("price"),
        desc: document.getElementById("desc"),
        title: document.getElementById("title"),
    },

    Actions: {
        init: () =>{
            Details.Actions.getProductDetails();
        },

        getProductDetails: () =>{
            const urlParams = new URLSearchParams(window.location.search);
            const id = urlParams.get("id");

            if (id) {
                fetch(Details.Apis.products + id)
                .then(res => res.json())
                .then(res =>{
                    Details.Elements.title.innerText= res.title;
                    Details.Elements.desc.innerText= res.description;
                    Details.Elements.price.innerText= "Price:" + res.price;

                    const ratingPercentage=((res.rating)/5)*100;//4.43
                    const ratingPercentageRounded=`${Math.round(ratingPercentage/10)*10}%`
                    Details.Elements.rating.style.width = ratingPercentageRounded;
                    console.log(ratingPercentageRounded)

                    Details.Elements.bigImg.setAttribute("src", res.images[0]);

                    for (let i = 0; i < res.images.length; i++) {
                        const imgSrc = res.images[i];
                        const imgEl = document.createElement("img");
                        imgEl.setAttribute("src", imgSrc);
                        imgEl.setAttribute("onclick", "Details.Actions.changeImg(this)");
                        if (i===0) {
                            imgEl.classList.add("active");
                        }
                        Details.Elements.smallImg.appendChild(imgEl);
                        if (i===2) {
                            break;
                        }
                    }
                })
            }
            else{
                alert("Hatalı Url!!")
            }
        },

        changeImg: (sender) => {
            const avtiveEl= Details.Elements.smallImg.querySelector(".active");
            avtiveEl.classList.remove("active");

            sender.classList.add("active");

            const imgSrc= sender.getAttribute("src");
            Details.Elements.bigImg.setAttribute("src", imgSrc);
        }

    }
}

Details.Actions.init();