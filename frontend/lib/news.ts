// Mock data for news articles
const newsArticles = {
  "1": {
    id: "1",
    title: {
      en: "New Recognition Agreement with EU Countries",
      ru: "Новое соглашение о признании с странами ЕС",
      kk: "ЕО елдерімен жаңа тану келісімі",
    },
    date: "2025-05-15",
    category: {
      en: "Agreements",
      ru: "Соглашения",
      kk: "Келісімдер",
    },
    image: "/placeholder.svg?height=400&width=800",
    content: {
      en: `<p>The Center has signed a new agreement with EU countries to streamline the recognition process for educational documents. This agreement will facilitate the mobility of students and professionals between our country and EU member states.</p>
      
      <p>The agreement, which was signed during a ceremony in Brussels, establishes a framework for automatic recognition of higher education qualifications between our country and the European Union. This means that degrees and diplomas issued by accredited institutions in our country will be recognized across the EU, and vice versa.</p>
      
      <h2>Key Benefits</h2>
      
      <ul>
        <li>Faster recognition process for students and professionals</li>
        <li>Reduced administrative burden for educational institutions</li>
        <li>Enhanced mobility opportunities for students and researchers</li>
        <li>Stronger academic and professional ties with EU countries</li>
      </ul>
      
      <p>The agreement will come into effect on January 1, 2026, giving institutions time to adapt to the new framework. The Center will organize a series of workshops and webinars in the coming months to help stakeholders understand the implications of the agreement.</p>
      
      <p>"This is a significant milestone in our efforts to integrate our education system with international standards," said the Director of the Center. "It will open up new opportunities for our students and professionals, and strengthen our position in the global education landscape."</p>`,

      ru: `<p>Центр подписал новое соглашение со странами ЕС для упрощения процесса признания образовательных документов. Это соглашение облегчит мобильность студентов и профессионалов между нашей страной и государствами-членами ЕС.</p>
      
      <p>Соглашение, подписанное во время церемонии в Брюсселе, устанавливает рамки для автоматического признания квалификаций высшего образования между нашей страной и Европейским Союзом. Это означает, что степени и дипломы, выданные аккредитованными учреждениями в нашей стране, будут признаны по всему ЕС, и наоборот.</p>
      
      <h2>Ключевые преимущества</h2>
      
      <ul>
        <li>Более быстрый процесс признания для студентов и профессионалов</li>
        <li>Снижение административной нагрузки для образовательных учреждений</li>
        <li>Расширенные возможности мобильности для студентов и исследователей</li>
        <li>Укрепление академических и профессиональных связей со странами ЕС</li>
      </ul>
      
      <p>Соглашение вступит в силу 1 января 2026 года, давая учреждениям время для адаптации к новой структуре. Центр организует серию семинаров и вебинаров в ближайшие месяцы, чтобы помочь заинтересованным сторонам понять последствия соглашения.</p>
      
      <p>"Это значительная веха в наших усилиях по интеграции нашей системы образования с международными стандартами", - сказал директор Центра. "Это откроет новые возможности для наших студентов и профессионалов и укрепит нашу позицию в глобальном образовательном ландшафте."</p>`,

      kk: `<p>Орталық білім беру құжаттарын тану процесін жеңілдету үшін ЕО елдерімен жаңа келісімге қол қойды. Бұл келісім біздің ел мен ЕО мүше мемлекеттері арасында студенттер мен мамандардың ұтқырлығын жеңілдетеді.</p>
      
      <p>Брюссельдегі салтанатты рәсім кезінде қол қойылған келісім біздің ел мен Еуропалық Одақ арасында жоғары білім біліктілігін автоматты түрде тану үшін негіз қалайды. Бұл біздің елдегі аккредиттелген мекемелер берген дәрежелер мен дипломдар бүкіл ЕО-да танылатынын және керісінше білдіреді.</p>
      
      <h2>Негізгі артықшылықтар</h2>
      
      <ul>
        <li>Студенттер мен мамандар үшін жылдамырақ тану процесі</li>
        <li>Білім беру мекемелері үшін әкімшілік жүктемені азайту</li>
        <li>Студенттер мен зерттеушілер үшін ұтқырлық мүмкіндіктерін кеңейту</li>
        <li>ЕО елдерімен академиялық және кәсіби байланыстарды нығайту</li>
      </ul>
      
      <p>Келісім 2026 жылдың 1 қаңтарында күшіне енеді, бұл мекемелерге жаңа құрылымға бейімделуге уақыт береді. Орталық келесі айларда мүдделі тараптарға келісімнің салдарын түсінуге көмектесу үшін семинарлар мен вебинарлар сериясын ұйымдастырады.</p>
      
      <p>"Бұл біздің білім беру жүйемізді халықаралық стандарттармен интеграциялау жөніндегі күш-жігеріміздегі маңызды кезең", - деді Орталық директоры. "Бұл біздің студенттер мен мамандар үшін жаңа мүмкіндіктер ашады және жаһандық білім беру ландшафтындағы позициямызды нығайтады."</p>`,
    },
  },
  "2": {
    id: "2",
    title: {
      en: "Upcoming Webinar on Accreditation Standards",
      ru: "Предстоящий вебинар по стандартам аккредитации",
      kk: "Аккредитация стандарттары бойынша алдағы вебинар",
    },
    date: "2025-05-10",
    category: {
      en: "Events",
      ru: "События",
      kk: "Оқиғалар",
    },
    image: "/placeholder.svg?height=400&width=800",
    content: {
      en: `<p>Join our experts for a comprehensive overview of the latest accreditation standards and procedures. The webinar will cover key aspects of institutional and program accreditation, quality assurance mechanisms, and best practices.</p>
      
      <h2>Webinar Details</h2>
      
      <ul>
        <li><strong>Date:</strong> May 25, 2025</li>
        <li><strong>Time:</strong> 10:00 AM - 12:00 PM (Local Time)</li>
        <li><strong>Platform:</strong> Zoom</li>
        <li><strong>Language:</strong> English (with simultaneous translation to Russian and Kazakh)</li>
        <li><strong>Registration:</strong> Free, but registration is required</li>
      </ul>
      
      <h2>Topics to be Covered</h2>
      
      <ol>
        <li>Overview of the new accreditation standards</li>
        <li>Changes in the accreditation process</li>
        <li>Documentation requirements</li>
        <li>Self-evaluation procedures</li>
        <li>Preparing for on-site visits</li>
        <li>Common challenges and how to address them</li>
      </ol>
      
      <p>The webinar will be led by Dr. Anna Petrova, Head of Accreditation at the Center, and will feature guest speakers from partner accreditation agencies in Europe and Asia.</p>
      
      <p>Participants will have the opportunity to ask questions and engage in discussions with the experts. A certificate of participation will be provided to all attendees.</p>
      
      <p>To register for the webinar, please fill out the registration form on our website or contact us at events@education-center.org.</p>`,

      ru: `<p>Присоединяйтесь к нашим экспертам для всестороннего обзора последних стандартов и процедур аккредитации. Вебинар охватит ключевые аспекты институциональной и программной аккредитации, механизмы обеспечения качества и лучшие практики.</p>
      
      <h2>Детали вебинара</h2>
      
      <ul>
        <li><strong>Дата:</strong> 25 мая 2025 г.</li>
        <li><strong>Время:</strong> 10:00 - 12:00 (местное время)</li>
        <li><strong>Платформа:</strong> Zoom</li>
        <li><strong>Язык:</strong> Английский (с синхронным переводом на русский и казахский)</li>
        <li><strong>Регистрация:</strong> Бесплатно, но требуется регистрация</li>
      </ul>
      
      <h2>Темы для обсуждения</h2>
      
      <ol>
        <li>Обзор новых стандартов аккредитации</li>
        <li>Изменения в процессе аккредитации</li>
        <li>Требования к документации</li>
        <li>Процедуры самооценки</li>
        <li>Подготовка к выездным визитам</li>
        <li>Распространенные проблемы и способы их решения</li>
      </ol>
      
      <p>Вебинар будет проводить д-р Анна Петрова, руководитель отдела аккредитации Центра, с участием приглашенных докладчиков из партнерских аккредитационных агентств Европы и Азии.</p>
      
      <p>Участники будут иметь возможность задавать вопросы и участвовать в дискуссиях с экспертами. Всем участникам будет предоставлен сертификат участия.</p>`,

      kk: `<p>Аккредитацияның соңғы стандарттары мен процедураларына жан-жақты шолу жасау үшін біздің сарапшыларға қосылыңыз. Вебинар институционалдық және бағдарламалық аккредитацияның негізгі аспектілерін, сапаны қамтамасыз ету механизмдерін және үздік тәжірибелерді қамтиды.</p>
      
      <h2>Вебинар туралы мәліметтер</h2>
      
      <ul>
        <li><strong>Күні:</strong> 2025 жылдың 25 мамыры</li>
        <li><strong>Уақыты:</strong> 10:00 - 12:00 (жергілікті уақыт)</li>
        <li><strong>Платформа:</strong> Zoom</li>
        <li><strong>Тіл:</strong> Ағылшын (орыс және қазақ тілдеріне синхронды аудармамен)</li>
        <li><strong>Тіркелу:</strong> Тегін, бірақ тіркелу қажет</li>
      </ul>
      
      <h2>Қамтылатын тақырыптар</h2>
      
      <ol>
        <li>Жаңа аккредитация стандарттарына шолу</li>
        <li>Аккредитация процесіндегі өзгерістер</li>
        <li>Құжаттама талаптары</li>
        <li>Өзін-өзі бағалау процедуралары</li>
        <li>Орынға баруға дайындық</li>
        <li>Жалпы қиындықтар және оларды шешу жолдары</li>
      </ol>
      
      <p>Вебинарды Орталықтың аккредитация бөлімінің басшысы д-р Анна Петрова жүргізеді және Еуропа мен Азиядағы серіктес аккредитациялық агенттіктерден шақырылған спикерлер қатысады.</p>
      
      <p>Қатысушылар сұрақтар қоюға және сарапшылармен пікірталастарға қатысуға мүмкіндік алады. Барлық қатысушыларға қатысу сертификаты беріледі.</p>`,
    },
  },
  "3": {
    id: "3",
    title: {
      en: "Annual Report on Educational Quality",
      ru: "Годовой отчет о качестве образования",
      kk: "Білім беру сапасы туралы жылдық есеп",
    },
    date: "2025-05-05",
    category: {
      en: "Reports",
      ru: "Отчеты",
      kk: "Есептер",
    },
    image: "/placeholder.svg?height=400&width=800",
    content: {
      en: `<p>The Center has published its annual report on educational quality and accreditation outcomes. The report provides a detailed analysis of the quality of higher education in our country, highlighting achievements and areas for improvement.</p>
      
      <h2>Key Findings</h2>
      
      <p>The report reveals several important trends in the higher education sector:</p>
      
      <ul>
        <li>A 15% increase in the number of accredited institutions compared to the previous year</li>
        <li>Significant improvements in quality assurance mechanisms across universities</li>
        <li>Enhanced international collaboration in research and academic exchange</li>
        <li>Growing adoption of innovative teaching methods and digital technologies</li>
      </ul>
      
      <p>However, the report also identifies challenges that need to be addressed:</p>
      
      <ul>
        <li>Regional disparities in access to quality higher education</li>
        <li>The need for stronger industry-academia partnerships</li>
        <li>Gaps in the implementation of student-centered learning approaches</li>
      </ul>
      
      <h2>Recommendations</h2>
      
      <p>Based on the findings, the report makes several recommendations:</p>
      
      <ol>
        <li>Develop targeted programs to support institutions in underserved regions</li>
        <li>Establish a national framework for industry-academia collaboration</li>
        <li>Provide professional development opportunities for faculty in student-centered teaching methods</li>
        <li>Enhance the use of learning analytics to improve educational outcomes</li>
        <li>Strengthen international partnerships to promote mobility and knowledge exchange</li>
      </ol>
      
      <p>The full report is available for download on our website. A series of webinars and workshops will be organized in the coming months to discuss the findings and recommendations with stakeholders.</p>`,

      ru: `<p>Центр опубликовал свой годовой отчет о качестве образования и результатах аккредитации. Отчет содержит подробный анализ качества высшего образования в нашей стране, выделяя достижения и области для улучшения.</p>
      
      <h2>Ключевые выводы</h2>
      
      <p>Отчет выявляет несколько важных тенденций в секторе высшего образования:</p>
      
      <ul>
        <li>Увеличение числа аккредитованных учреждений на 15% по сравнению с предыдущим годом</li>
        <li>Значительные улучшения в механизмах обеспечения качества в университетах</li>
        <li>Расширение международного сотрудничества в исследованиях и академическом обмене</li>
        <li>Растущее внедрение инновационных методов обучения и цифровых технологий</li>
      </ul>
      
      <p>Однако в отчете также выявлены проблемы, которые необходимо решить:</p>
      
      <ul>
        <li>Региональные различия в доступе к качественному высшего образования</li>
        <li>Необходимость более тесного партнерства между промышленностью и академическими кругами</li>
        <li>Пробелы в реализации студентоцентрированных подходов к обучению</li>
      </ul>
      
      <h2>Рекомендации</h2>
      
      <p>На основе выводов в отчете даются несколько рекомендаций:</p>
      
      <ol>
        <li>Разработать целевые программы поддержки учреждений в недостаточно обслуживаемых регионах</li>
        <li>Создать национальную структуру для сотрудничества между промышленностью и академическими кругами</li>
        <li>Предоставить возможности профессионального развития для преподавателей в области студентоцентрированных методов обучения</li>
        <li>Расширить использование аналитики обучения для улучшения образовательных результатов</li>
        <li>Укрепить международные партнерства для содействия мобильности и обмену знаниями</li>
      </ol>
      
      <p>Полный отчет доступен для скачивания на нашем сайте. В ближайшие месяцы будет организована серия вебинаров и семинаров для обсуждения выводов и рекомендаций с заинтересованными сторонами.</p>`,

      kk: `<p>Орталық білім беру сапасы мен аккредитация нәтижелері туралы жылдық есебін жариялады. Есепте біздің елдегі жоғары білім сапасына егжей-тегжейлі талдау жасалып, жетістіктер мен жақсарту салалары көрсетілген.</p>
      
      <h2>Негізгі тұжырымдар</h2>
      
      <p>Есеп жоғары білім беру секторындағы бірнеше маңызды тенденцияларды анықтайды:</p>
      
      <ul>
        <li>Өткен жылмен салыстырғанда аккредиттелген мекемелер санының 15%-ға өсуі</li>
        <li>Университеттердегі сапаны қамтамасыз ету механизмдерінің айтарлықтай жақсаруы</li>
        <li>Зерттеулер мен академиялық алмасудағы халықаралық ынтымақтастықтың кеңеюі</li>
        <li>Инновациялық оқыту әдістері мен цифрлық технологияларды қолданудың өсуі</li>
      </ul>
      
      <p>Алайда, есепте шешілуі керек мәселелер де анықталды:</p>
      
      <ul>
        <li>Сапалы жоғары білімге қол жетімділіктегі аймақтық айырмашылықтар</li>
        <li>Өнеркәсіп пен академиялық орта арасындағы күшті серіктестіктің қажеттілігі</li>
        <li>Студентке бағытталған оқыту тәсілдерін енгізудегі олқылықтар</li>
      </ul>
      
      <h2>Ұсыныстар</h2>
      
      <p>Тұжырымдарға сүйене отырып, есепте бірнеше ұсыныстар жасалады:</p>
      
      <ol>
        <li>Қызмет көрсетілмейтін аймақтардағы мекемелерді қолдауға арналған мақсатты бағдарламаларды әзірлеу</li>
        <li>Өнеркәсіп пен академиялық орта арасындағы ынтымақтастық үшін ұлттық құрылым құру</li>
        <li>Оқытушыларға студентке бағытталған оқыту әдістері бойынша кәсіби даму мүмкіндіктерін ұсыну</li>
        <li>Білім беру нәтижелерін жақсарту үшін оқыту аналитикасын пайдалануды кеңейту</li>
        <li>Ұтқырлық пен білім алмасуды ілгерілету үшін халықаралық серіктестікті нығайту</li>
      </ol>
      
      <p>Толық есеп біздің веб-сайтымызда жүктеуге қол жетімді. Келесі айларда мүдделі тараптармен тұжырымдар мен ұсыныстарды талқылау үшін вебинарлар мен семинарлар сериясы ұйымдастырылады.</p>`,
    },
  },
}

export async function getNewsArticles() {
  // In a real application, this would fetch from an API or database
  return Object.values(newsArticles).map((article) => ({
    id: article.id,
    title: article.title,
    date: article.date,
    category: article.category,
    image: article.image,
  }))
}

export async function getNewsArticle(id: string) {
  // In a real application, this would fetch from an API or database
  return newsArticles[id] || null
}
