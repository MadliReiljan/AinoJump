CREATE TABLE post (
    id INT PRIMARY KEY,
    title VARCHAR(255),
    body TEXT,
    time TIMESTAMP,
    created_at TIMESTAMP,
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES user(id)
);