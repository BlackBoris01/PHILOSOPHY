<?php
/**
 * Админ-панель: вставка ссылки/кода трансляции (VK Видео, YouTube и т.д.)
 * Вход по паролю из admin/config.php
 */
session_start();

$configPath = __DIR__ . '/config.php';
if (!file_exists($configPath)) {
    $message = 'Создайте файл admin/config.php на основе admin/config.sample.php и задайте пароль и токен.';
    $loggedIn = false;
} else {
    $config = include $configPath;
    $adminPassword = $config['admin_password'] ?? '';
    $loggedIn = !empty($_SESSION['stream_admin']);

    if (!$loggedIn && isset($_POST['action']) && $_POST['action'] === 'login') {
        if (!empty($_POST['password']) && $_POST['password'] === $adminPassword) {
            $_SESSION['stream_admin'] = true;
            $loggedIn = true;
        } else {
            $loginError = 'Неверный пароль';
        }
    }

    if ($loggedIn && isset($_POST['action']) && $_POST['action'] === 'logout') {
        unset($_SESSION['stream_admin']);
        $loggedIn = false;
        header('Location: index.php');
        exit;
    }

    if ($loggedIn && isset($_POST['action']) && $_POST['action'] === 'save') {
        $embed = trim($_POST['embed'] ?? '');
        $embed = strip_tags($embed, '<iframe>');
        $dataDir = __DIR__ . '/../api/data';
        if (!is_dir($dataDir)) {
            @mkdir($dataDir, 0755, true);
        }
        $streamFile = $dataDir . '/stream.json';
        $data = ['embed' => $embed, 'updated' => date('Y-m-d H:i:s')];
        if (@file_put_contents($streamFile, json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT)) !== false) {
            $saveSuccess = true;
        } else {
            $saveError = 'Не удалось записать файл. Проверьте права на папку api/data.';
        }
    }
}

$currentEmbed = '';
if ($loggedIn && file_exists(__DIR__ . '/../api/data/stream.json')) {
    $data = @json_decode(file_get_contents(__DIR__ . '/../api/data/stream.json'), true);
    $currentEmbed = is_array($data) ? ($data['embed'] ?? '') : '';
}

$baseHref = dirname(dirname($_SERVER['REQUEST_URI'] ?? ''));
if ($baseHref === '\\' || $baseHref === '/') {
    $baseHref = '';
}
?>
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Админ — Трансляция</title>
  <link rel="stylesheet" href="<?= htmlspecialchars($baseHref) ?>/css/main.css">
  <style>
    body { padding: 40px 20px; max-width: 640px; margin: 0 auto; }
    h1 { font-size: 1.5rem; margin-bottom: 1rem; }
    .form-group { margin-bottom: 1rem; }
    .form-group label { display: block; margin-bottom: 0.5rem; font-weight: 600; }
    .form-group textarea { width: 100%; min-height: 120px; padding: 12px; border: 1px solid var(--border); border-radius: 8px; font-family: inherit; font-size: 14px; }
    .btn { padding: 10px 20px; border-radius: 8px; border: none; cursor: pointer; font-size: 14px; }
    .btn-primary { background: var(--primary); color: #fff; }
    .btn-secondary { background: var(--surface); color: var(--text); margin-left: 8px; }
    .message { padding: 12px; border-radius: 8px; margin-bottom: 1rem; }
    .message.success { background: #d1fae5; color: #065f46; }
    .message.error { background: #fee2e2; color: #991b1b; }
    .help { font-size: 13px; color: var(--muted); margin-top: 0.5rem; }
    .logout { margin-top: 24px; }
  </style>
</head>
<body>
  <h1>Трансляция на сайте</h1>

  <?php if (!file_exists($configPath)): ?>
    <div class="message error"><?= htmlspecialchars($message) ?></div>
  <?php elseif (!$loggedIn): ?>
    <form method="post">
      <input type="hidden" name="action" value="login">
      <div class="form-group">
        <label for="password">Пароль</label>
        <input type="password" id="password" name="password" required autocomplete="current-password" style="width:100%;padding:10px;border:1px solid var(--border);border-radius:8px;">
      </div>
      <?php if (!empty($loginError)): ?>
        <div class="message error"><?= htmlspecialchars($loginError) ?></div>
      <?php endif; ?>
      <button type="submit" class="btn btn-primary">Войти</button>
    </form>
  <?php else: ?>
    <?php if (!empty($saveSuccess)): ?>
      <div class="message success">Сохранено. Плеер на странице «Трансляции» обновится.</div>
    <?php endif; ?>
    <?php if (!empty($saveError)): ?>
      <div class="message error"><?= htmlspecialchars($saveError) ?></div>
    <?php endif; ?>

    <form method="post">
      <input type="hidden" name="action" value="save">
      <div class="form-group">
        <label for="embed">Код встраивания (iframe)</label>
        <textarea id="embed" name="embed" placeholder='<iframe src="https://vk.com/video_ext.php?..." ...></iframe>'><?= htmlspecialchars($currentEmbed) ?></textarea>
        <p class="help">
          VK Видео: откройте видео → «Поделиться» → «Код для вставки» — скопируйте весь iframe.<br>
          YouTube: «Поделиться» → «Встроить» — скопируйте iframe.<br>
          Оставьте пустым, чтобы убрать трансляцию с сайта.
        </p>
      </div>
      <button type="submit" class="btn btn-primary">Сохранить</button>
    </form>

    <div class="logout">
      <form method="post" style="display:inline">
        <input type="hidden" name="action" value="logout">
        <button type="submit" class="btn btn-secondary">Выйти</button>
      </form>
    </div>
  <?php endif; ?>
</body>
</html>
