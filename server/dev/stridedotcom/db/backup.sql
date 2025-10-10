create table category
(
    id   bigint auto_increment
        primary key,
    name varchar(255) null
);

create table product
(
    id          bigint auto_increment
        primary key,
    brand       varchar(255)   null,
    description varchar(255)   null,
    inventory   int            not null,
    name        varchar(255)   null,
    price       decimal(38, 2) null,
    category_id bigint         null,
    constraint FK1mtsbur82frn64de7balymq9s
        foreign key (category_id) references category (id)
);

create table image
(
    id           bigint auto_increment
        primary key,
    download_url varchar(255) null,
    file_name    varchar(255) null,
    file_type    varchar(255) null,
    image        longblob     null,
    product_id   bigint       null,
    constraint FKgpextbyee3uk9u6o2381m7ft1
        foreign key (product_id) references product (id)
);

create table role
(
    id   bigint auto_increment
        primary key,
    name varchar(255) null
);

create table user
(
    id         bigint auto_increment
        primary key,
    email      varchar(255) null,
    first_name varchar(255) null,
    last_name  varchar(255) null,
    password   varchar(255) null,
    constraint UKcudaqifebe8cfswgy556uuv3x
        unique (email)
);

create table cart
(
    id           bigint auto_increment
        primary key,
    total_amount decimal(38, 2) null,
    user_id      bigint         null,
    constraint UK9emlp6m95v5er2bcqkjsw48he
        unique (user_id),
    constraint FKl70asp4l4w0jmbm1tqyofho4o
        foreign key (user_id) references user (id)
);

create table cart_item
(
    id          bigint auto_increment
        primary key,
    quantity    int            not null,
    total_price decimal(38, 2) null,
    unit_price  decimal(38, 2) null,
    cart_id     bigint         null,
    product_id  bigint         null,
    constraint FK1uobyhgl1wvgt1jpccia8xxs3
        foreign key (cart_id) references cart (id),
    constraint FKjcyd5wv4igqnw413rgxbfu4nv
        foreign key (product_id) references product (id)
);

create table orders
(
    order_id     bigint auto_increment
        primary key,
    order_date   date                                                                null,
    order_status enum ('CANCELLED', 'DELIVERED', 'PENDING', 'PROCESSING', 'SHIPPED') null,
    total_amount decimal(38, 2)                                                      null,
    user_id      bigint                                                              null,
    constraint FKel9kyl84ego2otj2accfd8mr7
        foreign key (user_id) references user (id)
);

create table order_item
(
    id         bigint auto_increment
        primary key,
    price      decimal(38, 2) null,
    quantity   int            not null,
    order_id   bigint         null,
    product_id bigint         null,
    constraint FK551losx9j75ss5d6bfsqvijna
        foreign key (product_id) references product (id),
    constraint FKt4dc2r9nbvbujrljv3e23iibt
        foreign key (order_id) references orders (order_id)
);

create table user_roles
(
    user_id bigint not null,
    role_id bigint not null,
    constraint FK55itppkw3i07do3h7qoclqd4k
        foreign key (user_id) references user (id),
    constraint FKrhfovtciq1l558cw6udg0h0d3
        foreign key (role_id) references role (id)
);

create table wishlist
(
    id      bigint auto_increment
        primary key,
    user_id bigint null,
    constraint UKrcuy9aqx9c6q56x1xdoty8r3q
        unique (user_id),
    constraint FKd4r80jm8s41fgoa0xv9yy5lo8
        foreign key (user_id) references user (id)
);

create table wishlist_item
(
    id          bigint auto_increment
        primary key,
    product_id  bigint null,
    wishlist_id bigint null,
    constraint FK5iw5sajivrxnt4qjxqlgo8yb1
        foreign key (wishlist_id) references wishlist (id),
    constraint FK5s5jxai41c8tqklyy111ngqh7
        foreign key (product_id) references product (id)
);

create table wishlist_products
(
    wishlist_id bigint not null,
    product_id  bigint not null,
    constraint FKfx1kub09qhl8g1w6j563ghgy0
        foreign key (product_id) references product (id),
    constraint FKhlq0ylq5sxd70s0pembuumc1d
        foreign key (wishlist_id) references wishlist (id)
);

