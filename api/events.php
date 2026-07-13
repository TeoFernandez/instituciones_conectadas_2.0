<?php
// API de eventos
//   GET    /api/events.php            → lista pública de eventos
//   POST   /api/events.php            → crear evento        (requiere token)
//   PUT    /api/events.php            → actualizar evento   (requiere token)
//   DELETE /api/events.php?id=...     → eliminar evento     (requiere token)
declare(strict_types=1);

require __DIR__ . '/helpers.php';
ic_cors();

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$db = ic_db();

/** Mapea una fila de la BD al formato JSON que usa el frontend. */
function ic_row_to_event(array $r): array
{
    return [
        'id' => $r['id'],
        'date' => $r['event_date'],           // 'YYYY-MM-DD'
        'title' => $r['title'],
        'programa' => $r['programa'],
        'color' => $r['color'],
        'time' => $r['event_time'],
        'location' => $r['location'],
        'image' => $r['image'] !== null && $r['image'] !== '' ? $r['image'] : null,
        'formUrl' => $r['form_url'] !== null && $r['form_url'] !== '' ? $r['form_url'] : null,
    ];
}

/** Valida y normaliza los campos de un evento que llega en el body. */
function ic_parse_event_input(array $b): array
{
    $required = ['title', 'programa', 'color', 'date', 'time', 'location'];
    foreach ($required as $field) {
        if (!isset($b[$field]) || trim((string) $b[$field]) === '') {
            ic_json(['ok' => false, 'error' => "Falta el campo obligatorio: {$field}."], 422);
        }
    }
    // La fecha debe ser YYYY-MM-DD.
    if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', (string) $b['date'])) {
        ic_json(['ok' => false, 'error' => 'La fecha debe tener formato YYYY-MM-DD.'], 422);
    }
    return [
        'title' => trim((string) $b['title']),
        'programa' => trim((string) $b['programa']),
        'color' => trim((string) $b['color']),
        'date' => (string) $b['date'],
        'time' => trim((string) $b['time']),
        'location' => trim((string) $b['location']),
        'image' => isset($b['image']) && trim((string) $b['image']) !== '' ? trim((string) $b['image']) : null,
        'formUrl' => isset($b['formUrl']) && trim((string) $b['formUrl']) !== '' ? trim((string) $b['formUrl']) : null,
    ];
}

switch ($method) {
    // ── Listar (público) ─────────────────────────────────────────────────────
    case 'GET': {
        $rows = $db->query('SELECT * FROM events ORDER BY event_date ASC')->fetchAll();
        $events = array_map('ic_row_to_event', $rows);
        ic_json(['ok' => true, 'events' => $events]);
        break;
    }

    // ── Crear (protegido) ────────────────────────────────────────────────────
    case 'POST': {
        ic_require_auth();
        $b = ic_body();
        $e = ic_parse_event_input($b);
        $id = isset($b['id']) && trim((string) $b['id']) !== ''
            ? trim((string) $b['id'])
            : 'evt-' . time() . '-' . bin2hex(random_bytes(3));

        $stmt = $db->prepare(
            'INSERT INTO events (id, title, programa, color, event_date, event_time, location, image, form_url)
             VALUES (:id, :title, :programa, :color, :date, :time, :location, :image, :form_url)'
        );
        $stmt->execute([
            ':id' => $id,
            ':title' => $e['title'],
            ':programa' => $e['programa'],
            ':color' => $e['color'],
            ':date' => $e['date'],
            ':time' => $e['time'],
            ':location' => $e['location'],
            ':image' => $e['image'],
            ':form_url' => $e['formUrl'],
        ]);

        $row = $db->query('SELECT * FROM events WHERE id = ' . $db->quote($id))->fetch();
        ic_json(['ok' => true, 'event' => ic_row_to_event($row)], 201);
        break;
    }

    // ── Actualizar (protegido) ───────────────────────────────────────────────
    case 'PUT': {
        ic_require_auth();
        $b = ic_body();
        $id = trim((string) ($b['id'] ?? ''));
        if ($id === '') {
            ic_json(['ok' => false, 'error' => 'Falta el id del evento.'], 422);
        }
        $e = ic_parse_event_input($b);

        $stmt = $db->prepare(
            'UPDATE events SET title = :title, programa = :programa, color = :color,
             event_date = :date, event_time = :time, location = :location,
             image = :image, form_url = :form_url WHERE id = :id'
        );
        $stmt->execute([
            ':id' => $id,
            ':title' => $e['title'],
            ':programa' => $e['programa'],
            ':color' => $e['color'],
            ':date' => $e['date'],
            ':time' => $e['time'],
            ':location' => $e['location'],
            ':image' => $e['image'],
            ':form_url' => $e['formUrl'],
        ]);

        if ($stmt->rowCount() === 0) {
            // rowCount 0 puede ser "no existe" o "sin cambios"; verificamos existencia.
            $exists = $db->query('SELECT id FROM events WHERE id = ' . $db->quote($id))->fetch();
            if (!$exists) {
                ic_json(['ok' => false, 'error' => 'El evento no existe.'], 404);
            }
        }

        $row = $db->query('SELECT * FROM events WHERE id = ' . $db->quote($id))->fetch();
        ic_json(['ok' => true, 'event' => ic_row_to_event($row)]);
        break;
    }

    // ── Eliminar (protegido) ─────────────────────────────────────────────────
    case 'DELETE': {
        ic_require_auth();
        $id = trim((string) ($_GET['id'] ?? ''));
        if ($id === '') {
            $b = ic_body();
            $id = trim((string) ($b['id'] ?? ''));
        }
        if ($id === '') {
            ic_json(['ok' => false, 'error' => 'Falta el id del evento.'], 422);
        }
        $stmt = $db->prepare('DELETE FROM events WHERE id = :id');
        $stmt->execute([':id' => $id]);
        ic_json(['ok' => true, 'deleted' => $id]);
        break;
    }

    default:
        ic_json(['ok' => false, 'error' => 'Método no permitido.'], 405);
}
