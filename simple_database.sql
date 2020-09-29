-- Simple database structure for this nodejs application template

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema simple_db
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `simple_db` ;

-- -----------------------------------------------------
-- Schema simple_db
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `simple_db` DEFAULT CHARACTER SET utf8 ;
USE `simple_db` ;

-- -----------------------------------------------------
-- Table `simple_db`.`user`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `simple_db`.`user` ;

CREATE TABLE IF NOT EXISTS `simple_db`.`user` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(145) NOT NULL,
  `surname` VARCHAR(245) NOT NULL,
  `email` VARCHAR(145) NOT NULL,
  `password` TEXT(200) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;

CREATE UNIQUE INDEX `email_UNIQUE` ON `simple_db`.`user` (`email` ASC) VISIBLE;

SET SQL_MODE = '';
DROP USER IF EXISTS application;
SET SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';
CREATE USER 'application' IDENTIFIED BY '123456';

GRANT SELECT ON TABLE `simple_db`.* TO 'application';
GRANT SELECT, INSERT, TRIGGER ON TABLE `simple_db`.* TO 'application';
GRANT SELECT, INSERT, TRIGGER, UPDATE, DELETE ON TABLE `simple_db`.* TO 'application';
GRANT EXECUTE ON TABLE `simple_db`.* TO 'application';

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

-- After Creation:
ALTER USER 'application' IDENTIFIED WITH mysql_native_password BY '123456'
