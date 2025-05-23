"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

type Language = "kk" | "ru" | "en"

type Translations = {
  [key: string]: {
    [key: string]: string
  }
}

type LanguageContextType = {
  language: Language
  setLanguage: (language: Language) => void
  t: (key: string) => string
}

// Comprehensive translations for all UI elements
const translations: Translations = {
  kk: {
    // Navigation
    home: "Басты бет",
    recognition: "Тану",
    accreditation: "Аккредитация",
    bologna: "Болон процесі",
    news: "Жаңалықтар",
    contact: "Байланыс",
    login: "Кіру",
    register: "Тіркелу",
    search: "Іздеу...",
    toggle_theme: "Тақырыпты ауыстыру",
    my_account: "Менің аккаунтым",
    my_applications: "Менің өтініштерім",
    admin_panel: "Әкімшілік панелі",
    logout: "Шығу",
    language: "kk",

    // Header/Footer
    education_center: "Білім беру орталығы",
    center_subtitle: "Шетелдік білім беру құжаттарын тану және аккредитациялау ұлттық орталығы",
    toggle_menu: "Мәзірді ашу/жабу",
    copy_to_clipboard: "Нөмірді көшіру",
    copied: "Көшірілді!",

    // Hero section
    hero_title: "Шетелдік білім беру құжаттарын тану және аккредитациялау ұлттық орталығы",
    hero_subtitle:
      "Біз шетелдік біліктілікті тануға және аккредитация қызметтері арқылы білім сапасын қамтамасыз етуге көмектесеміз.",
    recognition_services: "Тану қызметтері",
    accreditation_process: "Аккредитация процесі",

    // Quick links
    recognition_database: "Тану дерекқоры",
    accredited_organizations: "Аккредитацияланған ұйымдар",
    bologna_process: "Болон процесі",
    faq: "Жиі қойылатын сұрақтар",

    // Services section
    our_key_services: "Біздің негізгі қызметтеріміз",
    services_description:
      "Біз білім беру құжаттары мен мекемелерін тану және аккредитациялау бойынша кешенді қызметтер ұсынамыз.",
    recognition_of_foreign_education: "Шетелдік білім беруді тану",
    recognition_description: "Академиялық және кәсіби мақсаттар үшін шетелдік білім беру құжаттарын ресми тану.",
    accreditation_services: "Аккредитация қызметтері",
    accreditation_description: "Білім беру мекемелеріне арналған сапаны қамтамасыз ету және аккредитация қызметтері.",
    bologna_process_service: "Болон процесі",
    bologna_description: "Болон процесі және Еуропалық жоғары білім беру кеңістігі туралы ақпарат пен ресурстар.",
    learn_more: "Толығырақ",

    // Statistics
    documents_recognized: "Танылған құжаттар",
    accredited_institutions: "Аккредитацияланған мекемелер",
    partner_countries: "Серіктес елдер",
    years_of_experience: "Тәжірибе жылдары",

    // News section
    latest_news: "Соңғы жаңалықтар",
    view_all: "Барлығын көру",
    read_more: "Толығырақ оқу",

    // CTA section
    ready_to_get_started: "Бастауға дайынсыз ба?",
    cta_description:
      "Шетелдік білім беру құжаттарын тану немесе мекемеңізге аккредитация қызметтері қажет болса, біз көмектесуге дайынмыз.",
    apply_for_recognition: "Тануға өтініш беру",
    contact_us: "Бізбен байланысу",

    // Recognition form
    recognition_application: "Тану өтінімі",
    step: "Қадам",
    of: "/",
    personal_information: "Жеке ақпарат",
    first_name: "Аты",
    last_name: "Тегі",
    email: "Электрондық пошта",
    phone_number: "Телефон нөмірі",
    nationality: "Азаматтығы",
    address: "Мекенжайы",
    enter_first_name: "Атыңызды енгізіңіз",
    enter_last_name: "Тегіңізді енгізіңіз",
    enter_email: "Электрондық поштаңызды енгізіңіз",
    enter_phone: "Телефон нөміріңізді енгізіңіз",
    select_nationality: "Азаматтығыңызды таңдаңыз",
    enter_address: "Мекенжайыңызды енгізіңіз",

    document_information: "Құжат туралы ақпарат",
    document_type: "Құжат түрі",
    issuing_country: "Берілген ел",
    issuing_institution: "Берілген мекеме",
    year_of_issue: "Берілген жылы",
    field_of_study: "Оқу саласы",
    recognition_purpose: "Тану мақсаты",
    select_document_type: "Құжат түрін таңдаңыз",
    select_country: "Елді таңдаңыз",
    enter_institution: "Мекеме атауын енгізіңіз",
    enter_field: "Оқу саласын енгізіңіз",
    academic_purpose: "Академиялық (әрі қарай оқу үшін)",
    professional_purpose: "Кәсіби (жұмысқа орналасу үшін)",

    document_upload: "Құжатты жүктеу",
    required_documents: "Қажетті құжаттар",
    original_document: "Түпнұсқа білім беру құжаты (PDF немесе JPG)",
    certified_translation: "Сертификатталған аударма (ресми тілде болмаса)",
    id_copy: "Паспорт немесе жеке куәлік көшірмесі",
    supporting_documents: "Қосымша құжаттар (қажет болса)",
    drag_drop_files: "Файлдарды осында сүйреп әкеліңіз немесе шолу үшін басыңыз",
    supported_formats: "Қолдау көрсетілетін форматтар: PDF, JPG, PNG (файл басына 10МБ-тан аспауы керек)",
    browse_files: "Файлдарды шолу",
    uploaded_files: "Жүктелген файлдар",
    remove: "Жою",

    confirm_accuracy: "Барлық берілген ақпараттың дұрыс екенін растаймын",
    terms_agreement: "Бұл өтінімді жіберу арқылы мен шарттар мен ережелерді және құпиялылық саясатын қабылдаймын.",
    previous: "Алдыңғы",
    next: "Келесі",
    submitting: "Жіберілуде...",
    submit_application: "Өтінімді жіберу",
    application_success_message:
      "Сіздің өтініміңіз сәтті жіберілді. Сіздің анықтама нөміріңіз: REF-2025-12345. Жақын арада растау электрондық поштасын аласыз.",

    // Calculator
    cost_calculator: "Құн калькуляторы",
    calculator_description: "Тану өтінішіңіздің құны мен өңдеу уақытын бағалаңыз",
    processing_speed: "Өңдеу жылдамдығы",
    estimated_results: "Болжамды нәтижелер",
    based_on_selections: "Сіздің таңдауларыңызға негізделген",
    estimated_cost: "Болжамды құны",
    processing_time: "Өңдеу уақыты",
    please_select_options: "Опцияларды таңдаңыз",
    estimate_note: "Бұл тек болжам. Нақты құны мен өңдеу уақыты мыналарға байланысты өзгеруі мүмкін:",
    document_complexity: "Құжаттың күрделілігі",
    additional_verification: "Қосымша тексеру қажеттілігі",
    application_completeness: "Өтінімнің толықтығы",
    start_application: "Өтінімді бастау",

    // Countries
    kazakhstan: "Қазақстан",
    united_states: "Америка Құрама Штаттары",
    united_kingdom: "Ұлыбритания",
    canada: "Канада",
    australia: "Австралия",
    france: "Франция",
    germany: "Германия",
    other: "Басқа",

    // Document types
    diploma: "Диплом",
    degree_certificate: "Дәреже сертификаты",
    transcript: "Транскрипт",

    // Footer
    quick_links: "Жылдам сілтемелер",
    information: "Ақпарат",
    about_center: "Орталық туралы",
    privacy_policy: "Құпиялылық саясаты",
    terms_conditions: "Шарттар мен ережелер",
    copyright_text: "барлық құқықтар қорғалған",
    member_bologna: "Болон процесінің мүшесі",

    // News and articles
    article: "Мақала",
    article_not_found: "Мақала табылмады",
    back_to_news: "Жаңалықтарға оралу",
    back_to_bologna: "Болон процесіне оралу",

    // Types of recognition
    types_of_recognition: "Тану түрлері",
    types_description: "Академиялық, кәсіби және біліктілікті тану",
    types_description_full:
      "Біздің орталық сіздің қажеттіліктеріңізге байланысты әртүрлі тану қызметтерін ұсынады. Төменде біз ұсынатын негізгі тану түрлері берілген.",
    academic_recognition: "Академиялық тану",
    academic_recognition_description:
      "Университеттерде және басқа білім беру мекемелерінде білім алуды жалғастыруға арналған тану.",
    professional_recognition: "Кәсіби тану",
    professional_recognition_description: "Жұмысқа орналасу және кәсіби лицензиялау мақсаттары үшін тану.",
    qualification_recognition: "Біліктілікті тану",
    qualification_recognition_description: "Нақты біліктіліктерді, дәрежелерді және дипломдарды тану.",
    partial_studies_recognition: "Ішінара оқуды тану",
    partial_studies_recognition_description: "Шетелде аяқталған кредиттер мен оқу кезеңдерін тану.",

    // Application process
    application_process: "Өтініш беру процесі",
    application_process_description:
      "Шетелдік білім беру құжаттарын тануға өтініш беру үшін төмендегі онлайн өтініш формасын толтырыңыз. Барлық қажетті ақпаратты беріп, қажетті құжаттарды жүктеуді ұмытпаңыз.",

    // Calculator page
    calculator_page_description:
      "Құжат түріне, шыққан еліне және өтінішіңіздің шұғылдығына байланысты тану өтінішіңіздің құны мен өңдеу уақытын бағалау үшін біздің калькуляторды пайдаланыңыз.",

    // Database page
    database_description:
      "Танылған шетелдік білім беру мекемелері мен біліктіліктер дерекқорын іздеңіз. Бұл дерекқор әлемдегі білім беру мекемелері туралы ақпаратпен үнемі жаңартылып отырады.",
    search_institutions: "Мекемелерді іздеу...",
    country: "Ел",
    all_countries: "Барлық елдер",
    european_union: "Еуропалық Одақ",
    asia: "Азия",
    institution_type: "Мекеме түрі",
    all_types: "Барлық түрлер",
    university: "Университет",
    college: "Колледж",
    school: "Мектеп",
    institution_name: "Мекеме атауы",
    type: "Түрі",
    recognition_status: "Тану мәртебесі",
    recognized: "Танылған",
    showing_results: "1,245 мекеменің 5-і көрсетілген",

    // FAQ page
    faq_description: "Тану, аккредитация және біздің қызметтер туралы жиі қойылатын сұрақтарға жауаптар табыңыз.",
    faq_recognition_time: "Тану процесі қанша уақытқа созылады?",
    faq_recognition_time_answer:
      "Тану процесі әдетте толық өтінім берілген күннен бастап 4-6 аптаға созылады. Алайда, өңдеу уақыты істің күрделілігіне, құжаттың шыққан еліне және өтінімнің толықтығына байланысты өзгеруі мүмкін.",
    faq_required_documents: "Тану үшін қандай құжаттар қажет?",
    faq_required_documents_answer:
      "Қажетті құжаттарға әдетте түпнұсқа білім беру құжаты, сертификатталған аударма (ресми тілде болмаса), паспорт немесе жеке куәліктің көшірмесі және толық өтініш формасы кіреді.",
    faq_recognition_cost: "Тану қанша тұрады?",
    faq_recognition_cost_answer:
      "Тану құны құжат түріне, шыққан еліне және өтініштің шұғылдығына байланысты өзгереді. Нақты жағдайыңыз үшін бағалау алу үшін біздің құн калькуляторын пайдалана аласыз.",
    faq_accreditation_meaning: "Аккредитация дегеніміз не және ол неге маңызды?",
    faq_accreditation_meaning_answer:
      "Аккредитация - бұл колледждерді, университеттерді және білім беру бағдарламаларын сапаны қамтамасыз ету және сапаны жақсарту үшін тексеру үшін қолданылатын сыртқы сапаны тексеру процесі. Бұл мекемелердің белгілі бір сапа мен тұтастық стандарттарына сәйкес келуін қамтамасыз ететіндіктен маңызды.",
    faq_bologna_process: "Болон процесі дегеніміз не?",
    faq_bologna_process_answer:
      "Болон процесі - бұл 49 еуропалық елді және бірқатар еуропалық ұйымдарды қамтитын үкіметаралық жоғары білім беру реформасы процесі. Оның негізгі мақсаты - еуропалық жоғары білім беру жүйелерінің сапасы мен танылуын арттыру және студенттер мен қызметкерлердің ұтқырлығын жеңілдету.",
    still_have_questions: "Әлі де сұрақтарыңыз бар ма?",
    contact_us_for_more_info:
      "Егер сұрағыңызға жауап таба алмасаңыз, бізге хабарласудан тартынбаңыз. Біздің команда сізге көмектесуге дайын.",

    // Japan
    japan: "Жапония",
    // Russia
    russia: "Ресей",
  },
  ru: {
    // Navigation
    home: "Главная",
    recognition: "Признание",
    accreditation: "Аккредитация",
    bologna: "Болонский процесс",
    news: "Новости",
    contact: "Контакты",
    login: "Вход",
    register: "Регистрация",
    search: "Поиск...",
    toggle_theme: "Переключить тему",
    my_account: "Мой аккаунт",
    my_applications: "Мои заявления",
    admin_panel: "Панель администратора",
    logout: "Выход",
    language: "ru",

    // Header/Footer
    education_center: "Образовательный центр",
    center_subtitle: "Национальный центр признания и аккредитации документов об образовании",
    toggle_menu: "Открыть/закрыть меню",
    copy_to_clipboard: "Скопировать номер",
    copied: "Скопировано!",

    // Hero section
    hero_title: "Национальный центр признания и аккредитации документов об образовании",
    hero_subtitle:
      "Мы содействуем признанию иностранных квалификаций и обеспечиваем качество образования через услуги аккредитации.",
    recognition_services: "Услуги признания",
    accreditation_process: "Процесс аккредитации",

    // Quick links
    recognition_database: "База данных признания",
    accredited_organizations: "Аккредитованные организации",
    bologna_process: "Болонский процесс",
    faq: "Часто задаваемые вопросы",

    // Services section
    our_key_services: "Наши ключевые услуги",
    services_description:
      "Мы предоставляем комплексные услуги по признанию и аккредитации образовательных документов и учреждений.",
    recognition_of_foreign_education: "Признание иностранного образования",
    recognition_description:
      "Официальное признание иностранных документов об образовании для академических и профессиональных целей.",
    accreditation_services: "Услуги аккредитации",
    accreditation_description: "Услуги по обеспечению качества и аккредитации для образовательных учреждений.",
    bologna_process_service: "Болонский процесс",
    bologna_description: "Информация и ресурсы о Болонском процессе и Европейском пространстве высшего образования.",
    learn_more: "Узнать больше",

    // Statistics
    documents_recognized: "Признанных документов",
    accredited_institutions: "Аккредитованных учреждений",
    partner_countries: "Стран-партнеров",
    years_of_experience: "Лет опыта",

    // News section
    latest_news: "Последние новости",
    view_all: "Смотреть все",
    read_more: "Читать далее",

    // CTA section
    ready_to_get_started: "Готовы начать?",
    cta_description:
      "Независимо от того, нужно ли вам признание иностранных документов об образовании или услуги аккредитации для вашего учреждения, мы готовы помочь.",
    apply_for_recognition: "Подать заявление на признание",
    contact_us: "Связаться с нами",

    // Recognition form
    recognition_application: "Заявление о признании",
    step: "Шаг",
    of: "из",
    personal_information: "Личная информация",
    first_name: "Имя",
    last_name: "Фамилия",
    email: "Электронная почта",
    phone_number: "Номер телефона",
    nationality: "Гражданство",
    address: "Адрес",
    enter_first_name: "Введите ваше имя",
    enter_last_name: "Введите вашу фамилию",
    enter_email: "Введите вашу электронную почту",
    enter_phone: "Введите ваш номер телефона",
    select_nationality: "Выберите ваше гражданство",
    enter_address: "Введите ваш адрес",

    document_information: "Информация о документе",
    document_type: "Тип документа",
    issuing_country: "Страна выдачи",
    issuing_institution: "Учреждение, выдавшее документ",
    year_of_issue: "Год выдачи",
    field_of_study: "Область обучения",
    recognition_purpose: "Цель признания",
    select_document_type: "Выберите тип документа",
    select_country: "Выберите страну",
    enter_institution: "Введите название учреждения",
    enter_field: "Введите область обучения",
    academic_purpose: "Академическая (для дальнейшего обучения)",
    professional_purpose: "Профессиональная (для трудоустройства)",

    document_upload: "Загрузка документов",
    required_documents: "Необходимые документы",
    original_document: "Оригинал документа об образовании (PDF или JPG)",
    certified_translation: "Заверенный перевод (если не на официальном языке)",
    id_copy: "Копия паспорта или удостоверения личности",
    supporting_documents: "Дополнительные подтверждающие документы (если применимо)",
    drag_drop_files: "Перетащите файлы сюда или нажмите для выбора",
    supported_formats: "Поддерживаемые форматы: PDF, JPG, PNG (макс. 10МБ на файл)",
    browse_files: "Выбрать файлы",
    uploaded_files: "Загруженные файлы",
    remove: "Удалить",

    confirm_accuracy: "Я подтверждаю, что вся предоставленная информация является точной",
    terms_agreement: "Отправляя это заявление, я соглашаюсь с условиями и политикой конфиденциальности.",
    previous: "Назад",
    next: "Далее",
    submitting: "Отправка...",
    submit_application: "Отправить заявление",
    application_success_message:
      "Ваше заявление успешно отправлено. Ваш номер ссылки: REF-2025-12345. Вы получите подтверждение по электронной почте в ближайшее время.",

    // Calculator
    cost_calculator: "Калькулятор стоимости",
    calculator_description: "Оцените стоимость и время обработки вашего заявления о признании",
    processing_speed: "Скорость обработки",
    estimated_results: "Предварительные результаты",
    based_on_selections: "На основе ваших выборов",
    estimated_cost: "Предварительная стоимость",
    processing_time: "Время обработки",
    please_select_options: "Пожалуйста, выберите параметры",
    estimate_note: "Это только оценка. Фактические затраты и время обработки могут варьироваться в зависимости от:",
    document_complexity: "Сложности документа",
    additional_verification: "Необходимости дополнительной проверки",
    application_completeness: "Полноты заявления",
    start_application: "Начать заявление",

    // Countries
    kazakhstan: "Казахстан",
    united_states: "Соединенные Штаты Америки",
    united_kingdom: "Великобритания",
    canada: "Канада",
    australia: "Австралия",
    france: "Франция",
    germany: "Германия",
    other: "Другое",

    // Document types
    diploma: "Диплом",
    degree_certificate: "Сертификат о степени",
    transcript: "Транскрипт",

    // Footer
    quick_links: "Быстрые ссылки",
    information: "Информация",
    about_center: "О центре",
    privacy_policy: "Политика конфиденциальности",
    terms_conditions: "Условия и положения",
    copyright_text: "все права защищены",
    member_bologna: "Член Болонского процесса",

    // News and articles
    article: "Статья",
    article_not_found: "Статья не найдена",
    back_to_news: "Вернуться к новостям",
    back_to_bologna: "Вернуться к Болонскому процессу",

    // Types of recognition
    types_of_recognition: "Типы признания",
    types_description: "Академическое, профессиональное и квалификационное признание",
    types_description_full:
      "Наш центр предоставляет различные типы услуг признания в зависимости от ваших потребностей. Ниже приведены основные типы признания, которые мы предлагаем.",
    academic_recognition: "Академическое признание",
    academic_recognition_description:
      "Признание для продолжения образования в университетах и других образовательных учреждениях.",
    professional_recognition: "Профессиональное признание",
    professional_recognition_description: "Признание для целей трудоустройства и профессионального лицензирования.",
    qualification_recognition: "Признание квалификаций",
    qualification_recognition_description: "Признание конкретных квалификаций, степеней и дипломов.",
    partial_studies_recognition: "Признание частичного обучения",
    partial_studies_recognition_description: "Признание кредитов и периодов обучения, завершенных за рубежом.",

    // Application process
    application_process: "Процесс подачи заявления",
    application_process_description:
      "Чтобы подать заявление на признание ваших иностранных документов об образовании, пожалуйста, заполните онлайн-форму заявления ниже. Убедитесь, что вы предоставили всю необходимую информацию и загрузили необходимые документы.",

    // Calculator page
    calculator_page_description:
      "Используйте наш калькулятор для оценки стоимости и времени обработки вашего заявления о признании в зависимости от типа документа, страны происхождения и срочности вашего запроса.",

    // Database page
    database_description:
      "Поиск в нашей базе данных признанных иностранных образовательных учреждений и квалификаций. Эта база данных регулярно обновляется информацией об образовательных учреждениях по всему миру.",
    search_institutions: "Поиск учреждений...",
    country: "Страна",
    all_countries: "Все страны",
    european_union: "Европейский Союз",
    asia: "Азия",
    institution_type: "Тип учреждения",
    all_types: "Все типы",
    university: "Университет",
    college: "Колледж",
    school: "Школа",
    institution_name: "Название учреждения",
    type: "Тип",
    recognition_status: "Статус признания",
    recognized: "Признано",
    showing_results: "Показано 5 из 1,245 учреждений",

    // FAQ page
    faq_description: "Найдите ответы на часто задаваемые вопросы о признании, аккредитации и наших услугах.",
    faq_recognition_time: "Сколько времени занимает процесс признания?",
    faq_recognition_time_answer:
      "Процесс признания обычно занимает 4-6 недель с даты подачи полного заявления. Однако время обработки может варьироваться в зависимости от сложности дела, страны происхождения документа и полноты заявления.",
    faq_required_documents: "Какие документы требуются для признания?",
    faq_required_documents_answer:
      "Необходимые документы обычно включают оригинал документа об образовании, заверенный перевод (если не на официальном языке), копию паспорта или удостоверения личности и заполненную форму заявления.",
    faq_recognition_cost: "Сколько стоит признание?",
    faq_recognition_cost_answer:
      "Стоимость признания варьируется в зависимости от типа документа, страны происхождения и срочности запроса. Вы можете использовать наш калькулятор стоимости, чтобы получить оценку для вашего конкретного случая.",
    faq_accreditation_meaning: "Что такое аккредитация и почему она важна?",
    faq_accreditation_meaning_answer:
      "Аккредитация - это процесс внешней проверки качества, используемый для изучения колледжей, университетов и образовательных программ для обеспечения качества и его улучшения. Она важна, потому что обеспечивает соответствие учреждений определенным стандартам качества и целостности.",
    faq_bologna_process: "Что такое Болонский процесс?",
    faq_bologna_process_answer:
      "Болонский процесс - это межправительственный процесс реформы высшего образования, который включает 49 европейских стран и ряд европейских организаций. Его основная цель - повысить качество и признание европейских систем высшего образования и облегчить мобильность студентов и персонала.",
    still_have_questions: "Остались вопросы?",
    contact_us_for_more_info:
      "Если вы не смогли найти ответ на свой вопрос, пожалуйста, не стесняйтесь связаться с нами. Наша команда готова помочь вам.",

    // Japan
    japan: "Япония",
    // Russia
    russia: "Россия",
  },
  en: {
    // Navigation
    home: "Home",
    recognition: "Recognition",
    accreditation: "Accreditation",
    bologna: "Bologna Process",
    news: "News",
    contact: "Contact",
    login: "Login",
    register: "Register",
    search: "Search...",
    toggle_theme: "Toggle theme",
    my_account: "My Account",
    my_applications: "My Applications",
    admin_panel: "Admin Panel",
    logout: "Logout",
    language: "en",

    // Header/Footer
    education_center: "Education Center",
    center_subtitle: "National Center for Recognition and Accreditation of Education Documents",
    toggle_menu: "Toggle menu",
    copy_to_clipboard: "Copy number",
    copied: "Copied!",

    // Hero section
    hero_title: "National Center for Recognition and Accreditation of Education Documents",
    hero_subtitle:
      "We facilitate the recognition of foreign qualifications and ensure quality assurance in education through accreditation services.",
    recognition_services: "Recognition Services",
    accreditation_process: "Accreditation Process",

    // Quick links
    recognition_database: "Recognition Database",
    accredited_organizations: "Accredited Organizations",
    bologna_process: "Bologna Process",
    faq: "FAQ",

    // Services section
    our_key_services: "Our Key Services",
    services_description:
      "We provide comprehensive services for recognition and accreditation of educational documents and institutions.",
    recognition_of_foreign_education: "Recognition of Foreign Education",
    recognition_description:
      "Official recognition of foreign education documents for academic and professional purposes.",
    accreditation_services: "Accreditation Services",
    accreditation_description: "Quality assurance and accreditation services for educational institutions.",
    bologna_process_service: "Bologna Process",
    bologna_description: "Information and resources about the Bologna Process and European Higher Education Area.",
    learn_more: "Learn More",

    // Statistics
    documents_recognized: "Documents Recognized",
    accredited_institutions: "Accredited Institutions",
    partner_countries: "Partner Countries",
    years_of_experience: "Years of Experience",

    // News section
    latest_news: "Latest News",
    view_all: "View All",
    read_more: "Read More",

    // CTA section
    ready_to_get_started: "Ready to Get Started?",
    cta_description:
      "Whether you need recognition of your foreign education documents or accreditation services for your institution, we're here to help.",
    apply_for_recognition: "Apply for Recognition",
    contact_us: "Contact Us",

    // Recognition form
    recognition_application: "Recognition Application",
    step: "Step",
    of: "of",
    personal_information: "Personal Information",
    first_name: "First Name",
    last_name: "Last Name",
    email: "Email",
    phone_number: "Phone Number",
    nationality: "Nationality",
    address: "Address",
    enter_first_name: "Enter your first name",
    enter_last_name: "Enter your last name",
    enter_email: "Enter your email",
    enter_phone: "Enter your phone number",
    select_nationality: "Select your nationality",
    enter_address: "Enter your address",

    document_information: "Document Information",
    document_type: "Document Type",
    issuing_country: "Issuing Country",
    issuing_institution: "Issuing Institution",
    year_of_issue: "Year of Issue",
    field_of_study: "Field of Study",
    recognition_purpose: "Recognition Purpose",
    select_document_type: "Select document type",
    select_country: "Select country",
    enter_institution: "Enter institution name",
    enter_field: "Enter field of study",
    academic_purpose: "Academic (for further studies)",
    professional_purpose: "Professional (for employment)",

    document_upload: "Document Upload",
    required_documents: "Required Documents",
    original_document: "Original education document (PDF or JPG)",
    certified_translation: "Certified translation (if not in official language)",
    id_copy: "Passport or ID copy",
    supporting_documents: "Additional supporting documents (if applicable)",
    drag_drop_files: "Drag and drop files here, or click to browse",
    supported_formats: "Supported formats: PDF, JPG, PNG (max 10MB per file)",
    browse_files: "Browse Files",
    uploaded_files: "Uploaded Files",
    remove: "Remove",

    confirm_accuracy: "I confirm that all information provided is accurate",
    terms_agreement: "By submitting this application, I agree to the terms and conditions and privacy policy.",
    previous: "Previous",
    next: "Next",
    submitting: "Submitting...",
    submit_application: "Submit Application",
    application_success_message:
      "Your application has been submitted successfully. Your reference number is REF-2025-12345. You will receive a confirmation email shortly.",

    // Calculator
    cost_calculator: "Cost Calculator",
    calculator_description: "Estimate the cost and processing time for your recognition application",
    processing_speed: "Processing Speed",
    estimated_results: "Estimated Results",
    based_on_selections: "Based on your selections",
    estimated_cost: "Estimated Cost",
    processing_time: "Processing Time",
    please_select_options: "Please select options",
    estimate_note: "This is an estimate only. Actual costs and processing times may vary based on:",
    document_complexity: "Complexity of the document",
    additional_verification: "Need for additional verification",
    application_completeness: "Completeness of the application",
    start_application: "Start Application",

    // Countries
    kazakhstan: "Kazakhstan",
    united_states: "United States",
    united_kingdom: "United Kingdom",
    canada: "Canada",
    australia: "Australia",
    france: "France",
    germany: "Germany",
    other: "Other",

    // Document types
    diploma: "Diploma",
    degree_certificate: "Degree Certificate",
    transcript: "Transcript",

    // Footer
    quick_links: "Quick Links",
    information: "Information",
    about_center: "About the Center",
    privacy_policy: "Privacy Policy",
    terms_conditions: "Terms & Conditions",
    copyright_text: "all rights reserved",
    member_bologna: "Member of the Bologna Process",

    // News and articles
    article: "Article",
    article_not_found: "Article not found",
    back_to_news: "Back to News",
    back_to_bologna: "Back to Bologna Process",

    // Types of recognition
    types_of_recognition: "Types of Recognition",
    types_description: "Academic, professional, and qualification recognition",
    types_description_full:
      "Our center provides different types of recognition services depending on your needs. Below are the main types of recognition we offer.",
    academic_recognition: "Academic Recognition",
    academic_recognition_description:
      "Recognition for continuing education at universities and other educational institutions.",
    professional_recognition: "Professional Recognition",
    professional_recognition_description: "Recognition for employment purposes and professional licensing.",
    qualification_recognition: "Qualification Recognition",
    qualification_recognition_description: "Recognition of specific qualifications, degrees, and diplomas.",
    partial_studies_recognition: "Partial Studies Recognition",
    partial_studies_recognition_description: "Recognition of credits and periods of study completed abroad.",

    // Application process
    application_process: "Application Process",
    application_process_description:
      "To apply for recognition of your foreign education documents, please complete the online application form below. Make sure to provide all required information and upload the necessary documents.",

    // Calculator page
    calculator_page_description:
      "Use our calculator to estimate the cost and processing time for your recognition application based on the type of document, country of origin, and urgency of your request.",

    // Database page
    database_description:
      "Search our database of recognized foreign educational institutions and qualifications. This database is regularly updated with information about educational institutions worldwide.",
    search_institutions: "Search institutions...",
    country: "Country",
    all_countries: "All Countries",
    european_union: "European Union",
    asia: "Asia",
    institution_type: "Institution Type",
    all_types: "All Types",
    university: "University",
    college: "College",
    school: "School",
    institution_name: "Institution Name",
    type: "Type",
    recognition_status: "Recognition Status",
    recognized: "Recognized",
    showing_results: "Showing 5 of 1,245 institutions",

    // FAQ page
    faq_description: "Find answers to frequently asked questions about recognition, accreditation, and our services.",
    faq_recognition_time: "How long does the recognition process take?",
    faq_recognition_time_answer:
      "The recognition process typically takes 4-6 weeks from the date of submission of a complete application. However, processing times may vary depending on the complexity of the case, the country of origin of the document, and the completeness of the application.",
    faq_required_documents: "What documents are required for recognition?",
    faq_required_documents_answer:
      "Required documents typically include the original education document, a certified translation (if not in the official language), a copy of your passport or ID, and a complete application form.",
    faq_recognition_cost: "How much does recognition cost?",
    faq_recognition_cost_answer:
      "The cost of recognition varies depending on the type of document, the country of origin, and the urgency of the request. You can use our cost calculator to get an estimate for your specific case.",
    faq_accreditation_meaning: "What is accreditation and why is it important?",
    faq_accreditation_meaning_answer:
      "Accreditation is a process of external quality review used to scrutinize colleges, universities, and educational programs for quality assurance and quality improvement. It is important because it ensures that institutions meet certain standards of quality and integrity.",
    faq_bologna_process: "What is the Bologna Process?",
    faq_bologna_process_answer:
      "The Bologna Process is an intergovernmental higher education reform process that includes 49 European countries and a number of European organizations. Its main goal is to enhance the quality and recognition of European higher education systems and to facilitate student and staff mobility.",
    still_have_questions: "Still Have Questions?",
    contact_us_for_more_info:
      "If you couldn't find the answer to your question, please don't hesitate to contact us. Our team is ready to assist you.",

    // Japan
    japan: "Japan",
    // Russia
    russia: "Russia",
  },
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")

  // Load language preference from localStorage on initial load
  useEffect(() => {
    const storedLanguage = localStorage.getItem("language") as Language
    if (storedLanguage && (storedLanguage === "kk" || storedLanguage === "ru" || storedLanguage === "en")) {
      setLanguage(storedLanguage)
    } else {
      // Try to detect browser language
      const browserLang = navigator.language.split("-")[0]
      if (browserLang === "kk" || browserLang === "ru") {
        setLanguage(browserLang as Language)
      }
    }
  }, [])

  // Save language preference to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("language", language)
    // Update html lang attribute
    document.documentElement.lang = language
    // Update document title based on language
    document.title =
      language === "kk" ? "Білім беру орталығы" : language === "ru" ? "Образовательный центр" : "Education Center"
  }, [language])

  const t = (key: string): string => {
    if (!translations[language]) return key
    return translations[language][key] || key
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
