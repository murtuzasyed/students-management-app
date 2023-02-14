package com.example.demo.student;

import com.example.demo.student.exceptions.BadRequestException;
import com.example.demo.student.exceptions.StudentNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@AllArgsConstructor
@Service
public class StudentService {
    @Autowired
    private final StudentRepository studentRepository;

    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    public void addStudent(Student student) {
        if(studentRepository.selectExistsEmail(student.getEmail())) {
            throw new BadRequestException("Student with email " + student.getEmail() + " already exists");
        }
        studentRepository.save(student);
    }
    public void deleteStudent(Long studentId) {
        if(!studentRepository.existsById(studentId)) {
            throw new StudentNotFoundException("Student with id:" + studentId + " does not exists");
        }
        studentRepository.deleteById(studentId);
    }
}
