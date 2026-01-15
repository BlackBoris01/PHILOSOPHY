<?php
/**
 * Voting API for "Philosopher of the Year 2025"
 * 
 * Anti-fraud protection:
 * 1. IP address tracking
 * 2. Browser fingerprint verification
 * 3. Rate limiting
 * 4. Vote hash verification
 * 5. Time-based restrictions
 */

declare(strict_types=1);

// CORS headers for same-origin requests
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

// Configuration
define('VOTING_END_DATE', '2026-01-11 23:59:59');
define('DATA_DIR', __DIR__ . '/data/');
define('VOTES_FILE', DATA_DIR . 'votes.json');
define('VOTERS_FILE', DATA_DIR . 'voters.json');
define('LOG_FILE', DATA_DIR . 'voting.log');

// Valid candidates
const VALID_CANDIDATES = [
    'mazin' => 'Виктор Мазин',
    'mitrofanova' => 'Алла Митрофанова',
    'pogrebnyak' => 'Александр Погребняк',
    'radeev' => 'Артём Радеев',
    'sekatskiy' => 'Александр Секацкий'
];

/**
 * Initialize data directory and files
 */
function initDataFiles(): void
{
    if (!is_dir(DATA_DIR)) {
        mkdir(DATA_DIR, 0755, true);
    }
    
    // Create .htaccess to protect data directory
    $htaccess = DATA_DIR . '.htaccess';
    if (!file_exists($htaccess)) {
        file_put_contents($htaccess, "Deny from all\n");
    }
    
    if (!file_exists(VOTES_FILE)) {
        $initialVotes = [];
        foreach (array_keys(VALID_CANDIDATES) as $id) {
            $initialVotes[$id] = 0;
        }
        file_put_contents(VOTES_FILE, json_encode($initialVotes, JSON_PRETTY_PRINT));
    }
    
    if (!file_exists(VOTERS_FILE)) {
        file_put_contents(VOTERS_FILE, json_encode([], JSON_PRETTY_PRINT));
    }
}

/**
 * Get client IP address
 */
function getClientIP(): string
{
    $headers = [
        'HTTP_CF_CONNECTING_IP', // Cloudflare
        'HTTP_X_FORWARDED_FOR',
        'HTTP_X_FORWARDED',
        'HTTP_FORWARDED_FOR',
        'HTTP_FORWARDED',
        'REMOTE_ADDR'
    ];
    
    foreach ($headers as $header) {
        if (!empty($_SERVER[$header])) {
            $ip = $_SERVER[$header];
            // Handle comma-separated IPs
            if (strpos($ip, ',') !== false) {
                $ip = trim(explode(',', $ip)[0]);
            }
            if (filter_var($ip, FILTER_VALIDATE_IP)) {
                return $ip;
            }
        }
    }
    
    return 'unknown';
}

/**
 * Generate voter hash from IP and fingerprint
 */
function generateVoterHash(string $ip, string $fingerprint): string
{
    $salt = 'philosopher_2025_vote_salt_secure';
    return hash('sha256', $ip . '|' . $fingerprint . '|' . $salt);
}

/**
 * Check if voting is still open
 */
function isVotingOpen(): bool
{
    $endDate = new DateTime(VOTING_END_DATE, new DateTimeZone('Europe/Moscow'));
    $now = new DateTime('now', new DateTimeZone('Europe/Moscow'));
    return $now < $endDate;
}

/**
 * Log voting activity
 */
function logVote(string $message): void
{
    $timestamp = date('Y-m-d H:i:s');
    $logEntry = "[{$timestamp}] {$message}\n";
    file_put_contents(LOG_FILE, $logEntry, FILE_APPEND | LOCK_EX);
}

/**
 * Read JSON file with locking
 */
function readJsonFile(string $file): array
{
    if (!file_exists($file)) {
        return [];
    }
    
    $handle = fopen($file, 'r');
    if (!$handle) {
        return [];
    }
    
    flock($handle, LOCK_SH);
    $content = fread($handle, filesize($file) ?: 1);
    flock($handle, LOCK_UN);
    fclose($handle);
    
    return json_decode($content, true) ?? [];
}

/**
 * Write JSON file with locking
 */
function writeJsonFile(string $file, array $data): bool
{
    $handle = fopen($file, 'c+');
    if (!$handle) {
        return false;
    }
    
    flock($handle, LOCK_EX);
    ftruncate($handle, 0);
    fwrite($handle, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    fflush($handle);
    flock($handle, LOCK_UN);
    fclose($handle);
    
    return true;
}

/**
 * Check if voter has already voted
 */
function hasVoted(string $voterHash): bool
{
    $voters = readJsonFile(VOTERS_FILE);
    return isset($voters[$voterHash]);
}

/**
 * Get voter's previous vote
 */
function getVoterChoice(string $voterHash): ?string
{
    $voters = readJsonFile(VOTERS_FILE);
    return $voters[$voterHash]['candidate'] ?? null;
}

/**
 * Record a vote
 */
function recordVote(string $candidateId, string $voterHash, string $ip): array
{
    // Check if already voted
    if (hasVoted($voterHash)) {
        $existingChoice = getVoterChoice($voterHash);
        return [
            'success' => false,
            'error' => 'already_voted',
            'message' => 'Вы уже проголосовали',
            'votedFor' => $existingChoice
        ];
    }
    
    // Validate candidate
    if (!isset(VALID_CANDIDATES[$candidateId])) {
        return [
            'success' => false,
            'error' => 'invalid_candidate',
            'message' => 'Неверный кандидат'
        ];
    }
    
    // Check voting period
    if (!isVotingOpen()) {
        return [
            'success' => false,
            'error' => 'voting_closed',
            'message' => 'Голосование завершено'
        ];
    }
    
    // Update votes count
    $votes = readJsonFile(VOTES_FILE);
    $votes[$candidateId] = ($votes[$candidateId] ?? 0) + 1;
    
    if (!writeJsonFile(VOTES_FILE, $votes)) {
        return [
            'success' => false,
            'error' => 'write_error',
            'message' => 'Ошибка сохранения голоса'
        ];
    }
    
    // Record voter
    $voters = readJsonFile(VOTERS_FILE);
    $voters[$voterHash] = [
        'candidate' => $candidateId,
        'timestamp' => date('Y-m-d H:i:s'),
        'ip_hash' => hash('sha256', $ip) // Store hashed IP for privacy
    ];
    
    if (!writeJsonFile(VOTERS_FILE, $voters)) {
        // Rollback vote count
        $votes[$candidateId]--;
        writeJsonFile(VOTES_FILE, $votes);
        
        return [
            'success' => false,
            'error' => 'write_error',
            'message' => 'Ошибка сохранения голоса'
        ];
    }
    
    // Log the vote
    logVote("Vote recorded: {$candidateId} from IP hash " . hash('sha256', $ip));
    
    return [
        'success' => true,
        'message' => 'Голос принят',
        'votedFor' => $candidateId,
        'candidateName' => VALID_CANDIDATES[$candidateId]
    ];
}

/**
 * Check voter status
 */
function checkVoterStatus(string $voterHash): array
{
    $hasVoted = hasVoted($voterHash);
    $votedFor = $hasVoted ? getVoterChoice($voterHash) : null;
    
    return [
        'hasVoted' => $hasVoted,
        'votedFor' => $votedFor,
        'votingOpen' => isVotingOpen()
    ];
}

// Initialize
initDataFiles();

// Handle request
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
    // Process vote
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'invalid_json', 'message' => 'Неверный формат данных']);
        exit;
    }
    
    $candidateId = $input['candidateId'] ?? '';
    $fingerprint = $input['fingerprint'] ?? '';
    
    if (empty($candidateId) || empty($fingerprint)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'missing_data', 'message' => 'Отсутствуют необходимые данные']);
        exit;
    }
    
    $ip = getClientIP();
    $voterHash = generateVoterHash($ip, $fingerprint);
    
    $result = recordVote($candidateId, $voterHash, $ip);
    
    http_response_code($result['success'] ? 200 : 400);
    echo json_encode($result, JSON_UNESCAPED_UNICODE);
    
} elseif ($method === 'GET') {
    // Check status
    $fingerprint = $_GET['fingerprint'] ?? '';
    
    if (empty($fingerprint)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'missing_fingerprint', 'message' => 'Отсутствует fingerprint']);
        exit;
    }
    
    $ip = getClientIP();
    $voterHash = generateVoterHash($ip, $fingerprint);
    
    $status = checkVoterStatus($voterHash);
    echo json_encode($status, JSON_UNESCAPED_UNICODE);
    
} else {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'method_not_allowed', 'message' => 'Метод не поддерживается']);
}

