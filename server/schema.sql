DROP DATABASE IF EXISTS chat;

CREATE DATABASE chat;

USE chat;

CREATE TABLE messages (
id INTEGER(5) NOT NULL AUTO_INCREMENT,
text TEXT(160) NOT NULL,
id_users INTEGER(5) NOT NULL,
id_rooms INTEGER(5) NOT NULL,
PRIMARY KEY (id)
);

CREATE TABLE users (
id INTEGER(5) NOT NULL AUTO_INCREMENT,
username VARCHAR(50) NOT NULL,
PRIMARY KEY (id)
);

CREATE TABLE rooms (
id INTEGER(5) NOT NULL AUTO_INCREMENT,
roomname VARCHAR(32) NOT NULL,
PRIMARY KEY (id)
);


ALTER TABLE messages ADD FOREIGN KEY (id_users) REFERENCES users  ( id );
ALTER TABLE messages ADD FOREIGN KEY (id_rooms) REFERENCES rooms  ( id );
ALTER TABLE users ADD UNIQUE unique_index (username);
ALTER TABLE rooms ADD UNIQUE unique_index (roomname);

/*  Execute this file from the command line by typing:
 *    mysql -u root < server/schema.sql
 *  to create the database and the tables.*/

