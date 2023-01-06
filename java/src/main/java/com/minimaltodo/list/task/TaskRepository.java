package com.minimaltodo.list.task;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import org.springframework.data.domain.Sort;

import com.minimaltodo.list.project.Project;


@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    // @Query(value = "SELECT t.* FROM task t WHERE t.project_id = ?1 AND t.level = 1", nativeQuery = true)
    @Query(value = "SELECT t FROM Task t WHERE project = ?1 AND t.level = 1")
    public List<Task> findTaskByProject(Project project, Sort sort);
    
    
    @Query(value = "SELECT t FROM Task t WHERE project.id in ?1 AND t.level = 1 AND t.done = 0 ORDER BY t.priority DESC")
    public List<Task> findIncompleteTasks(List<Long> projectIds);

    @Query(value = "SELECT t FROM Task t WHERE project.id in ?1 AND t.level = 1 AND t.done = 0 AND t.priority != 0 ORDER BY t.priority DESC")
    public List<Task> findPriorityTasks(List<Long> projectIds);

}
