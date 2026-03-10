<?php

test('unauthenticated users are redirected from workout-sessions', function () {
    $this->get('/workout-sessions')->assertRedirect('/login');
});

test('unauthenticated users are redirected from history', function () {
    $this->get('/history')->assertRedirect('/login');
});

test('unauthenticated users are redirected from prs', function () {
    $this->get('/prs')->assertRedirect('/login');
});

test('unauthenticated users are redirected from progress', function () {
    $this->get('/progress')->assertRedirect('/login');
});

test('unauthenticated users are redirected from tools', function () {
    $this->get('/tools')->assertRedirect('/login');
});

test('unauthenticated users are redirected from library', function () {
    $this->get('/library')->assertRedirect('/login');
});

test('unauthenticated users are redirected from exercises', function () {
    $this->get('/exercises')->assertRedirect('/login');
});

test('unauthenticated users cannot store a session', function () {
    $this->post('/workout-sessions', [])->assertRedirect('/login');
});

test('unauthenticated users cannot store an exercise', function () {
    $this->post('/exercises', [])->assertRedirect('/login');
});
