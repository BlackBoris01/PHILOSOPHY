<?php
/**
 * Floyd / личный сайт — синхронизация localStorage между устройствами.
 *
 * Секрет: одна строка в api/data/floyd-sync-secret.txt (не коммитьте в репозиторий).
 * Запросы: заголовок X-Floyd-Sync-Token: <секрет> или Authorization: Bearer <секрет>
 *
 * GET  — вернуть сохранённый снимок { updatedAt, payload }
 * POST — тело JSON { updatedAt?, payload } — перезаписать снимок на сервере, updatedAt = max(сервер, клиент, time)
 */

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

define('DATA_DIR', __DIR__ . '/data/');
define('SECRET_FILE', DATA_DIR . 'floyd-sync-secret.txt');
define('SNAPSHOT_FILE', DATA_DIR . 'floyd-sync.json');

function read_sync_token(): string {
    $h = $_SERVER['HTTP_X_FLOYD_SYNC_TOKEN'] ?? '';
    if (is_string($h) && $h !== '') {
        return trim($h);
    }
    $auth = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    if (is_string($auth) && preg_match('/^\s*Bearer\s+(.+)$/i', $auth, $m)) {
        return trim($m[1]);
    }
    return '';
}

function load_secret(): ?string {
    if (!is_readable(SECRET_FILE)) {
        return null;
    }
    $s = file_get_contents(SECRET_FILE);
    if ($s === false) {
        return null;
    }
    $s = trim($s);
    return $s === '' ? null : $s;
}

function read_snapshot(): array {
    if (!is_readable(SNAPSHOT_FILE)) {
        return ['updatedAt' => 0, 'payload' => new stdClass()];
    }
    $raw = file_get_contents(SNAPSHOT_FILE);
    if ($raw === false) {
        return ['updatedAt' => 0, 'payload' => new stdClass()];
    }
    $data = json_decode($raw, true);
    if (!is_array($data)) {
        return ['updatedAt' => 0, 'payload' => new stdClass()];
    }
    $u = isset($data['updatedAt']) && is_numeric($data['updatedAt'])
        ? (int) $data['updatedAt']
        : 0;
    $p = $data['payload'] ?? new stdClass();
    if (!is_array($p) && !is_object($p)) {
        $p = new stdClass();
    }
    return ['updatedAt' => $u, 'payload' => $p];
}

function write_snapshot(int $updatedAt, array $payload): bool {
    if (!is_dir(DATA_DIR)) {
        @mkdir(DATA_DIR, 0755, true);
    }
    $body = json_encode(
        ['updatedAt' => $updatedAt, 'payload' => $payload],
        JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR
    );
    $tmp = SNAPSHOT_FILE . '.tmp';
    if (file_put_contents($tmp, $body, LOCK_EX) === false) {
        return false;
    }
    return rename($tmp, SNAPSHOT_FILE);
}

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

$secret = load_secret();
if ($secret === null) {
    http_response_code(503);
    echo json_encode([
        'ok' => false,
        'error' => 'Сервер не настроен: создайте файл api/data/floyd-sync-secret.txt с одной строкой секрета.',
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

$token = read_sync_token();
if ($token === '' || !hash_equals($secret, $token)) {
    http_response_code(401);
    echo json_encode(['ok' => false, 'error' => 'Неверный или отсутствующий токен синхронизации.'], JSON_UNESCAPED_UNICODE);
    exit;
}

try {
    if ($method === 'GET') {
        $snap = read_snapshot();
        echo json_encode(['ok' => true] + $snap, JSON_UNESCAPED_UNICODE);
        exit;
    }

    if ($method === 'POST') {
        $rawIn = file_get_contents('php://input');
        if ($rawIn === false || trim($rawIn) === '') {
            http_response_code(400);
            echo json_encode(['ok' => false, 'error' => 'Пустое тело запроса.'], JSON_UNESCAPED_UNICODE);
            exit;
        }
        $in = json_decode($rawIn, true, 512, JSON_THROW_ON_ERROR);
        if (!is_array($in)) {
            http_response_code(400);
            echo json_encode(['ok' => false, 'error' => 'Ожидался JSON-объект.'], JSON_UNESCAPED_UNICODE);
            exit;
        }
        $clientTs = isset($in['updatedAt']) && is_numeric($in['updatedAt'])
            ? (int) $in['updatedAt']
            : 0;
        $payload = $in['payload'] ?? null;
        if (!is_array($payload)) {
            http_response_code(400);
            echo json_encode(['ok' => false, 'error' => 'Поле payload должно быть объектом.'], JSON_UNESCAPED_UNICODE);
            exit;
        }

        $current = read_snapshot();
        $now = (int) floor(microtime(true) * 1000);
        $newTs = max($current['updatedAt'], $clientTs, $now);

        if (!write_snapshot($newTs, $payload)) {
            http_response_code(500);
            echo json_encode(['ok' => false, 'error' => 'Не удалось записать данные на сервер.'], JSON_UNESCAPED_UNICODE);
            exit;
        }

        echo json_encode(['ok' => true, 'updatedAt' => $newTs], JSON_UNESCAPED_UNICODE);
        exit;
    }

    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Метод не поддерживается.'], JSON_UNESCAPED_UNICODE);
} catch (JsonException $e) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Некорректный JSON.'], JSON_UNESCAPED_UNICODE);
}
