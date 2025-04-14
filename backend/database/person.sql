CREATE TABLE person (
    id INT PRIMARY KEY AUTO_INCREMENT,
    full_name VARCHAR(255),
    parent_id INT,
    FOREIGN KEY (parent_id) REFERENCES person(id)
);