import { NewsItem, CreateNewsRequest } from '../types/news';
import discusThrower from '../assets/discus-thrower-sculpture.jpg';

class NewsService {
  private readonly STORAGE_KEY = 'philosophy_museum_news';
  private news: NewsItem[];
  private nextId: number;

  constructor() {
    // Загружаем данные из localStorage или используем начальные данные
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      const data = JSON.parse(stored);
      this.news = data.news;
      this.nextId = data.nextId;
    } else {
      this.news = this.getInitialNews();
      this.nextId = 4;
      this.saveToStorage();
    }
  }

  private saveToStorage(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify({
      news: this.news,
      nextId: this.nextId
    }));
  }

  private getInitialNews(): NewsItem[] {
    return [
    {
      id: 1,
      title: "В Петербурге состоялось учредительное собрание первого в России музея философии",
      subtitle: "Круглый стол и создание инициативной группы для запуска культурного проекта города",
      content: `
        <p id="intro">8 июля 2025 года в 17:00 в музейно-выставочном центре «Петербургский художник» состоялось важное событие для культурной жизни города — круглый стол и учредительное собрание первого в России музея философии.</p>

        <h2 id="why">Почему Петербургу понадобился музей философии?</h2>
        <p>Петербург — одна из интеллектуальных столиц России. Создание устойчивой площадки, объединяющей исследователей, художников, кураторов и горожан, позволит развивать просветительские программы и выставочные проекты, посвящённые истории и практике философии.</p>

        <blockquote>Мы верим, что философия — это практика осмысления, которая делает жизнь более осознанной.</blockquote>

        <h2 id="city">Петербург как философская столица</h2>
        <p>Горожане давно привыкли к насыщенной культурной повестке. Новый музей предложит публичные лекции, дискуссии, кинопоказы и тематические выставки, а также станет координационным центром для образовательных инициатив.</p>

        <p>Следите за новостями на наших площадках — скоро мы объявим о ближайших мероприятиях и партнёрах проекта.</p>
      `,
      tableOfContents: [
        { id: 'intro', title: 'В Петербурге состоялось учредительное собрание', level: 1 },
        { id: 'why', title: 'Почему Петербургу понадобился музей философии?', level: 2 },
        { id: 'city', title: 'Петербург как философская столица', level: 2 }
      ],
      excerpt: "8 июля 2025 года в музейно-выставочном центре «Петербургский художник» состоялось важное событие для культурной жизни города — круглый стол и учредительное собрание первого в России музея философии.",
      date: "10 июля 2025",
      readTime: "3 мин чтения",
      createdAt: "2025-07-10T00:00:00Z",
      updatedAt: "2025-07-10T00:00:00Z"
    },
    {
      id: 2,
      title: "Новый экспонат в коллекции — античная скульптура дисконоса",
      subtitle: "Рассказываем о поступлении и планах по экспонированию редкого артефакта",
      content: `
        <p id="arrival">В фондах музея появился значимый экспонат — копия знаменитой древнегреческой скульптуры атлета‑дисконоса. Он будет представлен в рамках специальной экспозиции, посвящённой эстетике античности.</p>

        <h2 id="context">Исторический контекст</h2>
        <p>Образ атлета стал символом гармонии телесного и духовного. В разное время эта скульптура переосмысливалась художниками и философами, оставаясь важным ориентиром для европейской культуры.</p>

        <h2 id="plans">Планы показа</h2>
        <p>Мы готовим цикл публичных лекций и экскурсии о роли спорта и состязаний в античном мире, а также специальные занятия для школьников и студентов.</p>
      `,
      tableOfContents: [
        { id: 'arrival', title: 'Новый экспонат в коллекции', level: 1 },
        { id: 'context', title: 'Исторический контекст', level: 2 },
        { id: 'plans', title: 'Планы показа', level: 2 }
      ],
      excerpt: "В фондах музея появился значимый экспонат — копия знаменитой древнегреческой скульптуры атлета‑дисконоса.",
      date: "8 сентября 2025",
      readTime: "3 мин чтения",
      imageUrl: discusThrower,
      createdAt: "2025-09-08T00:00:00Z",
      updatedAt: "2025-09-08T00:00:00Z"
    },
    {
      id: 3,
      title: "Партнёрство с философским факультетом СПбГУ",
      content: "Полный текст новости о партнёрстве...",
      excerpt: "Музей философии заключил соглашение о сотрудничестве с философским факультетом Санкт-Петербургского государственного университета.",
      date: "25 августа 2025",
      readTime: "2 мин чтения",
      createdAt: "2025-08-25T00:00:00Z",
      updatedAt: "2025-08-25T00:00:00Z"
    }
  ];
  }

  async getAllNews(): Promise<NewsItem[]> {
    // Имитируем задержку API
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...this.news].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getLatestNews(limit: number = 3): Promise<NewsItem[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...this.news]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  }

  async getNewsById(id: number): Promise<NewsItem | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return this.news.find(item => item.id === id) || null;
  }

  async createNews(newsData: CreateNewsRequest): Promise<NewsItem> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newNews: NewsItem = {
      id: this.nextId++,
      ...newsData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    this.news.unshift(newNews);
    this.saveToStorage();
    return newNews;
  }

  async updateNews(id: number, newsData: Partial<CreateNewsRequest>): Promise<NewsItem> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = this.news.findIndex(item => item.id === id);
    if (index === -1) throw new Error('News not found');

    this.news[index] = {
      ...this.news[index],
      ...newsData,
      updatedAt: new Date().toISOString()
    };

    this.saveToStorage();
    return this.news[index];
  }

  async deleteNews(id: number): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = this.news.findIndex(item => item.id === id);
    if (index === -1) throw new Error('News not found');
    
    this.news.splice(index, 1);
    this.saveToStorage();
  }

  // Метод для обработки специального синтаксиса изображений в контенте
  processImageSyntax(content: string): string {
    // Сначала заменяем [img:IMAGE_key:caption] на реальные изображения из localStorage
    content = content.replace(
      /\[img:(IMAGE_\d+_\d+):([^\]]+)\]/g,
      (match, imageKey, caption) => {
        const imageUrl = localStorage.getItem(`news_image_${imageKey}`);
        if (imageUrl) {
          return `<figure class="article-figure"><img src="${imageUrl}" alt="${caption}" /><figcaption>${caption}</figcaption></figure>`;
        }
        return match; // Если изображения нет, оставляем как есть
      }
    );
    
    // Заменяем [img:URL:caption] на figure с подписью
    content = content.replace(
      /\[img:([^:]+):([^\]]+)\]/g,
      '<figure class="article-figure"><img src="$1" alt="$2" /><figcaption>$2</figcaption></figure>'
    );
    
    // Заменяем [img:URL] на HTML тег figure без подписи
    content = content.replace(
      /\[img:([^\]]+)\]/g,
      '<figure class="article-figure"><img src="$1" alt="Изображение статьи" /></figure>'
    );
    
    return content;
  }
}

export default new NewsService();

