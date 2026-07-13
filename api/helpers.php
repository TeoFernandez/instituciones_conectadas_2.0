<?php
// ─────────────────────────────────────────────────────────────────────────────
// Utilidades compartidas: config, conexión PDO, CORS, respuestas JSON y tokens.
// ─────────────────────────────────────────────────────────────────────────────

declare(strict_types=1);

/** Carga la configuración desde config.php (o config.example.php como fallback). */
function ic_config(): array
{
    static $config = null;
    if ($config !== null) {
        return $config;
    }
    $path = __DIR__ . '/config.php';
    if (!file_exists($path)) {
        $path = __DIR__ . '/config.example.php';
    }
    $config = require $path;
    return $config;
}

/** Devuelve una conexión PDO a MySQL. */
function ic_db(): PDO
{
    static $pdo = null;
    if ($pdo !== null) {
        return $pdo;
    }
    $c = ic_config();
    $dsn = "mysql:host={$c['db_host']};dbname={$c['db_name']};charset={$c['db_charset']}";
    try {
        $pdo = new PDO($dsn, $c['db_user'], $c['db_pass'], [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]);
    } catch (PDOException $e) {
        ic_json(['ok' => false, 'error' => 'No se pudo conectar a la base de datos.'], 500);
    }
    return $pdo;
}

/** Envía las cabeceras CORS. Refleja el origen del pedido (sirve para dev y producción). */
function ic_cors(): void
{
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    if ($origin !== '') {
        header("Access-Control-Allow-Origin: {$origin}");
        header('Vary: Origin');
    } else {
        header('Access-Control-Allow-Origin: *');
    }
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
    header('Access-Control-Max-Age: 86400');

    if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
        http_response_code(204);
        exit;
    }
}

/** Emite una respuesta JSON y termina. */
function ic_json($data, int $status = 200): void
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

/** Lee y decodifica el body JSON del request. */
function ic_body(): array
{
    $raw = file_get_contents('php://input');
    if ($raw === false || $raw === '') {
        return [];
    }
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

/**
 * Garantiza que exista la tabla `users` y, si está vacía, siembra el usuario
 * administrador inicial con los valores de config.php (contraseña hasheada).
 * Después de esta siembra, la base de datos es la única fuente de verdad:
 * cambiar config.php ya NO cambia la contraseña.
 */
function ic_ensure_users(PDO $db): void
{
    $db->exec(
        'CREATE TABLE IF NOT EXISTS users (
            id            INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
            username      VARCHAR(64)  NOT NULL UNIQUE,
            password_hash VARCHAR(255) NOT NULL,
            created_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci'
    );

    $count = (int) $db->query('SELECT COUNT(*) FROM users')->fetchColumn();
    if ($count === 0) {
        $c = ic_config();
        $stmt = $db->prepare('INSERT INTO users (username, password_hash) VALUES (?, ?)');
        $stmt->execute([
            (string) $c['admin_username'],
            password_hash((string) $c['admin_password'], PASSWORD_DEFAULT),
        ]);
    }
}

// ── Tokens de sesión firmados con HMAC (sin necesidad de tabla de sesiones) ──

function ic_b64url_encode(string $bin): string
{
    return rtrim(strtr(base64_encode($bin), '+/', '-_'), '=');
}

function ic_b64url_decode(string $txt): string
{
    return base64_decode(strtr($txt, '-_', '+/'));
}

/** Genera un token firmado con expiración, asociado a un usuario. */
function ic_make_token(string $username): string
{
    $c = ic_config();
    $payload = ic_b64url_encode(json_encode([
        'exp' => time() + (int) $c['token_ttl'],
        'usr' => $username,
    ]));
    $sig = ic_b64url_encode(hash_hmac('sha256', $payload, $c['auth_secret'], true));
    return "{$payload}.{$sig}";
}

/**
 * Verifica firma y expiración del token. Devuelve el nombre de usuario
 * si es válido, o null si no lo es.
 */
function ic_token_user(?string $token): ?string
{
    if (!$token) {
        return null;
    }
    $parts = explode('.', $token);
    if (count($parts) !== 2) {
        return null;
    }
    [$payload, $sig] = $parts;
    $c = ic_config();
    $expected = ic_b64url_encode(hash_hmac('sha256', $payload, $c['auth_secret'], true));
    if (!hash_equals($expected, $sig)) {
        return null;
    }
    $data = json_decode(ic_b64url_decode($payload), true);
    if (!is_array($data) || !isset($data['exp']) || (int) $data['exp'] <= time()) {
        return null;
    }
    // Tokens viejos (emitidos antes de la migración a base de datos) no traen 'usr'.
    return isset($data['usr']) && is_string($data['usr'])
        ? $data['usr']
        : (string) $c['admin_username'];
}

/**
 * Corta la ejecución con 401 si el request no trae un token válido.
 * Devuelve el nombre del usuario autenticado.
 */
function ic_require_auth(): string
{
    $header = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    // Algunos servidores guardan el header en otra variable.
    if ($header === '' && function_exists('apache_request_headers')) {
        $headers = apache_request_headers();
        $header = $headers['Authorization'] ?? ($headers['authorization'] ?? '');
    }
    $token = null;
    if (preg_match('/Bearer\s+(.+)/i', $header, $m)) {
        $token = trim($m[1]);
    }
    $user = ic_token_user($token);
    if ($user === null) {
        ic_json(['ok' => false, 'error' => 'No autorizado. Iniciá sesión de nuevo.'], 401);
    }
    return $user;
}
