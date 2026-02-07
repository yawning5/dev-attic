CREATE TABLE IF NOT EXISTS TODO (
    ID bigint NOT NULL AUTO_INCREMENT,
    TITLE varchar(255) NOT NULL,

--  private int todoOrder;
--  이걸 매핑하는건데 이렇게 중간에 대문자 있으면 그 앞에서 띄어쓰기 하는 의민가봄
--  todo_Order 이렇게 컬럼이름 안 지어주면 오류남
    TODO_ORDER int NOT NULL,
    COMPLETED BOOLEAN NOT NULL,
    PRIMARY KEY (ID)
    );