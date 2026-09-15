<?php
/**
 * Results API for "Philosopher of the Year 2025"
 * Returns current voting results
 */

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-cache, must-revalidate');

define('DATA_DIR', __DIR__ . '/data/');
define('VOTES_FILE', DATA_DIR . 'votes.json');
define('VOTERS_FILE', DATA_DIR . 'voters.json');
define('VOTING_END_DATE', '2026-01-11 23:59:59');

// Valid candidates with names
const CANDIDATES = [
    'mazin' => [
        'name' => 'Виктор Мазин',
        'role' => 'Психоаналитик, основатель Музея сновидений Фрейда'
    ],
    'mitrofanova' => [
        'name' => 'Алла Митрофанова',
        'role' => 'Философ, куратор, ведущая «Философского кафе»'
    ],
    'pogrebnyak' => [
        'name' => 'Александр Погребняк',
        'role' => 'Автор курса «Архитекторы смысла»'
    ],
    'radeev' => [
        'name' => 'Артём Радеев',
        'role' => 'Организатор философских событий Петербурга'
    ],
    'sekatskiy' => [
        'name' => 'Александр Секацкий',
        'role' => 'Философ и медийный спикер'
    ]
];

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
 * Get time remaining until voting ends
 */
function getTimeRemaining(): ?array
{
    $endDate = new DateTime(VOTING_END_DATE, new DateTimeZone('Europe/Moscow'));
    $now = new DateTime('now', new DateTimeZone('Europe/Moscow'));
    
    if ($now >= $endDate) {
        return null;
    }
    
    $diff = $now->diff($endDate);
    
    return [
        'days' => $diff->days,
        'hours' => $diff->h,
        'minutes' => $diff->i,
        'seconds' => $diff->s
    ];
}

/**
 * Read votes from file
 */
function getVotes(): array
{
    if (!file_exists(VOTES_FILE)) {
        $votes = [];
        foreach (array_keys(CANDIDATES) as $id) {
            $votes[$id] = 0;
        }
        return $votes;
    }
    
    $handle = fopen(VOTES_FILE, 'r');
    if (!$handle) {
        return [];
    }
    
    flock($handle, LOCK_SH);
    $content = fread($handle, filesize(VOTES_FILE) ?: 1);
    flock($handle, LOCK_UN);
    fclose($handle);
    
    return json_decode($content, true) ?? [];
}

/**
 * Get total voters count
 */
function getTotalVoters(): int
{
    if (!file_exists(VOTERS_FILE)) {
        return 0;
    }
    
    $handle = fopen(VOTERS_FILE, 'r');
    if (!$handle) {
        return 0;
    }
    
    flock($handle, LOCK_SH);
    $content = fread($handle, filesize(VOTERS_FILE) ?: 1);
    flock($handle, LOCK_UN);
    fclose($handle);
    
    $voters = json_decode($content, true) ?? [];
    return count($voters);
}

// Only allow GET requests
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'method_not_allowed']);
    exit;
}

$votes = getVotes();
$totalVotes = array_sum($votes);
$totalVoters = getTotalVoters();
$votingOpen = isVotingOpen();
$timeRemaining = getTimeRemaining();

// Build results array with percentages
$results = [];
foreach (CANDIDATES as $id => $info) {
    $voteCount = $votes[$id] ?? 0;
    $percentage = $totalVotes > 0 ? round(($voteCount / $totalVotes) * 100, 1) : 0;
    
    $results[] = [
        'id' => $id,
        'name' => $info['name'],
        'role' => $info['role'],
        'votes' => $voteCount,
        'percentage' => $percentage
    ];
}

// Sort by votes (descending)
usort($results, fn($a, $b) => $b['votes'] <=> $a['votes']);

// Response
$response = [
    'success' => true,
    'votingOpen' => $votingOpen,
    'timeRemaining' => $timeRemaining,
    'totalVotes' => $totalVotes,
    'totalVoters' => $totalVoters,
    'results' => $results,
    'lastUpdated' => date('Y-m-d H:i:s')
];

echo json_encode($response, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);

