function plus(key) {

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {

            var item = document.getElementById("items_quantity" + key);

            var response = JSON.parse(this.responseText);

            if (response.error == "true") {
                document.getElementById("quantity_warning").style.display = "block";
            } else {

                item.value++;

                cart = response.cart;
                var price_for_one_item = document.getElementById("price_for_one_item" + key);
                price_for_one_item.innerText = (parseFloat(price_for_one_item.innerText) + parseFloat(cart.products[key].price)).toFixed(2);

                var price_tag = document.getElementById("price_tag");
                price_tag.innerText = (parseFloat(price_tag.innerText) + parseFloat(cart.products[key].price)).toFixed(2);
            }
        }
    };

    xhttp.open("GET", "index.php?target=cart&action=addQuantity&id=" + key, true);
    xhttp.send();
}

function minus(key) {

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var item = document.getElementById("items_quantity" + key);
            item.value--;

            if (item.value == 0) {
                document.getElementById("product"+key).style.display = "none";
            }

            var cart = JSON.parse(this.responseText);
            if (cart.products.length == 0) {
                document.getElementById("shopping_cart").style.display = "none";
                document.getElementById("empty_cart_warning").style.display = "block";

            }

            var price_for_one_item = document.getElementById("price_for_one_item" + key);
            price_for_one_item.innerText = (parseFloat(price_for_one_item.innerText) - parseFloat(cart.products[key].price)).toFixed(2);

            var price_tag = document.getElementById("price_tag");
            price_tag.innerText = (parseFloat(price_tag.innerText) - parseFloat(cart.products[key].price)).toFixed(2);
        }
    };

    xhttp.open("GET", "index.php?target=cart&action=subtractQuantity&id=" + key, true);
    xhttp.send();
}


function viewCart() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {

            var cart = JSON.parse(this.responseText);
            var shopping_cart_div = document.getElementById("shopping_cart");

            if (cart.empty == "false") {
                cart = cart.cart;
                var items = cart.products;
                var price = 0;
                for (var key in items) {
                    var product_container = document.createElement("div");
                    product_container.setAttribute("id", "product" + key);

                    var items_id = document.createElement("input");
                    items_id.type = "hidden";
                    items_id.name = "keys[]";
                    items_id.value = key;

                    product_container.appendChild(items_id);

                    var items_name = document.createElement("h2");
                    items_name.innerText = items[key].name;
                    product_container.appendChild(items_name);

                    var ingrArray = [];
                    for (var keys_pr in items[key].ingredients) {
                        ingrArray[keys_pr] = items[key].ingredients[keys_pr].name;
                    }
                    var ingredients_div = document.createElement("div");
                    ingredients_div.innerText = ingrArray.join(", ");
                    product_container.appendChild(ingredients_div);

                    if (typeof items[key].description !== 'undefined') {
                        var description = document.createElement("div");
                        description.innerText = items[key].description;
                        product_container.appendChild(description);
                    }

                    var quantity_container = document.createElement("div");
                    quantity_container.setAttribute("class", "row");
                    var minus = document.createElement("img");
                    minus.setAttribute("class", "icons float-left");
                    minus.src = "uploads/minus.png";
                    minus.setAttribute("onclick", "minus(" + key + ")");
                    quantity_container.appendChild(minus);

                    var items_quantity = document.createElement("input");
                    items_quantity.type = "number";
                    items_quantity.readOnly = true;
                    items_quantity.name = "quantities[]";
                    items_quantity.id = "items_quantity" + key;
                    items_quantity.value = items[key].quantity;
                    items_quantity.setAttribute("class", "form-control float-left w-25 ");
                    items_quantity.setAttribute("max", "100 ");
                    quantity_container.appendChild(items_quantity);


                    var plus = document.createElement("img");
                    plus.setAttribute("class", "icons float-left");
                    plus.src = "uploads/plus.png";
                    //if (items_quantity.value < 100) {
                        plus.setAttribute("onclick", "plus(" + key + ")");
                    //}
                    quantity_container.appendChild(plus);
                    product_container.appendChild(quantity_container);

                    var price_container = document.createElement("h3");
                    price_container.setAttribute("class", "row mt-3");
                    var lv_addition = document.createElement("span");
                    lv_addition.innerText = " BGN";
                    var price_for_item_el = document.createElement("span");
                    price_for_item_el.id = "price_for_one_item" + key;
                    price_for_item_el.innerText = (items_quantity.value * items[key].price).toFixed(2);
                    price_container.appendChild(price_for_item_el);
                    price_container.appendChild(lv_addition);

                    product_container.appendChild(price_container);


                    product_container.appendChild(document.createElement("hr"));

                    price += items_quantity.value * items[key].price;

                    shopping_cart_div.appendChild(product_container);


                }
                var price_container = document.createElement("h1");
                price_container.innerText = "Total price: ";

                var lv_addition = document.createElement("span");
                lv_addition.innerText = " BGN";

                var price_tag = document.createElement("span");
                price_tag.innerText = price.toFixed(2);
                price_tag.id="price_tag";
                price_container.appendChild(price_tag);
                price_container.appendChild(lv_addition);

                shopping_cart_div.appendChild(price_container);


                var submit_form = document.createElement("form");
                submit_form.method = "post";
                submit_form.action = "index.php?target=order&action=finish";

                var comment = document.createElement("textarea");
                comment.placeholder = "Additional info...";
                comment.setAttribute("name", "comment");
                comment.setAttribute("class", "form-control w-50 mb-2");
                comment.setAttribute("maxlength", "254");
                submit_form.appendChild(comment);

                var payment_container = document.createElement("div");
                payment_container.setAttribute("class", "mb-2 mt-2");

                var payment_title = document.createElement("h6");
                payment_title.innerText = "Select your payment type:";

                payment_container.appendChild(payment_title);
                var cash = document.createElement("input");
                cash.type = "radio";
                cash.value = "1";
                cash.id = "cash";
                cash.setAttribute("class", "payment");
                cash.checked = true;
                cash.name = "payment_type";

                var label = document.createElement("label");
                label.setAttribute("class", "payment_img m-3");
                var icon = document.createElement("img");
                icon.src = "uploads/cash.png";
                label.appendChild(icon);
                label.setAttribute("for", "cash");

                payment_container.appendChild(cash);
                payment_container.appendChild(label);

                var text = document.createElement("span");
                text.innerText = "(Cash)";
                payment_container.appendChild(text);

                var card = document.createElement("input");
                card.type = "radio";
                card.value = "2";
                card.setAttribute("class", "payment ");
                card.id = "card";
                card.name = "payment_type";

                var label_card = document.createElement("label");
                label_card.setAttribute("class", "payment_img m-3 ml-5");
                var icon = document.createElement("img");
                icon.src = "uploads/card.png";
                icon.setAttribute("class", "payment_img");
                label_card.appendChild(icon);
                label_card.setAttribute("for", "card");

                payment_container.appendChild(card);
                payment_container.appendChild(label_card);
                var text = document.createElement("span");
                text.innerText = "(Card)";
                payment_container.appendChild(text);


                submit_form.appendChild(payment_container);


                var input_submit = document.createElement("input");
                input_submit.type = "submit";
                input_submit.name = "order";
                input_submit.value = "Order";
                input_submit.setAttribute("class", "w-50 btn btn-primary ");
                // input_submit.onclick = function() { deliveryAlert(); };

                submit_form.appendChild(input_submit);

                shopping_cart_div.appendChild(submit_form);
            } else {
                document.getElementById("empty_cart_warning").style.display = "block";
            }
        }
    };

    xhttp.open("GET", "index.php?target=cart&action=get", true);
    xhttp.send();
}

function checkCart() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var cart = JSON.parse(this.responseText);

            var a = document.createElement("a");
            a.href = "index.php?target=cart&action=seeCart";
            a.setAttribute("class", "text-decoration-none");
            var img = document.createElement("img");
            var p = document.createElement("p");
            if (cart.empty == "true") {
                img.src = "uploads/empty_cart.png";
                p.innerText = "(empty)";
            } else {
                img.src = "uploads/full_cart.png";
                p.innerText = cart.cart.products.length + " items";
            }

            img.setAttribute("class", "shopping_cart_img");
            a.appendChild(img);

            a.appendChild(p);
            var shopping_cart_div = document.getElementById("shopping_cart_icon");
            shopping_cart_div.appendChild(a);
        }
    };

    xhttp.open("GET", "index.php?target=cart&action=get", true);
    xhttp.send();
}

function deliveryAlert() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            if (this.responseText.length != 0) {
                var container = document.getElementById("alert_if_delivery_empty");
                container.setAttribute("class", "alert alert-warning alert-dismissible fade show mt-3");
                container.innerText = this.responseText;

                var dismiss = document.createElement("button");
                dismiss.type = "button";
                dismiss.innerText = "×";
                dismiss.setAttribute("class", "close");
                dismiss.setAttribute("data-dismiss", "alert");
                dismiss.setAttribute("aria-label", "Close");
                container.appendChild(dismiss);
            }
        }
    };

    xhttp.open("GET", "index.php?target=order&action=checkDelivery", true);
    xhttp.send();
}

function finishedOrder() {
    var query = window.location.search.substring(1);
    var arr = query.split("&");
    if (arr.pop() == "finish") {

        document.getElementById("finished_order").style.display="block";
        document.getElementById("alert_if_delivery_empty").style.display="none";
        document.getElementById("empty_cart_warning").style.display = "none";
    }
}