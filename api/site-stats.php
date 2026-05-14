<?php
/**
 * Статистика посещений основного сайта (HTML-страницы с трекером).
 *
 * Данные: api/data/site-stats.json
 * «Сейчас онлайн» — вкладки с heartbeat за последние ONLINE_WINDOW_SEC.
 *
 * GET без токена — только агрегаты (без персональных данных).
 * GET ?details=1 + токен (см. ниже) — полный список клиентов: IP, UA, локация, сессия.
 *
 * Токен: первая непустая строка из api/data/site-stats-admin-secret.txt
 *        или, если файла нет, — из api/data/floyd-sync-secret.txt
 * Передача: заголовок X-Site-Stats-Token, Authorization: Bearer …, либо query token=
 */

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

define('STATS_FILE', __DIR__ . '/data/site-stats.json');
define('DATA_DIR', __DIR__ . '/data/');
define('ADMIN_SECRET_PRIMARY', DATA_DIR . 'site-stats-admin-secret.txt');
define('ADMIN_SECRET_FALLBACK', DATA_DIR . 'floyd-sync-secret.txt');
define('ONLINE_WINDOW_SEC', 300);
define('MAX_CLIENT_RECORDS', 1000);
define('GEO_HTTP_TIMEOUT_SEC', 2);

function default_stats(): array
{
    $today = date('Y-m-d');
    return [
        'totalVisits' => 0,
        'currentDay' => $today,
        'dayVisits' => 0,
        'clients' => [],
    ];
}

function read_request_token(): string
{
    if (isset($_GET['token']) && is_string($_GET['token'])) {
        $t = trim($_GET['token']);
        if ($t !== '') {
            return $t;
        }
    }
    $h = $_SERVER['HTTP_X_SITE_STATS_TOKEN'] ?? '';
    if (is_string($h) && trim($h) !== '') {
        return trim($h);
    }
    $auth = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    if (is_string($auth) && preg_match('/^\s*Bearer\s+(.+)$/i', $auth, $m)) {
        return trim($m[1]);
    }
    return '';
}

function load_valid_admin_secret(): ?string
{
    foreach ([ADMIN_SECRET_PRIMARY, ADMIN_SECRET_FALLBACK] as $path) {
        if (!is_readable($path)) {
            continue;
        }
        $raw = file_get_contents($path);
        if ($raw === false) {
            continue;
        }
        $s = trim((string) $raw);
        if ($s !== '') {
            return $s;
        }
    }
    return null;
}

function verify_admin_token(string $token): bool
{
    $secret = load_valid_admin_secret();
    if ($secret === null || $token === '') {
        return false;
    }
    return hash_equals($secret, $token);
}

function get_client_ip(): string
{
    $xff = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? '';
    if (is_string($xff) && $xff !== '') {
        $parts = array_map('trim', explode(',', $xff));
        if (isset($parts[0]) && $parts[0] !== '') {
            return substr($parts[0], 0, 128);
        }
    }
    $ip = $_SERVER['REMOTE_ADDR'] ?? '';
    return is_string($ip) ? substr($ip, 0, 128) : '';
}

/** @return array{0:string,1:string} [country, city] */
function geo_lookup(string $ip): array
{
    if ($ip === '' || $ip === '127.0.0.1' || strncmp($ip, '192.168.', 8) === 0 || strncmp($ip, '10.', 3) === 0) {
        return ['', ''];
    }
    if (str_starts_with($ip, '172.')) {
        $oct = explode('.', $ip);
        if (count($oct) === 4) {
            $n = (int) $oct[1];
            if ($n >= 16 && $n <= 31) {
                return ['', ''];
            }
        }
    }
    $url = 'http://ip-api.com/json/' . rawurlencode($ip) . '?fields=status,country,city';
    $ctx = stream_context_create([
        'http' => [
            'timeout' => GEO_HTTP_TIMEOUT_SEC,
            'ignore_errors' => true,
        ],
    ]);
    $raw = @file_get_contents($url, false, $ctx);
    if ($raw === false || $raw === '') {
        return ['', ''];
    }
    try {
        $j = json_decode($raw, true, 512, JSON_THROW_ON_ERROR);
    } catch (Throwable $e) {
        return ['', ''];
    }
    if (!is_array($j) || ($j['status'] ?? '') !== 'success') {
        return ['', ''];
    }
    $country = isset($j['country']) && is_string($j['country']) ? $j['country'] : '';
    $city = isset($j['city']) && is_string($j['city']) ? $j['city'] : '';

    return [substr($country, 0, 80), substr($city, 0, 80)];
}

/**
 * @param array<string, mixed> $data
 */
function migrate_legacy_sessions(array &$data): void
{
    if (!isset($data['sessions']) || !is_array($data['sessions'])) {
        return;
    }
    if (!isset($data['clients']) || !is_array($data['clients'])) {
        $data['clients'] = [];
    }
    foreach ($data['sessions'] as $id => $ts) {
        if (!is_string($id) || $id === '' || !is_numeric($ts)) {
            continue;
        }
        $t = (int) $ts;
        if (!isset($data['clients'][$id])) {
            $data['clients'][$id] = [
                'last' => $t,
                'first' => $t,
                'ip' => '',
                'ua' => '',
                'lang' => '',
                'country' => '',
                'city' => '',
                'geoTried' => 0,
            ];
        } else {
            $data['clients'][$id]['last'] = max((int) ($data['clients'][$id]['last'] ?? 0), $t);
            $data['clients'][$id]['first'] = min((int) ($data['clients'][$id]['first'] ?? $t), $t);
        }
    }
    unset($data['sessions']);
}

/**
 * @param array<string, mixed>|null $data
 * @return array<string, mixed>
 */
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

    $clients = $data['clients'] ?? [];
    if (!is_array($clients)) {
        $clients = [];
    }
    $clean = [];
    foreach ($clients as $id => $rec) {
        if (!is_string($id) || $id === '' || strlen($id) > 128) {
            continue;
        }
        if (is_int($rec) || is_float($rec)) {
            $t = (int) $rec;
            $clean[$id] = [
                'last' => $t,
                'first' => $t,
                'ip' => '',
                'ua' => '',
                'lang' => '',
                'country' => '',
                'city' => '',
                'geoTried' => 0,
            ];
            continue;
        }
        if (!is_array($rec)) {
            continue;
        }
        $last = isset($rec['last']) && is_numeric($rec['last']) ? (int) $rec['last'] : 0;
        $first = isset($rec['first']) && is_numeric($rec['first']) ? (int) $rec['first'] : $last;
        $clean[$id] = [
            'last' => $last,
            'first' => $first,
            'ip' => isset($rec['ip']) && is_string($rec['ip']) ? substr($rec['ip'], 0, 128) : '',
            'ua' => isset($rec['ua']) && is_string($rec['ua']) ? substr($rec['ua'], 0, 512) : '',
            'lang' => isset($rec['lang']) && is_string($rec['lang']) ? substr($rec['lang'], 0, 32) : '',
            'country' => isset($rec['country']) && is_string($rec['country']) ? substr($rec['country'], 0, 80) : '',
            'city' => isset($rec['city']) && is_string($rec['city']) ? substr($rec['city'], 0, 80) : '',
            'geoTried' => !empty($rec['geoTried']) ? 1 : 0,
        ];
    }
    $d['clients'] = $clean;

    if (isset($data['sessions']) && is_array($data['sessions'])) {
        $d['sessions'] = $data['sessions'];
    }
    migrate_legacy_sessions($d);

    return $d;
}

/**
 * @param array<string, array<string, mixed>> $clients
 */
function cap_clients(array &$clients): void
{
    if (count($clients) <= MAX_CLIENT_RECORDS) {
        return;
    }
    $drop = count($clients) - MAX_CLIENT_RECORDS;
    $ids = array_keys($clients);
    usort($ids, static function (string $a, string $b) use ($clients): int {
        return ($clients[$a]['last'] ?? 0) <=> ($clients[$b]['last'] ?? 0);
    });
    for ($i = 0; $i < $drop; $i++) {
        unset($clients[$ids[$i]]);
    }
}

/**
 * @param array<string, array<string, mixed>> $clients
 */
function count_online(array $clients, int $now): int
{
    $cutoff = $now - ONLINE_WINDOW_SEC;
    $n = 0;
    foreach ($clients as $c) {
        if (($c['last'] ?? 0) >= $cutoff) {
            $n++;
        }
    }
    return $n;
}

/**
 * @param array<string, array<string, mixed>> $clients
 * @return list<array<string, mixed>>
 */
function build_client_rows(array $clients, int $now): array
{
    $cutoff = $now - ONLINE_WINDOW_SEC;
    $rows = [];
    foreach ($clients as $sessionId => $c) {
        $last = (int) ($c['last'] ?? 0);
        $rows[] = [
            'session' => $sessionId,
            'online' => $last >= $cutoff,
            'lastSeen' => $last,
            'firstSeen' => (int) ($c['first'] ?? $last),
            'ip' => (string) ($c['ip'] ?? ''),
            'country' => (string) ($c['country'] ?? ''),
            'city' => (string) ($c['city'] ?? ''),
            'ua' => (string) ($c['ua'] ?? ''),
            'lang' => (string) ($c['lang'] ?? ''),
        ];
    }
    usort($rows, static function (array $a, array $b): int {
        return ($b['lastSeen'] ?? 0) <=> ($a['lastSeen'] ?? 0);
    });

    return $rows;
}

/**
 * @param array<string, mixed> $rec
 */
function maybe_fill_geo(array &$rec, string $ip): void
{
    if ($ip === '') {
        return;
    }
    if (!empty($rec['geoTried'])) {
        return;
    }
    [$country, $city] = geo_lookup($ip);
    $rec['country'] = $country;
    $rec['city'] = $city;
    $rec['geoTried'] = 1;
}

/**
 * @param array<string, mixed> $data
 * @param array<string, string> $body client fields from JSON
 */
function upsert_client(array &$data, string $session, int $now, array $body): void
{
    $ip = get_client_ip();
    $ua = isset($body['ua']) && is_string($body['ua']) ? substr($body['ua'], 0, 512) : '';
    $lang = isset($body['lang']) && is_string($body['lang']) ? substr($body['lang'], 0, 32) : '';

    if (!isset($data['clients'][$session])) {
        if (count($data['clients']) >= MAX_CLIENT_RECORDS) {
            uasort($data['clients'], static function (array $a, array $b): int {
                return ($a['last'] ?? 0) <=> ($b['last'] ?? 0);
            });
            foreach (array_keys($data['clients']) as $id) {
                unset($data['clients'][$id]);
                break;
            }
        }
        $data['clients'][$session] = [
            'last' => $now,
            'first' => $now,
            'ip' => $ip,
            'ua' => $ua,
            'lang' => $lang,
            'country' => '',
            'city' => '',
            'geoTried' => 0,
        ];
        maybe_fill_geo($data['clients'][$session], $ip);

        return;
    }

    $rec = &$data['clients'][$session];
    $rec['last'] = $now;
    if ($ua !== '') {
        $rec['ua'] = $ua;
    }
    if ($lang !== '') {
        $rec['lang'] = $lang;
    }
    if ($ip !== '') {
        $prevIp = (string) ($rec['ip'] ?? '');
        if ($prevIp !== '' && $prevIp !== $ip) {
            $rec['country'] = '';
            $rec['city'] = '';
            $rec['geoTried'] = 0;
        }
        $rec['ip'] = $ip;
    }
    maybe_fill_geo($rec, $ip);
}

function rollover_day(array &$data, string $today): void
{
    if ($data['currentDay'] !== $today) {
        $data['currentDay'] = $today;
        $data['dayVisits'] = 0;
    }
}

/**
 * @param callable(array, int, string): array $mutator
 */
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

        cap_clients($data['clients']);

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

/**
 * Read-only stats for GET details (no write) — avoids pruning side effects on simple read.
 *
 * @return array{data: array<string, mixed>, now: int, today: string}
 */
function read_stats_snapshot(): array
{
    if (!is_readable(STATS_FILE)) {
        return ['data' => default_stats(), 'now' => time(), 'today' => date('Y-m-d')];
    }
    $raw = file_get_contents(STATS_FILE);
    if ($raw === false || trim($raw) === '') {
        return ['data' => default_stats(), 'now' => time(), 'today' => date('Y-m-d')];
    }
    try {
        $data = normalize_stats(json_decode($raw, true, 512, JSON_THROW_ON_ERROR));
    } catch (Throwable $e) {
        $data = default_stats();
    }
    $now = time();
    $today = date('Y-m-d', $now);
    rollover_day($data, $today);

    return ['data' => $data, 'now' => $now, 'today' => $today];
}

function respond(array $payload, int $code = 200): void
{
    http_response_code($code);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE);
}

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

try {
    if ($method === 'GET') {
        $wantDetails = isset($_GET['details']) && (string) $_GET['details'] === '1';
        $token = read_request_token();

        if ($wantDetails) {
            if (!verify_admin_token($token)) {
                respond(['ok' => false, 'error' => 'Нужен действительный токен (details=1).'], 403);
                exit;
            }
            $snap = read_stats_snapshot();
            $data = $snap['data'];
            $now = $snap['now'];
            $today = $snap['today'];
            $clients = is_array($data['clients'] ?? null) ? $data['clients'] : [];
            respond([
                'ok' => true,
                'totalVisits' => (int) ($data['totalVisits'] ?? 0),
                'dayVisits' => (int) ($data['dayVisits'] ?? 0),
                'serverDay' => $today,
                'online' => count_online($clients, $now),
                'clients' => build_client_rows($clients, $now),
            ]);
            exit;
        }

        $out = read_write_stats(static function (array &$data, int $now, string $today): array {
            rollover_day($data, $today);
            $clients = &$data['clients'];
            if (!is_array($clients)) {
                $data['clients'] = [];
                $clients = &$data['clients'];
            }
            $online = count_online($clients, $now);

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
    $bodyMeta = [
        'ua' => isset($in['ua']) && is_string($in['ua']) ? $in['ua'] : '',
        'lang' => isset($in['lang']) && is_string($in['lang']) ? $in['lang'] : '',
    ];

    if ($session === '' || strlen($session) > 128) {
        respond(['ok' => false, 'error' => 'Нужен session (строка до 128 символов).'], 400);
        exit;
    }

    if ($action === 'visit') {
        $out = read_write_stats(static function (array &$data, int $now, string $today) use ($session, $bodyMeta): array {
            rollover_day($data, $today);
            $data['totalVisits']++;
            $data['dayVisits']++;
            upsert_client($data, $session, $now, $bodyMeta);
            $online = count_online($data['clients'], $now);

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
        $out = read_write_stats(static function (array &$data, int $now, string $today) use ($session, $bodyMeta): array {
            rollover_day($data, $today);
            upsert_client($data, $session, $now, $bodyMeta);
            $online = count_online($data['clients'], $now);

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
