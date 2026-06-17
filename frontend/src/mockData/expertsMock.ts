const getDynamicDates = () => {
  const dates = [];
  const today = new Date();
  for (let i = 1; i <= 6; i++) {
    if (i === 4) continue; // Skip one day to simulate unavailability
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    dates.push(d.toISOString().split('T')[0]);
  }
  return dates;
};

const mockDates = getDynamicDates();

const getDynamicTimes = (dates: string[]) => {
  const timeOptions = [
    ['10:00', '11:00', '13:00'],
    ['14:00', '15:00', '16:00'],
    ['09:00', '10:00'],
    ['12:00', '14:00', '17:00'],
    ['16:00', '18:00', '19:00'],
  ];
  const timesRecord: Record<string, string[]> = {};
  dates.forEach((date, index) => {
    timesRecord[date] = timeOptions[index % timeOptions.length];
  });
  return timesRecord;
};

const mockTimes = getDynamicTimes(mockDates);

export const MOCK_EXPERTS_EN = [
  {
    id: 'expert-1',
    availableDates: mockDates,
    availableTimes: mockTimes,
    name: 'David Kim',
    role: 'Senior Product Manager at',
    company: 'Meta',
    imageUrl: '/images/avatars/avatar_1.png',
    quote: '“Helping startups build scalable digital products through data-driven product strategy and cross-functional leadership.”',
    availableFor: ['Consultation', 'Mentorship'],
    expertise: ['AI', 'Business Strategy', 'Product Ownership', 'Growth Strategy', 'Startups'],
    industries: ['FinTech', 'Healthcare'],
    price: 150,
    languages: ['Bulgarian', 'English', 'Mandarin'],
    bio: [
      'Креативный директор, дизайнер и бывший преподаватель дизайна с опытом работы более 14 лет в стартапах и компаниях из списка Fortune 100 по всему миру. В настоящее время в основном работаю над социальными и экологическими проектами, так как считаю, что дизайн должен служить во благо.',
      'Готов помочь каждому практически с любым вопросом, независимо от вашего опыта и бэкграунда. Время бронирования — час, но вы можете использовать его полностью или частично по необходимости. Если встреча была полезной, пожалуйста, оставьте отзыв — это поможет охватить больше людей 😄',
      '⚠️ В связи с большим количеством неявок в последнее время: проявляйте элементарное уважение ко времени. Если не можете прийти, просто сообщите за несколько часов. Если не появитесь или отмените в последний момент без уважительной причины, я не буду принимать новые бронирования.'
    ],
    sessions: [
      {
        id: 'session-1',
        title: 'Консультация',
        subtitle: '60-минутная онлайн-сессия',
        description: 'Формат консультации вопрос-ответ. Разбираем вашу проблему.',
        price: 80
      },
      {
        id: 'session-2',
        title: 'Анализ проекта',
        subtitle: '90-минутный разбор вашей идеи',
        description: 'Подробный аудит с советами по улучшению и оптимизации.',
        price: 150
      },
      {
        id: 'session-3',
        title: 'Менторство',
        subtitle: '4 встречи на месяц',
        description: 'Практические занятия с разбором кейсов и ответами на вопросы.',
        price: 200
      }
    ],
    experienceList: [
      {
        id: 'exp-1',
        role: 'Senior Design Lead',
        company: 'Apple inc.',
        period: 'JAN 2023-PRESENT'
      }
    ],
    analytics: {
      consultations: '200+',
      attendance: '100%',
      experienceYears: '10+'
    }
  },
  {
    id: 'expert-2',
    availableDates: mockDates,
    availableTimes: mockTimes,
    name: 'Elena Rostova',
    role: 'Head of Engineering at',
    company: 'Spotify',
    imageUrl: '/images/avatars/avatar_2.png',
    quote: '“Passionate about building resilient systems and inclusive engineering cultures.”',
    availableFor: ['Consultation', 'Code Review'],
    expertise: ['Development'],
    price: 200,
    languages: ['English', 'Български'],
    industries: ['Tech', 'Design'],
    bio: [
      'Креативный директор, дизайнер и бывший преподаватель дизайна с опытом работы более 14 лет в стартапах и компаниях из списка Fortune 100 по всему миру. В настоящее время в основном работаю над социальными и экологическими проектами, так как считаю, что дизайн должен служить во благо.',
      'Готов помочь каждому практически с любым вопросом, независимо от вашего опыта и бэкграунда. Время бронирования — час, но вы можете использовать его полностью или частично по необходимости. Если встреча была полезной, пожалуйста, оставьте отзыв — это поможет охватить больше людей 😄',
      '⚠️ В связи с большим количеством неявок в последнее время: проявляйте элементарное уважение ко времени. Если не можете прийти, просто сообщите за несколько часов. Если не появитесь или отмените в последний момент без уважительной причины, я не буду принимать новые бронирования.'
    ],
    sessions: [
      {
        id: 'session-1',
        title: 'Консультация',
        subtitle: '60-минутная онлайн-сессия',
        description: 'Формат консультации вопрос-ответ. Разбираем вашу проблему.',
        price: 80
      },
      {
        id: 'session-2',
        title: 'Анализ проекта',
        subtitle: '90-минутный разбор вашей идеи',
        description: 'Подробный аудит с советами по улучшению и оптимизации.',
        price: 150
      },
      {
        id: 'session-3',
        title: 'Менторство',
        subtitle: '4 встречи на месяц',
        description: 'Практические занятия с разбором кейсов и ответами на вопросы.',
        price: 200
      }
    ],
    experienceList: [
      {
        id: 'exp-1',
        role: 'Senior Design Lead',
        company: 'Apple inc.',
        period: 'JAN 2023-PRESENT'
      }
    ],
    analytics: {
      consultations: '150+',
      attendance: '98%',
      experienceYears: '8+'
    }
  },
  {
    id: 'expert-3',
    availableDates: mockDates,
    availableTimes: mockTimes,
    name: 'Michael Chen',
    role: 'UX Design Lead at',
    company: 'Airbnb',
    imageUrl: '/images/avatars/avatar_3.png',
    quote: '“Creating intuitive experiences bridging the gap between users and business goals.”',
    availableFor: ['Consultation', 'Portfolio Review'],
    expertise: ['Design'],
    price: 100,
    languages: ['English'],
    industries: ['Tech', 'Design'],
    bio: [
      'Креативный директор, дизайнер и бывший преподаватель дизайна с опытом работы более 14 лет в стартапах и компаниях из списка Fortune 100 по всему миру. В настоящее время в основном работаю над социальными и экологическими проектами, так как считаю, что дизайн должен служить во благо.',
      'Готов помочь каждому практически с любым вопросом, независимо от вашего опыта и бэкграунда. Время бронирования — час, но вы можете использовать его полностью или частично по необходимости. Если встреча была полезной, пожалуйста, оставьте отзыв — это поможет охватить больше людей 😄',
      '⚠️ В связи с большим количеством неявок в последнее время: проявляйте элементарное уважение ко времени. Если не можете прийти, просто сообщите за несколько часов. Если не появитесь или отмените в последний момент без уважительной причины, я не буду принимать новые бронирования.'
    ],
    sessions: [
      {
        id: 'session-1',
        title: 'Консультация',
        subtitle: '60-минутная онлайн-сессия',
        description: 'Формат консультации вопрос-ответ. Разбираем вашу проблему.',
        price: 80
      },
      {
        id: 'session-2',
        title: 'Анализ проекта',
        subtitle: '90-минутный разбор вашей идеи',
        description: 'Подробный аудит с советами по улучшению и оптимизации.',
        price: 150
      },
      {
        id: 'session-3',
        title: 'Менторство',
        subtitle: '4 встречи на месяц',
        description: 'Практические занятия с разбором кейсов и ответами на вопросы.',
        price: 200
      }
    ],
    experienceList: [
      {
        id: 'exp-1',
        role: 'Senior Design Lead',
        company: 'Apple inc.',
        period: 'JAN 2023-PRESENT'
      }
    ],
    analytics: {
      consultations: '300+',
      attendance: '99%',
      experienceYears: '15+'
    }
  },
  {
    id: 'expert-4',
    availableDates: mockDates,
    availableTimes: mockTimes,
    name: 'Andrey Nikolov',
    role: 'Founder & CEO at',
    company: 'Hashtag Innovations',
    imageUrl: '/images/avatars/avatar_1.png',
    quote: '“Building the future of tech communities and fostering continuous innovation.”',
    availableFor: ['Mentorship', 'Strategy'],
    expertise: ['Business', 'Management'],
    industries: ['Community', 'EdTech'],
    price: 250,
    languages: ['English', 'Български', 'Русский'],
    bio: [
      'Креативный директор, дизайнер и бывший преподаватель дизайна с опытом работы более 14 лет в стартапах и компаниях из списка Fortune 100 по всему миру. В настоящее время в основном работаю над социальными и экологическими проектами, так как считаю, что дизайн должен служить во благо.',
      'Готов помочь каждому практически с любым вопросом, независимо от вашего опыта и бэкграунда. Время бронирования — час, но вы можете использовать его полностью или частично по необходимости. Если встреча была полезной, пожалуйста, оставьте отзыв — это поможет охватить больше людей 😄',
      '⚠️ В связи с большим количеством неявок в последнее время: проявляйте элементарное уважение ко времени. Если не можете прийти, просто сообщите за несколько часов. Если не появитесь или отмените в последний момент без уважительной причины, я не буду принимать новые бронирования.'
    ],
    sessions: [
      {
        id: 'session-1',
        title: 'Консультация',
        subtitle: '60-минутная онлайн-сессия',
        description: 'Формат консультации вопрос-ответ. Разбираем вашу проблему.',
        price: 80
      },
      {
        id: 'session-2',
        title: 'Анализ проекта',
        subtitle: '90-минутный разбор вашей идеи',
        description: 'Подробный аудит с советами по улучшению и оптимизации.',
        price: 150
      },
      {
        id: 'session-3',
        title: 'Менторство',
        subtitle: '4 встречи на месяц',
        description: 'Практические занятия с разбором кейсов и ответами на вопросы.',
        price: 200
      }
    ],
    experienceList: [
      {
        id: 'exp-1',
        role: 'Senior Design Lead',
        company: 'Apple inc.',
        period: 'JAN 2023-PRESENT'
      },
      {
        id: 'exp-2',
        role: 'Lead UX/UI Designer',
        company: 'Google',
        period: 'MAR 2019-DEC 2022'
      },
      {
        id: 'exp-3',
        role: 'Senior Graphic Designer',
        company: 'Adobe Systems',
        period: 'AUG 2015-FEB 2019'
      }
    ],
    analytics: {
      consultations: '50+',
      attendance: '100%',
      experienceYears: '5+'
    }
  },
  {
    id: 'expert-5',
    availableDates: mockDates,
    availableTimes: mockTimes,
    name: 'Sarah Jenkins',
    role: 'Principal Data Scientist at',
    company: 'Netflix',
    imageUrl: '/images/avatars/avatar_2.png',
    quote: '“Turning complex data into actionable insights for personalized user journeys.”',
    availableFor: ['Consultation', 'Data Strategy'],
    expertise: ['Artificial Intelligence', 'Development'],
    price: 300,
    languages: ['English', 'Українська']
  }
];

export const MOCK_EXPERTS_BG = [
  {
    id: 'expert-1',
    availableDates: mockDates,
    availableTimes: mockTimes,
    name: 'Дейвид Ким',
    role: 'Старши продуктов мениджър в',
    company: 'Meta',
    imageUrl: '/images/avatars/avatar_1.png',
    quote: '„Помагам на стартъпи да изграждат мащабируеми дигитални продукти чрез стратегии, базирани на данни.“',
    availableFor: ['Консултация', 'Менторство'],
    expertise: ['Изкуствен интелект', 'Бизнес Стратегия', 'Продуктов Мениджмънт', 'Стратегия за Растеж', 'Стартъпи'],
    industries: ['FinTech', 'Healthcare'],
    price: 150,
    languages: ['Bulgarian', 'English', 'Mandarin'],
    bio: [
      'Креативный директор, дизайнер и бывший преподаватель дизайна с опытом работы более 14 лет в стартапах и компаниях из списка Fortune 100 по всему миру. В настоящее время в основном работаю над социальными и экологическими проектами, так как считаю, что дизайн должен служить во благо.',
      'Готов помочь каждому практически с любым вопросом, независимо от вашего опыта и бэкграунда. Время бронирования — час, но вы можете использовать его полностью или частично по необходимости. Если встреча была полезной, пожалуйста, оставьте отзыв — это поможет охватить больше людей 😄',
      '⚠️ В связи с большим количеством неявок в последнее время: проявляйте элементарное уважение ко времени. Если не можете прийти, просто сообщите за несколько часов. Если не появитесь или отмените в последний момент без уважительной причины, я не буду принимать новые бронирования.'
    ],
    sessions: [
      {
        id: 'session-1',
        title: 'Консультация',
        subtitle: '60-минутная онлайн-сессия',
        description: 'Формат консультации вопрос-ответ. Разбираем вашу проблему.',
        price: 80
      },
      {
        id: 'session-2',
        title: 'Анализ проекта',
        subtitle: '90-минутный разбор вашей идеи',
        description: 'Подробный аудит с советами по улучшению и оптимизации.',
        price: 150
      },
      {
        id: 'session-3',
        title: 'Менторство',
        subtitle: '4 встречи на месяц',
        description: 'Практические занятия с разбором кейсов и ответами на вопросы.',
        price: 200
      }
    ],
    experienceList: [
      {
        id: 'exp-1',
        role: 'Senior Design Lead',
        company: 'Apple inc.',
        period: 'JAN 2023-PRESENT'
      }
    ],
    analytics: {
      consultations: '200+',
      attendance: '100%',
      experienceYears: '10+'
    }
  },
  {
    id: 'expert-2',
    availableDates: mockDates,
    availableTimes: mockTimes,
    name: 'Елена Ростова',
    role: 'Ръководител инженеринг в',
    company: 'Spotify',
    imageUrl: '/images/avatars/avatar_2.png',
    quote: '„Страстно отдадена на изграждането на устойчиви системи и приобщаваща инженерна култура.“',
    availableFor: ['Консултация', 'Ревю на код'],
    expertise: ['Разработка'],
    price: 200,
    languages: ['English', 'Български'],
    industries: ['Tech', 'Design'],
    bio: [
      'Креативный директор, дизайнер и бывший преподаватель дизайна с опытом работы более 14 лет в стартапах и компаниях из списка Fortune 100 по всему миру. В настоящее время в основном работаю над социальными и экологическими проектами, так как считаю, что дизайн должен служить во благо.',
      'Готов помочь каждому практически с любым вопросом, независимо от вашего опыта и бэкграунда. Время бронирования — час, но вы можете использовать его полностью или частично по необходимости. Если встреча была полезной, пожалуйста, оставьте отзыв — это поможет охватить больше людей 😄',
      '⚠️ В связи с большим количеством неявок в последнее время: проявляйте элементарное уважение ко времени. Если не можете прийти, просто сообщите за несколько часов. Если не появитесь или отмените в последний момент без уважительной причины, я не буду принимать новые бронирования.'
    ],
    sessions: [
      {
        id: 'session-1',
        title: 'Консультация',
        subtitle: '60-минутная онлайн-сессия',
        description: 'Формат консультации вопрос-ответ. Разбираем вашу проблему.',
        price: 80
      },
      {
        id: 'session-2',
        title: 'Анализ проекта',
        subtitle: '90-минутный разбор вашей идеи',
        description: 'Подробный аудит с советами по улучшению и оптимизации.',
        price: 150
      },
      {
        id: 'session-3',
        title: 'Менторство',
        subtitle: '4 встречи на месяц',
        description: 'Практические занятия с разбором кейсов и ответами на вопросы.',
        price: 200
      }
    ],
    experienceList: [
      {
        id: 'exp-1',
        role: 'Senior Design Lead',
        company: 'Apple inc.',
        period: 'JAN 2023-PRESENT'
      }
    ],
    analytics: {
      consultations: '150+',
      attendance: '98%',
      experienceYears: '8+'
    }
  },
  {
    id: 'expert-3',
    availableDates: mockDates,
    availableTimes: mockTimes,
    name: 'Майкъл Чен',
    role: 'Водещ UX дизайнер в',
    company: 'Airbnb',
    imageUrl: '/images/avatars/avatar_3.png',
    quote: '„Създавам интуитивни преживявания, които свързват нуждите на потребителите с бизнес целите.“',
    availableFor: ['Консултация', 'Ревю на портфолио'],
    expertise: ['Дизайн'],
    price: 100,
    languages: ['English'],
    industries: ['Tech', 'Design'],
    bio: [
      'Креативный директор, дизайнер и бывший преподаватель дизайна с опытом работы более 14 лет в стартапах и компаниях из списка Fortune 100 по всему миру. В настоящее время в основном работаю над социальными и экологическими проектами, так как считаю, что дизайн должен служить во благо.',
      'Готов помочь каждому практически с любым вопросом, независимо от вашего опыта и бэкграунда. Время бронирования — час, но вы можете использовать его полностью или частично по необходимости. Если встреча была полезной, пожалуйста, оставьте отзыв — это поможет охватить больше людей 😄',
      '⚠️ В связи с большим количеством неявок в последнее время: проявляйте элементарное уважение ко времени. Если не можете прийти, просто сообщите за несколько часов. Если не появитесь или отмените в последний момент без уважительной причины, я не буду принимать новые бронирования.'
    ],
    sessions: [
      {
        id: 'session-1',
        title: 'Консультация',
        subtitle: '60-минутная онлайн-сессия',
        description: 'Формат консультации вопрос-ответ. Разбираем вашу проблему.',
        price: 80
      },
      {
        id: 'session-2',
        title: 'Анализ проекта',
        subtitle: '90-минутный разбор вашей идеи',
        description: 'Подробный аудит с советами по улучшению и оптимизации.',
        price: 150
      },
      {
        id: 'session-3',
        title: 'Менторство',
        subtitle: '4 встречи на месяц',
        description: 'Практические занятия с разбором кейсов и ответами на вопросы.',
        price: 200
      }
    ],
    experienceList: [
      {
        id: 'exp-1',
        role: 'Senior Design Lead',
        company: 'Apple inc.',
        period: 'JAN 2023-PRESENT'
      }
    ],
    analytics: {
      consultations: '300+',
      attendance: '99%',
      experienceYears: '15+'
    }
  },
  {
    id: 'expert-4',
    availableDates: mockDates,
    availableTimes: mockTimes,
    name: 'Андрей Николов',
    role: 'Основател и изпълнителен директор в',
    company: 'Hashtag Innovations',
    imageUrl: '/images/avatars/avatar_1.png',
    quote: '„Изграждам бъдещето на технологичните общности и насърчавам непрекъснатите иновации.“',
    availableFor: ['Менторство', 'Стратегия'],
    expertise: ['Бизнес', 'Мениджмънт'],
    industries: ['Общности', 'EdTech'],
    price: 250,
    languages: ['English', 'Български', 'Русский'],
    bio: [
      'Креативный директор, дизайнер и бывший преподаватель дизайна с опытом работы более 14 лет в стартапах и компаниях из списка Fortune 100 по всему миру. В настоящее время в основном работаю над социальными и экологическими проектами, так как считаю, что дизайн должен служить во благо.',
      'Готов помочь каждому практически с любым вопросом, независимо от вашего опыта и бэкграунда. Время бронирования — час, но вы можете использовать его полностью или частично по необходимости. Если встреча была полезной, пожалуйста, оставьте отзыв — это поможет охватить больше людей 😄',
      '⚠️ В связи с большим количеством неявок в последнее время: проявляйте элементарное уважение ко времени. Если не можете прийти, просто сообщите за несколько часов. Если не появитесь или отмените в последний момент без уважительной причины, я не буду принимать новые бронирования.'
    ],
    sessions: [
      {
        id: 'session-1',
        title: 'Консультация',
        subtitle: '60-минутная онлайн-сессия',
        description: 'Формат консультации вопрос-ответ. Разбираем вашу проблему.',
        price: 80
      },
      {
        id: 'session-2',
        title: 'Анализ проекта',
        subtitle: '90-минутный разбор вашей идеи',
        description: 'Подробный аудит с советами по улучшению и оптимизации.',
        price: 150
      },
      {
        id: 'session-3',
        title: 'Менторство',
        subtitle: '4 встречи на месяц',
        description: 'Практические занятия с разбором кейсов и ответами на вопросы.',
        price: 200
      }
    ],
    experienceList: [
      {
        id: 'exp-1',
        role: 'Senior Design Lead',
        company: 'Apple inc.',
        period: 'JAN 2023-PRESENT'
      },
      {
        id: 'exp-2',
        role: 'Lead UX/UI Designer',
        company: 'Google',
        period: 'MAR 2019-DEC 2022'
      },
      {
        id: 'exp-3',
        role: 'Senior Graphic Designer',
        company: 'Adobe Systems',
        period: 'AUG 2015-FEB 2019'
      }
    ],
    analytics: {
      consultations: '50+',
      attendance: '100%',
      experienceYears: '5+'
    }
  },
  {
    id: 'expert-5',
    availableDates: mockDates,
    availableTimes: mockTimes,
    name: 'Сара Дженкинс',
    role: 'Главен Data Scientist в',
    company: 'Netflix',
    imageUrl: '/images/avatars/avatar_2.png',
    quote: '„Превръщам сложните данни в приложими стратегии за персонализирани потребителски преживявания.“',
    availableFor: ['Консултация', 'Стратегия за данни'],
    expertise: ['Изкуствен интелект', 'Разработка'],
    price: 300,
    languages: ['English', 'Українська']
  }
];
