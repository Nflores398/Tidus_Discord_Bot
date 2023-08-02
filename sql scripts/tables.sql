-- ####################################################################
-- # Basic CREATE TABLE statement
-- # See https://www.ibm.com/docs/en/db2-for-zos/13?topic=statements-create-table for complete syntax.
-- ####################################################################
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'passwordHere'
USE TidusBot
DROP TABLE Birthday;

CREATE TABLE Birthday (
  userId VARCHAR(18) PRIMARY KEY NOT NULL
  , userName VARCHAR(35) NOT NULL
  , birthDate VARCHAR(5) NOT NULL
);
