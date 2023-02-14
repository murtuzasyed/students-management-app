package com.example.demo.student;

import com.example.demo.student.exceptions.BadRequestException;
import com.example.demo.student.exceptions.StudentNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.assertj.core.api.AssertionsForClassTypes.assertThatThrownBy;

import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.BDDMockito.given;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class StudentServiceTest {
    @Mock
    private StudentRepository studentRepository;
    private StudentService underTest;

    @BeforeEach
    void setUp() {
        underTest = new StudentService(studentRepository);
    }

    @Test
    void getAllStudents() {
        underTest.getAllStudents();
        verify(studentRepository).findAll();
    }

    @Test
    void canAddStudent() {
        // when
        Student student = new Student("FN", "LN", "fn.ln@test.com", Gender.FEMALE);

        underTest.addStudent(student);
        //then
        ArgumentCaptor<Student> studentArgumentCaptor = ArgumentCaptor.forClass(Student.class);
        verify(studentRepository).save(studentArgumentCaptor.capture());
        Student capturedStudent = studentArgumentCaptor.getValue();
        assertThat(capturedStudent).isEqualTo(student);
    }
    @Test
    void willThrowErrorWhenEmailIstaken() {
        String email = "fn.ln@test.com";
        // when
        given(studentRepository.selectExistsEmail(email)).willReturn(true);
        Student student = new Student("FN", "LN", email, Gender.FEMALE);
        //then
        assertThatThrownBy(() -> underTest.addStudent(student))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("Student with email " + student.getEmail() + " already exists");
        verify(studentRepository, never()).save(student);
    }

    @Test
    void canDeleteStudent() {
        Long studentId = anyLong();
        given(studentRepository.existsById(studentId)).willReturn(true);
        underTest.deleteStudent(studentId);
        verify(studentRepository).deleteById(studentId);
    }
    @Test
    void errorDeletingStudent() {
        //given

        given(studentRepository.existsById(anyLong())).willReturn(false);
        assertThatThrownBy(() -> underTest.deleteStudent(1L))
                .isInstanceOf(StudentNotFoundException.class)
                .hasMessageContaining("Student with id:"+ 1L + " does not exists");
        verify(studentRepository, never()).deleteById(anyLong());
    }
}