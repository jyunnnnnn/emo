package com.example.demo.service;

import com.example.demo.entity.MyUserDetails;
import com.example.demo.entity.UserInfo;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class MyUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository repository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        UserInfo user = repository.findByUsername(username);
        if (user == null) {
            throw new UsernameNotFoundException("Can not found user with username: " + username);
        }
        return new MyUserDetails(user);
    }
}
