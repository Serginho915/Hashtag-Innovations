export interface ExpertsTranslations {
  expertsTitle: string;
  expertsDesc: string;
  searchPlaceholder: string;
  expertise: string;
  priceRange: string;
  languages: string;
  expertiseOptions: string[];
  allExpertsTitle: string;
  viewAlso: string;
  becomeExpertBanner: string;
  allOption: string;
  availableSessions: string;
  background: string;
  experienceLabel: string;
  fluentIn: string;
  expertiseLabel: string;
  industriesLabel: string;
  profileAnalytics: string;
  showAll: string;
  allText: string;
  bookNow: string;
  similarExperts: string;
  browseAll: string;
  consultationsCompleted: string;
  sessionAttendance: string;
  yearsOfExperience: string;
  dateTime: string;
  selectDateTime: string;
  bookingInfo: string;
  timeLabel: string;
  selectedTimeLabel: string;
  confirm: string;
  selectDateTimePrompt: string;
  hideText: string;
  contactDetails: string;
  contactDetailsDesc: string;
  nameLabel: string;
  emailLabel: string;
  additionalLabel: string;
  additionalPlaceholder: string;
  termsAgree: string;
  termsLink: string;
  and: string;
  privacyLink: string;
  nextBtn: string;
  confirmBtn: string;
  view?: string;
  errorRequired?: string;
  errorEmail?: string;
  errorTerms?: string;
}

export const translations: Record<string, ExpertsTranslations> = {
  en: {
    expertsTitle: 'Experts Catalog',
    expertsDesc: 'Book individual consultations, mentorship sessions or expert advice tailored to your goals.',
    searchPlaceholder: 'Search by name, company, or specialization',
    expertise: 'Expertise',
    priceRange: 'Price range',
    languages: 'Languages',
    expertiseOptions: ['Artificial Intelligence', 'Business', 'Accounting', 'Design', 'Management', 'Marketing', 'Finance', 'Development'],
    allExpertsTitle: '{count} experts in bulgaria',
    viewAlso: 'view also',
    becomeExpertBanner: 'Want to become an expert?',
    allOption: 'All',
    availableSessions: 'Available Sessions',
    background: 'Background',
    experienceLabel: 'Experience',
    fluentIn: 'Fluent In',
    expertiseLabel: 'Expertise:',
    industriesLabel: 'Industries:',
    profileAnalytics: 'Profile Analytics',
    showAll: 'show all',
    allText: 'all',
    bookNow: 'Book Now',
    similarExperts: 'Similar Experts',
    browseAll: 'Browse All',
    consultationsCompleted: 'Consultations completed',
    sessionAttendance: 'Session attendance',
    yearsOfExperience: 'Years of experience',
    dateTime: 'Date and Time /',
    selectDateTime: 'Select an available time and date',
    bookingInfo: 'Booking & cancellation available up to 48 hours before.',
    timeLabel: 'Time',
    selectedTimeLabel: 'selected time',
    confirm: 'Confirm',
    selectDateTimePrompt: 'Select date and time',
    hideText: 'hide',
    contactDetails: 'Contact Details',
    contactDetailsDesc: 'Fill in the form below to complete the session booking.',
    nameLabel: 'Name*',
    emailLabel: 'Email*',
    additionalLabel: 'Additional',
    additionalPlaceholder: 'Describe your request or problem...',
    termsAgree: 'I agree to the ',
    termsLink: 'terms of use',
    and: ' and ',
    privacyLink: 'privacy policy',
    nextBtn: 'Next',
    confirmBtn: 'Confirm'
  },
  bg: {
    expertsTitle: 'Каталог Експерти',
    expertsDesc: 'Резервирайте индивидуални консултации, менторски сесии или експертни съвети, съобразени с вашите цели.',
    searchPlaceholder: 'Търсене по име, компания или специализация',
    expertise: 'Експертиза',
    priceRange: 'Ценови диапазон',
    languages: 'Езици',
    expertiseOptions: ['Изкуствен интелект', 'Бизнес', 'Счетоводство', 'Дизайн', 'Мениджмънт', 'Маркетинг', 'Финанси', 'Разработка'],
    allExpertsTitle: '{count} експерти в българия',
    viewAlso: 'вижте също',
    becomeExpertBanner: 'Искаш да станеш експерт?',
    allOption: 'Всички',
    availableSessions: 'Достъпни сесии',
    background: 'Опит',
    experienceLabel: 'Кариера',
    fluentIn: 'Владее',
    expertiseLabel: 'Експертиза:',
    industriesLabel: 'Индустрии:',
    profileAnalytics: 'Анализ на профила',
    showAll: 'виж всички',
    allText: 'всички',
    bookNow: 'Запази',
    similarExperts: 'Подобни експерти',
    browseAll: 'Разгледай всички',
    consultationsCompleted: 'Завършени консултации',
    sessionAttendance: 'Присъствие',
    yearsOfExperience: 'Години опит',
    dateTime: 'Дата и Време /',
    selectDateTime: 'Изберете актуално време и дата',
    bookingInfo: 'Резервация & отмяна са достъпни до 48 часа преди събитието.',
    timeLabel: 'Време',
    selectedTimeLabel: 'избрано време',
    confirm: 'Потвърди',
    selectDateTimePrompt: 'Изберете дата и време',
    hideText: 'скрий',
    contactDetails: 'Данни за контакт',
    contactDetailsDesc: 'Попълнете формуляра по-долу, за да завършите резервацията.',
    nameLabel: 'Име*',
    emailLabel: 'Имейл*',
    additionalLabel: 'Допълнително',
    additionalPlaceholder: 'Опишете вашето запитване или проблем...',
    termsAgree: 'Съгласен съм с ',
    termsLink: 'условията за ползване',
    and: ' и ',
    privacyLink: 'политиката за поверителност',
    nextBtn: 'Напред',
    confirmBtn: 'Потвърди'
  },
  ru: {
    expertsTitle: 'Каталог Экспертов',
    expertsDesc: 'Бронируйте индивидуальные консультации, сессии наставничества или экспертные рекомендации, адаптированные к вашим целям.',
    searchPlaceholder: 'Поиск по имени, компании, специализации',
    expertise: 'Експертиза',
    priceRange: 'Price range',
    languages: 'Languages',
    expertiseOptions: ['Исскуственный Интелект', 'Бизнес', 'Бухгалтерия', 'Дизайн', 'Менеджмент', 'Маркетинг', 'Финансы', 'Разработка'],
    allExpertsTitle: '{count} экспертов в болгарии',
    viewAlso: 'смотрите также',
    becomeExpertBanner: 'Хочешь стать экспертом?',
    allOption: 'Все',
    availableSessions: 'доступные сессии',
    background: 'background',
    experienceLabel: 'experience',
    fluentIn: 'fluent in',
    expertiseLabel: 'EXPERTISE:',
    industriesLabel: 'Industries:',
    profileAnalytics: 'Аналитика профиля',
    showAll: 'показать все',
    allText: 'все',
    bookNow: 'Book Now',
    similarExperts: 'similar experts',
    browseAll: 'browse all',
    consultationsCompleted: 'Consultations completed',
    sessionAttendance: 'Session attendence',
    yearsOfExperience: 'Years of experience',
    dateTime: 'Дата и Время /',
    selectDateTime: 'Выберите актуальное время и дату',
    bookingInfo: 'Бронирование & отмена доступны за 48 часов до начала.',
    timeLabel: 'Время',
    selectedTimeLabel: 'выбранное время',
    confirm: 'Подтвердить',
    selectDateTimePrompt: 'Выберите дату и время',
    hideText: 'скрыть',
    contactDetails: 'Контактные Данные',
    contactDetailsDesc: 'Заполните форму ниже, чтобы завершить бронирование сессии.',
    nameLabel: 'Имя*',
    emailLabel: 'Электронная Почта*',
    additionalLabel: 'Дополнительно',
    additionalPlaceholder: 'Опишите ваш запрос или проблему...',
    termsAgree: 'Я согласен с ',
    termsLink: 'условиями использования',
    and: ' и ',
    privacyLink: 'политикой конфиденциальности',
    nextBtn: 'Далее',
    confirmBtn: 'Подтвердить'
  }
};
