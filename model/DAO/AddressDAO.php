<?php

namespace model\DAO;

include_once "DBConnector.php";
use model\Address;
use PDO;
use PDOException;

class AddressDAO
{
    static function add(Address $address, $user_id){
        $phone_number = $address->getPhoneNumber();
        $city_id  = $address->getCityId();
        $name      = $address->getName();
        $street_name   = $address->getStreetName();
        $street_number   = $address->getStreetNumber();
        $building_number   = $address->getBuildingNumber();
        $entrance   = $address->getEntrance();
        $floor   = $address->getFloor();
        $apartment_number   = $address->getApartmentNumber();
        try{
            $pdo = getPDO();
            $pdo->beginTransaction();
            $sql ="INSERT INTO addresses (phone_number, city_id, name, street_name, street_number, building_number, entrance, floor, apartment_number)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
            $stmt = $pdo->prepare($sql);
            $stmt->execute(array($phone_number,$city_id,$name,$street_name, $street_number,$building_number,$entrance,$floor,$apartment_number));
            $address->setId($pdo->lastInsertId());
            $sql2= "INSERT INTO users_have_addresses (user_id, address_id) VALUES (?, ?)";
            $stmt2 = $pdo->prepare($sql2);
            $stmt2->execute(array($user_id, $address->getId()));

            $pdo->commit();

        }
        catch (PDOException $e) {
            $pdo->rollBack();
            echo "Something went wrong". $e->getMessage();
        }
    }

    static function get($user_id) {
        try{
            $pdo = getPDO();
            $sql ="SELECT * FROM addresses as a JOIN users_have_addresses as uha ON a.id = uha.address_id
                            WHERE uha.user_id = ?";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([$user_id]);
            $rows = $stmt->fetchAll(PDO::FETCH_OBJ);
            if (empty($rows)) {
                return false;
            } else {
                return $rows;
            }
        }
        catch (PDOException $e) {
            echo "Something went wrong". $e->getMessage();
        }
    }

    static function change(Address $address, $id) {
        $phone_number = $address->getPhoneNumber();
        $city_id  = $address->getCityId();
        $name      = $address->getName();
        $street_name   = $address->getStreetName();
        $street_number   = $address->getStreetNumber();
        $building_number   = $address->getBuildingNumber();
        $entrance   = $address->getEntrance();
        $floor   = $address->getFloor();
        $apartment_number   = $address->getApartmentNumber();
        try {
            $pdo = getPDO();
            $sql = "UPDATE addresses SET phone_number=?, city_id=? , name=?, street_name=?, street_number=?, building_number=?,
                    entrance=?, floor=?, apartment_number=?
                   WHERE id= ?";
            $stmt = $pdo->prepare($sql);
            $stmt->execute(array($phone_number, $city_id, $name, $street_name, $street_number, $building_number, $entrance, $floor, $apartment_number, $id));
            return true;
        }
        catch (PDOException $e) {
            echo "Something went wrong". $e->getMessage();
            return false;
        }
    }

    static function delete($id){
        try {
            //DELETE addresses, users_have_addresses FROM addresses
            // JOIN users_have_addresses ON addresses.id=users_have_addresses.address_id WHERE addresses.id=?;
            //
            //CHANGED FK in DB to be ON DELETE CASCADE in uha - address_id
            $pdo = getPDO();
            $pdo->beginTransaction();
            $sql = "DELETE FROM addresses WHERE id= ?";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([$id]);
            $sql2="DELETE FROM users_have_addresses WHERE address_id =?";
            $stmt2= $pdo->prepare($sql2);
            $stmt2->execute([$id]);

            $pdo->commit();
            return true;
        }
        catch (PDOException $e) {
            $pdo->rollBack();
            echo "Something went wrong". $e->getMessage();
            return false;
        }
    }
}