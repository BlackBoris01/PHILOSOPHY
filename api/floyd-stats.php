<?php
/**
 * Статистика посещений скрытой страницы Floyd (всего / за сегодня / «сейчас онлайн»).
 *
 * Файл данных: api/data/floyd-stats.json (создаётся автоматически).
 * «Сейчас» — число вкладок, приславших heartbeat за последние 5 минут.
 */

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

define('STATS_FILE', __DIR__ . '/data/floyd-stats.json');
define('ONLINE_WINDOW_SEC', 300);

function default_stats(): array
{
    $today = date('Y-m-d');
    return [
        'totalVisits' => 0,
        'currentDay' => $today,
        'dayVisits' => 0,
        'sessions' => [],
    ];
}

function normalize_stats(?array $data): array
{
    $d = default_stats();
    if ($data === null) {
        return $d;
    }
    $d['totalVisits'] = isset($data['totalVisits']) && is_numeric($data['totalVisits'])
        ? max(0, (int) $data['totalVisits'])
        : 0;
    $d['currentDay'] = isset($data['currentDay']) && is_string($data['currentDay'])
        ? $data['currentDay']
        : date('Y-m-d');
    $d['dayVisits'] = isset($data['dayVisits']) && is_numeric($data['dayVisits'])
        ? max(0, (int) $data['dayVisits'])
        : 0;
    $sess = $data['sessions'] ?? [];
    if (!is_array($sess)) {
        $sess = [];
    }
    $clean = [];
    foreach ($sess as $id => $ts) {
        if (!is_string($id) || $id === '' || !is_numeric($ts)) {
            continue;
        }
        $clean[$id] = (int) $ts;
    }
    $d['sessions'] = $clean;
    return $d;
}

function prune_sessions(array &$data, int $now): int
{
    $cutoff = $now - ONLINE_WINDOW_SEC;
    foreach ($data['sessions'] as $id => $ts) {
        if ($ts < $cutoff) {
            unset($data['sessions'][$id]);
        }
    }
    return count($data['sessions']);
}

function rollover_day(array &$data, string $today): void
{
    if ($data['currentDay'] !== $today) {
        $data['currentDay'] = $today;
        $data['dayVisits'] = 0;
    }
}

function read_write_stats(callable $mutator): array
{
    if (!is_dir(dirname(STATS_FILE))) {
        @mkdir(dirname(STATS_FILE), 0755, true);
    }

    $fp = @fopen(STATS_FILE, 'c+');
    if ($fp === false) {
        throw new RuntimeException('Не удалось открыть файл статистики.');
    }

    try {
        if (!flock($fp, LOCK_EX)) {
            throw new RuntimeException('Не удалось заблокировать файл статистики.');
        }

        rewind($fp);
        $raw = stream_get_contents($fp);
        $data = $raw === false || trim((string) $raw) === ''
            ? default_stats()
            : normalize_stats(json_decode((string) $raw, true));

        $now = time();
        $today = date('Y-m-d', $now);
        $response = $mutator($data, $now, $today);

        $out = json_encode($data, JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR);
        rewind($fp);
        ftruncate($fp, 0);
        fwrite($fp, $out);
        fflush($fp);

        return $response;
    } finally {
        flock($fp, LOCK_UN);
        fclose($fp);
    }
}

function respond(array $payload, int $code = 200): void
{
    http_response_code($code);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE);
}

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

try {
    if ($method === 'GET') {
        $out = read_write_stats(static function (array &$data, int $now, string $today): array {
            rollover_day($data, $today);
            $online = prune_sessions($data, $now);
            return [
                'ok' => true,
                'totalVisits' => $data['totalVisits'],
                'dayVisits' => $data['dayVisits'],
                'serverDay' => $today,
                'online' => $online,
            ];
        });
        respond($out);
        exit;
    }

    if ($method !== 'POST') {
        respond(['ok' => false, 'error' => 'Метод не поддерживается.'], 405);
        exit;
    }

    $raw = file_get_contents('php://input');
    if ($raw === false || trim($raw) === '') {
        respond(['ok' => false, 'error' => 'Пустое тело запроса.'], 400);
        exit;
    }

    $in = json_decode($raw, true, 512, JSON_THROW_ON_ERROR);
    if (!is_array($in)) {
        respond(['ok' => false, 'error' => 'Ожидался JSON-объект.'], 400);
        exit;
    }

    $action = isset($in['action']) && is_string($in['action']) ? $in['action'] : '';
    $session = isset($in['session']) && is_string($in['session']) ? trim($in['session']) : '';

    if ($session === '' || strlen($session) > 128) {
        respond(['ok' => false, 'error' => 'Нужен session (строка до 128 символов).'], 400);
        exit;
    }

    if ($action === 'visit') {
        $out = read_write_stats(static function (array &$data, int $now, string $today) use ($session): array {
            rollover_day($data, $today);
            $data['totalVisits']++;
            $data['dayVisits']++;
            $data['sessions'][$session] = $now;
            $online = prune_sessions($data, $now);
            return [
                'ok' => true,
                'totalVisits' => $data['totalVisits'],
                'dayVisits' => $data['dayVisits'],
                'serverDay' => $today,
                'online' => $online,
            ];
        });
        respond($out);
        exit;
    }

    if ($action === 'heartbeat') {
        $out = read_write_stats(static function (array &$data, int $now, string $today) use ($session): array {
            rollover_day($data, $today);
            $data['sessions'][$session] = $now;
            $online = prune_sessions($data, $now);
            return [
                'ok' => true,
                'totalVisits' => $data['totalVisits'],
                'dayVisits' => $data['dayVisits'],
                'serverDay' => $today,
                'online' => $online,
            ];
        });
        respond($out);
        exit;
    }

    respond(['ok' => false, 'error' => 'Неизвестное действие (visit | heartbeat).'], 400);
} catch (JsonException $e) {
    respond(['ok' => false, 'error' => 'Некорректный JSON.'], 400);
} catch (Throwable $e) {
    respond(['ok' => false, 'error' => 'Ошибка сервера статистики.'], 500);
}
