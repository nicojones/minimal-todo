package com.minimaltodo.list.project;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.minimaltodo.list.task.Task;
import com.minimaltodo.list.user.User;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Project {

    @Id
    @SequenceGenerator(name = "project_sequence", sequenceName = "project_sequence", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "project_sequence")
    private Long id;

    @NotNull
    @Enumerated(EnumType.STRING)
    private ProjectSort sort;

    private boolean showCompleted;

    private String name;

    private String color;

    @CreationTimestamp
    private Date createdAt;

    @UpdateTimestamp
    private Date updatedAt;

    @OneToMany(mappedBy="project", fetch = FetchType.EAGER, orphanRemoval = true)
    @JsonIgnore
    private List<Task> tasks;
    
    @ManyToMany(mappedBy = "projects", fetch = FetchType.EAGER)
    @JsonIgnore
    private List<User> users;

    public boolean getEmpty() {
        return tasks.size() == 0;
    }

    @JsonProperty("shared")
    public boolean isShared() {
        return users != null ? users.size() > 1 : false;
    }

    public void addUserToProject(User user) {
        if (users == null) {
            users = new ArrayList<>();
        }
        users.add(user);
    }

    public Project(
            ProjectSort sort,
            boolean showCompleted,
            String name,
            String color,
            boolean shared
            ) {
        this.sort = sort;
        this.showCompleted = showCompleted;
        this.name = name;
        this.color = color;
        this.tasks = new ArrayList<>();
        this.users = new ArrayList<>();
    }

}
