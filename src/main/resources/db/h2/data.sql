INSERT INTO COFFEE (kor_name, eng_name, price, coffee_code, coffee_status, created_at, last_modified_at, created_by)
    VALUES ('아메리카노', 'Americano', 2500,'AMR', 'COFFEE_FOR_SALE', CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP(), 'kevin');
INSERT INTO COFFEE (kor_name, eng_name, price, coffee_code, coffee_status, created_at, last_modified_at, created_by)
    VALUES ('카라멜 라떼', 'Caramel Latte', 4500,'CRL', 'COFFEE_FOR_SALE', CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP(), 'kevin');
INSERT INTO COFFEE (kor_name, eng_name, price, coffee_code, coffee_status, created_at, last_modified_at, created_by)
    VALUES ('바닐라 라떼', 'Vanilla Latte', 5000, 'VNL', 'COFFEE_FOR_SALE', CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP(), 'kevin');
INSERT INTO MEMBER (email, name, phone, member_status, created_at, last_modified_at, created_by)
    VALUES ('hgd99@gmail.com', '홍길동99', '010-9999-9999', 'MEMBER_ACTIVE', CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP(),
    'kevin');
INSERT INTO STAMP (stamp_count, created_at, last_modified_at, created_by, member_id)
    VALUES (0, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP(), 'kevin', 1);