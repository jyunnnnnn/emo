package com.example.demo.config;


import com.example.demo.entity.StompPrincipal;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;
import org.springframework.web.socket.server.support.DefaultHandshakeHandler;

import java.security.Principal;
import java.util.Map;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        //註冊路徑為 /ws 的websocket接口
        registry.addEndpoint("/ws")
                .setHandshakeHandler(new DefaultHandshakeHandler() {
                    @Override
                    protected Principal determineUser(ServerHttpRequest request, WebSocketHandler wsHandler, Map<String, Object> attributes) {
                        //身分驗證的東西
                        String userId = request.getURI().getQuery().split("=")[1];
                        request.getPrincipal().getName();
                        return new StompPrincipal(userId);
                    }
                }).withSockJS();
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        //前端發送
        config.setApplicationDestinationPrefixes("/app");
        //發送消息給前端時的prefix /topic適用一對多 /queue適用於一對一
        config.enableSimpleBroker("/topic", "/queue");

        //發送給指定使用者的prefix
        config.setUserDestinationPrefix("/user");
    }


}
