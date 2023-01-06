package com.minimaltodo.auth;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.minimaltodo.list.user.User;
import com.minimaltodo.list.user.UserService;

@RestController
@RequestMapping("/api/auth")
public class AuthenticationController {

	private final AuthenticationService service;

	@Autowired
	public AuthenticationController(AuthenticationService service, UserService userService) {
		this.service = service;
	}
    
    @RequestMapping(method = RequestMethod.POST, path = "/signup")
	public ResponseEntity<AuthenticationResponse> signup(
		@RequestBody RegisterRequest request
	) {
		return ResponseEntity.ok(service.register(request));
	}   

    @RequestMapping(method = RequestMethod.POST, path = "")
	public ResponseEntity<AuthenticationResponse> login(
		@RequestBody AuthenticationRequest request
	) {
		return ResponseEntity.ok(service.authenticate(request));
	}
    
}
