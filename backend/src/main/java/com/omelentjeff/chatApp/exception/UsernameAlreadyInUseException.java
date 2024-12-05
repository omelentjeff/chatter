package com.omelentjeff.chatApp.exception;

public class UsernameAlreadyInUseException extends RuntimeException {

    public UsernameAlreadyInUseException(String msg) {
        super(msg);
    }
}
