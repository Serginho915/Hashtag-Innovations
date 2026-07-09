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
        "This Privacy Policy explains how Hashtag Innovations processes personal data when people use the website, register for events, buy learning materials, request expert consultations, use the chatbot, or access administrator-protected features.",
      sections: [
        {
          title: "Controller and contact",
          body:
            "The website is operated under the Hashtag Innovations name. Privacy requests can be sent through the contact form or other official contact channels published on the website. If a separate legal entity, registered address or dedicated privacy email is published later, those details should be treated as the controller contact details.",
        },
        {
          title: "Data we collect",
          items: [
            "Contact data such as name, email address and message content submitted in event, consultation, learning material, chatbot and contact forms.",
            "Purchase and request details such as selected expert session, learning material, event ticket, price, currency, Stripe checkout session ID and payment status.",
            "Chatbot conversation content, conversation identifiers, timestamps and assistant replies, which may be visible to authorized administrators for support and quality control.",
            "Technical and analytics data such as device/browser information, page views, referral source and interaction events when optional analytics are enabled.",
            "Admin authentication data needed to protect administrator access.",
          ],
        },
        {
          title: "How we use data",
          items: [
            "To provide requested services, including expert consultations, learning materials and event registrations.",
            "To start Stripe Checkout sessions, process payment-related requests and keep sales records in the admin panel.",
            "To answer inquiries, operate the chatbot and maintain service history for support.",
            "To maintain security, prevent misuse and manage administrator access.",
            "To measure website traffic and improve content, navigation and service decisions when analytics consent has been given.",
          ],
        },
        {
          title: "Service providers",
          body:
            "We use Stripe for payment checkout, OpenRouter for chatbot responses and analytics infrastructure for optional usage measurement. Hosting, email, infrastructure and maintenance providers may also process data where needed to operate the website. These providers process data under their own terms, privacy notices and applicable data processing arrangements.",
        },
        {
          title: "Legal bases",
          body:
            "Depending on the context, processing is based on contract performance, steps requested before entering into a contract, legitimate interests in operating, improving and securing the website, legal obligations such as accounting and tax requirements, and consent where required for non-essential analytics cookies or optional communications.",
        },
        {
          title: "Retention",
          body:
            "We keep personal data only as long as needed for the purpose for which it was collected, including service delivery, accounting, security, dispute handling and legal compliance. Chat, sales and request records are retained while they are needed for support, administration and legal purposes. Analytics retention depends on the configured analytics settings.",
        },
        {
          title: "Your rights",
          body:
            "Where applicable, you may request access, correction, deletion, restriction, portability or objection to processing of your personal data. You may also withdraw consent where processing is based on consent. You may lodge a complaint with the Bulgarian Commission for Personal Data Protection or another competent supervisory authority.",
        },
        {
          title: "International transfers",
          body:
            "Some providers, including Stripe, OpenRouter and analytics infrastructure providers, may process data outside the European Economic Area. Where required, transfers rely on appropriate safeguards such as adequacy decisions, standard contractual clauses or other lawful transfer mechanisms.",
        },
      ],
    },
    terms: {
      eyebrow: "Legal",
      title: "Terms and Conditions",
      updated: updatedEn,
      intro:
        "These Terms and Conditions govern use of the Hashtag Innovations website, content, events, learning materials, expert consultation booking flows, chatbot and related digital services.",
      sections: [
        {
          title: "Use of the website",
          body:
            "You may use the website for lawful personal or business purposes. You must not interfere with the website, attempt unauthorized access, misuse forms, copy protected content outside permitted use, or submit unlawful, misleading or harmful information.",
        },
        {
          title: "Content and information",
          body:
            "Articles, event pages, expert profiles, projects, chatbot replies and learning content are provided for general informational and educational purposes. They do not replace professional legal, financial, medical or other regulated advice.",
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
            "Payments are processed through Stripe Checkout. The website creates a checkout session and records the sale request in the admin panel. Stripe handles card data and payment processing. Until webhook confirmation is added, admin-panel sales records should be treated as checkout requests rather than final proof of successful payment.",
        },
        {
          title: "Refunds and cancellations",
          body:
            "Refunds, cancellations or rescheduling requests are reviewed case by case depending on the type of purchase, timing, expert/event availability, whether digital content has been supplied and applicable consumer rights. Contact Hashtag Innovations through the website channels for support.",
        },
        {
          title: "Chatbot",
          body:
            "The chatbot is provided to help visitors navigate the website and answer general questions. It may produce incomplete or inaccurate information. Users should verify important details before making decisions, purchases or registrations.",
        },
        {
          title: "Intellectual property",
          body:
            "Website design, text, images, learning materials, branding and other content belong to Hashtag Innovations or their respective rights holders. No rights are transferred except the limited right to use the website and purchased materials as intended.",
        },
        {
          title: "Liability",
          body:
            "The website is provided on an as-available basis. To the maximum extent permitted by law, Hashtag Innovations is not liable for indirect losses, lost profits, data loss, service interruptions or third-party service failures. Nothing in these terms limits rights that cannot lawfully be limited.",
        },
      ],
    },
    cookies: {
      eyebrow: "Legal",
      title: "Cookie Policy",
      updated: updatedEn,
      intro:
        "This Cookie Policy explains how the Hashtag Innovations website uses cookies and similar technologies, including necessary cookies, optional analytics storage, local browser storage and third-party technologies connected to Stripe Checkout.",
      sections: [
        {
          title: "What cookies are",
          body:
            "Cookies are small text files stored on a device by a browser. Similar technologies can include local storage, pixels, tags and scripts that help a website remember information, secure access, complete transactions or measure usage.",
        },
        {
          title: "Necessary cookies",
          body:
            "The admin area uses the hashtag_admin_session cookie to keep administrators signed in securely. Necessary cookies are used for security, authentication and core website operation and do not require optional analytics consent.",
        },
        {
          title: "Analytics technologies",
          body:
            "If you accept optional analytics, the website may use analytics technologies to measure visits, pages viewed, traffic sources and aggregated usage patterns. Analytics storage is denied by default and is enabled only after consent is accepted.",
        },
        {
          title: "Payment-related cookies",
          body:
            "When a user continues to Stripe Checkout, Stripe may set cookies or similar technologies for payment processing, fraud prevention, security and checkout functionality.",
        },
        {
          title: "Chatbot and local interaction data",
          body:
            "The chatbot stores a conversation identifier in browser local storage so the conversation can continue across page views. Chat messages are sent to the website backend and to the AI service provider used to generate replies, and conversations can be reviewed in the admin panel.",
        },
        {
          title: "Managing cookies",
          body:
            "You can accept or decline optional analytics through the cookie banner. You can also block, delete or restrict cookies in your browser settings. Blocking necessary cookies may prevent admin login, checkout handoff or some website functions from working.",
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
        "Тази Политика за поверителност обяснява как Hashtag Innovations обработва лични данни, когато посетителите използват сайта, регистрират се за събития, купуват учебни материали, заявяват експертни консултации, използват чатбота или достъпват защитени администраторски функции.",
      sections: [
        {
          title: "Администратор и контакт",
          body:
            "Сайтът се управлява под името Hashtag Innovations. Заявки, свързани с лични данни, могат да се изпращат чрез контактната форма или другите официални канали за контакт, публикувани в сайта. Ако по-късно бъде публикувано отделно юридическо лице, регистриран адрес или специален имейл за поверителност, тези данни следва да се приемат като контактни данни на администратора.",
        },
        {
          title: "Какви данни събираме",
          items: [
            "Данни за контакт като име, имейл адрес и съдържание на съобщение, изпратени чрез форми за събития, консултации, учебни материали, чатбот и контакт.",
            "Детайли за покупки и заявки като избрана експертна сесия, учебен материал, билет за събитие, цена, валута, Stripe checkout session ID и статус на плащане.",
            "Съдържание на разговори с чатбота, идентификатори на разговори, времеви данни и отговори на асистента, които могат да бъдат видими за упълномощени администратори с цел поддръжка и контрол на качеството.",
            "Технически и аналитични данни като информация за устройство/браузър, прегледани страници, източник на посещение и събития на взаимодействие, когато незадължителната аналитика е активирана.",
            "Данни за администраторска автентикация, необходими за защита на достъпа до админ панела.",
          ],
        },
        {
          title: "Как използваме данните",
          items: [
            "За предоставяне на заявени услуги, включително експертни консултации, учебни материали и регистрации за събития.",
            "За създаване на Stripe Checkout сесии, обработване на платежни заявки и запис на продажби в админ панела.",
            "За отговор на запитвания, работа на чатбота и поддържане на история за обслужване.",
            "За поддръжка на сигурността, предотвратяване на злоупотреби и управление на администраторски достъп.",
            "За измерване на трафика и подобряване на съдържанието, навигацията и услугите, когато е дадено съгласие за аналитика.",
          ],
        },
        {
          title: "Доставчици на услуги",
          body:
            "Използваме Stripe за платежен checkout, OpenRouter за отговори на чатбота и аналитична инфраструктура за незадължително измерване на употребата. Хостинг, имейл, инфраструктурни и технически доставчици също могат да обработват данни, когато това е необходимо за работата на сайта. Тези доставчици обработват данни съгласно собствените си условия, политики за поверителност и приложимите договорености за обработване на данни.",
        },
        {
          title: "Правни основания",
          body:
            "В зависимост от контекста обработването се основава на изпълнение на договор, стъпки преди сключване на договор, легитимен интерес за работа, подобряване и защита на сайта, законови задължения като счетоводни и данъчни изисквания и съгласие, когато се изисква за несъществени аналитични бисквитки или незадължителни комуникации.",
        },
        {
          title: "Срокове за съхранение",
          body:
            "Съхраняваме лични данни само толкова дълго, колкото е необходимо за целта на събирането им, включително доставка на услуги, счетоводство, сигурност, спорове и законово съответствие. Записите за чатове, продажби и заявки се съхраняват, докато са необходими за поддръжка, администрация и правни цели. Срокът за аналитични данни зависи от конфигурираните настройки за аналитика.",
        },
        {
          title: "Вашите права",
          body:
            "Когато е приложимо, можете да поискате достъп, корекция, изтриване, ограничаване, преносимост или възражение срещу обработването на личните ви данни. Можете също да оттеглите съгласие, когато обработването се основава на съгласие. Можете да подадете жалба до Комисията за защита на личните данни или друг компетентен надзорен орган.",
        },
        {
          title: "Международни трансфери",
          body:
            "Някои доставчици, включително Stripe, OpenRouter и доставчици на аналитична инфраструктура, могат да обработват данни извън Европейското икономическо пространство. Когато е необходимо, трансферите се извършват с подходящи гаранции като решения за адекватност, стандартни договорни клаузи или други законни механизми.",
        },
      ],
    },
    terms: {
      eyebrow: "Правна информация",
      title: "Общи условия",
      updated: updatedBg,
      intro:
        "Тези Общи условия уреждат използването на сайта Hashtag Innovations, съдържанието, събитията, учебните материали, процесите за заявка на експертни консултации, чатбота и свързаните дигитални услуги.",
      sections: [
        {
          title: "Използване на сайта",
          body:
            "Можете да използвате сайта за законни лични или бизнес цели. Не трябва да пречите на работата му, да опитвате неоторизиран достъп, да злоупотребявате с форми, да копирате защитено съдържание извън позволената употреба или да изпращате незаконна, подвеждаща или вредна информация.",
        },
        {
          title: "Съдържание и информация",
          body:
            "Статии, страници за събития, експертни профили, проекти, отговори на чатбота и учебно съдържание се предоставят с обща информационна и образователна цел. Те не заменят професионален правен, финансов, медицински или друг регулиран съвет.",
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
            "Плащанията се обработват чрез Stripe Checkout. Сайтът създава checkout сесия и записва заявката за продажба в админ панела. Stripe обработва картови данни и плащания. Докато бъде добавено webhook потвърждение, записите за продажби в админ панела следва да се третират като checkout заявки, а не като окончателно доказателство за успешно плащане.",
        },
        {
          title: "Възстановявания и откази",
          body:
            "Заявки за възстановяване, отказ или пренасрочване се разглеждат индивидуално според типа покупка, момента на заявката, наличността на експерт/събитие, дали дигиталното съдържание вече е предоставено и приложимите потребителски права. За съдействие се свържете с Hashtag Innovations чрез каналите в сайта.",
        },
        {
          title: "Чатбот",
          body:
            "Чатботът се предоставя, за да помага на посетителите да се ориентират в сайта и да получават общи отговори. Той може да даде непълна или неточна информация. Потребителите следва да проверяват важните детайли преди решения, покупки или регистрации.",
        },
        {
          title: "Интелектуална собственост",
          body:
            "Дизайнът, текстовете, изображенията, учебните материали, брандингът и другото съдържание принадлежат на Hashtag Innovations или съответните правоносители. Не се прехвърлят права, освен ограниченото право сайтът и закупените материали да се използват по предназначение.",
        },
        {
          title: "Отговорност",
          body:
            "Сайтът се предоставя според наличността си. В максимално позволената от закона степен Hashtag Innovations не носи отговорност за непреки загуби, пропуснати ползи, загуба на данни, прекъсвания на услугата или неизправности на услуги на трети страни. Нищо в тези условия не ограничава права, които не могат законно да бъдат ограничени.",
        },
      ],
    },
    cookies: {
      eyebrow: "Правна информация",
      title: "Политика за бисквитки",
      updated: updatedBg,
      intro:
        "Тази Политика за бисквитки обяснява как сайтът Hashtag Innovations използва бисквитки и подобни технологии, включително необходими бисквитки, незадължително аналитично съхранение, локално съхранение в браузъра и технологии на трети страни, свързани със Stripe Checkout.",
      sections: [
        {
          title: "Какво са бисквитките",
          body:
            "Бисквитките са малки текстови файлове, които браузърът съхранява на устройство. Подобни технологии могат да включват local storage, pixels, tags и scripts, които помагат на сайта да запомня информация, да защитава достъп, да завършва транзакции или да измерва употреба.",
        },
        {
          title: "Необходими бисквитки",
          body:
            "Админ зоната използва бисквитката hashtag_admin_session, за да поддържа защитен администраторски вход. Необходимите бисквитки се използват за сигурност, автентикация и основна работа на сайта и не изискват незадължително съгласие за аналитика.",
        },
        {
          title: "Аналитични технологии",
          body:
            "Ако приемете незадължителната аналитика, сайтът може да използва аналитични технологии за измерване на посещения, прегледани страници, източници на трафик и агрегирани модели на употреба. Аналитичното съхранение е отказано по подразбиране и се активира само след приемане на съгласие.",
        },
        {
          title: "Бисквитки, свързани с плащания",
          body:
            "Когато потребител продължи към Stripe Checkout, Stripe може да задава бисквитки или подобни технологии за обработка на плащания, предотвратяване на измами, сигурност и checkout функционалност.",
        },
        {
          title: "Чатбот и локални данни",
          body:
            "Чатботът съхранява идентификатор на разговор в local storage на браузъра, за да може разговорът да продължи между преглеждания на страници. Съобщенията в чата се изпращат към backend-а на сайта и към AI доставчика, използван за генериране на отговори, а разговорите могат да бъдат преглеждани в админ панела.",
        },
        {
          title: "Управление на бисквитки",
          body:
            "Можете да приемете или откажете незадължителна аналитика чрез cookie banner-а. Можете също да блокирате, изтривате или ограничавате бисквитки от настройките на браузъра. Блокирането на необходими бисквитки може да попречи на админ входа, checkout пренасочването или на някои функции на сайта.",
        },
      ],
    },
  },
};

export const getLegalDocument = (lang: string, key: LegalPageKey) => {
  const language = legalContent[lang] ? lang : "en";
  return legalContent[language][key];
};
