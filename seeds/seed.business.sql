BEGIN;

INSERT INTO business (id, name, description, typeofbusiness)

VALUES
    (1, 'Venmo', 'Transfer all of your money virtually', 'finance'),
    (2, 'Big Burger', 'The most delicious burgers in the USA', 'food'),
    (3, 'AX', 'Top quality clothing at the finest price', 'clothing');
COMMIT;