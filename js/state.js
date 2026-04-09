/**
 * state.js — CV application state (single source of truth)
 */
const state = {
    name: 'student name',
    title: 'student title',
    email: 'student email',
    phone: 'student phone',
    dob: '01.01.1990',
    city: 'student city',
    postal: 'student postal',
    country: 'Ägypten',
    photo: '',
    photoX: 50,   // object-position X % (0–100)
    photoY: 50,   // object-position Y % (0–100)
    objective: 'Erfahrene Pflegefachkraft mit fundiertem Wissen in Notaufnahme, Intensivstation und Innerer Medizin. Hervorragende analytische Fähigkeiten und hohe Stressresistenz ermöglichen eine strukturierte und kooperative Arbeitsweise. Engagiert in der Patientenversorgung und Teamarbeit, mit nachgewiesener Fähigkeit, in anspruchsvollen Umgebungen effektiv zu agieren.',
    experience: [
        { dateFrom: '2013', dateTo: '2018', title: 'Pflegefachmann', institution: 'St. Maria-Krankenhaus (Notaufnahme-Station)', desc: 'Erstversorgung, Vitalzeichenüberwachung, Notfallmaßnahmen und diagnostische Begleitung.' },
        { dateFrom: '2018', dateTo: '2020', title: 'Pflegefachmann', institution: 'Italienisches Krankenhaus (Intensivstation)', desc: 'Intensivpflege, medizinische Geräte, Pflegedokumentation und Schichtübergaben.' },
        { dateFrom: '2020', dateTo: '2021', title: 'Pflegefachmann', institution: 'St. Paula-Krankenhaus (Innere Medizin)', desc: 'Grund- und Behandlungspflege, Medikamentengabe, Pflegeplanung und Teamarbeit.' },
        { dateFrom: '2021', dateTo: '2023', title: 'Pflegefachmann', institution: 'Elshifa-Klinik (Notaufnahme-Station)', desc: 'Triage, Notfallversorgung, Dokumentation und Teamarbeit unter Druck.' },
        { dateFrom: '2023', dateTo: '2026', title: 'Pflegefachmann', institution: 'ElKhanka für Psychiatrie (psychiatrische Abteilung)', desc: 'Psychiatrische Pflege, Krisenintervention, Deeskalation und multiprofessionelle Teamarbeit.' }
    ],
    education: [
        { dateFrom: 'Okt 2020', dateTo: 'Sep 2021', title: 'Praktisches Jahr', institution: 'Universität Assiut' },
        { dateFrom: 'Sep 2017', dateTo: 'Jun 2020', title: 'Bachelor der Pflegewissenschaften', institution: 'Universität Assiut' },
        { dateFrom: 'Jan 2015', dateTo: 'Dez 2017', title: 'Diplom', institution: 'Technisches Gesundheitsinstitut' },
        { dateFrom: 'Sep 2013', dateTo: 'Jun 2015', title: 'Diplom', institution: 'Technische Fachschule für Krankenpflege Assiut' }
    ],
    skills: ['Patientenversorgung', 'Stressmanagement', 'Teamarbeit'],
    educationTitle: 'Ausbildung',
    languages: [
        { name: 'Arabisch', level: 'Native' },
        { name: 'Englisch', level: 'Advanced' },
        { name: 'Deutsch', level: 'Advanced', note: 'Goethe-Zertifikat B2' }
    ],
    certifications: [
        { name: 'Reanimationskurs (HLW)', issuer: 'Deutsches Rotes Kreuz', date: '2022' },
        { name: 'Infektionspräventionskurs', issuer: 'Gesundheitsamt', date: '2023' }
    ]
};
