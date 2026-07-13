<?php
// POST /api/change-password.php  { currentPassword, newPassword }  →  { ok }
// Cambia la contraseña del usuario autenticado (requiere token de sesión).
declare(strict_types=1);

require __DIR__ . '/helpers.php';
ic_cors();

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    ic_json(['ok' => false, 'error' => 'Método no permitido.'], 405);
}

$username = ic_require_auth();

$body = ic_body();
$current = (string) ($body['currentPassword'] ?? '');
$new = (string) ($body['newPassword'] ?? '');

if (strlen($new) < 8) {
    ic_json(['ok' => false, 'error' => 'La nueva contraseña debe tener al menos 8 caracteres.'], 422);
}

$db = ic_db();
ic_ensure_users($db);

$stmt = $db->prepare('SELECT password_hash FROM users WHERE username = :u');
$stmt->execute([':u' => $username]);
$user = $stmt->fetch();

if (!$user || !password_verify($current, $user['password_hash'])) {
    ic_json(['ok' => false, 'error' => 'La contraseña actual no es correcta.'], 401);
}

$upd = $db->prepare('UPDATE users SET password_hash = :h WHERE username = :u');
$upd->execute([':h' => password_hash($new, PASSWORD_DEFAULT), ':u' => $username]);

ic_json(['ok' => true]);
