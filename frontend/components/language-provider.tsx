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
  leaders: Leader[]
}

type Leader = {
  name: string
  position: string
  contact: string
  education: string[]
  experience: string[]
  leaders: Leader[]
}

const leadersByLang: Record<Language, Leader[]> = {
  ru: [
    {
      name: "КУАНГАНОВ ФАРХАД ШАЙМУРАТОВИЧ",
      position: "Директор",
      contact: "f.kuanganov@n-k.kz",
      education: [
        "Магистр государственного управления (MRA), Национальный институт политических исследований (GRIPS), Токио (2001–2002)",
        "Национальная Высшая Школа госуправления при Президенте РК (1996)",
        "Казахский политехнический институт им. В. И. Ленина, АСОИУ, инженер-системотехник (1992)",
      ],
      experience: [
        "11.2022–12.2024 — Руководитель офиса управления проектами НЦРВО МНВО РК",
        "С декабря 2024 — директор НЦРВО МНВО РК",
        "02.2020–10.2022 — ЧУ «Международный научный комплекс «Астана»»",
        "08.2019–01.2020 — Директор Корпоративного фонда «Академия Елбасы»",
        "Советник исполнительного директора Фонда Первого Президента РК-Елбасы",
        "06.2014–07.2019 — Секретарь партии «Нұр Отан» по вопросам идеологии",
        "04.2010–06.2014 — Заместитель акима Северо-Казахстанской области",
        "06.2008–04.2010 — Ответственный секретарь МОН РК",
        "04.2007–06.2008 — Вице-министр образования и науки РК",
        "2006–2007 — Заместитель руководителя Канцелярии Премьер-министра РК",
        "2005–2006 — Заведующий отделом соц-культурного развития Канцелярии Премьер-министра",
        "2003–2005 — Советник Премьер-министра РК",
        "2003 — Заведующий сектором СОКА Администрации Президента РК",
        "1999–2003 — Зам. директора департамента кадровой службы Агентства госслужбы",
        "1997–1999 — Начальник отдела стратегического планирования РК",
        "1996–1997 — Старший эксперт Высшего экономического совета при Президенте РК",
        "1995 — Заместитель директора ГБРК",
        "1995–1996 — Заместитель директора департамента информатизации Экспертно-импортного банка РК",
        "1993–1995 — Старший инженер КазАБ «Туранбанк»",
        "1992–1993 — Инженер Института проблем информатики и управления НАН РК",
        "1987 — Техник Казгипросельхоз",
      ],
      leaders: []
    },
    {
      name: "ИРГЕБАЕВ ЕРЖАН ТУРСЫНХАНУЛЫ",
      position: "Заместитель директора",
      contact: "y.irgebayev@n-k.kz",
      education: [
        "Восточно-Казахстанский гос. техн. ун-т им. Д. Серикбаева (1998)",
        "Восточно-Казахстанский гос. ун-т (2004)",
        "The University of Nottingham, кандидат техн. наук (2018)",
      ],
      experience: [
        "2001 — Директор ТОО «Ниет»",
        "2003–2009 — Зам. директора по производству, ИД Восточно-КазНТУ",
        "2009–2010 — Старший преподаватель Восточно-КазНТУ им. Д. Серикбаева",
        "2010–2014 — Главный эксперт Департамента ВПО МОН РК",
        "2014–2018 — Руководитель Упр. планирования и инноваций ДВПО МОН РК",
        "2018–2019 — Руководитель Упр. планирования и финансирования ВО ДВПО МОН РК",
        "2019–2021 — Зам. директора Департамента ВПО МОН РК",
        "С 2021 — Заместитель директора НЦРВО МНВО РК",
      ],
      leaders: []
    },
    {
      name: "МАДИБЕКОВ АЛИБЕК СЕРГАЗЫЕВИЧ",
      position: "Заместитель директора",
      contact: "a.madibekov@n-k.kz",
      education: [
        "Международный казахско-турецкий ун-т им. А. Яссауи, PhD, юриспруденция",
        "Eurasian National University им. Л. Н. Гумилёва, юриспруденция",
        "Программа «Болашак» — Penn State, право",
      ],
      experience: [
        "Начал в ТОО «KATEV» юристом",
        "2013–2019 — Директор департамента соц. и гражданского развития в Евразийском национальном университете",
        "2019–2021 — Зам. директора департамента развития человеческого капитала НПП «Атамекен»",
        "2022–2023 — Юрист ТОО «ДизайнПроектМонтаж»",
        "С 2023 — Заместитель директора НЦРВО МНВО РК",
      ],
      leaders: []
    },
    {
      name: "НҰРЛАНОВ ШЫНҒЫС НҰРЛАНҰЛЫ",
      position: "Заместитель директора",
      contact: "sh.nurlanov@n-k.kz",
      education: [
        "Программа «Болашак» — Univ. of Washington (2010)",
        "Назарбаев Университет, магистр управления образованием (2019)",
      ],
      experience: [
        "2010 — Специалист АО «Центр международных программ» НУ",
        "2011–2013 — Аналитик ИАЦ МОН РК",
        "2013–2014 — Эксперт проектов Института общественной политики «Нұр Отан»",
        "2014–2016 — Координатор проекта GIZ по проф. образованию",
        "2017–2019 — Директор Республиканской физико-математической школы",
        "2019–2024 — Проректор по соц. развитию КНПУ им. Абая",
        "С февраля 2024 — Координатор стартап-группы НЦРВО",
        "С марта 2024 — Заместитель директора НЦРВО МНВО РК",
      ],
      leaders: []
    },
    {
      name: "НУРМАГАМБЕТОВ АМАНТАЙ АБИЛХАИРОВИЧ",
      position: "Советник директора",
      contact: "a.nurmagambetov@n-k.kz",
      education: [
        "КазГУ им. С. М. Кирова, физика (1974)",
        "Аспирантура МГУ им. М. В. Ломоносова (1983)",
      ],
      experience: [
        "—",
      ],
      leaders: []
    },
  ],
  kk: [
    {
      name: "ҚУАҢҒАНОВ ФАРХАД ШАЙМҰРАТҰЛЫ",
      position: "Директор",
      contact: "f.kuanganov@n-k.kz",
      education: [
        "Мемлекеттік басқару магистрі (MRA), Саяси зерттеулер ұлттық институты (GRIPS), Токио (2001–2002)",
        "Қазақстан Республикасы Президенті жанындағы Мемлекеттік басқару ұлттық жоғары мектебі (1996)",
        "В.И. Ленин атындағы Қазақ политехникалық институты, АСОИУ, инженер-жүйетехник (1992)",
      ],
      experience: [
        "11.2022–12.2024 — Жобаларды басқару офисінің жетекшісі, НЦРВО МҒБО РК",
        "2024 ж. желтоқсанынан — НЦРВО МҒБО РК директоры",
        "02.2020–10.2022 — «Астана» халықаралық ғылыми кешені",
        "08.2019–01.2020 — «Елбасы Академиясы» корпоративтік қорының директоры",
        "Қазақстан Республикасының Тұңғыш Президенті Қорының атқарушы директорының кеңесшісі",
        "06.2014–07.2019 — «Нұр Отан» партиясының идеология бойынша хатшысы",
        "04.2010–06.2014 — Солтүстік Қазақстан облысы әкімінің орынбасары",
        "06.2008–04.2010 — ҚР БҒМ жауапты хатшысы",
        "04.2007–06.2008 — ҚР Білім және ғылым вице-министрі",
        "2006–2007 — ҚР Премьер-Министрі кеңсесі басшысының орынбасары",
        "2005–2006 — ҚР Премьер-Министрі кеңсесінің әлеуметтік-мәдени даму бөлімінің меңгерушісі",
        "2003–2005 — ҚР Премьер-Министрінің кеңесшісі",
        "2003 — ҚР Президенті Әкімшілігінің әлеуметтік-экономикалық талдау секторының меңгерушісі",
        "1999–2003 — ҚР Мемлекеттік қызмет істері агенттігінің кадр департаменті директорының орынбасары",
        "1997–1999 — ҚР стратегиялық жоспарлау басқармасының бастығы",
        "1996–1997 — ҚР Президенті жанындағы Жоғары экономикалық кеңестің аға сарапшысы",
        "1995 — ҚР Даму мемлекеттік банкінің директорының орынбасары",
        "1995–1996 — ҚР Экспорт-импорт банкінің ақпараттандыру департаменті директорының орынбасары",
        "1993–1995 — «Тұранбанк» АҚ аға инженері",
        "1992–1993 — ҚР ҰҒА Ақпараттық және басқару проблемалары институтының инженері",
        "1987 — «Қазгипросельхоз» жобалау институтының технигі",
      ],
      leaders: []
    },
    {
      name: "ІРГЕБАЕВ ЕРЖАН ТҰРСЫНХАНҰЛЫ",
      position: "Директордың орынбасары",
      contact: "y.irgebayev@n-k.kz",
      education: [
        "Д. Серікбаев атындағы ШҚМТУ (1998)",
        "ШҚМУ (2004)",
        "Ноттингем университеті, техникалық ғылымдар кандидаты (2018)",
      ],
      experience: [
        "2001 — «Ниет» ЖШС директоры",
        "2003–2009 — өндірістік жұмыс бойынша директор орынбасары, ШҚМТУ",
        "2009–2010 — Д. Серікбаев атындағы ШҚМТУ аға оқытушысы",
        "2010–2014 — ҚР БҒМ ЖОО қызметін үйлестіру басқармасының бас сарапшысы",
        "2014–2018 — ҚР БҒМ ЖОО дамыту және инновациялар басқармасының басшысы",
        "2018–2019 — ҚР БҒМ ЖОО қаржыландыру және жоспарлау басқармасының басшысы",
        "2019–2021 — ҚР БҒМ ЖОО департаменті директорының орынбасары",
        "2021 жылдан — НЦРВО МҒБО РК директордың орынбасары",
      ],
      leaders: []
    },
    {
      name: "МӘДІБЕКОВ ӘЛІБЕК СЕРҒАЗЫҰЛЫ",
      position: "Директордың орынбасары",
      contact: "a.madibekov@n-k.kz",
      education: [
        "А. Яссауи атындағы ХҚТУ, PhD, құқық",
        "Л. Гумилев атындағы ЕҰУ, құқық",
        "«Болашақ» бағдарламасы — Penn State University, құқық",
      ],
      experience: [
        "«KATEV» ҚҚ — заңгер",
        "2013–2019 — ЕҰУ әлеуметтік даму департаментінің директоры",
        "2019–2021 — «Атамекен» ҰКП адами капиталды дамыту департаменті директорының орынбасары",
        "2022–2023 — «ДизайнПроектМонтаж» ЖШС заңгері",
        "2023 жылдан — НЦРВО МҒБО РК директордың орынбасары",
      ],
      leaders: []
    },
    {
      name: "НҰРЛАНҰЛЫ ШЫНҒЫС НҰРЛАНҰЛЫ",
      position: "Директордың орынбасары",
      contact: "sh.nurlanov@n-k.kz",
      education: [
        "«Болашақ» бағдарламасы — Вашингтон университеті (2010)",
        "Назарбаев Университеті, білім беру менеджменті магистрі (2019)",
      ],
      experience: [
        "2010 — «Халықаралық бағдарламалар орталығы» АҚ маманы",
        "2011–2013 — ҚР БҒМ Ақпараттық-талдау орталығының талдаушысы",
        "2013–2014 — «Нұр Отан» партиясы қоғамдық саясат институтының сарапшысы",
        "2014–2016 — GIZ жобасының үйлестірушісі",
        "2017–2019 — РҚММФМ мектебі директоры",
        "2019–2024 — Абай атындағы ҚазҰПУ әлеуметтік даму жөніндегі проректоры",
        "2024 ж. ақпан — НЦРВО стартап-жобалар тобының үйлестірушісі",
        "2024 ж. наурыз — НЦРВО МҒБО РК директордың орынбасары",
      ],
      leaders: []
    },
    {
      name: "НҰРМАҒАМБЕТОВ АМАНТАЙ ӘБІЛХАЙЫРҰЛЫ",
      position: "Директордың кеңесшісі",
      contact: "a.nurmagambetov@n-k.kz",
      education: [
        "С. М. Киров атындағы ҚазМУ, физика (1974)",
        "М. В. Ломоносов атындағы ММУ аспирантурасы (1983)",
      ],
      experience: ["—"],
      leaders: []
    },
  ],
  en: [
    {
      name: "KUANGANOV FARHAD SHAIMURATOVICH",
      position: "Director",
      contact: "f.kuanganov@n-k.kz",
      education: [
        "Master of Public Administration (MPA), GRIPS, Tokyo (2001–2002)",
        "National Higher School of Public Administration under the President of the Republic of Kazakhstan (1996)",
        "Kazakh Polytechnic Institute named after V.I. Lenin, ASOIU, Systems Engineer (1992)",
      ],
      experience: [
        "11.2022–12.2024 — Head of Project Management Office at NCHE",
        "Since Dec 2024 — Director of NCHE",
        "02.2020–10.2022 — International Scientific Complex 'Astana'",
        "08.2019–01.2020 — Director of the Corporate Foundation 'Elbasy Academy'",
        "Advisor to the Executive Director of the First President’s Fund",
        "06.2014–07.2019 — Secretary of 'Nur Otan' party for ideological issues",
        "04.2010–06.2014 — Deputy Akim of North Kazakhstan Region",
        "06.2008–04.2010 — Executive Secretary of the Ministry of Education and Science",
        "04.2007–06.2008 — Vice Minister of Education and Science",
        "2006–2007 — Deputy Head of the Prime Minister’s Office",
        "2005–2006 — Head of Socio-Cultural Development Department, PM’s Office",
        "2003–2005 — Advisor to the Prime Minister",
        "2003 — Head of Socio-Economic Sector, Presidential Administration",
        "1999–2003 — Deputy Director, Civil Service Personnel Department",
        "1997–1999 — Head of Strategic Planning Department",
        "1996–1997 — Senior Expert, Supreme Economic Council under the President",
        "1995 — Deputy Director of the Development Bank of Kazakhstan",
        "1995–1996 — Deputy Director, IT Department, Export-Import Bank",
        "1993–1995 — Senior Engineer, Turanbank",
        "1992–1993 — Engineer, Institute of Informatics and Control, National Academy of Sciences",
        "1987 — Technician, Kazgiproselkhoz",
      ],
      leaders: []
    },
    {
      name: "IRGEBAEV YERZHAN TURSYNKHANULY",
      position: "Deputy Director",
      contact: "y.irgebayev@n-k.kz",
      education: [
        "East Kazakhstan Technical University named after D. Serikbayev (1998)",
        "East Kazakhstan State University (2004)",
        "The University of Nottingham, PhD in Technical Sciences (2018)",
      ],
      experience: [
        "2001 — Director of LLP 'Niyet'",
        "2003–2009 — Deputy Director for Production, Executive Director at East-Kazakhstan TGC",
        "2009–2010 — Senior Lecturer, EKTU named after D. Serikbayev",
        "2010–2014 — Chief Expert, Higher Education Department, MoES RK",
        "2014–2018 — Head of Planning and Innovation Department, MoES RK",
        "2018–2019 — Head of Higher Ed Planning and Finance Department, MoES RK",
        "2019–2021 — Deputy Director, Higher Ed Department, MoES RK",
        "Since 2021 — Deputy Director of NCHE",
      ],
      leaders: []
    },
    {
      name: "MADIBEKOV ALIBEK SERGAZIEVICH",
      position: "Deputy Director",
      contact: "a.madibekov@n-k.kz",
      education: [
        "International Kazakh-Turkish University named after A. Yassawi, PhD in Law",
        "Eurasian National University named after L.N. Gumilyov, Law",
        "Bolashak Program — Penn State University, Law",
      ],
      experience: [
        "Started as a lawyer at the 'KATEV' Foundation",
        "2013–2019 — Director of the Social and Civic Development Department, ENU",
        "2019–2021 — Deputy Director, Human Capital Development Department, Atameken",
        "2022–2023 — Lawyer at LLP 'DesignProjectMontage'",
        "Since 2023 — Deputy Director of NCHE",
      ],
      leaders: []
    },
    {
      name: "NURLANOV SHYNGYS NURLANULY",
      position: "Deputy Director",
      contact: "sh.nurlanov@n-k.kz",
      education: [
        "Bolashak Program — University of Washington (2010)",
        "Nazarbayev University, MA in Educational Leadership (2019)",
      ],
      experience: [
        "2010 — Specialist, JSC 'Center for International Programs'",
        "2011–2013 — Analyst, IAC, MoES RK",
        "2013–2014 — Expert, Institute of Public Policy, 'Nur Otan'",
        "2014–2016 — Coordinator of GIZ project on vocational education",
        "2017–2019 — Director of Republican Physics and Math School",
        "2019–2024 — Vice-Rector for Social Development, Abai KazNPU",
        "Since Feb 2024 — Startup Project Coordinator, NCHE",
        "Since Mar 2024 — Deputy Director of NCHE",
      ],
      leaders: []
    },
    {
      name: "NURMAGAMBETOV AMANTAI ABILKHAIROVICH",
      position: "Advisor to the Director",
      contact: "a.nurmagambetov@n-k.kz",
      education: [
        "Kazakh State University named after S.M. Kirov, Physics (1974)",
        "Postgraduate Studies, Moscow State University named after M.V. Lomonosov (1983)",
      ],
      experience: [
        "—",
      ],
      leaders: []
    },
  ],
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

    // About:
    about_title: "Орталық туралы",
    about_history: "Орталықтың тарихы",
    about_history_p1: "ҚР ҒЖБМ-не қарасты «Жоғары білім беруді дамыту ұлттық орталығы» шаруашылық жүргізу құқығындағы РМК – ҚР Ғылым және жоғары білім министрлігінің ведомстволық бағынысты ұйымы.",
    about_history_p2: "Қазақстан 2010 жылы Болон декларациясына қол қойып, Болон процесіне қосылған 47-ші ел және Еуропалық жоғары білім беру кеңістігінің толық мүшесі болған алғашқы Орталық Азия мемлекеті болды.",
    about_history_p3: "Әр қатысушы ел Болон процесінің міндетті, ұсынылатын және факультативті параметрлерін орындауға міндеттенеді.",
    about_history_p4: "Орталық 2012 жылғы 31 тамызда Болон процесі параметрлерін ұлттық деңгейде жүзеге асыруды әдістемелік, ғылыми-әдістемелік және ақпараттық-талдамалық қамтамасыз ету мақсатында құрылды.",
    about_history_p5: "Негізі – ҚР Президентінің 2010 жылғы 7 желтоқсандағы №1118 Жарлығы «Қазақстан Республикасында білім беруді дамытудың 2011–2020 жылдарға арналған мемлекеттік бағдарламасын бекіту туралы».",
    about_mission: "Миссиясы",
    about_mission_text: "Қазақстандағы жоғары және жоғары оқу орнынан кейінгі білім беру жүйесінде Болон процесі параметрлерін енгізуді ғылыми-әдістемелік және ақпараттық-талдамалық сүйемелдеу.",
    about_leadership: "Басшылық құрамы",
    about_contact: "Байланыс",
    about_education: "Білімі",
    about_experience: "Еңбек өтілі",

    // Footer
    footer_description: "Шетелдік білім құжаттарын тану және аккредитациялау жөніндегі ресми орталық.",
    quick_link: "Жылдам сілтемелер",
    informations: "Ақпарат",
    legislation: "Заңнама",
    contactus: "Байланыс",
    footer_address_line1: "Сығанақ көшесі, 70",
    footer_address_line2: "Астана, Қазақстан",
    footer_address_line3: "010000",
    footer_phone: "+7 (7172) 57-20-75",
    footer_email: "cbpiam@n-k.kz",
    all_rights_reserved: "Барлық құқықтар қорғалған.",

    // FAQ section
    what_is_recognition: "Құжаттарды тану дегеніміз не?",
    recognition_explanation: "Құжаттарды тану — бұл шетелдік білім құжаттарын бағалап, Қазақстанда қолдануға ресми түрде мойындау рәсімі.",
    how_to_apply: "Қалай өтініш беруге болады?",
    application_process_faq: "Сайттағы онлайн-форманы толтырып, қажетті құжаттардың сканерлерін жүктеп, тиісті төлемді жасаңыз. Содан кейін өтінішіңіздің қабылданғаны туралы растау аласыз.",
    required_document: "Қандай құжаттар қажет?",
    documents_list: "1. Диплом немесе сертификаттың түпнұсқасы\n2. Ресми аударма (құжат орыс тілінде болмаса)\n3. Паспорт немесе жеке куәлік көшірмесі\n4. Қосымша куәландыратын құжаттар (қажет болса)",
    processing_times: "Процесс қанша уақыт алады?",
    processing_time_explanation: "Құжаттар пакетін қарастыру орта есеппен 4–6 аптаға созылады.",
    recognition_fees: "Процедура қанша тұрады?",
    fees_explanation: "Құн құжат түріне және өңдеу мерзіміне байланысты. Оларды біздің үлгі калькуляторында бағалай аласыз.",
    appeal_process: "Шешімді қалай шағымдануға болады?",
    appeal_explanation: "Нәтижеге наразы болсаңыз, шешімді алғаннан кейін 30 күн ішінде жазбаша апелляция бере аласыз.",

    // FAQ ids
    faq_q_recognition: "Танудың мәні неде?",
    faq_a_recognition: "Тану – шетелдік дипломның қазақстандық білімге сәйкестігін ресми түрде мойындау.",
    faq_q_application: "Тануға өтінімді қалай беруге болады?",
    faq_a_application: "Онлайн портал арқылы өтінім беріп, қажетті құжаттарды тіркей аласыз.",
    faq_q_documents: "Қандай құжаттар қажет?",
    faq_a_documents: "Диплом, қосымша (транскрипт), жеке куәлік және қазақ/орыс тіліне аударма қажет.",
    faq_q_duration: "Процесс қанша уақыт алады?",
    faq_a_duration: "Қарапайым жағдайда 2–4 апта, күрделілігіне байланысты өзгеруі мүмкін.",
    faq_q_cost: "Танудың құны қанша тұрады?",
    faq_a_cost: "Қызмет құны білім деңгейі мен шұғылдылығына байланысты. Бағалауды калькулятор арқылы жүргізіңіз.",
    faq_q_appeal: "Шешімге шағымдануға бола ма?",
    faq_a_appeal: "Иә, шешім шыққаннан кейін 30 күн ішінде апелляция беруге болады.",
    frequently_asked_questions: "Жиі қойылатын сұрақтар",
    faq_description: "Тану, аккредитация және қызметтеріміз бойынша жиі қойылатын сұрақтардың жауабын табыңыз.",
    still_have_questions: "Сұрақтарыңыз қалды ма?",
    contact_us_for_more_info: "Егер сұраққа жауап таппасаңыз, бізге хабарласыңыз — көмектесуге дайынбыз.",

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

    // About section
    about_title: "О центре",
    about_history: "История центра",
    about_history_p1: "РГП на ПХВ \"Национальный Центр развития высшего образования\" МНВО РК — подведомственная организация Министерства науки и высшего образования Республики Казахстан.",
    about_history_p2: "Казахстан, подписав Болонскую Декларацию в 2010 году, стал 47-й страной-участницей Болонского процесса и первым центрально-азиатским государством в ЕHEA.",
    about_history_p3: "Каждая страна-участница обязуется выполнять обязательные, рекомендательные и факультативные параметры Болонского процесса.",
    about_history_p4: "Центр создан 31 августа 2012 года для методологического, научно-методического и информационно-аналитического сопровождения параметров Болонского процесса в РК.",
    about_history_p5: "Основание — Указ Президента РК от 7 декабря 2010 года №1118 «Об утверждении Государственной программы развития образования РК на 2011–2020 годы».",
    about_mission: "Миссия",
    about_mission_text: "Научно-методическое и информационно-аналитическое сопровождение внедрения параметров Болонского процесса в системе высшего и послевузовского образования Казахстана.",
    about_leadership: "Руководящий состав",
    about_contact: "Контакт",
    about_education: "Образование",
    about_experience: "Профессиональный опыт",

    // Footer
    footer_description: "Официальный центр признания и аккредитации иностранных документов об образовании.",
    quick_link: "Быстрые ссылки",
    informations: "Информация",
    legislation: "Законодательство",
    contactus: "Связаться с нами",
    footer_address_line1: "Улица Сыганак, 70",
    footer_address_line2: "Астана, Казахстан",
    footer_address_line3: "010000",
    footer_phone: "+7 (7172) 57-20-75",
    footer_email: "cbpiam@n-k.kz",
    all_rights_reserved: "Все права защищены.",

    // FAQ section
    what_is_recognition: "Что такое признание документов?",
    recognition_explanation: "Признание документов — это официальная процедура оценки и подтверждения ваших иностранных образовательных квалификаций для их использования в Казахстане.",
    how_to_apply: "Как подать заявку?",
    application_process_faq: "Заполните онлайн-форму на нашем сайте, загрузите сканы всех необходимых документов и оплатите соответствующий сбор. После этого вы получите подтверждение о приёме заявки.",
    required_document: "Какие документы нужны?",
    documents_list: "1. Оригинал диплома или сертификата\n2. Заверенный перевод (если документ не на русском)\n3. Копия паспорта или удостоверения личности\n4. Дополнительные подтверждающие документы (при необходимости)",
    processing_times: "Сколько времени занимает процесс?",
    processing_time_explanation: "В среднем рассмотрение полного пакета документов занимает от 4 до 6 недель.",
    recognition_fees: "Сколько стоит процедура?",
    fees_explanation: "Стоимость зависит от типа документа и срочности обработки. Вы можете ориентировочно рассчитать её в нашем калькуляторе стоимости.",
    appeal_process: "Как обжаловать решение?",
    appeal_explanation: "Если вы не согласны с результатом, подайте письменную апелляцию в течение 30 дней со дня получения решения.",

    // FAQ ids
    faq_q_recognition: "Что такое признание образования?",
    faq_a_recognition: "Признание — это официальное подтверждение эквивалентности иностранного диплома казахстанскому образованию.",
    faq_q_application: "Как подать заявку на признание?",
    faq_a_application: "Вы можете подать заявку онлайн через наш портал, заполнив форму и приложив необходимые документы.",
    faq_q_documents: "Какие документы необходимы?",
    faq_a_documents: "Понадобятся диплом, приложение (транскрипт), удостоверение личности и перевод на казахский/русский язык.",
    faq_q_duration: "Сколько времени занимает признание?",
    faq_a_duration: "Процесс обычно занимает от 2 до 4 недель в зависимости от сложности заявки.",
    faq_q_cost: "Сколько стоит услуга признания?",
    faq_a_cost: "Стоимость зависит от уровня образования и срочности рассмотрения. Оцените с помощью калькулятора на сайте.",
    faq_q_appeal: "Можно ли обжаловать решение?",
    faq_a_appeal: "Да, вы можете подать апелляцию в течение 30 дней после получения решения.",
    frequently_asked_questions: "Часто задаваемые вопросы",
    faq_description_id: "Найдите ответы на часто задаваемые вопросы о признании, аккредитации и наших услугах.",
    still_have_questions: "Остались вопросы?",
    contact_us_for_more_info: "Если вы не нашли ответа, свяжитесь с нами — мы с радостью поможем.",

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
    faq_recognition_time_answer: "Процесс признания обычно занимает 4-6 недель с даты подачи полного заявления. Однако время обработки может варьироваться в зависимости от сложности дела, страны происхождения документа и полноты заявления.",
    faq_required_documents: "Какие документы требуются для признания?",
    faq_required_documents_answer: "Необходимые документы обычно включают оригинал документа об образовании, заверенный перевод (если не на официальном языке), копию паспорта или удостоверения личности и заполненную форму заявления.",
    faq_recognition_cost: "Сколько стоит признание?",
    faq_recognition_cost_answer: "Стоимость признания варьируется в зависимости от типа документа, страны происхождения и срочности запроса. Вы можете использовать наш калькулятор стоимости, чтобы получить оценку для вашего конкретного случая.",
    faq_accreditation_meaning: "Что такое аккредитация и почему она важна?",
    faq_accreditation_meaning_answer: "Аккредитация - это процесс внешней проверки качества, используемый для изучения колледжей, университетов и образовательных программ для обеспечения качества и его улучшения. Она важна, потому что обеспечивает соответствие учреждений определенным стандартам качества и целостности.",
    faq_bologna_process: "Что такое Болонский процесс?",
    faq_bologna_process_answer: "Болонский процесс - это межправительственный процесс реформы высшего образования, который включает 49 европейских стран и ряд европейских организаций. Его основная цель - повысить качество и признание европейских систем высшего образования и облегчить мобильность студентов и персонала.",
    still_have_questions: "Остались вопросы?",
    contact_us_for_more_info: "Если вы не смогли найти ответ на свой вопрос, пожалуйста, не стесняйтесь связаться с нами. Наша команда готова помочь вам.",

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

    // About section
    about_title: "About the Center",
    about_history: "History of the Center",
    about_history_p1: "The Republican State Enterprise 'National Center for the Development of Higher Education' is a subordinate organization of the Ministry of Science and Higher Education of the Republic of Kazakhstan.",
    about_history_p2: "By signing the Bologna Declaration in 2010, Kazakhstan became the 47th country to join the Bologna Process and the first Central Asian country recognized as a full member of the European Higher Education Area (EHEA).",
    about_history_p3: "Each participating country commits to implementing mandatory, recommended, and optional parameters of the Bologna Process.",
    about_history_p4: "The Center was established on August 31, 2012, to provide methodological, scientific-methodological, and information-analytical support for implementing Bologna Process parameters in Kazakhstan.",
    about_history_p5: "Based on Presidential Decree No. 1118 dated December 7, 2010, 'On Approval of the State Program for the Development of Education of the Republic of Kazakhstan for 2011–2020.'",
    about_mission: "Mission",
    about_mission_text: "Providing scientific, methodological, and analytical support for the implementation of Bologna Process parameters in the system of higher and postgraduate education in Kazakhstan.",
    about_leadership: "Leadership Team",
    about_contact: "Contact",
    about_education: "Education",
    about_experience: "Professional Experience",

    // Footer
    footer_description: "Official center for recognition and accreditation of foreign education documents.",
    quick_link: "Quick Links",
    informations: "Information",
    legislation: "Legislation",
    contactus: "Contact Us",
    footer_address_line1: "70 Syganak Street",
    footer_address_line2: "Astana, Kazakhstan",
    footer_address_line3: "010000",
    footer_phone: "+7 (7172) 57-20-75",
    footer_email: "cbpiam@n-k.kz",
    all_rights_reserved: "All rights reserved.",

    // FAQ section
    what_is_recognition: "What is document recognition?",
    recognition_explanation: "Recognition of documents is the official process of evaluating and validating foreign educational credentials for use in Kazakhstan.",
    how_to_apply: "How do I apply?",
    application_process_faq: "Fill out the online application form on our website, upload scans of all required documents, and pay the applicable fee. You will then receive a confirmation of your submission.",
    required_document: "What documents are required?",
    documents_list: "1. Original diploma or certificate\n2. Certified translation (if not in Russian)\n3. Copy of passport or ID\n4. Any additional supporting documents (if applicable)",
    processing_times: "How long does the process take?",
    processing_time_explanation: "The review of a complete set of documents typically takes 4–6 weeks.",
    recognition_fees: "How much does the process cost?",
    fees_explanation: "Fees vary depending on the document type and processing time. You can estimate them using our cost calculator.",
    appeal_process: "How can I appeal the decision?",
    appeal_explanation: "If you disagree with the decision, you may submit a written appeal within 30 days of receiving it.",

    // FAQ ids
    faq_q_recognition: "What is educational recognition?",
    faq_a_recognition: "Recognition is the official confirmation that a foreign diploma is equivalent to Kazakh education.",
    faq_q_application: "How do I apply for recognition?",
    faq_a_application: "You can apply online through our portal by filling out the form and uploading required documents.",
    faq_q_documents: "What documents are needed?",
    faq_a_documents: "You’ll need a diploma, transcript, ID document, and a translation into Kazakh or Russian.",
    faq_q_duration: "How long does the recognition take?",
    faq_a_duration: "Typically 2–4 weeks depending on complexity.",
    faq_q_cost: "How much does recognition cost?",
    faq_a_cost: "The fee depends on education level and urgency. Use the calculator on the website for estimates.",
    faq_q_appeal: "Can I appeal the decision?",
    faq_a_appeal: "Yes, you can submit an appeal within 30 days of receiving the decision.",
    frequently_asked_questions: "Frequently Asked Questions",
    faq_description_id: "Find answers to common questions about recognition, accreditation, and our services.",
    still_have_questions: "Still have questions?",
    contact_us_for_more_info: "If you didn’t find your answer, contact us — we’re here to help.",

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

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, leaders: leadersByLang[language] }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
