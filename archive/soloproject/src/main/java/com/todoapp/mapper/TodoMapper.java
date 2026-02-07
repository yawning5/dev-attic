package com.todoapp.mapper;

import com.todoapp.dto.TodoPatchDto;
import com.todoapp.dto.TodoPostDto;
import com.todoapp.dto.TodoResponseDto;
import com.todoapp.entity.Todo;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface TodoMapper {
    Todo todoPostDtoToTodo(TodoPostDto todoPostDto);
    Todo todoPatchDtoToTodo(TodoPatchDto todoPatchDto);
    TodoResponseDto todoToTodoResponseDto(Todo todo);

    List<TodoResponseDto> todoToTodoResponseDtos(List<Todo> Todos);
}
