<?php
/**
 * Stream API — текущая трансляция для страницы streams.html
 * GET: возвращает сохранённый embed (iframe) или пустой объект
 * POST: сохраняет embed (только с токеном из admin)
 */

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

define('DATA_DIR', __DIR__ . '/data/');
define('STREAM_FILE', DATA_DIR . 'stream.json');

/**
 * Разрешить только теги iframe (безопасность)
 */
function sanitizeEmbed(string $html): string {
    $html = trim($html);
    if ($html === '') {
        return '';
    }
    $allowed = '<iframe>';
    $stripped = strip_tags($html, $allowed);
    return $stripped;
}

/**
 * Прочитать текущую трансляцию
 */
function getStream(): array {
    if (!file_exists(STREAM_FILE)) {
        return ['embed' => '', 'updated' => null];
    }
    $json = @file_get_contents(STREAM_FILE);
    if ($json === false) {
        return ['embed' => '', 'updated' => null];
    }
    $data = json_decode($json, true);
    if (!is_array($data)) {
        return ['embed' => '', 'updated' => null];
    }
    return [
        'embed' => $data['embed'] ?? '',
        'updated' => $data['updated'] ?? null
    ];
}

/**
 * Сохранить трансляцию (только с валидным токеном)
 */
function saveStream(string $embed, string $token): array {
    $configPath = __DIR__ . '/../admin/config.php';
    if (!file_exists($configPath)) {
        return ['success' => false, 'error' => 'Нет конфигурации админки'];
    }
    $config = include $configPath;
    $expectedToken = $config['stream_api_token'] ?? '';
    if ($expectedToken === '' || $token !== $expectedToken) {
        return ['success' => false, 'error' => 'Неверный токен'];
    }

    if (!is_dir(DATA_DIR)) {
        mkdir(DATA_DIR, 0755, true);
    }
    $htaccess = DATA_DIR . '.htaccess';
    if (!file_exists($htaccess)) {
        @file_put_contents($htaccess, "Deny from all\n");
    }

    $embed = sanitizeEmbed($embed);
    $data = [
        'embed' => $embed,
        'updated' => date('Y-m-d H:i:s')
    ];
    $written = @file_put_contents(STREAM_FILE, json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
    if ($written === false) {
        return ['success' => false, 'error' => 'Не удалось записать файл'];
    }
    return ['success' => true, 'updated' => $data['updated']];
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $stream = getStream();
    echo json_encode($stream, JSON_UNESCAPED_UNICODE);
    exit;
}

if ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    if (!is_array($input)) {
        $input = ['embed' => $_POST['embed'] ?? '', 'token' => $_POST['token'] ?? ''];
    }
    $embed = (string) ($input['embed'] ?? '');
    $token = (string) ($input['token'] ?? '');
    $result = saveStream($embed, $token);
    http_response_code($result['success'] ? 200 : 403);
    echo json_encode($result, JSON_UNESCAPED_UNICODE);
    exit;
}

http_response_code(405);
echo json_encode(['success' => false, 'error' => 'Метод не поддерживается']);
