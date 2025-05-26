// lib/contact.ts
export type Locale = 'en' | 'ru' | 'kk'

interface CardData {
  icon: React.ReactNode
  title: string
  description: string
  contact: string
  link?: string
}

interface FaqItem {
  question: string
  answer: string
}

interface ContactTranslations {
  breadcrumb: string
  pageTitle: string
  pageDescription: string
  cards: CardData[]
  sendMessageTitle: string
  visitOfficeTitle: string
  addressLines: string[]
  mapSrc: string
  faqTitle: string
  faq: FaqItem[]
}

export const contactTranslations: Record<Locale, ContactTranslations> = {
  en: {
    breadcrumb: 'Contact and Support',
    pageTitle: 'Contact and Support',
    pageDescription:
      "Get in touch with our team for inquiries, support, or feedback. We're here to help you with all your questions related to recognition, accreditation, and other services.",
    cards: [
      {
        icon: '📧', // можно заменить на <Mail /> в компоненте
        title: 'Email Us',
        description: "Send us an email and we'll get back to you within 24 hours.",
        contact: 'cbpiam@n-k.kz',
        link: 'mailto:cbpiam@n-k.kz',
      },
      {
        icon: '📞',
        title: 'Call Us',
        description: 'Our support team is available Monday to Friday, 9am to 5pm.',
        contact: '+7 (7172) 57-20-75',
        link: 'tel:+77172572075',
      },
      {
        icon: '⏰',
        title: 'Working Hours',
        description:
          'Our office is open Monday to Friday, 9am to 5pm. Closed on public holidays.',
        contact: '9:00 AM - 5:00 PM',
      },
    ],
    sendMessageTitle: 'Send Us a Message',
    visitOfficeTitle: 'Visit Our Office',
    addressLines: [
      'Сыганак 70',
      'Office 202, 2nd floor',
      'Astana, Republic of Kazakhstan',
    ],
    mapSrc:
      'https://www.google.com/maps/embed?pb=!1m10!1m8!1m3!1d1897.938707931259!2d71.44062294556657!3d51.12053652753531!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sru!2skz!4v1748195680261!5m2!1sru!2skz',
    faqTitle: 'Frequently Asked Questions',
    faq: [
      {
        question: 'How long does the recognition process take?',
        answer:
          'The recognition process typically takes 4–6 weeks from the date of submission of a complete application. However, processing times may vary depending on the complexity of the case, the country of origin of the document, and the completeness of the application.',
      },
      {
        question: 'What documents are required for recognition?',
        answer:
          'Required documents typically include the original education document, a certified translation (if not in the official language), a copy of your passport or ID, and a complete application form.',
      },
    ],
  },

  ru: {
    breadcrumb: 'Контакты и поддержка',
    pageTitle: 'Контакты и поддержка',
    pageDescription:
      'Свяжитесь с нашей командой по вопросам признания, аккредитации и другим услугам. Мы готовы помочь и ответить на все ваши вопросы.',
    cards: [
      {
        icon: '📧',
        title: 'Напишите нам',
        description: 'Отправьте нам письмо, и мы ответим в течение 24 часов.',
        contact: 'cbpiam@n-k.kz',
        link: 'mailto:cbpiam@n-k.kz',
      },
      {
        icon: '📞',
        title: 'Позвоните нам',
        description:
          'Наша служба поддержки доступна с понедельника по пятницу с 9:00 до 17:00.',
        contact: '+7 (7172) 57-20-75',
        link: 'tel:+77172572075',
      },
      {
        icon: '⏰',
        title: 'Часы работы',
        description:
          'Наш офис открыт с понедельника по пятницу с 9:00 до 17:00. Выходные и праздничные дни — выходной.',
        contact: '9:00–17:00',
      },
    ],
    sendMessageTitle: 'Отправьте нам сообщение',
    visitOfficeTitle: 'Наш офис',
    addressLines: [
      'Сыганак 70',
      'Офис 202, 2 этаж',
      'Астана, Республика Казахстан',
    ],
    mapSrc:
      'https://www.google.com/maps/embed?pb=!1m10!1m8!1m3!1d1897.938707931259!2d71.44062294556657!3d51.12053652753531!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sru!2skz!4v1748195680261!5m2!1sru!2skz',
    faqTitle: 'Часто задаваемые вопросы',
    faq: [
      {
        question: 'Сколько времени занимает процесс признания?',
        answer:
          'Процесс признания обычно занимает 4–6 недель с даты подачи полного комплекта документов. Сроки могут варьироваться в зависимости от сложности случая и страны происхождения.',
      },
      {
        question: 'Какие документы требуются для признания?',
        answer:
          'Обычно требуются оригинал документа об образовании, заверенный перевод (если документ не на официальном языке), копия паспорта или удостоверения личности и заполненная анкета.',
      },
    ],
  },

  kk: {
    breadcrumb: 'Байланыс және қолдау',
    pageTitle: 'Байланыс және қолдау',
    pageDescription:
      'Сұрақтар, қолдау немесе кері байланыс үшін біздің командаға хабарласыңыз. Біз сізге тану, аккредитация және басқа да қызметтер бойынша көмектесуге дайынбыз.',
    cards: [
      {
        icon: '📧',
        title: 'Хат жіберіңіз',
        description: 'Бізге хат жіберіңіз, біз 24 сағат ішінде жауап береміз.',
        contact: 'cbpiam@n-k.kz',
        link: 'mailto:cbpiam@n-k.kz',
      },
      {
        icon: '📞',
        title: 'Қоңырау шалыңыз',
        description:
          'Қолдау қызметіміз дүйсенбіден жұмаға дейін 9:00–17:00 аралығында жұмыс істейді.',
        contact: '+7 (7172) 57-20-75',
        link: 'tel:+77172572075',
      },
      {
        icon: '⏰',
        title: 'Жұмыс уақыты',
        description:
          'Біздің офіс дүйсенбіден жұмаға дейін 9:00–17:00 аралығында ашық. Демалыс және мейрам күндері жабық.',
        contact: '9:00–17:00',
      },
    ],
    sendMessageTitle: 'Хат жіберіңіз',
    visitOfficeTitle: 'Офиске келіңіз',
    addressLines: [
      'Сығанақ 70',
      '202-кеңсе, 2-қабат',
      'Астана, Қазақстан Республикасы',
    ],
    mapSrc:
      'https://www.google.com/maps/embed?pb=!1m10!1m8!1m3!1d1897.938707931259!2d71.44062294556657!3d51.12053652753531!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sru!2skz!4v1748195680261!5m2!1sru!2skz',
    faqTitle: 'Жиі Қойылатын Сұрақтар',
    faq: [
      {
        question: 'Тану процесі қанша уақыт алады?',
        answer:
          'Тану процесі толық өтінім берілген күннен бастап әдетте 4–6 аптаға созылады. Уақыттары күрделілік пен құжат шыққан елге байланысты өзгеруі мүмкін.',
      },
      {
        question: 'Тану үшін қандай құжаттар қажет?',
        answer:
          'Көбінесе білім туралы құжаттың түпнұсқасы, бекітілген аударма (ресми тілде емес болса), төлқұжат немесе жеке куәліктің көшірмесі және толтырылған өтінім формасы қажет.',
      },
    ],
  },
}
