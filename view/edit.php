<?php
include_once 'main.php';
$user = json_decode($_SESSION['logged_user']);
?>

<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Edit Profile</title>
</head>
<body>
<form action="index.php?target=user&action=edit" method="post">
    <label>First name: * </label><br>
    <input type="text" name="first_name" value="<?= $user->first_name ?>" required><br>
    <label>Last name: * </label><br>
    <input type="text" name="last_name"  value="<?= $user->last_name ?>" required><br>
    <label>Email: * </label><br>
    <input type="email" name="email"  value="<?= $user->email ?>" readonly><br>
    <label>Current password:</label><br>
    <input type="password" name="password" placeholder="Enter password" ><br>
    <label>New password:</label><br>
    <input type="password" name="new_password" placeholder="Enter new password" ><br>
    <label>Verify password:</label><br>
    <input type="password"  name="verify_password" placeholder="Verify password" ><br>
    <input type="submit" name="edit" value="Edit" ><br>
</form>
</body>
</html>