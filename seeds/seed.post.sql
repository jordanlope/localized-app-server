BEGIN;

INSERT INTO post (businessid, posttitle, description)

VALUES
    (1, 'Make the payment of your Life', 'Get 3% cash on each transaction'),
    (2, '$5 Burger Special', 'Try our new special burger that will only be available every other month'),
    (3, '50% off your Online Order', 'Get this coupon now when you can a purchase in-person');
COMMIT;