package com.minimaltodo;

import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.context.annotation.Bean;

import com.minimaltodo.list.user.Role;
import com.minimaltodo.list.user.User;
import com.minimaltodo.list.user.UserRepository;


@SpringBootApplication(
	exclude = { SecurityAutoConfiguration.class }
)
public class ListApplication {

	public static void main(String[] args) {
		SpringApplication.run(ListApplication.class, args);
	}
}
