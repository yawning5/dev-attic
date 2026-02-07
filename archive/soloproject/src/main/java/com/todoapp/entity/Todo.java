package com.todoapp.entity;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
@Getter
@Setter
public class Todo {
    @Id
    private long id;
    private String title;
    private int todoOrder;
    private boolean completed;
}
