CREATE TABLE person (
    id INT PRIMARY KEY,
    full_name VARCHAR(255),
    parent_id INT,
    FOREIGN KEY (parent_id) REFERENCES person(id)
);