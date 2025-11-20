# Insert data into the tables

USE berties_books;

INSERT INTO books (name, price)VALUES('Brighton Rock', 20.25),('Brave New World', 25.00), ('Animal Farm', 12.99) ;

-- Insert test user 'gold' with password 'smiths'
INSERT INTO users (username, first_name, last_name, email, hashed_password)
VALUES (
    'gold',
    'Gold',
    'Smith',
    'gold@gold.ac.uk',
    '$2b$10$9e3ONmlRylZ8hEvIEQJYheLY8MDbpGE9chC9rOaFzi9IPpxE2hR6S'
);