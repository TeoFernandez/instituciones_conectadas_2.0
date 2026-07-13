<?php
// ─────────────────────────────────────────────────────────────────────────────
// PLANTILLA DE CONFIGURACIÓN
// Copiá este archivo como "config.php" y completá tus datos reales.
// En Hostinger: creá la base de datos y el usuario desde hPanel → Bases de datos MySQL,
// y pegá acá los datos que te da el panel.
// ─────────────────────────────────────────────────────────────────────────────

return [
    // ── Conexión a MySQL ────────────────────────────────────────────────────
    'db_host' => 'localhost',
    'db_name' => 'ic_conectadas',
    'db_user' => 'root',
    'db_pass' => '',
    'db_charset' => 'utf8mb4',

    // ── Credenciales INICIALES del panel ────────────────────────────────────
    // Solo se usan la PRIMERA vez, para crear el usuario en la tabla `users`
    // (la contraseña se guarda hasheada). Después, la base de datos es la fuente
    // de verdad: para cambiar la contraseña usá el panel, no este archivo.
    // Cambiá la contraseña por una fuerte ANTES de correr setup.php en producción.
    'admin_username' => 'admin',
    'admin_password' => 'conectadas2026',

    // ── Secreto para firmar los tokens de sesión ────────────────────────────
    // Poné una cadena larga y aleatoria (podés generar una en https://randomkeygen.com/).
    'auth_secret' => 'CAMBIA-ESTO-POR-UNA-CADENA-LARGA-Y-ALEATORIA',

    // ── Duración de la sesión del panel (en segundos) ───────────────────────
    'token_ttl' => 60 * 60 * 12, // 12 horas
];
