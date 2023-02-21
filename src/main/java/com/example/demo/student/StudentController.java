package com.example.demo.student;

import com.example.demo.student.exceptions.StudentNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping(path = "api/v1/students")
public class StudentController {
    private StudentService studentService;
    @GetMapping
    public List<Student> getAllStudents() {
        return studentService.getAllStudents();
    }
    @PostMapping
    public ResponseEntity<Student> addStudent(@Valid @RequestBody Student student){
        return studentService.addStudent(student);
    }
    @DeleteMapping(path ="{studentId}")
    public void deleteStudent(@PathVariable("studentId") Long studentId){
        studentService.deleteStudent(studentId);
    }
    @PutMapping(path="{studentId}")
    public ResponseEntity<Student> editStudent(@Valid @RequestBody Student student, @PathVariable("studentId") Long studentId) {
        return studentService.editStudent(studentId, student);
    }
}
