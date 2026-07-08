import { CommunityEvent } from '../Types/community.ts';

export const MOCK_EVENTS: CommunityEvent[] = [
  {
    id: "evt-1",
    title: "Business Innovation Summit 2026",
    titleBg: "Среща на върха за бизнес иновации 2026",
    speaker: { id: "spk-1", name: "Andrey Nikolov", nameBg: "Андрей Николов", expertId: "expert-4", avatarSrc: "/images/avatars/avatar_1.png", role: "Founder & CEO at Hashtag Innovations", roleBg: "Основател и изпълнителен директор в Hashtag Innovations" },
    description: "Connect with 500+ industry trailblazers at the Business Innovation Summit 2026. Explore AI, navigate digital transformation, and unlock strategic growth opportunities. Elevate your expertise and expand your network.",
    descriptionBg: "Свържете се с 500+ лидери в индустрията на Business Innovation Summit 2026. Изследвайте ИИ, навигирайте дигиталната трансформация и отключете възможности за стратегически растеж.",
    date: "2026-08-20T10:00:00Z",
    displayDate: "Thu, 20 Aug",
    displayDateBg: "Четв, 20 Авг",
    location: "LIVE, Sofia",
    locationBg: "НА ЖИВО, София",
    imageSrc: "/images/community/summit_event.png",
    tags: ["recommended", "business", "on_site"],
    price: "€80",
    startTime: "11:00",
    detailDescription: "We invite you to an upcoming business event where leading experts and entrepreneurs will gather to exchange experience and discuss current trends. The program includes inspiring talks, practical workshops, and networking opportunities. It is a strong opportunity to expand your knowledge, find new partners, and gain valuable insights for developing your business.",
    detailDescriptionBg: "Каним ви на предстоящо бизнес събитие, където водещи експерти и предприемачи ще се съберат, за да обменят опит и да обсъдят актуални тенденции. Програмата включва вдъхновяващи лекции, практически работилници и възможности за нетуъркинг. Това е отлична възможност да разширите знанията си, да намерите нови партньори и да получите ценни идеи за развитието на вашия бизнес.",
    speakers: [
      {
        id: "spk-1",
        name: "Andrey Nikolov",
        nameBg: "Андрей Николов",
        role: "Founder & CEO at Hashtag Innovations",
        roleBg: "Основател и изпълнителен директор в Hashtag Innovations",
        avatarSrc: "/images/avatars/avatar_1.png",
        expertId: "expert-4"
      },
      {
        id: "spk-2",
        name: "David Kim",
        nameBg: "Дейвид Ким",
        role: "Senior Product Manager at Meta",
        roleBg: "Старши продуктов мениджър в Meta",
        avatarSrc: "/images/avatars/avatar_1.png",
        expertId: "expert-1"
      },
      {
        id: "spk-3",
        name: "Sarah Jenkins",
        nameBg: "Сара Дженкинс",
        role: "Principal Data Scientist at Netflix",
        roleBg: "Главен Data Scientist в Netflix",
        avatarSrc: "/images/avatars/avatar_2.png",
        expertId: "expert-5"
      },
      {
        id: "spk-4",
        name: "Michael Chen",
        nameBg: "Майкъл Чен",
        role: "UX Design Lead at Airbnb",
        roleBg: "Водещ UX дизайнер в Airbnb",
        avatarSrc: "/images/avatars/avatar_3.png",
        expertId: "expert-3"
      }
    ],
    organizers: [
      { id: "org-1", name: "Hashtag Innovations", logoSrc: "/images/Logo.svg" }
    ],
    partners: [
      { id: "partner-1", name: "itStep", logoSrc: "https://placehold.co/120x40/000000/FFFFFF?text=itStep" },
      { id: "partner-2", name: "Miray group", logoSrc: "https://placehold.co/120x40/000000/FFFFFF?text=Miray" }
    ],
  },
  {
    id: "evt-2",
    title: "Future of Finance Forum",
    titleBg: "Форум Бъдещето на Финансите",
    speaker: { id: "spk-2", name: "Sarah Jenkins", nameBg: "Сара Дженкинс", expertId: "expert-5", avatarSrc: "/images/avatars/avatar_2.png", role: "Principal Data Scientist at Netflix", roleBg: "Главен Data Scientist в Netflix" },
    description: "Discover the latest trends in fintech, decentralized finance, and banking innovations. Join top executives and visionaries to discuss what the next decade holds for the financial sector.",
    descriptionBg: "Открийте най-новите тенденции във финтех, децентрализираните финанси и банковите иновации. Присъединете се към топ ръководители.",
    date: "2026-08-23T09:00:00Z",
    displayDate: "Sun, 23 Aug",
    displayDateBg: "Нед, 23 Авг",
    location: "ONLINE",
    locationBg: "ОНЛАЙН",
    imageSrc: "/images/community/finance_event.png",
    tags: ["recommended", "business", "online"]
  },
  {
    id: "evt-3",
    title: "Tech Leadership Workshop",
    titleBg: "Работилница за Технологично Лидерство",
    speaker: { id: "spk-3", name: "Michael Chen", nameBg: "Майкъл Чен", expertId: "expert-3", avatarSrc: "/images/avatars/avatar_3.png", role: "UX Design Lead at Airbnb", roleBg: "Водещ UX дизайнер в Airbnb" },
    description: "An intensive half-day workshop for emerging tech leaders. Learn how to build resilient teams, manage technical debt, and drive innovation within your organization.",
    descriptionBg: "Интензивна полудневна работилница за нововъзникващи технологични лидери. Научете как да изграждате устойчиви екипи.",
    date: "2026-08-25T14:00:00Z",
    displayDate: "Tue, 25 Aug",
    displayDateBg: "Втор, 25 Авг",
    location: "LIVE, Sofia",
    locationBg: "НА ЖИВО, София",
    imageSrc: "/images/community/tech_event.png",
    tags: ["recommended", "top_speakers", "on_site"],
    price: "€15"
  },
  {
    id: "evt-4",
    title: "Past AI Conference",
    titleBg: "Минала ИИ Конференция",
    speaker: { id: "spk-4", name: "Elena Rostova", nameBg: "Елена Ростова", expertId: "expert-2", avatarSrc: "/images/avatars/avatar_2.png", role: "Head of Engineering at Spotify", roleBg: "Ръководител инженеринг в Spotify" },
    description: "This is a past event and should not be displayed in the list of upcoming events. However, we are adding more text here so that it perfectly matches the three lines requirement for the layout. Ensure this is long enough.",
    descriptionBg: "Това е минало събитие и не трябва да се показва в списъка с предстоящи събития. Въпреки това добавяме още текст тук, за да съвпадне перфектно с изискването за три реда в дизайна. Уверете се, че е достатъчно дълго.",
    date: "2023-01-01T10:00:00Z",
    displayDate: "Mon, 1 Jan",
    displayDateBg: "Пон, 1 Яну",
    location: "ONLINE",
    locationBg: "ОНЛАЙН",
    imageSrc: "/images/community/ai_event.png",
    tags: ["recommended", "ai", "online"]
  },
  {
    id: "evt-5",
    title: "Startup Pitch Night",
    titleBg: "Вечер на Стартиращите Компании",
    speaker: { id: "spk-5", name: "Michael Chang", nameBg: "Майкъл Чанг", role: "Startup Investor", roleBg: "Инвеститор" },
    description: "Watch early-stage startups pitch their innovative ideas to top venture capitalists. Network with founders, investors, and industry experts. Find out who will secure the next big funding round.",
    descriptionBg: "Гледайте как стартиращи компании в ранен етап представят своите иновативни идеи пред топ рискови капиталисти. Създайте контакти с основатели, инвеститори и експерти от индустрията. Разберете кой ще осигури следващия голям кръг на финансиране.",
    date: "2026-09-10T18:00:00Z",
    displayDate: "Thu, 10 Sep",
    displayDateBg: "Четв, 10 Сеп",
    location: "LIVE, London",
    locationBg: "НА ЖИВО, Лондон",
    imageSrc: "/images/community/summit.png",
    tags: ["business", "on_site"],
    price: "€10"
  },
  {
    id: "evt-6",
    title: "Web3 & Blockchain Summit",
    titleBg: "Среща на върха Web3 и Блокчейн",
    speaker: { id: "spk-6", name: "Sophia Martinez", nameBg: "София Мартинес", role: "Blockchain Architect", roleBg: "Блокчейн Архитект" },
    description: "Explore the future of decentralized internet and blockchain applications with industry leaders. Learn about smart contracts, digital assets, and the transition to a more open, transparent web infrastructure.",
    descriptionBg: "Изследвайте бъдещето на децентрализирания интернет и блокчейн приложенията с лидери в индустрията. Научете за смарт договори, дигитални активи и прехода към по-отворена и прозрачна уеб инфраструктура.",
    date: "2026-09-15T10:00:00Z",
    displayDate: "Tue, 15 Sep",
    displayDateBg: "Втор, 15 Сеп",
    location: "ONLINE",
    locationBg: "ОНЛАЙН",
    imageSrc: "/images/community/ai_event.png",
    tags: ["business", "online"]
  },
  {
    id: "evt-7",
    title: "Design Systems Masterclass",
    titleBg: "Майсторски Клас по Дизайн Системи",
    speaker: { id: "spk-7", name: "Alex Rivera", nameBg: "Алекс Ривера", role: "Design Systems Engineer", roleBg: "Инженер на дизайн системи" },
    description: "A deep dive into creating scalable and maintainable design systems for enterprise applications. Discover the best practices for building component libraries, managing design tokens, and aligning design with development.",
    descriptionBg: "Дълбоко гмуркане в създаването на мащабируеми и лесни за поддръжка дизайн системи за корпоративни приложения. Открийте най-добрите практики за изграждане на библиотеки с компоненти, управление на дизайн токени и съгласуване на дизайна с разработката.",
    date: "2026-09-20T14:00:00Z",
    displayDate: "Sun, 20 Sep",
    displayDateBg: "Нед, 20 Сеп",
    location: "LIVE, Berlin",
    locationBg: "НА ЖИВО, Берлин",
    imageSrc: "/images/community/summit.png",
    tags: ["business", "on_site"],
    price: "€49"
  }
];
