package com.todoapp.dto;

import lombok.Getter;

@Getter
public class TodoPostDto {
    private String title;
    private int todoOrder;
    private boolean completed;

    public TodoPostDto(String title, int todoOrder) {
        this.title = title;
        this.todoOrder = todoOrder;
        this.completed = false;
    }
}
