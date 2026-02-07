package com.todoapp.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TodoPatchDto {
    private long Id;
    private String title;
    private int todoOrder;
    private boolean completed;
}
