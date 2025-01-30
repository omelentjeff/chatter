CREATE TABLE user_entity (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255),
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE chat (
    chat_id SERIAL PRIMARY KEY,
    chat_name VARCHAR(100),
    is_group BOOLEAN NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE user_chat (
    user_chat_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    chat_id INT NOT NULL,
    joined_at TIMESTAMP NOT NULL DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES user_entity (id) ON DELETE CASCADE,
    FOREIGN KEY (chat_id) REFERENCES chat (chat_id) ON DELETE CASCADE
);

CREATE TABLE message (
    message_id SERIAL PRIMARY KEY,
    chat_id INT NOT NULL,
    sender_id INT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    is_deleted BOOLEAN DEFAULT FALSE,
    read_status BOOLEAN NOT NULL,
    FOREIGN KEY (chat_id) REFERENCES chat (chat_id) ON DELETE CASCADE,
    FOREIGN KEY (sender_id) REFERENCES user_entity (id) ON DELETE CASCADE
);

CREATE TABLE message_read_status (
    id SERIAL PRIMARY KEY,
    message_id INT NOT NULL,
    user_id INT NOT NULL,
    is_read BOOLEAN NOT NULL,
    FOREIGN KEY (message_id) REFERENCES message (message_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES user_entity (id) ON DELETE CASCADE
);

DO
$$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'chatter_admin') THEN
        CREATE USER chatter_user WITH PASSWORD 'chatter_adminPW1!';
    END IF;
END
$$;
GRANT CONNECT ON DATABASE chatter TO chatter_admin;
GRANT USAGE ON SCHEMA public TO chatter_admin;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO chatter_admin;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO chatter_admin;



