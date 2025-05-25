// Mock data for Bologna Process articles
const bolognaArticles = {
  "overview": {
    slug: "overview",
    title: {
      en: "Overview of the Bologna Process",
      ru: "Обзор Болонского процесса",
      kk: "Болон процесіне шолу",
    },
    image: "/placeholder.svg?height=400&width=800",
    content: {
      en: `<p>The Bologna Process, initiated in 1999, aims to create a European Higher Education Area (EHEA) by making academic degree standards and quality assurance standards more comparable and compatible throughout Europe.</p>
      
      <p>Named after the University of Bologna, where the initiative was launched, the process has transformed European higher education, introducing a three-cycle system (bachelor's, master's, doctorate), quality assurance standards, and tools for recognition such as the European Credit Transfer and Accumulation System (ECTS).</p>
      
      <h2>Key Objectives</h2>
      
      <ul>
        <li>Adoption of a system of easily readable and comparable degrees</li>
        <li>Implementation of a three-cycle system (Bachelor, Master, Doctorate)</li>
        <li>Establishment of a credit system (ECTS) for promoting student mobility</li>
        <li>Promotion of European cooperation in quality assurance</li>
        <li>Promotion of mobility for students, teachers, researchers, and administrative staff</li>
        <li>Promotion of lifelong learning as an essential element of the EHEA</li>
      </ul>
      
      <h2>Timeline of the Bologna Process</h2>
      
      <ul>
        <li><strong>1999:</strong> Bologna Declaration - 29 European countries signed the Bologna Declaration, launching the Bologna Process.</li>
        <li><strong>2001:</strong> Prague Communiqué - Ministers added three more action lines: lifelong learning, involvement of students, and enhancing the attractiveness of the EHEA.</li>
        <li><strong>2003:</strong> Berlin Communiqué - Doctoral studies were included as the third cycle, and the importance of quality assurance was emphasized.</li>
        <li><strong>2005:</strong> Bergen Communiqué - Ministers adopted the Standards and Guidelines for Quality Assurance and the Framework of Qualifications for the EHEA.</li>
        <li><strong>2007-2009:</strong> London and Leuven Communiqués - Focus on employability, student-centered learning, and the social dimension of higher education.</li>
        <li><strong>2010:</strong> Budapest-Vienna Declaration - Official launch of the European Higher Education Area (EHEA).</li>
        <li><strong>2015-2020:</strong> Yerevan and Paris Communiqués - Emphasis on implementation of key commitments: three-cycle system, recognition, and quality assurance.</li>
        <li><strong>2020-Present:</strong> Rome Communiqué - Focus on digitalization, inclusion, innovation, and interconnection in higher education.</li>
      </ul>
      
      <p>The Bologna Process has been a significant driver of reform in higher education across Europe and beyond. It has facilitated greater mobility for students and staff, enhanced the quality and attractiveness of European higher education, and strengthened the links between education and research.</p>
      
      <p>Our center actively participates in the implementation of the Bologna Process principles and provides support to educational institutions in aligning their programs and practices with the EHEA standards.</p>`,

      ru: `<p>Болонский процесс, начатый в 1999 году, направлен на создание Европейского пространства высшего образования (ЕПВО) путем обеспечения сопоставимости и совместимости стандартов академических степеней и стандартов обеспечения качества по всей Европе.</p>
      
      <p>Названный в честь Болонского университета, где была запущена инициатива, процесс трансформировал европейское высшее образование, внедрив трехцикловую систему (бакалавриат, магистратура, докторантура), стандарты обеспечения качества и инструменты признания, такие как Европейская система перевода и накопления кредитов (ECTS).</p>
      
      <h2>Ключевые цели</h2>
      
      <ul>
        <li>Принятие системы легко читаемых и сопоставимых степеней</li>
        <li>Внедрение трехцикловой системы (бакалавриат, магистратура, докторантура)</li>
        <li>Создание кредитной системы (ECTS) для содействия мобильности студентов</li>
        <li>Содействие европейскому сотрудничеству в обеспечении качества</li>
        <li>Содействие мобильности студентов, преподавателей, исследователей и административного персонала</li>
        <li>Продвижение обучения на протяжении всей жизни как важного элемента ЕПВО</li>
      </ul>
      
      <h2>Хронология Болонского процесса</h2>
      
      <ul>
        <li><strong>1999:</strong> Болонская декларация - 29 европейских стран подписали Болонскую декларацию, положив начало Болонскому процессу.</li>
        <li><strong>2001:</strong> Пражское коммюнике - Министры добавили еще три направления действий: обучение на протяжении всей жизни, вовлечение студентов и повышение привлекательности ЕПВО.</li>
        <li><strong>2003:</strong> Берлинское коммюнике - Докторские исследования были включены в качестве третьего цикла, и была подчеркнута важность обеспечения качества.</li>
        <li><strong>2005:</strong> Бергенское коммюнике - Министры приняли Стандарты и руководства по обеспечению качества и Рамки квалификаций для ЕПВО.</li>
        <li><strong>2007-2009:</strong> Лондонское и Левенское коммюнике - Акцент на трудоустройстве, студентоцентрированном обучении и социальном измерении высшего образования.</li>
        <li><strong>2010:</strong> Будапештско-Венская декларация - Официальный запуск Европейского пространства высшего образования (ЕПВО).</li>
        <li><strong>2015-2020:</strong> Ереванское и Парижское коммюнике - Акцент на реализации ключевых обязательств: трехцикловая система, признание и обеспечение качества.</li>
        <li><strong>2020-настоящее время:</strong> Римское коммюнике - Акцент на цифровизации, инклюзии, инновациях и взаимосвязи в высшем образовании.</li>
      </ul>
      
      <p>Болонский процесс был значительным двигателем реформ в высшем образовании по всей Европе и за ее пределами. Он способствовал большей мобильности студентов и персонала, повысил качество и привлекательность европейского высшего образования и укрепил связи между образованием и исследованиями.</p>
      
      <p>Наш центр активно участвует в реализации принципов Болонского процесса и оказывает поддержку образовательным учреждениям в согласовании их программ и практик со стандартами ЕПВО.</p>`,

      kk: `<p>1999 жылы басталған Болон процесі академиялық дәреже стандарттары мен сапаны қамтамасыз ету стандарттарын бүкіл Еуропада салыстырмалы және үйлесімді ету арқылы Еуропалық жоғары білім беру кеңістігін (EHEA) құруға бағытталған.</p>
      
      <p>Бастама басталған Болонья университетінің құрметіне аталған процесс еуропалық жоғары білімді өзгертті, үш циклдік жүйені (бакалавр, магистр, докторантура), сапаны қамтамасыз ету стандарттарын және Еуропалық кредиттерді аудару және жинақтау жүйесі (ECTS) сияқты тану құралдарын енгізді.</p>
      
      <h2>Негізгі мақсаттар</h2>
      
      <ul>
        <li>Оңай оқылатын және салыстырмалы дәрежелер жүйесін қабылдау</li>
        <li>Үш циклдік жүйені енгізу (бакалавр, магистр, докторантура)</li>
        <li>Студенттердің ұтқырлығын ілгерілету үшін кредиттік жүйені (ECTS) құру</li>
        <li>Сапаны қамтамасыз етудегі еуропалық ынтымақтастықты ілгерілету</li>
        <li>Студенттер, оқытушылар, зерттеушілер және әкімшілік қызметкерлердің ұтқырлығын ілгерілету</li>
        <li>EHEA-ның маңызды элементі ретінде өмір бойы оқуды ілгерілету</li>
      </ul>
      
      <h2>Болон процесінің уақыт кестесі</h2>
      
      <ul>
        <li><strong>1999:</strong> Болон декларациясы - 29 еуропалық ел Болон декларациясына қол қойып, Болон процесін бастады.</li>
        <li><strong>2001:</strong> Прага коммюникесі - Министрлер тағы үш іс-қимыл бағытын қосты: өмір бойы оқыту, студенттерді тарту және EHEA тартымдылығын арттыру.</li>
        <li><strong>2003:</strong> Берлин коммюникесі - Докторлық зерттеулер үшінші цикл ретінде енгізілді және сапаны қамтамасыз етудің маңыздылығы атап өтілді.</li>
        <li><strong>2005:</strong> Берген коммюникесі - Министрлер сапаны қамтамасыз ету стандарттары мен нұсқаулықтарын және EHEA біліктілік шеңберін қабылдады.</li>
        <li><strong>2007-2009:</strong> Лондон және Левен коммюникелері - Жұмыспен қамту, студентке бағытталған оқыту және жоғары білімнің әлеуметтік өлшеміне назар аударылды.</li>
        <li><strong>2010:</strong> Будапешт-Вена декларациясы - Еуропалық жоғары білім беру кеңістігінің (EHEA) ресми іске қосылуы.</li>
        <li><strong>2015-2020:</strong> Ереван және Париж коммюникелері - Негізгі міндеттемелерді орындауға баса назар аударылды: үш циклдік жүйе, тану және сапаны қамтамасыз ету.</li>
        <li><strong>2020-қазіргі уақытқа дейін:</strong> Рим коммюникесі - Жоғары білімдегі цифрландыру, инклюзия, инновация және өзара байланысқа назар аударылды.</li>
      </ul>
      
      <p>Болон процесі бүкіл Еуропа мен одан тыс жерлерде жоғары білім беру реформасының маңызды қозғаушы күші болды. Ол студенттер мен қызметкерлердің ұтқырлығын арттыруға, еуропалық жоғары білімнің сапасы мен тартымдылығын арттыруға және білім мен зерттеулер арасындағы байланысты нығайтуға ықпал етті.</p>
      
      <p>Біздің орталық Болон процесі қағидаттарын іске асыруға белсенді қатысады және білім беру мекемелеріне өз бағдарламалары мен тәжірибелерін EHEA стандарттарымен үйлестіруде қолдау көрсетеді.</p>`,
    },
  },
  "qualifications-framework": {
    slug: "qualifications-framework",
    title: {
      en: "Qualifications Framework in the Bologna Process",
      ru: "Рамка квалификаций в Болонском процессе",
      kk: "Болон процесіндегі біліктілік шеңбері",
    },
    image: "/placeholder.svg?height=400&width=800",
    content: {
      en: `<p>The Qualifications Framework of the European Higher Education Area (QF-EHEA) provides a mechanism to relate national qualifications frameworks to a common European framework. This helps to improve the transparency, comparability, and recognition of qualifications across different countries.</p>
      
      <h2>Cycle Descriptors</h2>
      
      <p>The QF-EHEA is structured around three main cycles, each defined by descriptors that indicate the learning outcomes expected at the completion of each cycle:</p>
      
      <h3>First Cycle (Bachelor's)</h3>
      <p>Typically includes 180-240 ECTS credits and leads to a Bachelor's degree. Qualifications that signify completion of the first cycle are awarded to students who:</p>
      <ul>
        <li>Have demonstrated knowledge and understanding in a field of study that builds upon general secondary education</li>
        <li>Can apply their knowledge and understanding in a manner that indicates a professional approach to their work or vocation</li>
        <li>Have the ability to gather and interpret relevant data to inform judgments that include reflection on relevant social, scientific, or ethical issues</li>
        <li>Can communicate information, ideas, problems, and solutions to both specialist and non-specialist audiences</li>
        <li>Have developed learning skills necessary to continue further study with a high degree of autonomy</li>
      </ul>
      
      <h3>Second Cycle (Master's)</h3>
      <p>Typically includes 90-120 ECTS credits and leads to a Master's degree. Qualifications that signify completion of the second cycle are awarded to students who:</p>
      <ul>
        <li>Have demonstrated knowledge and understanding that extends and enhances that typically associated with the first cycle</li>
        <li>Can apply their knowledge and understanding, and problem-solving abilities in new or unfamiliar environments within broader contexts related to their field of study</li>
        <li>Have the ability to integrate knowledge and handle complexity, and formulate judgments with incomplete or limited information</li>
        <li>Can communicate their conclusions, and the knowledge and rationale underpinning these, to specialist and non-specialist audiences clearly and unambiguously</li>
        <li>Have the learning skills to allow them to continue to study in a manner that may be largely self-directed or autonomous</li>
      </ul>
      
      <h3>Third Cycle (Doctorate)</h3>
      <p>No ECTS range specified, leads to a doctoral degree. Qualifications that signify completion of the third cycle are awarded to students who:</p>
      <ul>
        <li>Have demonstrated a systematic understanding of a field of study and mastery of the skills and methods of research associated with that field</li>
        <li>Have demonstrated the ability to conceive, design, implement, and adapt a substantial process of research with scholarly integrity</li>
        <li>Have made a contribution through original research that extends the frontier of knowledge by developing a substantial body of work, some of which merits national or international refereed publication</li>
        <li>Are capable of critical analysis, evaluation, and synthesis of new and complex ideas</li>
        <li>Can communicate with their peers, the larger scholarly community, and with society in general about their areas of expertise</li>
        <li>Can be expected to promote, within academic and professional contexts, technological, social, or cultural advancement in a knowledge-based society</li>
      </ul>
      
      <h2>Relationship with National Qualifications Frameworks</h2>
      
      <p>Each country in the EHEA has developed or is developing a National Qualifications Framework (NQF) that is compatible with the QF-EHEA. The process of aligning national frameworks with the QF-EHEA involves:</p>
      
      <ol>
        <li>Self-certification: A process by which national authorities certify the compatibility of their national framework with the QF-EHEA</li>
        <li>External verification: Involving international experts to ensure the credibility of the self-certification process</li>
        <li>Public accessibility: Making the self-certification report publicly available</li>
      </ol>
      
      <p>The alignment of national frameworks with the QF-EHEA facilitates the recognition of qualifications across borders, enhances the mobility of students and graduates, and supports lifelong learning.</p>
      
      <h2>European Qualifications Framework (EQF)</h2>
      
      <p>The European Qualifications Framework for Lifelong Learning (EQF) is a related framework that covers all levels of education, not just higher education. The QF-EHEA is compatible with the EQF, with the first, second, and third cycles corresponding to EQF levels 6, 7, and 8 respectively.</p>
      
      <p>The EQF serves as a translation device to make national qualifications more readable across Europe, promoting workers' and learners' mobility between countries and facilitating their lifelong learning.</p>`,

      ru: `<p>Рамка квалификаций Европейского пространства высшего образования (QF-EHEA) предоставляет механизм для соотнесения национальных рамок квалификаций с общей европейской рамкой. Это помогает улучшить прозрачность, сопоставимость и признание квалификаций в разных странах.</p>
      
      <h2>Дескрипторы циклов</h2>
      
      <p>QF-EHEA структурирована вокруг трех основных циклов, каждый из которых определяется дескрипторами, указывающими на результаты обучения, ожидаемые при завершении каждого цикла:</p>
      
      <h3>Первый цикл (Бакалавриат)</h3>
      <p>Обычно включает 180-240 кредитов ECTS и ведет к степени бакалавра. Квалификации, свидетельствующие о завершении первого цикла, присуждаются студентам, которые:</p>
      <ul>
        <li>Продемонстрировали знания и понимание в области обучения, которые основываются на общем среднем образовании</li>
        <li>Могут применять свои знания и понимание способом, указывающим на профессиональный подход к своей работе или профессии</li>
        <li>Имеют способность собирать и интерпретировать соответствующие данные для формирования суждений, включающих размышления о соответствующих социальных, научных или этических вопросах</li>
        <li>Могут передавать информацию, идеи, проблемы и решения как специалистам, так и неспециалистам</li>
        <li>Развили навыки обучения, необходимые для продолжения дальнейшего обучения с высокой степенью автономии</li>
      </ul>
      
      <h3>Второй цикл (Магистратура)</h3>
      <p>Обычно включает 90-120 кредитов ECTS и ведет к степени магистра. Квалификации, свидетельствующие о завершении второго цикла, присуждаются студентам, которые:</p>
      <ul>
        <li>Продемонстрировали знания и понимание, которые расширяют и углубляют то, что обычно связано с первым циклом</li>
        <li>Могут применять свои знания и понимание, а также способности решать проблемы в новых или незнакомых средах в более широких контекстах, связанных с их областью обучения</li>
        <li>Имеют способность интегрировать знания и справляться со сложностью, а также формулировать суждения с неполной или ограниченной информацией</li>
        <li>Могут четко и однозначно сообщать свои выводы, а также знания и обоснования, лежащие в их основе, специалистам и неспециалистам</li>
        <li>Имеют навыки обучения, позволяющие им продолжать обучение в значительной степени самостоятельно или автономно</li>
      </ul>
      
      <h3>Третий цикл (Докторантура)</h3>
      <p>Диапазон ECTS не указан, ведет к докторской степени. Квалификации, свидетельствующие о завершении третьего цикла, присуждаются студентам, которые:</p>
      <ul>
        <li>Продемонстрировали систематическое понимание области исследования и владение навыками и методами исследования, связанными с этой областью</li>
        <li>Продемонстрировали способность задумывать, разрабатывать, внедрять и адаптировать существенный процесс исследования с научной целостностью</li>
        <li>Внесли вклад через оригинальное исследование, которое расширяет границы знаний путем разработки существенного объема работы, часть которой заслуживает национальной или международной рецензируемой публикации</li>
        <li>Способны к критическому анализу, оценке и синтезу новых и сложных идей</li>
        <li>Могут общаться со своими коллегами, более широким научным сообществом и обществом в целом о своих областях знаний</li>
        <li>Могут способствовать, в академических и профессиональных контекстах, технологическому, социальному или культурному прогрессу в обществе, основанном на знаниях</li>
      </ul>`,
      kk: `<p>1999 жылы басталған Болон процесі академиялық дәреже стандарттары мен сапаны қамтамасыз ету стандарттарын бүкіл Еуропада салыстырмалы және үйлесімді ету арқылы Еуропалық жоғары білім беру кеңістігін (EHEA) құруға бағытталған.</p>
      
      <p>Бастама басталған Болонья университетінің құрметіне аталған процесс еуропалық жоғары білімді өзгертті, үш циклдік жүйені (бакалавр, магистр, докторантура), сапаны қамтамасыз ету стандарттарын және Еуропалық кредиттерді аудару және жинақтау жүйесі (ECTS) сияқты тану құралдарын енгізді.</p>
      
      <h2>Негізгі мақсаттар</h2>
      
      <ul>
        <li>Оңай оқылатын және салыстырмалы дәрежелер жүйесін қабылдау</li>
        <li>Үш циклдік жүйені енгізу (бакалавр, магистр, докторантура)</li>
        <li>Студенттердің ұтқырлығын ілгерілету үшін кредиттік жүйені (ECTS) құру</li>
        <li>Сапаны қамтамасыз етудегі еуропалық ынтымақтастықты ілгерілету</li>
        <li>Студенттер, оқытушылар, зерттеушілер және әкімшілік қызметкерлердің ұтқырлығын ілгерілету</li>
        <li>EHEA-ның маңызды элементі ретінде өмір бойы оқуды ілгерілету</li>
      </ul>
      
      <h2>Болон процесінің уақыт кестесі</h2>
      
      <ul>
        <li><strong>1999:</strong> Болон декларациясы - 29 еуропалық ел Болон декларациясына қол қойып, Болон процесін бастады.</li>
        <li><strong>2001:</strong> Прага коммюникесі - Министрлер тағы үш іс-қимыл бағытын қосты: өмір бойы оқыту, студенттерді тарту және EHEA тартымдылығын арттыру.</li>
        <li><strong>2003:</strong> Берлин коммюникесі - Докторлық зерттеулер үшінші цикл ретінде енгізілді және сапаны қамтамасыз етудің маңыздылығы атап өтілді.</li>
        <li><strong>2005:</strong> Берген коммюникесі - Министрлер сапаны қамтамасыз ету стандарттары мен нұсқаулықтарын және EHEA біліктілік шеңберін қабылдады.</li>
        <li><strong>2007-2009:</strong> Лондон және Левен коммюникелері - Жұмыспен қамту, студентке бағытталған оқыту және жоғары білімнің әлеуметтік өлшеміне назар аударылды.</li>
        <li><strong>2010:</strong> Будапешт-Вена декларациясы - Еуропалық жоғары білім беру кеңістігінің (EHEA) ресми іске қосылуы.</li>
        <li><strong>2015-2020:</strong> Ереван және Париж коммюникелері - Негізгі міндеттемелерді орындауға баса назар аударылды: үш циклдік жүйе, тану және сапаны қамтамасыз ету.</li>
        <li><strong>2020-қазіргі уақытқа дейін:</strong> Рим коммюникесі - Жоғары білімдегі цифрландыру, инклюзия, инновация және өзара байланысқа назар аударылды.</li>
      </ul>
      
      <p>Болон процесі бүкіл Еуропа мен одан тыс жерлерде жоғары білім беру реформасының маңызды қозғаушы күші болды. Ол студенттер мен қызметкерлердің ұтқырлығын арттыруға, еуропалық жоғары білімнің сапасы мен тартымдылығын арттыруға және білім мен зерттеулер арасындағы байланысты нығайтуға ықпал етті.</p>
      
      <p>Біздің орталық Болон процесі қағидаттарын іске асыруға белсенді қатысады және білім беру мекемелеріне өз бағдарламалары мен тәжірибелерін EHEA стандарттарымен үйлестіруде қолдау көрсетеді.</p>`
    }
  }
};

export function getBolognaArticle(slug: string) {
  return bolognaArticles[slug as keyof typeof bolognaArticles] || null
}

export function getBolognaArticles() {
  return Object.values(bolognaArticles)
}

export default bolognaArticles;
