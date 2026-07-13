<?php
// POST /api/login.php  { username, password }  →  { ok, token }
// Valida contra la tabla `users` de MySQL (contraseñas hasheadas con bcrypt).
declare(strict_types=1);

require __DIR__ . '/helpers.php';
ic_cors();

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    ic_json(['ok' => false, 'error' => 'Método no permitido.'], 405);
}

$body = ic_body();
$username = trim((string) ($body['username'] ?? ''));
$password = (string) ($body['password'] ?? '');

if ($username === '' || $password === '') {
    ic_json(['ok' => false, 'error' => 'Usuario o contraseña incorrectos.'], 401);
}

$db = ic_db();
// Si la tabla users todavía no existe (instalación vieja), la crea y siembra
// el admin inicial desde config.php — migración transparente.
ic_ensure_users($db);

$stmt = $db->prepare('SELECT username, password_hash FROM users WHERE username = :u');
$stmt->execute([':u' => $username]);
$user = $stmt->fetch();

if ($user && password_verify($password, $user['password_hash'])) {
    // Si PHP actualizó su algoritmo de hashing por defecto, re-hashea al vuelo.
    if (password_needs_rehash($user['password_hash'], PASSWORD_DEFAULT)) {
        $upd = $db->prepare('UPDATE users SET password_hash = :h WHERE username = :u');
        $upd->execute([':h' => password_hash($password, PASSWORD_DEFAULT), ':u' => $user['username']]);
    }
    ic_json(['ok' => true, 'token' => ic_make_token((string) $user['username'])]);
}

ic_json(['ok' => false, 'error' => 'Usuario o contraseña incorrectos.'], 401);
