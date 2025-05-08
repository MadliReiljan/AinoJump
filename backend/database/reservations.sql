CREATE TABLE reservations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    created_at TIMESTAMP,
    person_id INT,
    event_id INT,
    FOREIGN KEY (person_id) REFERENCES person(id),
    FOREIGN KEY (event_id) REFERENCES event(id)
);