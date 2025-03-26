create database finalproject;
use finalproject;

create table users(
	email varchar(100) not null,
    user_id char(50) not null unique,
    constraint pk_email primary key (email)
);


create table visit (
	visit_id varchar(50) not null,
    user_id char(50) not null,
    doctor varchar(50),
    visit_date long,
    purpose varchar(50),
    notes varchar(200),
    constraint pk_visit_id primary key (visit_id),
    constraint fk_user_id foreign key (user_id) references users(user_id)
);


create table medicine (
	med_id varchar(50) not null,
    visit_id varchar(50) not null,
    name varchar(50) not null,
    start_date long,
    end_date long,
    dosage int,
    timing varchar(50),
    constraint pk_med_id primary key (med_id),
    constraint fk_visit_id foreign key (visit_id) references visit(visit_id)
);

