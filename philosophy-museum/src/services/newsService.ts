import { NewsItem, CreateNewsRequest } from '../types/news';
import discusThrower from '../assets/discus-thrower-sculpture.jpg';

class NewsService {
  private news: NewsItem[] = [
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

  private nextId = 4;

  async getAllNews(): Promise<NewsItem[]> {
    // Имитируем задержку API
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...this.news];
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

    return this.news[index];
  }

  async deleteNews(id: number): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = this.news.findIndex(item => item.id === id);
    if (index === -1) throw new Error('News not found');
    
    this.news.splice(index, 1);
  }
}

export default new NewsService();

