export type LegalPageKey = "privacy" | "terms" | "cookies";

interface LegalSection {
  title: string;
  body?: string;
  items?: string[];
}

interface LegalDocument {
  eyebrow: string;
  title: string;
  updated: string;
  intro: string;
  sections: LegalSection[];
}

type LegalContent = Record<string, Record<LegalPageKey, LegalDocument>>;

const updatedEn = "Last updated: 9 July 2026";
const updatedBg = "Последна актуализация: 9 юли 2026 г.";

export const legalContent: LegalContent = {
  en: {
    privacy: {
      eyebrow: "Legal",
      title: "Privacy Policy",
      updated: updatedEn,
      intro:
        "This Privacy Policy explains how Hashtag Innovations processes personal data when people use the website, register for events, buy learning materials, request expert consultations, use the chatbot, or interact with the admin-protected platform features.",
      sections: [
        {
          title: "Controller and contact",
          body:
            "The website is operated under the Hashtag Innovations name. Privacy requests can be sent through the contact form or other official contact channels published on the website.",
        },
        {
          title: "Data we collect",
          items: [
            "Contact data such as name and email address submitted in event, consultation, material purchase and contact forms.",
            "Purchase and request details such as selected expert session, learning material, event ticket, price, currency, Stripe checkout session ID and payment status.",
            "Messages typed into the on-site chatbot during the current browser session.",
            "Technical data such as IP address, device/browser information, page views, referral source and interaction events collected through Google Analytics.",
            "Admin authentication data needed to protect administrator access.",
          ],
        },
        {
          title: "How we use data",
          items: [
            "To provide requested services, including expert consultations, learning materials and event registrations.",
            "To start Stripe Checkout sessions and keep a sales record in the admin panel.",
            "To respond to inquiries and operational requests.",
            "To maintain security, prevent misuse and manage administrator access.",
            "To understand website traffic and improve content, navigation and product decisions through Google Analytics.",
          ],
        },
        {
          title: "Service providers",
          body:
            "We use Stripe for payment checkout and Google Analytics / Google Tag Manager infrastructure for analytics. These providers may process data according to their own terms and privacy documentation. Hosting, email, infrastructure and maintenance providers may also process data where needed to operate the website.",
        },
        {
          title: "Legal bases",
          body:
            "Depending on the context, processing is based on contract performance, steps requested before entering into a contract, legitimate interests in operating and securing the website, legal obligations, and consent where required for non-essential analytics cookies or communications.",
        },
        {
          title: "Retention",
          body:
            "We keep personal data only as long as needed for the purpose for which it was collected, including service delivery, accounting, security, dispute handling and legal compliance. Analytics data is retained according to the configured Google Analytics retention settings.",
        },
        {
          title: "Your rights",
          body:
            "Where applicable, you may request access, correction, deletion, restriction, portability or objection to processing of your personal data. You may also withdraw consent where processing is based on consent.",
        },
        {
          title: "International transfers",
          body:
            "Some providers, including Google and Stripe, may process data outside the European Economic Area. Where required, transfers rely on appropriate safeguards such as standard contractual clauses or other lawful transfer mechanisms.",
        },
      ],
    },
    terms: {
      eyebrow: "Legal",
      title: "Terms and Conditions",
      updated: updatedEn,
      intro:
        "These Terms and Conditions govern use of the Hashtag Innovations website, content, events, learning materials, expert consultation booking flows and related digital services.",
      sections: [
        {
          title: "Use of the website",
          body:
            "You may use the website for lawful personal or business purposes. You must not interfere with the website, attempt unauthorized access, misuse forms, copy protected content outside permitted use, or submit unlawful, misleading or harmful information.",
        },
        {
          title: "Content and information",
          body:
            "Articles, event pages, expert profiles, projects and learning content are provided for general informational and educational purposes. They do not replace professional legal, financial, medical or other regulated advice.",
        },
        {
          title: "Expert consultations",
          body:
            "Consultation booking flows allow users to request paid sessions with listed experts. The exact scope, timing and delivery of a session may depend on expert availability and follow-up coordination after checkout.",
        },
        {
          title: "Events and tickets",
          body:
            "Event registration or ticket purchase confirms interest in a listed event. Event details such as date, location, speaker, agenda or format may change when operationally necessary. Users should check event details before attending.",
        },
        {
          title: "Learning materials",
          body:
            "Paid learning materials are supplied for individual use unless another written agreement says otherwise. Redistribution, resale, public sharing or unauthorized copying is not allowed.",
        },
        {
          title: "Payments",
          body:
            "Payments are processed through Stripe Checkout. The website creates a checkout session and records the sale request in the admin panel. Stripe handles card data and payment processing. Additional webhook-based payment confirmation may be added to the platform workflow.",
        },
        {
          title: "Refunds and cancellations",
          body:
            "Refunds, cancellations or rescheduling requests are reviewed case by case depending on the type of purchase, timing, expert/event availability and applicable consumer rights. Contact Hashtag Innovations through the website channels for support.",
        },
        {
          title: "Intellectual property",
          body:
            "Website design, text, images, learning materials, branding and other content belong to Hashtag Innovations or their respective rights holders. No rights are transferred except the limited right to use the website and purchased materials as intended.",
        },
        {
          title: "Liability",
          body:
            "The website is provided on an as-available basis. To the maximum extent permitted by law, Hashtag Innovations is not liable for indirect losses, lost profits, data loss, service interruptions or third-party service failures.",
        },
      ],
    },
    cookies: {
      eyebrow: "Legal",
      title: "Cookie Policy",
      updated: updatedEn,
      intro:
        "This Cookie Policy explains how the Hashtag Innovations website uses cookies and similar technologies, including necessary cookies, Google Analytics cookies and third-party cookies connected to Stripe Checkout.",
      sections: [
        {
          title: "What cookies are",
          body:
            "Cookies are small text files stored on a device by a browser. Similar technologies can include local storage, pixels, tags and scripts that help a website remember information or measure usage.",
        },
        {
          title: "Necessary cookies",
          body:
            "The admin area uses the hashtag_admin_session cookie to keep administrators signed in securely. Necessary cookies are used for security, authentication and core website operation.",
        },
        {
          title: "Analytics cookies",
          body:
            "The website uses Google Analytics with measurement ID G-SR64MPBLXQ. Google Analytics may set cookies such as _ga and _ga_* to measure visits, pages viewed, traffic sources and aggregated usage patterns. Analytics storage is disabled by default and is enabled after cookie consent is accepted.",
        },
        {
          title: "Payment-related cookies",
          body:
            "When a user continues to Stripe Checkout, Stripe may set cookies or similar technologies for payment processing, fraud prevention, security and checkout functionality.",
        },
        {
          title: "Chatbot and local interaction data",
          body:
            "The on-site chatbot stores the current conversation in browser memory while the page is open. It is not currently connected to an external AI service in this implementation.",
        },
        {
          title: "Managing cookies",
          body:
            "You can accept or decline analytics cookies through the cookie banner. You can also block, delete or restrict cookies in your browser settings. Blocking necessary cookies may prevent admin login or some website functions from working.",
        },
      ],
    },
  },
  bg: {
    privacy: {
      eyebrow: "Правна информация",
      title: "Политика за поверителност",
      updated: updatedBg,
      intro:
        "Тази Политика за поверителност обяснява как Hashtag Innovations обработва лични данни, когато посетителите използват сайта, регистрират се за събития, купуват учебни материали, заявяват експертни консултации, използват чатбота или взаимодействат с администраторски защитени функции.",
      sections: [
        {
          title: "Администратор и контакт",
          body:
            "Сайтът се управлява под името Hashtag Innovations. Заявки, свързани с лични данни, могат да се изпращат чрез контактната форма или другите официални канали за контакт, публикувани в сайта.",
        },
        {
          title: "Какви данни събираме",
          items: [
            "Данни за контакт като име и имейл, изпратени чрез форми за събития, консултации, учебни материали и контакт.",
            "Детайли за покупки и заявки като избрана експертна сесия, учебен материал, билет за събитие, цена, валута, Stripe checkout session ID и статус на плащане.",
            "Съобщения, въведени в чатбота на сайта по време на текущата браузър сесия.",
            "Технически данни като IP адрес, устройство, браузър, прегледани страници, източник на посещение и събития на взаимодействие, събирани чрез Google Analytics.",
            "Данни за администраторска автентикация, необходими за защита на достъпа до админ панела.",
          ],
        },
        {
          title: "Как използваме данните",
          items: [
            "За предоставяне на заявени услуги, включително експертни консултации, учебни материали и регистрации за събития.",
            "За създаване на Stripe Checkout сесии и запис на продажби в админ панела.",
            "За отговор на запитвания и оперативни заявки.",
            "За поддръжка на сигурността, предотвратяване на злоупотреби и управление на администраторски достъп.",
            "За разбиране на трафика и подобряване на съдържанието, навигацията и продукта чрез Google Analytics.",
          ],
        },
        {
          title: "Доставчици на услуги",
          body:
            "Използваме Stripe за платежен checkout и Google Analytics / инфраструктура на Google Tag Manager за аналитика. Тези доставчици могат да обработват данни съгласно собствените си условия и политики. Хостинг, имейл, инфраструктурни и технически доставчици също могат да обработват данни, когато това е необходимо за работата на сайта.",
        },
        {
          title: "Правни основания",
          body:
            "В зависимост от контекста обработването се основава на изпълнение на договор, стъпки преди сключване на договор, легитимен интерес за работа и защита на сайта, законови задължения и съгласие, когато се изисква за несъществени аналитични бисквитки или комуникации.",
        },
        {
          title: "Срокове за съхранение",
          body:
            "Съхраняваме лични данни само толкова дълго, колкото е необходимо за целта на събирането им, включително доставка на услуги, счетоводство, сигурност, спорове и законово съответствие. Аналитичните данни се съхраняват според настройките за съхранение в Google Analytics.",
        },
        {
          title: "Вашите права",
          body:
            "Когато е приложимо, можете да поискате достъп, корекция, изтриване, ограничаване, преносимост или възражение срещу обработването на личните ви данни. Можете също да оттеглите съгласие, когато обработването се основава на съгласие.",
        },
        {
          title: "Международни трансфери",
          body:
            "Някои доставчици, включително Google и Stripe, могат да обработват данни извън Европейското икономическо пространство. Когато е необходимо, трансферите се извършват с подходящи гаранции като стандартни договорни клаузи или други законни механизми.",
        },
      ],
    },
    terms: {
      eyebrow: "Правна информация",
      title: "Общи условия",
      updated: updatedBg,
      intro:
        "Тези Общи условия уреждат използването на сайта Hashtag Innovations, съдържанието, събитията, учебните материали, процесите за заявка на експертни консултации и свързаните дигитални услуги.",
      sections: [
        {
          title: "Използване на сайта",
          body:
            "Можете да използвате сайта за законни лични или бизнес цели. Не трябва да пречите на работата му, да опитвате неоторизиран достъп, да злоупотребявате с форми, да копирате защитено съдържание извън позволената употреба или да изпращате незаконна, подвеждаща или вредна информация.",
        },
        {
          title: "Съдържание и информация",
          body:
            "Статии, страници за събития, експертни профили, проекти и учебно съдържание се предоставят с обща информационна и образователна цел. Те не заменят професионален правен, финансов, медицински или друг регулиран съвет.",
        },
        {
          title: "Експертни консултации",
          body:
            "Процесите за заявка на консултации позволяват платени сесии с посочени експерти. Точният обхват, време и провеждане могат да зависят от наличността на експерта и последваща координация след checkout.",
        },
        {
          title: "Събития и билети",
          body:
            "Регистрация или покупка на билет потвърждава интерес към посочено събитие. Детайли като дата, локация, лектор, програма или формат могат да се променят при оперативна необходимост. Потребителите трябва да проверяват детайлите преди присъствие.",
        },
        {
          title: "Учебни материали",
          body:
            "Платените учебни материали се предоставят за индивидуална употреба, освен ако писмено не е договорено друго. Разпространение, препродажба, публично споделяне или неоторизирано копиране не са позволени.",
        },
        {
          title: "Плащания",
          body:
            "Плащанията се обработват чрез Stripe Checkout. Сайтът създава checkout сесия и записва заявката за продажба в админ панела. Stripe обработва картови данни и плащания. В платформения процес може да бъде добавено допълнително webhook потвърждение на плащането.",
        },
        {
          title: "Възстановявания и откази",
          body:
            "Заявки за възстановяване, отказ или пренасрочване се разглеждат индивидуално според типа покупка, момента на заявката, наличността на експерт/събитие и приложимите потребителски права. За съдействие се свържете с Hashtag Innovations чрез каналите в сайта.",
        },
        {
          title: "Интелектуална собственост",
          body:
            "Дизайнът, текстовете, изображенията, учебните материали, брандингът и другото съдържание принадлежат на Hashtag Innovations или съответните правоносители. Не се прехвърлят права, освен ограниченото право сайтът и закупените материали да се използват по предназначение.",
        },
        {
          title: "Отговорност",
          body:
            "Сайтът се предоставя според наличността си. В максимално позволената от закона степен Hashtag Innovations не носи отговорност за непреки загуби, пропуснати ползи, загуба на данни, прекъсвания на услугата или неизправности на услуги на трети страни.",
        },
      ],
    },
    cookies: {
      eyebrow: "Правна информация",
      title: "Политика за бисквитки",
      updated: updatedBg,
      intro:
        "Тази Политика за бисквитки обяснява как сайтът Hashtag Innovations използва бисквитки и подобни технологии, включително необходими бисквитки, Google Analytics бисквитки и бисквитки на трети страни, свързани със Stripe Checkout.",
      sections: [
        {
          title: "Какво са бисквитките",
          body:
            "Бисквитките са малки текстови файлове, които браузърът съхранява на устройство. Подобни технологии могат да включват local storage, pixels, tags и scripts, които помагат на сайта да запомня информация или да измерва употреба.",
        },
        {
          title: "Необходими бисквитки",
          body:
            "Админ зоната използва бисквитката hashtag_admin_session, за да поддържа защитен администраторски вход. Необходимите бисквитки се използват за сигурност, автентикация и основна работа на сайта.",
        },
        {
          title: "Аналитични бисквитки",
          body:
            "Сайтът използва Google Analytics с measurement ID G-SR64MPBLXQ. Google Analytics може да задава бисквитки като _ga и _ga_* за измерване на посещения, прегледани страници, източници на трафик и агрегирани модели на употреба. Analytics storage е изключен по подразбиране и се включва след приемане на съгласие за бисквитки.",
        },
        {
          title: "Бисквитки, свързани с плащания",
          body:
            "Когато потребител продължи към Stripe Checkout, Stripe може да задава бисквитки или подобни технологии за обработка на плащания, предотвратяване на измами, сигурност и checkout функционалност.",
        },
        {
          title: "Чатбот и локални данни",
          body:
            "Чатботът на сайта съхранява текущия разговор в паметта на браузъра, докато страницата е отворена. В настоящата имплементация той не е свързан с външна AI услуга.",
        },
        {
          title: "Управление на бисквитки",
          body:
            "Можете да приемете или откажете аналитични бисквитки чрез cookie banner-а. Можете също да блокирате, изтривате или ограничавате бисквитки от настройките на браузъра. Блокирането на необходими бисквитки може да попречи на админ входа или на някои функции на сайта.",
        },
      ],
    },
  },
};

export const getLegalDocument = (lang: string, key: LegalPageKey) => {
  const language = legalContent[lang] ? lang : "en";
  return legalContent[language][key];
};
