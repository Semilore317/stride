package com.abrahambankole.stridedotcom.model;

import jakarta.persistence.*;

import java.util.Collection;
import java.util.HashSet;
import java.util.List;

public class User {
    private Long id;
    private String firstName;
    private String lastName;

    private String email;
    private String password;

    // cascade means that any thing that affects the user CASCADES to all his other properties like deletion
    // if a user is deleted, his cart and orders are also deleted
    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private Cart cart;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Order> orders;

    // but even if there's no user, the roles still exist, hence no cascading of shit
    @ManyToMany(
            fetch = FetchType.EAGER,
            cascade = {CascadeType.DETACH, CascadeType.MERGE, CascadeType.PERSIST, CascadeType.REFRESH}
    )
    @JoinTable(
            name = "user_roled",
            joinColumns = @JoinColumn(
                    name = "user_id",
                    referencedColumnName = "id"
            ),
        inverseJoinColumns = @JoinColumn(
                name = "role_id",
                referencedColumnName = "id"
        )
    )
    private Collection<Role> roles = new HashSet<>();
}
