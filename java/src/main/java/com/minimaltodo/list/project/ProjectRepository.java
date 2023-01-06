package com.minimaltodo.list.project;

import com.minimaltodo.list.project.Project;

import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;


@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {

}
