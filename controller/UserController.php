<?php


namespace controller;

use model\DAO\UserDAO;
use model\User;

class UserController
{
//TODO edit
function register() {
    if(isset($_POST["register"])){
        $err = false;
        $msg = "";
        //TODO validate password!!! And more validations to be added
        if(UserDAO::checkUser($_POST["email"])){
            $msg =  "User already exists";
            $err = true;
        }
        if(!$err) {
            $password = password_hash($_POST["password"], PASSWORD_BCRYPT);
            $user = new User($_POST["first_name"], $_POST["last_name"], $_POST["email"], $password );
            UserDAO::addUser($user);
            $_SESSION["logged_user"] = $user;
            $msg = "Successful registration.";
            //header("Location: index.php?view=main");
        }
        else{
            $msg= 'Unsuccessful';
            //include_once "view/register.php";
        }
        echo $msg;
    }
}

function login() {
    if(isset($_POST['login'])) {
        if(isset($_POST['email']) && isset($_POST['password'])) {
            $email = $_POST['email'];
            $password = $_POST['password'];
            $user = UserDAO::checkUser($email);
            if(!$user) {
                echo "Invalid password or email! Try again.";
            }
            else {
                if(password_verify($password, $user["password"])) {
                    $_SESSION['logged_user'] = $user;
                    echo "Successful login! <br>";
                    include_once "view/main.php";
                }
                else {
                    echo 'Invalid email or password.Try again.';
                }
            }
        }
    }
}

function edit()
{
    if (isset($_POST['edit'])) {
       

   }
}

function logout() {
    unset($_SESSION);
    session_destroy();
    echo "Session destroyed successfully!";
    include_once "index.php";
    //header("Location: ../index.php");
    exit;
}



}
