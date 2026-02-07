package com.todoapp.service;

import com.todoapp.entity.Todo;
import com.todoapp.repository.TodoRepository;
import org.springframework.stereotype.Service;

import javax.swing.text.html.Option;
import java.util.List;
import java.util.Optional;

@Service
public class TodoService {
    private TodoRepository todoRepository;

    public TodoService(TodoRepository todoRepository) {
        this.todoRepository = todoRepository;
    }

    public Todo creatTodo(Todo todo) {
        return todoRepository.save(todo);
    }

    public List<Todo> readTodos() {
        return (List<Todo>) todoRepository.findAll();
    }

    public Todo readTodo(long Id) {
        return todoRepository.findAllById(Id);
    }

    public Todo updateTodo(Todo todo) {
        Optional<Todo> findTodo = todoRepository.findById(todo.getId());
        Todo realTodo = findTodo.orElseThrow();
        Optional.ofNullable(todo.getTodoOrder())
                .ifPresent(todoOrder -> realTodo.setTodoOrder(todoOrder));
        Optional.ofNullable(todo.getTitle())
                .ifPresent(todoTitle -> realTodo.setTitle(todoTitle));
        Optional.ofNullable(todo.isCompleted())
                .ifPresent(todoCompleted -> realTodo.setCompleted(todoCompleted));
        return todoRepository.save(realTodo);
    }

    public void deleteTodo(long id) {
        todoRepository.deleteById(id);
    }

    public void deleteTodos() {
        todoRepository.deleteAll();
    }

}
