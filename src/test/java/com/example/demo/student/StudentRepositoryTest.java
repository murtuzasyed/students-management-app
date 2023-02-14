package com.example.demo.student;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

@DataJpaTest
class StudentRepositoryTest {
    @AfterEach
    void tearDown() {
        underTest.deleteAll();
    }

    @Autowired
    private StudentRepository underTest;
    @Test
    void itShouldCheckWhenStudentEmailExists() {
        String email ="test@test.com";
        Student student = new Student("Test FN", "Test LN", "test@test.com",Gender.FEMALE);
        underTest.save(student);
        boolean expected = underTest.selectExistsEmail(email);

        // then
        assertThat(expected).isTrue();
    }
    @Test
    void itShouldCheckWhenStudentEmailDoesnotExists() {
        String email ="test@test.com";
        boolean expected = underTest.selectExistsEmail(email);

        // then
        assertThat(expected).isFalse();
    }
}