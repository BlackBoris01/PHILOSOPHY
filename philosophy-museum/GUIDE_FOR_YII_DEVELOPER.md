# 🎓 React для Yii2 разработчика

Этот гайд поможет вам понять React, если вы знакомы с Yii2 и классическим веб-разработкой.

---

## 📚 Оглавление

1. [Основная концепция React vs Yii2](#основная-концепция-react-vs-yii2)
2. [Структура проекта](#структура-проекта)
3. [Компоненты = Виджеты](#компоненты--виджеты)
4. [Роутинг](#роутинг)
5. [Состояние и хуки](#состояние-и-хуки)
6. [Работа с API](#работа-с-api)
7. [Стили](#стили)
8. [Подключение бэкенда](#подключение-бэкенда)

---

## 🎯 Основная концепция React vs Yii2

### Yii2 (Server-Side Rendering)

```
Клиент → Запрос → Сервер (PHP) → Рендеринг HTML → Клиент
```

- Каждая страница = новый запрос к серверу
- HTML генерируется на сервере
- JavaScript только для интерактивности

### React (Client-Side Rendering)

```
Клиент → Запрос → Сервер → Один HTML + JS → React рендерит все на клиенте
```

- Одна страница (SPA - Single Page Application)
- HTML генерируется в браузере через JavaScript
- Роутинг происходит без перезагрузки страницы

### Аналогия

**Yii2 контроллер** → **React компонент**

- В Yii2: `SiteController::actionIndex()` рендерит `views/site/index.php`
- В React: компонент `Home.tsx` рендерит JSX

---

## 📁 Структура проекта

```
philosophy-museum/
├── public/                    # Статические файлы (как web/ в Yii2)
│   ├── index.html            # Главный HTML (точка входа)
│   ├── favicon.ico
│   └── *.jfif, *.jpg         # Изображения
│
├── src/                      # Исходники (как protected/ в Yii2)
│   ├── index.tsx             # Главная точка входа (как index.php в Yii2)
│   ├── App.tsx               # Корневой компонент (как Layout в Yii2)
│   ├── index.css             # Глобальные стили
│   │
│   ├── components/           # Переиспользуемые компоненты (как widgets/ в Yii2)
│   │   ├── Header.tsx        # Шапка сайта
│   │   └── Footer.tsx        # Подвал сайта
│   │
│   ├── pages/                # Страницы (как views/ в Yii2)
│   │   ├── Home.tsx          # Главная страница
│   │   ├── About.tsx         # О музее
│   │   ├── News.tsx          # Список новостей
│   │   ├── NewsDetail.tsx    # Детали новости
│   │   ├── Events.tsx        # События
│   │   ├── Exhibitions.tsx   # Экспозиции
│   │   ├── Contacts.tsx      # Контакты
│   │   └── AdminPanel.tsx    # Админка
│   │
│   ├── services/             # Сервисы (как components/ в Yii2)
│   │   └── newsService.ts    # Работа с API новостей
│   │
│   ├── types/                # TypeScript типы (как models/ в Yii2)
│   │   └── news.ts           # Типы для новостей
│   │
│   ├── hooks/                # Кастомные хуки (специфика React)
│   │   └── useScrollAnimation.ts
│   │
│   └── assets/               # Ресурсы
│       └── *.jpg, *.png      # Изображения
│
├── package.json              # Зависимости (как composer.json)
├── tsconfig.json             # Конфиг TypeScript
└── webpack.config.js         # Сборщик проекта (как Gulp/Grunt)
```

---

## 🧩 Компоненты = Виджеты

### В Yii2

```php
// widgets/Header.php
class Header extends Widget {
    public function run() {
        return $this->render('header');
    }
}

// В view:
<?= Header::widget() ?>
```

### В React

```tsx
// components/Header.tsx
const Header: React.FC = () => {
  return (
    <header className="site-header">
      <nav>...</nav>
    </header>
  );
};

// В другом компоненте:
<Header />;
```

### Ключевые отличия:

1. **Компоненты React** - это функции, которые возвращают JSX (похоже на HTML)
2. **Props** (свойства) = параметры виджета в Yii2
3. **Компоненты переиспользуются** как виджеты

### Пример с параметрами:

**Yii2:**

```php
<?= Alert::widget([
    'type' => 'success',
    'message' => 'Сохранено!'
]) ?>
```

**React:**

```tsx
<Alert type="success" message="Сохранено!" />
```

---

## 🛣️ Роутинг

### В Yii2

```php
// config/web.php
'urlManager' => [
    'rules' => [
        '' => 'site/index',
        'about' => 'site/about',
        'news/<id:\d+>' => 'news/view',
    ],
],

// SiteController.php
public function actionAbout() {
    return $this->render('about');
}
```

### В React

```tsx
// App.tsx
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/about" element={<About />} />
  <Route path="/news/:id" element={<NewsDetail />} />
</Routes>
```

### Ключевые отличия:

1. **Роутинг происходит на клиенте** (без запроса к серверу)
2. **Параметры URL** доступны через хук `useParams()`
3. **Навигация** через компонент `<Link>` (не перезагружает страницу)

### Получение параметров:

**Yii2:**

```php
$id = Yii::$app->request->get('id');
```

**React:**

```tsx
const { id } = useParams<{ id: string }>();
```

---

## 🔄 Состояние и хуки

### Что такое хуки?

**Хуки** - это специальные функции React для управления состоянием и побочными эффектами.

### Аналогия с Yii2:

**Yii2:**

```php
class NewsController extends Controller {
    private $news = []; // Свойство класса

    public function actionIndex() {
        $this->news = News::find()->all(); // Получение данных
        return $this->render('index', [
            'news' => $this->news
        ]);
    }
}
```

**React:**

```tsx
const News: React.FC = () => {
  // useState = свойство компонента (переменная которая запоминается)
  const [news, setNews] = useState<NewsItem[]>([]);

  // useEffect = выполняется при монтировании (как init() в Yii2)
  useEffect(() => {
    // Получение данных (как в actionIndex)
    const fetchNews = async () => {
      const newsData = await newsService.getAllNews();
      setNews(newsData); // Обновляем состояние
    };
    fetchNews();
  }, []); // [] = выполнить только один раз при загрузке

  return (
    <div>
      {news.map((item) => (
        <NewsCard key={item.id} news={item} />
      ))}
    </div>
  );
};
```

### Основные хуки:

1. **useState** - хранение данных

   ```tsx
   const [count, setCount] = useState(0); // [значение, функция для изменения]
   setCount(count + 1); // Изменяем значение
   ```

2. **useEffect** - побочные эффекты (загрузка данных, подписки)

   ```tsx
   useEffect(() => {
     // Код выполнится после рендера
     console.log("Компонент загружен");

     return () => {
       // Cleanup - выполнится при размонтировании
       console.log("Компонент удалён");
     };
   }, [dependency]); // Перезапустится при изменении dependency
   ```

3. **useParams** - параметры из URL

   ```tsx
   const { id } = useParams(); // Как Yii::$app->request->get('id')
   ```

4. **useLocation** - текущий URL
   ```tsx
   const location = useLocation(); // location.pathname = '/about'
   ```

---

## 🌐 Работа с API

### В Yii2

```php
// Controller
public function actionIndex() {
    $news = News::find()->all();
    return $this->asJson($news);
}

// View
$.ajax({
    url: '/news/index',
    success: function(data) {
        // Обработка
    }
});
```

### В React

**1. Создаём сервис** (как ActiveRecord в Yii2)

```tsx
// services/newsService.ts
class NewsService {
  private baseUrl = "http://localhost:5000/api";

  async getAllNews(): Promise<NewsItem[]> {
    const response = await fetch(`${this.baseUrl}/news`);
    const data = await response.json();
    return data;
  }

  async getNewsById(id: number): Promise<NewsItem> {
    const response = await fetch(`${this.baseUrl}/news/${id}`);
    return response.json();
  }
}

export default new NewsService();
```

**2. Используем в компоненте**

```tsx
const News: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);

  useEffect(() => {
    const loadNews = async () => {
      const data = await newsService.getAllNews();
      setNews(data);
    };
    loadNews();
  }, []);

  return <div>{/* рендер новостей */}</div>;
};
```

### Аналогия:

- **newsService** = ActiveRecord модель (News::find()->all())
- **useState** = переменная контроллера ($this->news)
- **useEffect** = actionIndex() (получение данных)

---

## 🎨 Стили

### В Yii2

```php
// В layout:
<?php $this->registerCssFile('@web/css/site.css') ?>

// В HTML:
<div class="container">...</div>
```

### В React

```tsx
// Импорт стилей в компонент
import "./index.css";

// Использование классов
<div className="container">...</div>;
```

### Важно!

- В React используется `className` вместо `class`
- Стили можно импортировать прямо в компонент
- CSS Modules (опционально) для изоляции стилей

### Inline стили:

```tsx
// Yii2:
<div style="color: red; font-size: 14px;">

// React (объект):
<div style={{ color: 'red', fontSize: '14px' }}>
```

---

## 🔌 Подключение бэкенда

### Вариант 1: Yii2 как REST API

**1. Настройте Yii2 как API:**

```php
// config/web.php
'urlManager' => [
    'enablePrettyUrl' => true,
    'showScriptName' => false,
    'rules' => [
        ['class' => 'yii\rest\UrlRule', 'controller' => 'news'],
    ],
],

// controllers/NewsController.php
class NewsController extends \yii\rest\ActiveController {
    public $modelClass = 'app\models\News';

    public function behaviors() {
        $behaviors = parent::behaviors();
        $behaviors['corsFilter'] = [
            'class' => \yii\filters\Cors::class,
            'cors' => [
                'Origin' => ['http://localhost:3000'],
                'Access-Control-Allow-Credentials' => true,
            ],
        ];
        return $behaviors;
    }
}
```

**2. Обновите React сервис:**

```tsx
// services/newsService.ts
class NewsService {
  private baseUrl = "http://your-yii-app.com/api";

  async getAllNews(): Promise<NewsItem[]> {
    const response = await fetch(`${this.baseUrl}/news`, {
      credentials: "include", // Для cookies/сессий
    });

    if (!response.ok) {
      throw new Error("Network error");
    }

    return response.json();
  }

  async createNews(data: CreateNewsRequest): Promise<NewsItem> {
    const response = await fetch(`${this.baseUrl}/news`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // CSRF токен если нужен:
        "X-CSRF-Token": getCsrfToken(),
      },
      body: JSON.stringify(data),
      credentials: "include",
    });

    return response.json();
  }
}
```

### Вариант 2: Node.js + Express (текущий)

**Backend структура:**

```
philosophy-museum-backend/
├── src/
│   ├── index.ts              # Точка входа (как web/index.php)
│   ├── routes/
│   │   └── news.ts           # Роуты (как urlManager)
│   ├── controllers/
│   │   └── newsController.ts # Логика (как контроллеры Yii2)
│   ├── models/
│   │   └── NewsModel.ts      # Модели данных
│   └── types/
│       └── news.ts           # TypeScript типы
└── package.json
```

**Сравнение:**

| Yii2                  | Node.js + Express          |
| --------------------- | -------------------------- |
| `urlManager->rules`   | `router.get('/news', ...)` |
| `SiteController`      | `newsController.ts`        |
| `News::find()->all()` | `NewsModel.getAll()`       |
| `$model->save()`      | `NewsModel.create()`       |

---

## 🔄 Жизненный цикл компонента

### Аналогия с Yii2 контроллером:

```tsx
const MyComponent: React.FC = () => {
  // 1. КОНСТРУКТОР (вызывается первым)
  const [data, setData] = useState([]);

  // 2. INIT (выполняется после монтирования)
  useEffect(() => {
    console.log('Компонент смонтирован');
    loadData();

    // 3. CLEANUP (выполняется при размонтировании)
    return () => {
      console.log('Компонент размонтирован');
    };
  }, []);

  // 4. RENDER (вызывается при каждом изменении state)
  return <div>{data.map(...)}</div>;
};
```

**Yii2 эквивалент:**

```php
class MyController extends Controller {
    public function init() {
        parent::init();
        // useEffect(() => {...}, [])
    }

    public function actionIndex() {
        $data = News::find()->all();
        return $this->render('index', ['data' => $data]);
        // return <div>...</div>
    }
}
```

---

## 📡 CRUD операции

### В Yii2

```php
// CREATE
$model = new News();
$model->attributes = $_POST['News'];
$model->save();

// READ
$news = News::findOne($id);
$allNews = News::find()->all();

// UPDATE
$model = News::findOne($id);
$model->title = 'Новый заголовок';
$model->save();

// DELETE
News::findOne($id)->delete();
```

### В React (через сервис)

```tsx
// services/newsService.ts
class NewsService {
  // CREATE
  async createNews(data: CreateNewsRequest): Promise<NewsItem> {
    const response = await fetch(`${API_URL}/news`, {
      method: "POST",
      body: JSON.stringify(data),
    });
    return response.json();
  }

  // READ
  async getNewsById(id: number): Promise<NewsItem> {
    const response = await fetch(`${API_URL}/news/${id}`);
    return response.json();
  }

  // UPDATE
  async updateNews(id: number, data: Partial<NewsItem>) {
    const response = await fetch(`${API_URL}/news/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    return response.json();
  }

  // DELETE
  async deleteNews(id: number): Promise<void> {
    await fetch(`${API_URL}/news/${id}`, { method: "DELETE" });
  }
}

// В компоненте:
const handleCreate = async () => {
  const newNews = await newsService.createNews(formData);
  setNews([newNews, ...news]);
};
```

---

## 🎭 JSX - что это?

JSX = JavaScript + XML. Это синтаксис для написания HTML внутри JavaScript.

**Yii2:**

```php
<div class="container">
    <h1><?= Html::encode($title) ?></h1>
    <?php foreach ($items as $item): ?>
        <div><?= $item->name ?></div>
    <?php endforeach; ?>
</div>
```

**React (JSX):**

```tsx
<div className="container">
  <h1>{title}</h1>
  {items.map((item) => (
    <div key={item.id}>{item.name}</div>
  ))}
</div>
```

### Правила JSX:

1. `className` вместо `class`
2. `htmlFor` вместо `for`
3. Выражения в `{}`
4. `map()` вместо `foreach`
5. Каждый элемент в цикле должен иметь уникальный `key`

---

## 📝 Формы

### В Yii2

```php
<?php $form = ActiveForm::begin(); ?>
    <?= $form->field($model, 'title')->textInput() ?>
    <?= $form->field($model, 'content')->textarea() ?>
    <?= Html::submitButton('Сохранить') ?>
<?php ActiveForm::end(); ?>
```

### В React

```tsx
const NewsForm: React.FC = () => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await newsService.createNews(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="title" value={formData.title} onChange={handleChange} />
      <textarea
        name="content"
        value={formData.content}
        onChange={handleChange}
      />
      <button type="submit">Сохранить</button>
    </form>
  );
};
```

---

## 🔐 Аутентификация

### В Yii2

```php
if (Yii::$app->user->isGuest) {
    return $this->redirect(['site/login']);
}
```

### В React

```tsx
// Создаём контекст для auth (как User component в Yii2)
const AuthContext = React.createContext(null);

// Защищённый роут
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
};

// Использование:
<Route
  path="/admin"
  element={
    <ProtectedRoute>
      <AdminPanel />
    </ProtectedRoute>
  }
/>;
```

---

## 🚀 Запуск и разработка

### Команды (аналогия с Composer):

```bash
# Установка зависимостей (composer install)
npm install

# Запуск dev сервера (встроенный PHP сервер)
npm start
# → http://localhost:3000

# Сборка для production (как минификация assets)
npm run build
# → создаёт папку dist/ с оптимизированными файлами

# Установка новой библиотеки (composer require)
npm install react-query
```

---

## 🔗 Подключение к Yii2 Backend

### Шаг 1: Настройте CORS в Yii2

```php
// config/web.php
'components' => [
    'response' => [
        'formatters' => [
            \yii\web\Response::FORMAT_JSON => [
                'class' => 'yii\web\JsonResponseFormatter',
                'prettyPrint' => YII_DEBUG,
            ],
        ],
    ],
],

// В контроллере:
public function behaviors() {
    $behaviors = parent::behaviors();

    $behaviors['corsFilter'] = [
        'class' => \yii\filters\Cors::class,
        'cors' => [
            'Origin' => ['http://localhost:3000'],
            'Access-Control-Request-Method' => ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
            'Access-Control-Request-Headers' => ['*'],
            'Access-Control-Allow-Credentials' => true,
            'Access-Control-Max-Age' => 86400,
        ],
    ];

    return $behaviors;
}
```

### Шаг 2: Создайте REST API в Yii2

```php
// controllers/api/NewsController.php
namespace app\controllers\api;

class NewsController extends \yii\rest\ActiveController {
    public $modelClass = 'app\models\News';

    public function actions() {
        $actions = parent::actions();

        // Кастомизируйте actions если нужно
        $actions['index']['prepareDataProvider'] = [$this, 'prepareDataProvider'];

        return $actions;
    }

    public function prepareDataProvider() {
        return new ActiveDataProvider([
            'query' => News::find()->orderBy(['created_at' => SORT_DESC]),
            'pagination' => ['pageSize' => 20],
        ]);
    }
}
```

### Шаг 3: Подключите в React

```tsx
// .env файл (создайте в корне проекта)
REACT_APP_API_URL=http://your-yii-app.com/api

// services/newsService.ts
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class NewsService {
  async getAllNews(): Promise<NewsItem[]> {
    const response = await fetch(`${API_URL}/news`);

    if (!response.ok) {
      throw new Error('Failed to fetch');
    }

    const data = await response.json();
    return data;
  }
}
```

---

## 💡 Полезные паттерны

### 1. Условный рендеринг

**Yii2:**

```php
<?php if ($user->isGuest): ?>
    <a href="/login">Войти</a>
<?php else: ?>
    <span>Привет, <?= $user->name ?></span>
<?php endif; ?>
```

**React:**

```tsx
{
  user.isGuest ? <a href="/login">Войти</a> : <span>Привет, {user.name}</span>;
}
```

### 2. Списки

**Yii2:**

```php
<?php foreach ($items as $item): ?>
    <div><?= $item->title ?></div>
<?php endforeach; ?>
```

**React:**

```tsx
{
  items.map((item) => <div key={item.id}>{item.title}</div>);
}
```

### 3. События

**Yii2:**

```php
<?= Html::a('Удалить', ['delete', 'id' => $model->id], [
    'onclick' => 'return confirm("Точно?")'
]) ?>
```

**React:**

```tsx
<button
  onClick={() => {
    if (confirm("Точно?")) {
      handleDelete(item.id);
    }
  }}
>
  Удалить
</button>
```

---

## 🏗️ Как устроен этот проект

### Поток данных:

```
1. Пользователь открывает /news
   ↓
2. React Router рендерит компонент <News />
   ↓
3. useEffect вызывает newsService.getAllNews()
   ↓
4. fetch запрос к API (или моковые данные)
   ↓
5. setNews(data) обновляет state
   ↓
6. React автоматически перерендеривает компонент
   ↓
7. Отображается список новостей
```

### Сравнение с Yii2:

```
Yii2:
User → /news → NewsController::actionIndex()
     → News::find()->all() → render('index') → HTML

React:
User → /news → <News /> → useEffect
     → newsService.getAllNews() → setState → re-render
```

---

## 🛠️ TypeScript - что это?

**TypeScript** = JavaScript + типизация (как PHP с type hints)

**PHP:**

```php
public function getNews(int $id): News {
    return News::findOne($id);
}
```

**TypeScript:**

```typescript
function getNews(id: number): News {
  return newsService.getNewsById(id);
}
```

### Интерфейсы (как в Yii2):

**Yii2:**

```php
interface NewsInterface {
    public function getTitle(): string;
    public function getContent(): string;
}
```

**TypeScript:**

```typescript
interface NewsItem {
  id: number;
  title: string;
  content: string;
  date: string;
}
```

---

## 🔍 Дебаг и инструменты

### В Yii2

- **Yii Debug Panel** - просмотр запросов, SQL
- **Gii** - генерация кода

### В React

- **React DevTools** (расширение браузера) - просмотр компонентов и state
- **Console.log()** - основной инструмент дебага
- **Webpack Dev Server** - hot reload (автоперезагрузка при изменениях)

```tsx
useEffect(() => {
  console.log("State updated:", news);
}, [news]);
```

---

## 📦 Популярные библиотеки

| Задача         | Yii2           | React                   |
| -------------- | -------------- | ----------------------- |
| HTTP запросы   | Guzzle         | axios, fetch            |
| Валидация форм | ActiveForm     | Formik, react-hook-form |
| Состояние      | Session        | Redux, Zustand, Context |
| Даты           | Carbon         | date-fns, moment        |
| Таблицы        | GridView       | react-table             |
| Уведомления    | Flash messages | react-toastify          |

---

## 🎯 Быстрый старт для Yii2 разработчика

### 1. Создание нового компонента (как view):

```tsx
// pages/MyPage.tsx
import React from "react";

const MyPage: React.FC = () => {
  return (
    <div className="container">
      <h1>Моя страница</h1>
      <p>Контент</p>
    </div>
  );
};

export default MyPage;
```

### 2. Добавление в роутинг:

```tsx
// App.tsx
import MyPage from "./pages/MyPage";

<Route path="/my-page" element={<MyPage />} />;
```

### 3. Добавление ссылки:

```tsx
import { Link } from "react-router-dom";

<Link to="/my-page">Перейти</Link>;
```

---

## 🔥 Частые ошибки

### 1. Изменение state напрямую ❌

```tsx
// Неправильно (как в Yii2)
news.push(newItem);

// Правильно
setNews([...news, newItem]);
```

### 2. Забыли key в map ❌

```tsx
// Неправильно
{
  items.map((item) => <div>{item.name}</div>);
}

// Правильно
{
  items.map((item) => <div key={item.id}>{item.name}</div>);
}
```

### 3. Асинхронность в useEffect ❌

```tsx
// Неправильно
useEffect(async () => {
  await loadData();
}, []);

// Правильно
useEffect(() => {
  const load = async () => {
    await loadData();
  };
  load();
}, []);
```

---

## 📚 Дополнительные ресурсы

- **Официальная документация React:** https://react.dev/
- **React Router:** https://reactrouter.com/
- **TypeScript:** https://www.typescriptlang.org/
- **Webpack:** https://webpack.js.org/

---

## 🤝 Интеграция с Yii2 - пошаговый план

### 1. Подготовка Yii2

```bash
composer require --prefer-dist yiisoft/yii2-rest
```

```php
// config/web.php
'components' => [
    'urlManager' => [
        'enablePrettyUrl' => true,
        'showScriptName' => false,
        'rules' => [
            // API роуты
            'GET api/news' => 'api/news/index',
            'GET api/news/<id:\d+>' => 'api/news/view',
            'POST api/news' => 'api/news/create',
            'PUT api/news/<id:\d+>' => 'api/news/update',
            'DELETE api/news/<id:\d+>' => 'api/news/delete',
        ],
    ],
],
```

### 2. Создание API контроллера

```php
// controllers/api/NewsController.php
namespace app\controllers\api;

use yii\rest\Controller;
use app\models\News;

class NewsController extends Controller {
    public function behaviors() {
        $behaviors = parent::behaviors();

        // CORS для React
        $behaviors['corsFilter'] = [
            'class' => \yii\filters\Cors::class,
            'cors' => [
                'Origin' => ['http://localhost:3000'],
                'Access-Control-Allow-Credentials' => true,
            ],
        ];

        return $behaviors;
    }

    public function actionIndex() {
        $news = News::find()
            ->orderBy(['created_at' => SORT_DESC])
            ->all();

        return [
            'success' => true,
            'data' => $news,
        ];
    }

    public function actionView($id) {
        $news = News::findOne($id);

        if (!$news) {
            throw new \yii\web\NotFoundHttpException();
        }

        return [
            'success' => true,
            'data' => $news,
        ];
    }

    public function actionCreate() {
        $model = new News();
        $model->load(\Yii::$app->request->post(), '');

        if ($model->save()) {
            return [
                'success' => true,
                'data' => $model,
            ];
        }

        return [
            'success' => false,
            'errors' => $model->errors,
        ];
    }
}
```

### 3. Обновление React сервиса

```tsx
// services/newsService.ts
const API_BASE_URL = "http://your-yii-app.com/api";

class NewsService {
  async getAllNews(): Promise<NewsItem[]> {
    const response = await fetch(`${API_BASE_URL}/news`);
    const result = await response.json();

    if (result.success) {
      return result.data;
    }

    throw new Error("Failed to fetch news");
  }
}
```

---

## 🎨 Деплой проекта

### Development (разработка)

```bash
cd philosophy-museum
npm start
# → http://localhost:3000
```

### Production

**1. Соберите React:**

```bash
npm run build
# → создаёт dist/ с оптимизированными файлами
```

**2. Вариант А: Отдельные серверы**

- React (frontend) → Nginx/Apache → `dist/`
- Yii2 (backend) → Nginx/Apache → API

**3. Вариант Б: Всё через Yii2**

```php
// Скопируйте dist/ в web/react/
// config/web.php
'urlManager' => [
    'rules' => [
        'api/<controller:\w+>/<action:\w+>' => '<controller>/<action>',
        '<path:.*>' => 'site/index', // Все остальные → React
    ],
],

// SiteController::actionIndex()
public function actionIndex() {
    return $this->renderFile(Yii::getAlias('@webroot/react/index.html'));
}
```

---

## 💡 Советы для быстрого старта

1. **Думайте компонентами** - каждый блок страницы = отдельный компонент
2. **State поднимайте вверх** - данные храните в родительском компоненте
3. **Используйте TypeScript** - типы помогут избежать ошибок
4. **React DevTools** - установите расширение браузера
5. **Не бойтесь документации** - она очень хорошая

---

## 🎓 Заключение

**React** - это не так страшно, как кажется!

Основные концепции:

- **Компоненты** = виджеты в Yii2
- **Props** = параметры виджета
- **State** = переменные контроллера
- **useEffect** = init() метод
- **Services** = ActiveRecord модели
- **Routes** = urlManager rules

Главное отличие: **React работает на клиенте**, а **Yii2 на сервере**.

Но логика остаётся той же: получить данные → обработать → показать пользователю.

Удачи в освоении React! 🚀
