<?php
// POST /api/upload.php  (multipart/form-data, campo "file")  →  { ok, url }
// Guarda la imagen en api/uploads/ y devuelve la ruta relativa a la API
// (ej. "uploads/evt-xxxx.jpg"). Requiere token de sesión.
declare(strict_types=1);

require __DIR__ . '/helpers.php';
ic_cors();

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    ic_json(['ok' => false, 'error' => 'Método no permitido.'], 405);
}

ic_require_auth();

const IC_MAX_UPLOAD_BYTES = 5 * 1024 * 1024; // 5 MB

// Extensiones/MIME permitidos (solo imágenes web).
const IC_ALLOWED_TYPES = [
    'image/jpeg' => 'jpg',
    'image/png'  => 'png',
    'image/webp' => 'webp',
    'image/gif'  => 'gif',
];

if (!isset($_FILES['file']) || !is_array($_FILES['file'])) {
    ic_json(['ok' => false, 'error' => 'No se recibió ningún archivo.'], 422);
}

$file = $_FILES['file'];

if (($file['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) {
    $msg = $file['error'] === UPLOAD_ERR_INI_SIZE || $file['error'] === UPLOAD_ERR_FORM_SIZE
        ? 'La imagen supera el tamaño máximo permitido por el servidor.'
        : 'Error al recibir el archivo (código ' . (int) $file['error'] . ').';
    ic_json(['ok' => false, 'error' => $msg], 422);
}

if ((int) $file['size'] > IC_MAX_UPLOAD_BYTES) {
    ic_json(['ok' => false, 'error' => 'La imagen no puede superar los 5 MB.'], 422);
}

// Detectar el tipo real del archivo (no confiar en la extensión ni el MIME del cliente).
$info = @getimagesize($file['tmp_name']);
$mime = $info['mime'] ?? '';
if ($info === false || !isset(IC_ALLOWED_TYPES[$mime])) {
    ic_json([
        'ok' => false,
        'error' => 'Formato no soportado. Usá JPG, PNG, WEBP o GIF (si es HEIC de iPhone, convertila antes).',
    ], 422);
}
$ext = IC_ALLOWED_TYPES[$mime];

// Carpeta de destino.
$dir = __DIR__ . '/uploads';
if (!is_dir($dir) && !mkdir($dir, 0755, true)) {
    ic_json(['ok' => false, 'error' => 'No se pudo crear la carpeta de imágenes en el servidor.'], 500);
}

// Nombre aleatorio — nunca usar el nombre original del cliente.
$name = 'evt-' . date('Ymd') . '-' . bin2hex(random_bytes(6)) . '.' . $ext;

if (!move_uploaded_file($file['tmp_name'], "{$dir}/{$name}")) {
    ic_json(['ok' => false, 'error' => 'No se pudo guardar la imagen en el servidor.'], 500);
}

// Ruta relativa a la carpeta api/ — el frontend la convierte en URL completa.
ic_json(['ok' => true, 'url' => "uploads/{$name}"], 201);
