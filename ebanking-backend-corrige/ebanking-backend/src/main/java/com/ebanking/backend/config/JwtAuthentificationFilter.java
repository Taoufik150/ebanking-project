package com.ebanking.backend.config;

import com.ebanking.backend.services.CotumUserDetailesService;
import com.ebanking.backend.services.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
@Component
public class JwtAuthentificationFilter extends OncePerRequestFilter {
    final JwtService jwtService;
    final CotumUserDetailesService cotumUserDetailesService;

    public JwtAuthentificationFilter(JwtService jwtService, CotumUserDetailesService cotumUserDetailesService) {
        this.jwtService = jwtService;
        this.cotumUserDetailesService = cotumUserDetailesService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        final String authHeader=request.getHeader("Authorization");
        String username=null;
        String jwt=null;
        if(authHeader != null && authHeader.startsWith("Bearer ")){
            jwt=authHeader.substring(7);
            try{
                username=jwtService.extraireUsername(jwt);
            }catch (Exception e){
                System.out.println("Jwt invalid : "+e.getMessage());

            }
        }
        if (username!=null && SecurityContextHolder.getContext().getAuthentication()==null){
            UserDetails userDetails=cotumUserDetailesService.loadUserByUsername(username);

          if(jwtService.isTokenValid(jwt,userDetails)){
              UsernamePasswordAuthenticationToken authentication=new UsernamePasswordAuthenticationToken(userDetails,null,userDetails.getAuthorities());
              authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
              SecurityContextHolder.getContext().setAuthentication(authentication);
           }

        }
        filterChain.doFilter(request ,response);
    }
}
