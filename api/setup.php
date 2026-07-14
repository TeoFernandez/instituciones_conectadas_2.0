<?php
// ─────────────────────────────────────────────────────────────────────────────
// INSTALADOR — Ejecutar UNA sola vez desde el navegador:
//   Local (XAMPP):  http://localhost/AWENTECH/institucionesconectadas/api/setup.php
//   Hostinger:      https://TU-DOMINIO/api/setup.php
//
// Crea la tabla `events` y carga los eventos de ejemplo si la tabla está vacía.
// ⚠️ Por seguridad, BORRÁ este archivo del servidor después de usarlo.
// ─────────────────────────────────────────────────────────────────────────────
declare(strict_types=1);

require __DIR__ . '/helpers.php';

header('Content-Type: text/plain; charset=utf-8');

$db = ic_db();

// 1) Crear las tablas a partir del schema.sql (sentencia por sentencia)
$schema = file_get_contents(__DIR__ . '/schema.sql');
foreach (array_filter(array_map('trim', explode(';', $schema))) as $statement) {
    if ($statement !== '') {
        $db->exec($statement);
    }
}
echo "✓ Tablas 'users' y 'events' creadas (o ya existían).\n";

// 1b) Sembrar el usuario administrador inicial (si la tabla users está vacía)
ic_ensure_users($db);
$c = ic_config();
echo "✓ Usuario administrador listo (usuario: {$c['admin_username']}).\n";
echo "  La contraseña quedó HASHEADA en la base — para cambiarla usá el panel.\n";

// 2) Sembrar eventos de ejemplo si la tabla está vacía
$count = (int) $db->query('SELECT COUNT(*) FROM events')->fetchColumn();

if ($count === 0) {
    $seed = [
        ['evt-seed-1', 'Torneo de Iniciación Deportiva', 'Mis Pasitos', '#2EC4B6', '2026-07-11', '10:00 hs', 'Polideportivo Norte', null, null],
        ['evt-seed-2', 'Jornada de Formación Dirigencial', 'La Universidad en tu Club', '#5273C2', '2026-07-18', '18:00 hs', 'Sede Central', null, null],
        ['evt-seed-3', 'Huerta Comunitaria', 'Enraizando', '#22C55E', '2026-07-25', '9:30 hs', 'Plaza San Martín', '/img-instituciones/enraizando.png', null],
        ['evt-seed-4', 'Jornada Recreativa', 'Ruta de Sonrisas', '#F43F5E', '2026-08-01', '15:00 hs', 'Club Los Andes', '/img-instituciones/sonrisas1.png', null],
        ['evt-seed-5', 'Inicio Clases de Apoyo · 2do cuatrimestre', 'Hoja de Ruta', '#FF9F1C', '2026-08-08', '16:00 hs', 'Centro Comunitario', null, null],
    ];

    $stmt = $db->prepare(
        'INSERT INTO events (id, title, programa, color, event_date, event_time, location, image, form_url)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
    );
    foreach ($seed as $row) {
        $stmt->execute($row);
    }
    echo "✓ Se cargaron " . count($seed) . " eventos de ejemplo.\n";
} else {
    echo "• La tabla ya tenía {$count} eventos — no se cargaron ejemplos.\n";
}

echo "\n¡Listo! Ya podés borrar este archivo (setup.php) del servidor.\n";
