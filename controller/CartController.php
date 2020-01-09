<?php


namespace Controller;


use model\DAO\IngredientDAO;
use model\DAO\OthersDAO;
use model\DAO\PizzaDAO;


define("MIN_QUANTITY", 1);
define("MAX_QUANTITY", 100);
define("STATUS_PENDING", 1);
define("PAYMENT_TYPE_CASH", 1);

class CartController {

    public function seeCart() {
        include_once "view/view_cart.php";
    }

    public function addToCart()
    {
        $pizzaDAO = new PizzaDAO();

        if (isset($_POST["add_to_cart"])) {
            if (isset($_POST["pizza_id"]) && isset($_POST["dough"]) && isset($_POST["size"]) && isset($_POST["sauces"])) {
                $pizza = $pizzaDAO->getPizza($_POST["pizza_id"]);

                $ingredientsIds = array_merge($_POST["sauces"] ?? [], $_POST["cheeses"] ?? [],
                    $_POST["herbs"] ?? [], $_POST["meats"] ?? [], $_POST["vegetables"] ?? [], $_POST["miscellaneous"] ?? []);

                $ingredients = [];
                foreach ($ingredientsIds as $ingredient) {
                    $ingredientDAO = new IngredientDAO();
                    $ingredients[] = $ingredientDAO->getById($ingredient);
                }


                if ($pizza->getIngredients() != $ingredients) {

                    $pizza->setIngredients($ingredients);
                    $pizza->setModified(true);

                }
                $pizza->setDough($_POST["dough"]);
                $pizza->setSize($_POST["size"]);

                $price_for_one = 0;
                if (isset($_POST["price_for_one"])) {
                    $price_for_one = $_POST["price_for_one"];
                }

                if (isset($_POST["quantity"]) && $_POST["quantity"] >= MIN_QUANTITY && $_POST["quantity"] <= MAX_QUANTITY) {
                    $pizza->setQuantity($_POST["quantity"]);
                    $pizza->setPrice($price_for_one * $_POST["quantity"]);

                    $_SESSION["cart"]->addProduct($pizza);
                    header("Location: index.php?target=cart&action=seeCart");
                    die();
                } else {
                    //ToDo error
                    header("Location: index.php?target=pizza&action=showAll");
                    die();
                }
            } else if (isset($_POST["other_id"]) && isset($_POST["category_id"])) {
                $id = $_POST["other_id"];
                $category_id = $_POST["category_id"];

                $othersDAO = new OthersDAO();
                $other = $othersDAO->getOther($_POST[$id], $_POST[$category_id]);

                if (isset($_POST["quantity"]) && $_POST["quantity"] >= MIN_QUANTITY && $_POST["quantity"] <= MAX_QUANTITY) {
                    $other->setQuantity($_POST["quantity"]);
                } else {
                    header("Location: index.php");
                    die();
                }

                if ($category_id == 8 && isset($_POST["size"])) {
                    $price_for_one = $_POST["size"];
                } else {
                    $price_for_one = $other->getPrice();
                }
                $other->setPrice($price_for_one);

                $_SESSION["cart"]->addProduct($other);
                header("Location: index.php?target=cart&action=seeCart");
                die();
            }
        }
    }
}