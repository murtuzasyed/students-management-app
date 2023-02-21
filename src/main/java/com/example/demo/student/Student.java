package com.example.demo.student;

import lombok.*;


import javax.persistence.*;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@NoArgsConstructor
@Getter
@Setter
@AllArgsConstructor
@ToString
@EqualsAndHashCode
@Entity
@Table
public class Student {
    @Id
    @SequenceGenerator(
            name="student_sequence",
            sequenceName="student_sequence",
            allocationSize=1
    )
    @GeneratedValue(
            generator = "student_sequence",
            strategy = GenerationType.AUTO
    )
    private Long id;
    @NotBlank
    @Column(nullable = false)
    private String firstname;
    @NotBlank
    @Column(nullable = false)
    private String lastname;
    @Email
    @NotNull
    @Column(nullable = false, unique = true)
    private String email;
    @NotNull
    @Column(nullable = false)
    @Enumerated(value = EnumType.STRING)
    private Gender gender;
    public Student(String firstname, String lastname, String email, Gender gender) {
        this.firstname = firstname;
        this.lastname = lastname;
        this.email = email;
        this.gender = gender;
    }
}
