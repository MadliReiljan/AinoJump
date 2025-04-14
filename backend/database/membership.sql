CREATE TABLE membership (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255),
    start_date DATETIME,
    end_date DATETIME,
    created_at TIMESTAMP,
    person_id INT,
    FOREIGN KEY (person_id) REFERENCES person(id)
);