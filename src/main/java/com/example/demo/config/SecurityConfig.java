package com.example.demo.config;

import com.example.demo.service.MyUserDetailsService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpMethod;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.authentication.logout.LogoutSuccessHandler;

import java.io.IOException;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private MyUserDetailsService userDetailsService;

    @Bean
    public static PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                .exceptionHandling(handler ->
                        //權限不足導向
                        handler.accessDeniedHandler(new AccessDeniedHandler() {
                            @Override
                            public void handle(HttpServletRequest request, HttpServletResponse response, AccessDeniedException accessDeniedException) throws IOException, ServletException {

                                //清除登入紀錄

                                HttpSession session = request.getSession(false);
                                SecurityContextHolder.clearContext();
                                session = request.getSession(false);
                                if (session != null) {
                                    session.invalidate();
                                }
                                for (Cookie cookie : request.getCookies()) {
                                    cookie.setMaxAge(0);
                                }
                                //導向登入頁面
                                response.sendRedirect("/login");
                            }
                        }))
                .csrf(handler ->
                        handler.disable())
                .formLogin(form ->
                        //登入頁面設定
                        form.loginPage("/login")
                                //登入表單發送url設定
                                .loginProcessingUrl("/user/login")
                                .usernameParameter("username")
                                .passwordParameter("password")
                                .failureUrl("/login-error")
                                //登入成功handler
                                .successHandler(new AuthenticationSuccessHandler() {
                                    @Override
                                    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
                                        System.out.println("In login success handler");

                                        boolean isAdmin = false;
                                        for (GrantedAuthority authority : authentication.getAuthorities()) {
                                            if (authority.getAuthority().contains("ADMIN"))
                                                isAdmin = true;
                                        }
                                        if (isAdmin) {
                                            response.sendRedirect("/admin");
                                        } else
                                            response.sendRedirect("/map");

                                    }
                                })
                                .permitAll()
                )
                .authorizeHttpRequests(auth ->
                        //url權限設定
                        auth.requestMatchers("/frontend/**").permitAll()
                                .requestMatchers("/AC/**").permitAll()
                                .requestMatchers(HttpMethod.POST, "/login").permitAll()
                                .requestMatchers(HttpMethod.GET, "/user/init").hasAuthority("NORMAL")
                                .requestMatchers("/user/**").permitAll()
                                .requestMatchers("/mail/**").permitAll()
                                .requestMatchers("/map").hasAnyAuthority("NORMAL")
                                .requestMatchers("/admin").hasAuthority("ADMIN")
                                .requestMatchers("/api/**").hasAnyAuthority("NORMAL", "ADMIN")
                                .requestMatchers("/config/**").hasAnyAuthority("ADMIN", "NORMAL")
                                .requestMatchers("/index/**").permitAll()
                                .requestMatchers("/").permitAll()
                                .requestMatchers("/user/googleLogin").permitAll()
                                .anyRequest().authenticated()
                )
                .logout(auth ->
                        //登出設定
                        //刪除spring security cookie
                        auth.deleteCookies("JSESSIONID")
                                .logoutUrl("/user/logout")
                                //登出成功handler 處理登出後事項
                                .logoutSuccessHandler(new LogoutSuccessHandler() {
                                    @Override
                                    public void onLogoutSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
                                        System.out.println("User logged out " + authentication.getName());
                                        //導向登入頁面
                                        response.sendRedirect("/login");
                                    }
                                })
                                //登出成功後返回登入畫面
                                .logoutSuccessUrl("/login")

                )

        ;
        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

}
