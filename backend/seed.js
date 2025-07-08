const db = require('./config/database');
const bcrypt = require('bcryptjs');

console.log('Duke populluar databazën me të dhëna...');

// Sample users with passwords
const sampleUsers = [
  { firstName: 'Ana', lastName: 'Gjoka', email: 'ana@example.com', phone: '+355 69 123 4567', city: 'Tiranë', password: 'password123' },
  { firstName: 'Mark', lastName: 'Dedja', email: 'mark@example.com', phone: '+355 68 234 5678', city: 'Durrës', password: 'password123' },
  { firstName: 'Elena', lastName: 'Hoxha', email: 'elena@example.com', phone: '+355 67 345 6789', city: 'Vlorë', password: 'password123' },
  { firstName: 'Bardh', lastName: 'Kola', email: 'bardh@example.com', phone: '+355 66 456 7890', city: 'Shkodër', password: 'password123' },
  { firstName: 'Mira', lastName: 'Leka', email: 'mira@example.com', phone: '+355 65 567 8901', city: 'Elbasan', password: 'password123' },
  { firstName: 'Dritan', lastName: 'Mema', email: 'dritan@example.com', phone: '+355 64 678 9012', city: 'Fier', password: 'password123' },
  { firstName: 'Arta', lastName: 'Ndoja', email: 'arta@example.com', phone: '+355 63 789 0123', city: 'Berat', password: 'password123' },
  { firstName: 'Erion', lastName: 'Pali', email: 'erion@example.com', phone: '+355 62 890 1234', city: 'Korçë', password: 'password123' }
];

// Sample requests data
const sampleRequests = [
  {
    userId: 1,
    title: 'Riparim instalimi elektrik në kuzhinë',
    description: 'Kam probleme me prizat në kuzhinë. Ndonjëherë nuk punojnë dhe ndonjëherë bëjnë shkëndija. Duhet një elektricist i përvojshëm për të kontrolluar dhe riparuar instalimin.',
    category: 'Elektricist',
    city: 'Tiranë',
    address: 'Rr. Myslym Shyri, Nr. 45, Pallati 3, Kati 2',
    postalCode: '1001',
    desiredDate: '2024-02-15',
    budget: '8000 Lekë',
    budgetType: 'fixed',
    urgency: 'high',
    propertyType: 'Apartament',
    propertySize: '80m²',
    contactPreference: 'phone',
    additionalRequirements: 'Preferoj që të jetë i verifikuar dhe me përvojë'
  },
  {
    userId: 2,
    title: 'Instalim kondicioneri në dhomën e gjumit',
    description: 'Dëshiroj të instaloj një kondicioner të ri në dhomën e gjumit. Dhoma është rreth 15m². Duhet instalim profesional dhe të sigurt.',
    category: 'Elektricist',
    city: 'Durrës',
    address: 'Rr. Sulejman Delvina, Nr. 12',
    postalCode: '2000',
    desiredDate: '2024-02-20',
    budget: '15000 Lekë',
    budgetType: 'negotiable',
    urgency: 'normal',
    propertyType: 'Apartament',
    propertySize: '65m²',
    contactPreference: 'whatsapp',
    additionalRequirements: 'Kondicioneri do ta blej vetë, duhet vetëm instalim'
  },
  {
    userId: 3,
    title: 'Riparim rrjedhje në banjo',
    description: 'Ka rrjedhje në banjo. Uji rrjedh nga tubi i dushit dhe po dëmton dyshemenë. Duhet riparim i menjëhershëm.',
    category: 'Hidraulik',
    city: 'Vlorë',
    address: 'Rr. Ismail Qemali, Nr. 78',
    postalCode: '9401',
    desiredDate: '2024-02-16',
    budget: '7000 Lekë',
    budgetType: 'fixed',
    urgency: 'urgent',
    propertyType: 'Apartament',
    propertySize: '75m²',
    contactPreference: 'phone',
    additionalRequirements: 'Problemi është urgjent, uji po dëmton dyshemenë'
  },
  {
    userId: 4,
    title: 'Pastrim i plotë shtëpie pas renovimit',
    description: 'Sapo përfundova renovimin e shtëpisë dhe duhet pastrim i plotë. Ka pluhur dhe mbeturina kudo.',
    category: 'Pastrim',
    city: 'Shkodër',
    address: 'Rr. 28 Nëntori, Nr. 34',
    postalCode: '4001',
    desiredDate: '2024-02-17',
    budget: '12000 Lekë',
    budgetType: 'fixed',
    urgency: 'high',
    propertyType: 'Apartament',
    propertySize: '95m²',
    contactPreference: 'phone',
    additionalRequirements: 'Duhet pastrim i thellë dhe profesional'
  },
  {
    userId: 5,
    title: 'Lyerje e plotë shtëpie',
    description: 'Dëshiroj lyerje të plotë të shtëpisë. Të gjitha dhomat dhe korridoret duhen lyer me ngjyra moderne.',
    category: 'Pikturë',
    city: 'Elbasan',
    address: 'Rr. Qemal Stafa, Nr. 56',
    postalCode: '3001',
    desiredDate: '2024-03-01',
    budget: '45000 Lekë',
    budgetType: 'negotiable',
    urgency: 'normal',
    propertyType: 'Shtëpi',
    propertySize: '180m²',
    contactPreference: 'whatsapp',
    additionalRequirements: 'Preferoj ngjyra të qeta dhe moderne'
  },
  {
    userId: 6,
    title: 'Instalim mobilieri kuzhine',
    description: 'Dëshiroj instalim mobilieri të re për kuzhinë. Kam blerë mobilieri moderne dhe duhet instalim profesional.',
    category: 'Mobilieri',
    city: 'Fier',
    address: 'Rr. Gjergj Kastrioti, Nr. 23',
    postalCode: '9301',
    desiredDate: '2024-02-20',
    budget: '30000 Lekë',
    budgetType: 'fixed',
    urgency: 'normal',
    propertyType: 'Apartament',
    propertySize: '95m²',
    contactPreference: 'whatsapp',
    additionalRequirements: 'Mobilieri është e shtrenjtë, duhet instalim i kujdesshëm'
  },
  {
    userId: 7,
    title: 'Kujdesje oborr dhe kopsht',
    description: 'Dëshiroj kujdesje të përditshme për oborrin dhe kopshtin. Duhet prerje bar, ujitje dhe kujdesje për pemët.',
    category: 'Kopshtari',
    city: 'Berat',
    address: 'Rr. Antipatrea, Nr. 89',
    postalCode: '5001',
    desiredDate: '2024-02-18',
    budget: '20000 Lekë',
    budgetType: 'negotiable',
    urgency: 'normal',
    propertyType: 'Vila',
    propertySize: '300m²',
    contactPreference: 'whatsapp',
    additionalRequirements: 'Duhet kujdesje të përditshme, kontratë afatgjatë'
  },
  {
    userId: 8,
    title: 'Prerje pemë në oborr',
    description: 'Pemët në oborr janë shumë të mëdha dhe duhen prerë. Disa degë janë të rrezikshme dhe duhen hequr.',
    category: 'Kopshtari',
    city: 'Korçë',
    address: 'Rr. Fan Noli, Nr. 67',
    postalCode: '7001',
    desiredDate: '2024-02-21',
    budget: '15000 Lekë',
    budgetType: 'fixed',
    urgency: 'high',
    propertyType: 'Shtëpi',
    propertySize: '250m²',
    contactPreference: 'phone',
    additionalRequirements: 'Pemët janë të mëdha dhe të rrezikshme, duhet specialist'
  },
  // Additional Elektricist posts
  {
    userId: 1,
    title: 'Instalim sistem ndriçimi në oborr',
    description: 'Dëshiroj të instaloj sistem ndriçimi modern në oborr për sigurinë dhe estetikën. Duhet instalim LED dhe sensorë lëvizje.',
    category: 'Elektricist',
    city: 'Tiranë',
    address: 'Rr. Dëshmorët e Kombit, Nr. 23',
    postalCode: '1001',
    desiredDate: '2024-02-25',
    budget: '25000 Lekë',
    budgetType: 'negotiable',
    urgency: 'normal',
    propertyType: 'Shtëpi',
    propertySize: '200m²',
    contactPreference: 'whatsapp',
    additionalRequirements: 'Preferoj sistem të automatizuar dhe të kursyeshëm energji'
  },
  {
    userId: 2,
    title: 'Riparim panel elektrik',
    description: 'Panel elektrik është i vjetër dhe ka probleme. Ndonjëherë bëjnë shkëndija dhe duhet zëvendësim i plotë.',
    category: 'Elektricist',
    city: 'Durrës',
    address: 'Rr. Aleksandër Goga, Nr. 45',
    postalCode: '2000',
    desiredDate: '2024-02-22',
    budget: '35000 Lekë',
    budgetType: 'fixed',
    urgency: 'urgent',
    propertyType: 'Apartament',
    propertySize: '85m²',
    contactPreference: 'phone',
    additionalRequirements: 'Problemi është i rrezikshëm, duhet riparim i menjëhershëm'
  },
  {
    userId: 3,
    title: 'Instalim priza të reja në zyrë',
    description: 'Kam hapur një zyrë të re dhe duhet instalim priza moderne për kompjuterë dhe pajisje të tjera.',
    category: 'Elektricist',
    city: 'Vlorë',
    address: 'Rr. Vangjel Pandeli, Nr. 12',
    postalCode: '9401',
    desiredDate: '2024-02-28',
    budget: '18000 Lekë',
    budgetType: 'fixed',
    urgency: 'normal',
    propertyType: 'Zyrë',
    propertySize: '60m²',
    contactPreference: 'whatsapp',
    additionalRequirements: 'Duhet priza të shumëfishta dhe instalim profesional'
  },
  // Additional Hidraulik posts
  {
    userId: 4,
    title: 'Zëvendësim tubacioni në banjo',
    description: 'Tubacioni në banjo është i vjetër dhe ka rrjedhje. Duhet zëvendësim i plotë me materiale moderne.',
    category: 'Hidraulik',
    city: 'Shkodër',
    address: 'Rr. 13 Dhjetori, Nr. 78',
    postalCode: '4001',
    desiredDate: '2024-02-26',
    budget: '40000 Lekë',
    budgetType: 'negotiable',
    urgency: 'high',
    propertyType: 'Apartament',
    propertySize: '90m²',
    contactPreference: 'phone',
    additionalRequirements: 'Preferoj materiale cilësore dhe instalim të qëndrueshëm'
  },
  {
    userId: 5,
    title: 'Instalim sistem ujitje automatike',
    description: 'Dëshiroj të instaloj sistem ujitje automatike për kopshtin. Duhet programues dhe tubacione të përshtatshme.',
    category: 'Hidraulik',
    city: 'Elbasan',
    address: 'Rr. Rilindja, Nr. 34',
    postalCode: '3001',
    desiredDate: '2024-03-05',
    budget: '30000 Lekë',
    budgetType: 'fixed',
    urgency: 'normal',
    propertyType: 'Shtëpi',
    propertySize: '300m²',
    contactPreference: 'whatsapp',
    additionalRequirements: 'Duhet sistem i programueshëm dhe i kursyeshëm ujë'
  },
  {
    userId: 6,
    title: 'Riparim ngrohës uji',
    description: 'Ngrohësi i ujit nuk punon. Nuk ngroh ujin dhe duhet riparim ose zëvendësim.',
    category: 'Hidraulik',
    city: 'Fier',
    address: 'Rr. Pavarësia, Nr. 56',
    postalCode: '9301',
    desiredDate: '2024-02-24',
    budget: '20000 Lekë',
    budgetType: 'negotiable',
    urgency: 'high',
    propertyType: 'Apartament',
    propertySize: '70m²',
    contactPreference: 'phone',
    additionalRequirements: 'Problemi është urgjent, familja nuk ka ujë të ngrohtë'
  },
  // Additional Pastrim posts
  {
    userId: 7,
    title: 'Pastrim i thellë tapiceri',
    description: 'Tapiceria e divanit dhe karrigeve është e ndotur dhe duhet pastrim profesional i thellë.',
    category: 'Pastrim',
    city: 'Berat',
    address: 'Rr. Republika, Nr. 89',
    postalCode: '5001',
    desiredDate: '2024-02-27',
    budget: '8000 Lekë',
    budgetType: 'fixed',
    urgency: 'normal',
    propertyType: 'Apartament',
    propertySize: '80m²',
    contactPreference: 'whatsapp',
    additionalRequirements: 'Tapiceria është e shtrenjtë, duhet pastrim i kujdesshëm'
  },
  {
    userId: 8,
    title: 'Pastrim dritaresh dhe ballkoneve',
    description: 'Dritaret dhe ballkonet janë shumë të ndotura dhe duhen pastruar. Ka pluhur dhe ndotësi nga rruga.',
    category: 'Pastrim',
    city: 'Korçë',
    address: 'Rr. Demokracia, Nr. 23',
    postalCode: '7001',
    desiredDate: '2024-02-29',
    budget: '6000 Lekë',
    budgetType: 'fixed',
    urgency: 'normal',
    propertyType: 'Apartament',
    propertySize: '75m²',
    contactPreference: 'phone',
    additionalRequirements: 'Dritaret janë të larta, duhet pajisje speciale'
  },
  {
    userId: 1,
    title: 'Pastrim i plotë zyre',
    description: 'Zyrja ka nevojë për pastrim të plotë dhe të rregullt. Duhet pastrim ditor dhe pastrim i thellë javor.',
    category: 'Pastrim',
    city: 'Tiranë',
    address: 'Rr. Ibrahim Rugova, Nr. 15',
    postalCode: '1001',
    desiredDate: '2024-03-01',
    budget: '15000 Lekë',
    budgetType: 'negotiable',
    urgency: 'normal',
    propertyType: 'Zyrë',
    propertySize: '120m²',
    contactPreference: 'whatsapp',
    additionalRequirements: 'Kontratë afatgjatë për pastrim të rregullt'
  },
  // Additional Pikturë posts
  {
    userId: 2,
    title: 'Lyerje fasadë shtëpie',
    description: 'Fasada e shtëpisë është e vjetër dhe duhet lyerje e plotë. Duhet ngjyra e qëndrueshme dhe moderne.',
    category: 'Pikturë',
    city: 'Durrës',
    address: 'Rr. Adria, Nr. 67',
    postalCode: '2000',
    desiredDate: '2024-03-10',
    budget: '80000 Lekë',
    budgetType: 'negotiable',
    urgency: 'normal',
    propertyType: 'Shtëpi',
    propertySize: '250m²',
    contactPreference: 'phone',
    additionalRequirements: 'Duhet ngjyra e qëndrueshme ndaj motit dhe UV'
  },
  {
    userId: 3,
    title: 'Lyerje dhoma fëmijësh',
    description: 'Dëshiroj lyerje të dhoma fëmijësh me ngjyra të gjalla dhe motive të bukura. Duhet ngjyra jo-toxike.',
    category: 'Pikturë',
    city: 'Vlorë',
    address: 'Rr. Flamurtari, Nr. 34',
    postalCode: '9401',
    desiredDate: '2024-02-25',
    budget: '25000 Lekë',
    budgetType: 'fixed',
    urgency: 'normal',
    propertyType: 'Apartament',
    propertySize: '85m²',
    contactPreference: 'whatsapp',
    additionalRequirements: 'Ngjyra duhet të jenë jo-toxike dhe të sigurta për fëmijë'
  },
  {
    userId: 4,
    title: 'Lyerje korridori dhe hapësira të përbashkëta',
    description: 'Korridori dhe hapësirat e përbashkëta në pallat duhen lyer. Duhet ngjyra e qëndrueshme dhe e lehtë për pastrim.',
    category: 'Pikturë',
    city: 'Shkodër',
    address: 'Rr. 1 Maji, Nr. 12',
    postalCode: '4001',
    desiredDate: '2024-03-08',
    budget: '35000 Lekë',
    budgetType: 'fixed',
    urgency: 'normal',
    propertyType: 'Pallat',
    propertySize: '200m²',
    contactPreference: 'phone',
    additionalRequirements: 'Ngjyra duhet të jetë e qëndrueshme dhe e lehtë për pastrim'
  },
  // Additional Mobilieri posts
  {
    userId: 5,
    title: 'Instalim garderobë në dhomën e gjumit',
    description: 'Dëshiroj instalim garderobë të plotë në dhomën e gjumit. Duhet dizajn modern dhe hapësirë e mjaftueshme.',
    category: 'Mobilieri',
    city: 'Elbasan',
    address: 'Rr. 8 Marsi, Nr. 45',
    postalCode: '3001',
    desiredDate: '2024-03-12',
    budget: '50000 Lekë',
    budgetType: 'negotiable',
    urgency: 'normal',
    propertyType: 'Apartament',
    propertySize: '100m²',
    contactPreference: 'whatsapp',
    additionalRequirements: 'Preferoj garderobë të personalizuara dhe moderne'
  },
  {
    userId: 6,
    title: 'Riparim dhe montim mobilieri kuzhine',
    description: 'Mobileria e kuzhinës ka probleme dhe duhet riparim. Disa dera nuk mbyllen mirë dhe duhen rregulluar.',
    category: 'Mobilieri',
    city: 'Fier',
    address: 'Rr. 7 Marsi, Nr. 78',
    postalCode: '9301',
    desiredDate: '2024-02-26',
    budget: '15000 Lekë',
    budgetType: 'fixed',
    urgency: 'normal',
    propertyType: 'Apartament',
    propertySize: '80m²',
    contactPreference: 'phone',
    additionalRequirements: 'Duhet riparim i kujdesshëm për të mos dëmtuar mobilierin'
  },
  {
    userId: 7,
    title: 'Instalim rafta dhe organizatorë',
    description: 'Dëshiroj instalim rafta dhe organizatorë për hapësirat e vogla në shtëpi. Duhet zgjidhje të zgjuara për hapësirë.',
    category: 'Mobilieri',
    city: 'Berat',
    address: 'Rr. 5 Maji, Nr. 23',
    postalCode: '5001',
    desiredDate: '2024-03-05',
    budget: '20000 Lekë',
    budgetType: 'negotiable',
    urgency: 'normal',
    propertyType: 'Apartament',
    propertySize: '65m²',
    contactPreference: 'whatsapp',
    additionalRequirements: 'Duhet zgjidhje të zgjuara për hapësirat e vogla'
  },
  // Additional Kopshtari posts
  {
    userId: 8,
    title: 'Dizajnim kopsht të ri',
    description: 'Dëshiroj dizajnim të plotë të një kopshti të ri. Duhet plan i detajuar dhe instalim i të gjitha elementëve.',
    category: 'Kopshtari',
    city: 'Korçë',
    address: 'Rr. 28 Nëntori, Nr. 89',
    postalCode: '7001',
    desiredDate: '2024-03-15',
    budget: '100000 Lekë',
    budgetType: 'negotiable',
    urgency: 'normal',
    propertyType: 'Shtëpi',
    propertySize: '400m²',
    contactPreference: 'phone',
    additionalRequirements: 'Duhet dizajnim modern dhe elementë të bukur'
  },
  {
    userId: 1,
    title: 'Kujdesje pemë frutash',
    description: 'Pemët frutash në oborr duhen kujdesje speciale. Duhet prerje, plehërim dhe mbrojtje nga sëmundjet.',
    category: 'Kopshtari',
    city: 'Tiranë',
    address: 'Rr. Myslym Shyri, Nr. 67',
    postalCode: '1001',
    desiredDate: '2024-02-28',
    budget: '25000 Lekë',
    budgetType: 'fixed',
    urgency: 'normal',
    propertyType: 'Shtëpi',
    propertySize: '300m²',
    contactPreference: 'whatsapp',
    additionalRequirements: 'Duhet specialist për pemë frutash dhe kujdesje të rregullt'
  },
  {
    userId: 2,
    title: 'Instalim sistem ujitje automatike kopsht',
    description: 'Dëshiroj instalim sistem ujitje automatike për kopshtin. Duhet programues dhe tubacione të përshtatshme.',
    category: 'Kopshtari',
    city: 'Durrës',
    address: 'Rr. Aleksandër Moisiu, Nr. 34',
    postalCode: '2000',
    desiredDate: '2024-03-10',
    budget: '40000 Lekë',
    budgetType: 'negotiable',
    urgency: 'normal',
    propertyType: 'Shtëpi',
    propertySize: '250m²',
    contactPreference: 'phone',
    additionalRequirements: 'Duhet sistem i programueshëm dhe i kursyeshëm ujë'
  },
  // More Elektricist posts
  {
    userId: 3,
    title: 'Instalim sistem sigurie dhe alarmi',
    description: 'Dëshiroj instalim sistem sigurie modern për shtëpinë. Duhet kamera, sensorë dhe alarm që lidhet me telefonin.',
    category: 'Elektricist',
    city: 'Vlorë',
    address: 'Rr. Skele, Nr. 56',
    postalCode: '9401',
    desiredDate: '2024-03-08',
    budget: '60000 Lekë',
    budgetType: 'negotiable',
    urgency: 'high',
    propertyType: 'Shtëpi',
    propertySize: '180m²',
    contactPreference: 'phone',
    additionalRequirements: 'Duhet sistem i lidhur me internet dhe aplikacion në telefon'
  },
  {
    userId: 4,
    title: 'Riparim instalimi elektrik në garazh',
    description: 'Instalimi elektrik në garazh ka probleme. Ndonjëherë nuk punon dhe duhet riparim i plotë.',
    category: 'Elektricist',
    city: 'Shkodër',
    address: 'Rr. 2 Prilli, Nr. 89',
    postalCode: '4001',
    desiredDate: '2024-02-23',
    budget: '12000 Lekë',
    budgetType: 'fixed',
    urgency: 'normal',
    propertyType: 'Garazh',
    propertySize: '40m²',
    contactPreference: 'whatsapp',
    additionalRequirements: 'Garazhi është i madh, duhet instalim i fuqishëm'
  },
  {
    userId: 5,
    title: 'Instalim sistem ngrohje elektrike',
    description: 'Dëshiroj instalim sistem ngrohje elektrike moderne për apartamentin. Duhet termostatë dhe kontroll të temperaturës.',
    category: 'Elektricist',
    city: 'Elbasan',
    address: 'Rr. 11 Janari, Nr. 12',
    postalCode: '3001',
    desiredDate: '2024-03-15',
    budget: '45000 Lekë',
    budgetType: 'negotiable',
    urgency: 'normal',
    propertyType: 'Apartament',
    propertySize: '95m²',
    contactPreference: 'whatsapp',
    additionalRequirements: 'Preferoj sistem të kursyeshëm energji dhe të kontrollueshëm nga telefoni'
  },
  {
    userId: 6,
    title: 'Instalim sistem zinxhirë dritash për Krishtlindje',
    description: 'Dëshiroj instalim sistem zinxhirësh dritash për Krishtlindje në oborr dhe fasadë. Duhet instalim profesional dhe të sigurt.',
    category: 'Elektricist',
    city: 'Fier',
    address: 'Rr. 6 Dhjetori, Nr. 34',
    postalCode: '9301',
    desiredDate: '2024-12-15',
    budget: '15000 Lekë',
    budgetType: 'fixed',
    urgency: 'normal',
    propertyType: 'Shtëpi',
    propertySize: '200m²',
    contactPreference: 'phone',
    additionalRequirements: 'Duhet instalim i sigurt dhe i qëndrueshëm për motin'
  },
  // More Hidraulik posts
  {
    userId: 7,
    title: 'Instalim sistem filtrimi uji',
    description: 'Dëshiroj instalim sistem filtrimi uji për shtëpinë. Duhet filtra për ujë të pastër dhe të sigurt.',
    category: 'Hidraulik',
    city: 'Berat',
    address: 'Rr. 7 Shkurti, Nr. 67',
    postalCode: '5001',
    desiredDate: '2024-03-12',
    budget: '25000 Lekë',
    budgetType: 'fixed',
    urgency: 'normal',
    propertyType: 'Shtëpi',
    propertySize: '150m²',
    contactPreference: 'whatsapp',
    additionalRequirements: 'Duhet filtra cilësore për familjen me fëmijë'
  },
  {
    userId: 8,
    title: 'Riparim sistem kanalizimi',
    description: 'Sistemi i kanalizimit ka probleme. Uji nuk rrjedh mirë dhe ka bllokime. Duhet riparim i plotë.',
    category: 'Hidraulik',
    city: 'Korçë',
    address: 'Rr. 8 Dhjetori, Nr. 45',
    postalCode: '7001',
    desiredDate: '2024-02-25',
    budget: '30000 Lekë',
    budgetType: 'negotiable',
    urgency: 'urgent',
    propertyType: 'Apartament',
    propertySize: '85m²',
    contactPreference: 'phone',
    additionalRequirements: 'Problemi është urgjent, uji po kthehet në banjo'
  },
  {
    userId: 1,
    title: 'Instalim dush modern në banjo',
    description: 'Dëshiroj zëvendësim dushi të vjetër me një të ri modern. Duhet instalim profesional dhe të sigurt.',
    category: 'Hidraulik',
    city: 'Tiranë',
    address: 'Rr. 21 Dhjetori, Nr. 78',
    postalCode: '1001',
    desiredDate: '2024-03-05',
    budget: '20000 Lekë',
    budgetType: 'fixed',
    urgency: 'normal',
    propertyType: 'Apartament',
    propertySize: '75m²',
    contactPreference: 'whatsapp',
    additionalRequirements: 'Dushi do ta blej vetë, duhet vetëm instalim'
  },
  {
    userId: 2,
    title: 'Instalim sistem ujitje automatike për bar',
    description: 'Dëshiroj instalim sistem ujitje automatike për barin në oborr. Duhet programues dhe tubacione të përshtatshme.',
    category: 'Hidraulik',
    city: 'Durrës',
    address: 'Rr. 29 Nëntori, Nr. 23',
    postalCode: '2000',
    desiredDate: '2024-03-20',
    budget: '18000 Lekë',
    budgetType: 'fixed',
    urgency: 'normal',
    propertyType: 'Shtëpi',
    propertySize: '300m²',
    contactPreference: 'phone',
    additionalRequirements: 'Duhet sistem i thjeshtë dhe i lehtë për përdorim'
  },
  // More Pastrim posts
  {
    userId: 3,
    title: 'Pastrim i thellë kuzhine',
    description: 'Kuzhina ka nevojë për pastrim të thellë. Ka yndyrë në mobilieri dhe duhet pastrim profesional.',
    category: 'Pastrim',
    city: 'Vlorë',
    address: 'Rr. 1 Maji, Nr. 89',
    postalCode: '9401',
    desiredDate: '2024-02-26',
    budget: '10000 Lekë',
    budgetType: 'fixed',
    urgency: 'normal',
    propertyType: 'Apartament',
    propertySize: '80m²',
    contactPreference: 'whatsapp',
    additionalRequirements: 'Duhet pastrim i thellë për yndyrë dhe ndotësi të vjetër'
  },
  {
    userId: 4,
    title: 'Pastrim i plotë apartamenti pas zhvendosjes',
    description: 'Sapo u zhvendosa në apartament të ri dhe duhet pastrim i plotë. Ka pluhur dhe mbeturina nga punimet.',
    category: 'Pastrim',
    city: 'Shkodër',
    address: 'Rr. 3 Dhjetori, Nr. 12',
    postalCode: '4001',
    desiredDate: '2024-02-28',
    budget: '18000 Lekë',
    budgetType: 'negotiable',
    urgency: 'high',
    propertyType: 'Apartament',
    propertySize: '100m²',
    contactPreference: 'phone',
    additionalRequirements: 'Duhet pastrim i plotë dhe profesional për të jetuar'
  },
  {
    userId: 5,
    title: 'Pastrim i thellë banjo dhe tualet',
    description: 'Banjo dhe tualeti duhen pastruar thellë. Ka ndotësi të vjetër dhe duhet pastrim profesional.',
    category: 'Pastrim',
    city: 'Elbasan',
    address: 'Rr. 4 Dhjetori, Nr. 56',
    postalCode: '3001',
    desiredDate: '2024-02-27',
    budget: '7000 Lekë',
    budgetType: 'fixed',
    urgency: 'normal',
    propertyType: 'Apartament',
    propertySize: '70m²',
    contactPreference: 'whatsapp',
    additionalRequirements: 'Duhet pastrim i thellë për higjienë të plotë'
  },
  {
    userId: 6,
    title: 'Pastrim i plotë shtëpie pas festës',
    description: 'Pasi organizova një festë të madhe, shtëpia ka nevojë për pastrim të plotë. Ka mbeturina dhe ndotësi kudo.',
    category: 'Pastrim',
    city: 'Fier',
    address: 'Rr. 5 Dhjetori, Nr. 34',
    postalCode: '9301',
    desiredDate: '2024-02-24',
    budget: '20000 Lekë',
    budgetType: 'fixed',
    urgency: 'high',
    propertyType: 'Shtëpi',
    propertySize: '150m²',
    contactPreference: 'phone',
    additionalRequirements: 'Duhet pastrim i plotë dhe i shpejtë'
  },
  // More Pikturë posts
  {
    userId: 7,
    title: 'Lyerje e plotë apartamenti të ri',
    description: 'Kam blerë një apartament të ri dhe duhet lyerje e plotë. Të gjitha dhomat duhen lyer me ngjyra moderne.',
    category: 'Pikturë',
    city: 'Berat',
    address: 'Rr. 6 Dhjetori, Nr. 78',
    postalCode: '5001',
    desiredDate: '2024-03-15',
    budget: '55000 Lekë',
    budgetType: 'negotiable',
    urgency: 'normal',
    propertyType: 'Apartament',
    propertySize: '120m²',
    contactPreference: 'whatsapp',
    additionalRequirements: 'Preferoj ngjyra të qeta dhe moderne për familje'
  },
  {
    userId: 8,
    title: 'Lyerje dhomë pune në shtëpi',
    description: 'Dëshiroj lyerje të dhomës së punës në shtëpi. Duhet ngjyrë që të jetë e përshtatshme për punë dhe të qetë.',
    category: 'Pikturë',
    city: 'Korçë',
    address: 'Rr. 7 Dhjetori, Nr. 23',
    postalCode: '7001',
    desiredDate: '2024-03-08',
    budget: '15000 Lekë',
    budgetType: 'fixed',
    urgency: 'normal',
    propertyType: 'Apartament',
    propertySize: '85m²',
    contactPreference: 'phone',
    additionalRequirements: 'Ngjyrë që të jetë e përshtatshme për punë dhe të mos lodhë sytë'
  },
  {
    userId: 1,
    title: 'Lyerje dhomë gjumi kryesore',
    description: 'Dëshiroj lyerje të dhomës së gjumit kryesore me ngjyrë të qetë dhe romantike. Duhet ngjyrë që të jetë e përshtatshme për pushim.',
    category: 'Pikturë',
    city: 'Tiranë',
    address: 'Rr. 8 Dhjetori, Nr. 45',
    postalCode: '1001',
    desiredDate: '2024-03-10',
    budget: '20000 Lekë',
    budgetType: 'fixed',
    urgency: 'normal',
    propertyType: 'Apartament',
    propertySize: '90m²',
    contactPreference: 'whatsapp',
    additionalRequirements: 'Ngjyrë e qetë dhe romantike për dhomën e gjumit'
  },
  {
    userId: 2,
    title: 'Lyerje dhomë vizitorësh',
    description: 'Dëshiroj lyerje të dhomës së vizitorëve me ngjyrë elegante dhe moderne. Duhet të duket profesionale dhe e bukur.',
    category: 'Pikturë',
    city: 'Durrës',
    address: 'Rr. 9 Dhjetori, Nr. 67',
    postalCode: '2000',
    desiredDate: '2024-03-12',
    budget: '18000 Lekë',
    budgetType: 'fixed',
    urgency: 'normal',
    propertyType: 'Apartament',
    propertySize: '80m²',
    contactPreference: 'phone',
    additionalRequirements: 'Ngjyrë elegante dhe moderne për vizitorët'
  },
  // More Mobilieri posts
  {
    userId: 3,
    title: 'Instalim bibliotekë në dhomën e punës',
    description: 'Dëshiroj instalim bibliotekë të plotë në dhomën e punës. Duhet rafta për libra dhe hapësirë për punë.',
    category: 'Mobilieri',
    city: 'Vlorë',
    address: 'Rr. 10 Dhjetori, Nr. 89',
    postalCode: '9401',
    desiredDate: '2024-03-18',
    budget: '35000 Lekë',
    budgetType: 'negotiable',
    urgency: 'normal',
    propertyType: 'Apartament',
    propertySize: '95m²',
    contactPreference: 'whatsapp',
    additionalRequirements: 'Duhet bibliotekë të personalizuara dhe funksionale'
  },
  {
    userId: 4,
    title: 'Instalim mobilieri banjo moderne',
    description: 'Dëshiroj instalim mobilieri moderne për banjon. Duhet kabinetë, pasqyrë dhe hapësirë për ruajtje.',
    category: 'Mobilieri',
    city: 'Shkodër',
    address: 'Rr. 11 Dhjetori, Nr. 12',
    postalCode: '4001',
    desiredDate: '2024-03-20',
    budget: '40000 Lekë',
    budgetType: 'fixed',
    urgency: 'normal',
    propertyType: 'Apartament',
    propertySize: '85m²',
    contactPreference: 'phone',
    additionalRequirements: 'Mobilieri duhet të jetë e rezistente ndaj lagështirës'
  },
  {
    userId: 5,
    title: 'Instalim garderobë për fëmijë',
    description: 'Dëshiroj instalim garderobë të përshtatshme për fëmijët. Duhet hapësirë për rroba dhe lodra.',
    category: 'Mobilieri',
    city: 'Elbasan',
    address: 'Rr. 12 Dhjetori, Nr. 34',
    postalCode: '3001',
    desiredDate: '2024-03-22',
    budget: '25000 Lekë',
    budgetType: 'fixed',
    urgency: 'normal',
    propertyType: 'Apartament',
    propertySize: '90m²',
    contactPreference: 'whatsapp',
    additionalRequirements: 'Garderoba duhet të jetë e sigurt dhe e përshtatshme për fëmijë'
  },
  {
    userId: 6,
    title: 'Instalim mobilieri kuzhine të plotë',
    description: 'Dëshiroj instalim mobilieri të plotë për kuzhinë. Duhet kabinetë, rafta dhe hapësirë për pajisje.',
    category: 'Mobilieri',
    city: 'Fier',
    address: 'Rr. 13 Dhjetori, Nr. 56',
    postalCode: '9301',
    desiredDate: '2024-03-25',
    budget: '60000 Lekë',
    budgetType: 'negotiable',
    urgency: 'normal',
    propertyType: 'Apartament',
    propertySize: '100m²',
    contactPreference: 'phone',
    additionalRequirements: 'Mobilieri duhet të jetë moderne dhe funksionale'
  },
  // More Kopshtari posts
  {
    userId: 7,
    title: 'Kujdesje pemë dekorative',
    description: 'Pemët dekorative në oborr duhen kujdesje speciale. Duhet prerje, plehërim dhe mbrojtje nga sëmundjet.',
    category: 'Kopshtari',
    city: 'Berat',
    address: 'Rr. 14 Dhjetori, Nr. 78',
    postalCode: '5001',
    desiredDate: '2024-03-05',
    budget: '30000 Lekë',
    budgetType: 'fixed',
    urgency: 'normal',
    propertyType: 'Shtëpi',
    propertySize: '350m²',
    contactPreference: 'whatsapp',
    additionalRequirements: 'Duhet specialist për pemë dekorative dhe kujdesje të rregullt'
  },
  {
    userId: 8,
    title: 'Instalim sistem ndriçimi kopsht',
    description: 'Dëshiroj instalim sistem ndriçimi për kopshtin. Duhet drita për sigurinë dhe estetikën e oborrit.',
    category: 'Kopshtari',
    city: 'Korçë',
    address: 'Rr. 15 Dhjetori, Nr. 23',
    postalCode: '7001',
    desiredDate: '2024-03-28',
    budget: '35000 Lekë',
    budgetType: 'negotiable',
    urgency: 'normal',
    propertyType: 'Shtëpi',
    propertySize: '280m²',
    contactPreference: 'phone',
    additionalRequirements: 'Duhet sistem ndriçimi të bukur dhe të kursyeshëm energji'
  },
  {
    userId: 1,
    title: 'Kujdesje bar dhe kopsht i vogël',
    description: 'Barri dhe kopshti i vogël në oborr duhen kujdesje të rregullt. Duhet prerje bar, ujitje dhe kujdesje për lulet.',
    category: 'Kopshtari',
    city: 'Tiranë',
    address: 'Rr. 16 Dhjetori, Nr. 45',
    postalCode: '1001',
    desiredDate: '2024-03-30',
    budget: '20000 Lekë',
    budgetType: 'fixed',
    urgency: 'normal',
    propertyType: 'Apartament',
    propertySize: '120m²',
    contactPreference: 'whatsapp',
    additionalRequirements: 'Duhet kujdesje të rregullt dhe të bukur për oborrin'
  },
  {
    userId: 2,
    title: 'Instalim sistem ujitje për lulet',
    description: 'Dëshiroj instalim sistem ujitje për lulet në oborr. Duhet sistem i thjeshtë dhe i lehtë për përdorim.',
    category: 'Kopshtari',
    city: 'Durrës',
    address: 'Rr. 17 Dhjetori, Nr. 67',
    postalCode: '2000',
    desiredDate: '2024-04-05',
    budget: '15000 Lekë',
    budgetType: 'fixed',
    urgency: 'normal',
    propertyType: 'Shtëpi',
    propertySize: '200m²',
    contactPreference: 'phone',
    additionalRequirements: 'Duhet sistem i thjeshtë për ujitje të lulet'
  },
  // Postime për kategorinë Kondicionerë
  {
    userId: 1,
    title: 'Instalim kondicioneri në sallon',
    description: 'Dëshiroj instalim të një kondicioneri të ri në sallon. Pajisja është blerë, duhet vetëm montimi.',
    category: 'Kondicionerë',
    city: 'Tiranë',
    address: 'Rr. Dritan Hoxha, Nr. 10',
    postalCode: '1001',
    desiredDate: '2024-04-10',
    budget: '12000 Lekë',
    budgetType: 'fixed',
    urgency: 'normal',
    propertyType: 'Apartament',
    propertySize: '90m²',
    contactPreference: 'phone',
    additionalRequirements: 'Dëshiroj punë të pastër dhe të sigurt.'
  },
  {
    userId: 2,
    title: 'Servis kondicioneri',
    description: 'Kondicioneri nuk ftoh si më parë. Ka nevojë për servis dhe mbushje me gaz.',
    category: 'Kondicionerë',
    city: 'Durrës',
    address: 'Rr. Taulantia, Nr. 22',
    postalCode: '2000',
    desiredDate: '2024-04-12',
    budget: '7000 Lekë',
    budgetType: 'negotiable',
    urgency: 'high',
    propertyType: 'Apartament',
    propertySize: '70m²',
    contactPreference: 'whatsapp',
    additionalRequirements: 'Shërbim i shpejtë, është urgjente.'
  },
  {
    userId: 3,
    title: 'Çmontim dhe montim kondicioneri',
    description: 'Dua të çmontoj kondicionerin nga një apartament dhe ta montoj në një tjetër.',
    category: 'Kondicionerë',
    city: 'Vlorë',
    address: 'Rr. Uji i Ftohtë, Nr. 5',
    postalCode: '9401',
    desiredDate: '2024-04-15',
    budget: '15000 Lekë',
    budgetType: 'fixed',
    urgency: 'normal',
    propertyType: 'Apartament',
    propertySize: '80m²',
    contactPreference: 'phone',
    additionalRequirements: 'Të ruhet pajisja gjatë transportit.'
  },
  {
    userId: 4,
    title: 'Riparim kondicioneri',
    description: 'Kondicioneri nxjerr zhurmë të madhe gjatë punës. Duhet kontroll dhe riparim.',
    category: 'Kondicionerë',
    city: 'Shkodër',
    address: 'Rr. Parrucë, Nr. 18',
    postalCode: '4001',
    desiredDate: '2024-04-18',
    budget: '9000 Lekë',
    budgetType: 'negotiable',
    urgency: 'normal',
    propertyType: 'Shtëpi',
    propertySize: '110m²',
    contactPreference: 'phone',
    additionalRequirements: 'Preferoj specialist me eksperiencë.'
  },
  {
    userId: 5,
    title: 'Instalim multi-split kondicioneri',
    description: 'Dua të instaloj një sistem multi-split për dy dhoma. Pajisjet janë të reja.',
    category: 'Kondicionerë',
    city: 'Elbasan',
    address: 'Rr. 28 Nëntori, Nr. 30',
    postalCode: '3001',
    desiredDate: '2024-04-20',
    budget: '25000 Lekë',
    budgetType: 'negotiable',
    urgency: 'normal',
    propertyType: 'Apartament',
    propertySize: '120m²',
    contactPreference: 'whatsapp',
    additionalRequirements: 'Dëshiroj garanci për punën.'
  },
  // Postime për kategorinë Dysheme & Parket
  {
    userId: 6,
    title: 'Vendosje parketi laminat',
    description: 'Dëshiroj të vendos parket laminat në dhomën e ndenjes dhe korridor.',
    category: 'Dysheme & Parket',
    city: 'Fier',
    address: 'Rr. Apollonia, Nr. 12',
    postalCode: '9301',
    desiredDate: '2024-04-11',
    budget: '18000 Lekë',
    budgetType: 'fixed',
    urgency: 'normal',
    propertyType: 'Apartament',
    propertySize: '85m²',
    contactPreference: 'phone',
    additionalRequirements: 'Parketi është blerë, duhet vetëm montimi.'
  },
  {
    userId: 7,
    title: 'Riparim dyshemeje druri',
    description: 'Dyshemeja prej druri ka filluar të kërcasë dhe ka nevojë për riparim.',
    category: 'Dysheme & Parket',
    city: 'Berat',
    address: 'Rr. Çlirim, Nr. 8',
    postalCode: '5001',
    desiredDate: '2024-04-13',
    budget: '10000 Lekë',
    budgetType: 'negotiable',
    urgency: 'normal',
    propertyType: 'Shtëpi',
    propertySize: '100m²',
    contactPreference: 'whatsapp',
    additionalRequirements: 'Dëshiroj të ruhet pamja natyrale e drurit.'
  },
  {
    userId: 8,
    title: 'Vendosje pllakash qeramike në korridor',
    description: 'Korridori ka nevojë për pllaka të reja qeramike. Sipërfaqja është rreth 15m².',
    category: 'Dysheme & Parket',
    city: 'Korçë',
    address: 'Rr. Rilindja, Nr. 20',
    postalCode: '7001',
    desiredDate: '2024-04-16',
    budget: '12000 Lekë',
    budgetType: 'fixed',
    urgency: 'normal',
    propertyType: 'Apartament',
    propertySize: '70m²',
    contactPreference: 'phone',
    additionalRequirements: 'Pllakat janë blerë, duhet vetëm vendosja.'
  },
  {
    userId: 1,
    title: 'Lëmim dhe lyerje parketi',
    description: 'Parketi i vjetër ka nevojë për lëmim dhe lyerje për t’u rifreskuar.',
    category: 'Dysheme & Parket',
    city: 'Tiranë',
    address: 'Rr. Kavaja, Nr. 55',
    postalCode: '1001',
    desiredDate: '2024-04-19',
    budget: '15000 Lekë',
    budgetType: 'negotiable',
    urgency: 'normal',
    propertyType: 'Apartament',
    propertySize: '95m²',
    contactPreference: 'whatsapp',
    additionalRequirements: 'Dëshiroj që të përdoren materiale cilësore.'
  },
  {
    userId: 2,
    title: 'Vendosje parketi vinil në kuzhinë',
    description: 'Kuzhina ka nevojë për parket vinil rezistent ndaj ujit.',
    category: 'Dysheme & Parket',
    city: 'Durrës',
    address: 'Rr. Iliria, Nr. 40',
    postalCode: '2000',
    desiredDate: '2024-04-22',
    budget: '9000 Lekë',
    budgetType: 'fixed',
    urgency: 'normal',
    propertyType: 'Apartament',
    propertySize: '60m²',
    contactPreference: 'phone',
    additionalRequirements: 'Parketi është blerë, duhet vetëm montimi.'
  },
  // Postime për kategorinë IT & Teknologji
  {
    userId: 3,
    title: 'Instalim rrjeti interneti në shtëpi',
    description: 'Dëshiroj të instaloj rrjet kabllor dhe WiFi në të gjithë shtëpinë.',
    category: 'IT & Teknologji',
    city: 'Vlorë',
    address: 'Rr. Skelë, Nr. 15',
    postalCode: '9401',
    desiredDate: '2024-04-14',
    budget: '10000 Lekë',
    budgetType: 'fixed',
    urgency: 'normal',
    propertyType: 'Apartament',
    propertySize: '80m²',
    contactPreference: 'whatsapp',
    additionalRequirements: 'Dëshiroj shtrirje të mirë të sinjalit.'
  },
  {
    userId: 4,
    title: 'Riparim kompjuteri desktop',
    description: 'Kompjuteri nuk ndizet. Duhet diagnostikim dhe riparim.',
    category: 'IT & Teknologji',
    city: 'Shkodër',
    address: 'Rr. Dëshmorët, Nr. 8',
    postalCode: '4001',
    desiredDate: '2024-04-17',
    budget: '6000 Lekë',
    budgetType: 'negotiable',
    urgency: 'high',
    propertyType: 'Apartament',
    propertySize: '70m²',
    contactPreference: 'phone',
    additionalRequirements: 'Duhet të bëhet sa më shpejt.'
  },
  {
    userId: 5,
    title: 'Instalim kamera sigurie',
    description: 'Dëshiroj të instaloj 4 kamera sigurie në hyrje dhe korridor.',
    category: 'IT & Teknologji',
    city: 'Elbasan',
    address: 'Rr. 5 Maji, Nr. 25',
    postalCode: '3001',
    desiredDate: '2024-04-21',
    budget: '20000 Lekë',
    budgetType: 'negotiable',
    urgency: 'normal',
    propertyType: 'Shtëpi',
    propertySize: '120m²',
    contactPreference: 'whatsapp',
    additionalRequirements: 'Dëshiroj akses nga telefoni.'
  },
  {
    userId: 6,
    title: 'Konfigurim printeri dhe rrjeti',
    description: 'Printeri nuk lidhet me rrjetin WiFi. Duhet konfigurim dhe testim.',
    category: 'IT & Teknologji',
    city: 'Fier',
    address: 'Rr. 8 Marsi, Nr. 12',
    postalCode: '9301',
    desiredDate: '2024-04-23',
    budget: '5000 Lekë',
    budgetType: 'fixed',
    urgency: 'normal',
    propertyType: 'Apartament',
    propertySize: '75m²',
    contactPreference: 'phone',
    additionalRequirements: 'Printeri është i ri.'
  },
  {
    userId: 7,
    title: 'Riparim laptopi',
    description: 'Laptopi është shumë i ngadaltë dhe ka nevojë për formatim dhe pastrim.',
    category: 'IT & Teknologji',
    city: 'Berat',
    address: 'Rr. 6 Marsi, Nr. 30',
    postalCode: '5001',
    desiredDate: '2024-04-25',
    budget: '8000 Lekë',
    budgetType: 'negotiable',
    urgency: 'normal',
    propertyType: 'Apartament',
    propertySize: '65m²',
    contactPreference: 'whatsapp',
    additionalRequirements: 'Dëshiroj të ruhet të dhënat.'
  },
  // Postime shtesë për Kondicionerë
  {
    userId: 6,
    title: 'Mirëmbajtje vjetore kondicioneri',
    description: 'Dua të bëj mirëmbajtje vjetore për kondicionerin, pastrim dhe kontroll teknik.',
    category: 'Kondicionerë',
    city: 'Fier',
    address: 'Rr. Skënderbeu, Nr. 21',
    postalCode: '9301',
    desiredDate: '2024-05-02',
    budget: '6000 Lekë',
    budgetType: 'fixed',
    urgency: 'normal',
    propertyType: 'Apartament',
    propertySize: '75m²',
    contactPreference: 'phone',
    additionalRequirements: 'Dëshiroj që të përdoren produkte cilësore për pastrim.'
  },
  {
    userId: 7,
    title: 'Instalim kondicioneri në zyrë',
    description: 'Dua të instaloj një kondicioner të ri në zyrë. Pajisja është blerë.',
    category: 'Kondicionerë',
    city: 'Berat',
    address: 'Rr. Republika, Nr. 8',
    postalCode: '5001',
    desiredDate: '2024-05-05',
    budget: '10000 Lekë',
    budgetType: 'negotiable',
    urgency: 'normal',
    propertyType: 'Zyrë',
    propertySize: '60m²',
    contactPreference: 'whatsapp',
    additionalRequirements: 'Dëshiroj punë të pastër dhe të shpejtë.'
  },
  // Postime shtesë për Dysheme & Parket
  {
    userId: 8,
    title: 'Vendosje parketi druri natyral',
    description: 'Dua të vendos parket druri natyral në dhomën e gjumit.',
    category: 'Dysheme & Parket',
    city: 'Korçë',
    address: 'Rr. Fan Noli, Nr. 17',
    postalCode: '7001',
    desiredDate: '2024-05-03',
    budget: '20000 Lekë',
    budgetType: 'negotiable',
    urgency: 'normal',
    propertyType: 'Apartament',
    propertySize: '40m²',
    contactPreference: 'phone',
    additionalRequirements: 'Parketi është blerë, duhet vetëm montimi.'
  },
  {
    userId: 1,
    title: 'Riparim pllakash të dëmtuara',
    description: 'Disa pllaka në korridor janë çarë dhe duhen zëvendësuar.',
    category: 'Dysheme & Parket',
    city: 'Tiranë',
    address: 'Rr. Myslym Shyri, Nr. 99',
    postalCode: '1001',
    desiredDate: '2024-05-07',
    budget: '8000 Lekë',
    budgetType: 'fixed',
    urgency: 'normal',
    propertyType: 'Apartament',
    propertySize: '20m²',
    contactPreference: 'whatsapp',
    additionalRequirements: 'Dëshiroj punë të pastër.'
  },
  // Postime shtesë për IT & Teknologji
  {
    userId: 2,
    title: 'Instalim rrjeti kompjuterik në zyrë',
    description: 'Dua të instaloj rrjet LAN për 6 kompjuterë në zyrë.',
    category: 'IT & Teknologji',
    city: 'Durrës',
    address: 'Rr. Aleksandër Goga, Nr. 44',
    postalCode: '2000',
    desiredDate: '2024-05-04',
    budget: '15000 Lekë',
    budgetType: 'negotiable',
    urgency: 'normal',
    propertyType: 'Zyrë',
    propertySize: '100m²',
    contactPreference: 'phone',
    additionalRequirements: 'Dëshiroj kabllo të cilësisë së lartë.'
  },
  {
    userId: 3,
    title: 'Riparim telefoni smartphone',
    description: 'Telefoni nuk ndizet, ka nevojë për diagnostikim dhe riparim.',
    category: 'IT & Teknologji',
    city: 'Vlorë',
    address: 'Rr. Ismail Qemali, Nr. 12',
    postalCode: '9401',
    desiredDate: '2024-05-08',
    budget: '5000 Lekë',
    budgetType: 'fixed',
    urgency: 'normal',
    propertyType: 'Apartament',
    propertySize: '30m²',
    contactPreference: 'whatsapp',
    additionalRequirements: 'Dëshiroj të ruhet të dhënat.'
  }
];

// Function to hash passwords
async function hashPasswords() {
  for (let user of sampleUsers) {
    user.password = await bcrypt.hash(user.password, 10);
  }
}

// Function to insert users
function insertUsers() {
  return new Promise((resolve, reject) => {
    const insertUserPromises = sampleUsers.map(user => {
      return new Promise((resolveUser, rejectUser) => {
        // Check if user already exists
        db.get('SELECT id FROM users WHERE email = ?', [user.email], (err, row) => {
          if (err) {
            rejectUser(err);
            return;
          }
          
          if (row) {
            console.log(`User ${user.email} already exists, skipping...`);
            resolveUser(row.id);
            return;
          }
          
          // Insert new user
          db.run(
            'INSERT INTO users (firstName, lastName, email, password, phone, city) VALUES (?, ?, ?, ?, ?, ?)',
            [user.firstName, user.lastName, user.email, user.password, user.phone, user.city],
            function(err) {
              if (err) {
                rejectUser(err);
                return;
              }
              console.log(`User ${user.email} inserted with ID: ${this.lastID}`);
              resolveUser(this.lastID);
            }
          );
        });
      });
    });
    
    Promise.all(insertUserPromises)
      .then(resolve)
      .catch(reject);
  });
}

// Function to insert requests
function insertRequests() {
  return new Promise((resolve, reject) => {
    const insertRequestPromises = sampleRequests.map(request => {
      return new Promise((resolveRequest, rejectRequest) => {
        db.run(
          `INSERT INTO requests (
            userId, title, description, category, city, address, postalCode, 
            desiredDate, budget, budgetType, urgency, propertyType, propertySize, 
            contactPreference, additionalRequirements
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            request.userId, request.title, request.description, request.category,
            request.city, request.address, request.postalCode, request.desiredDate,
            request.budget, request.budgetType, request.urgency, request.propertyType,
            request.propertySize, request.contactPreference, request.additionalRequirements
          ],
          function(err) {
            if (err) {
              rejectRequest(err);
              return;
            }
            console.log(`Request "${request.title}" inserted with ID: ${this.lastID}`);
            resolveRequest(this.lastID);
          }
        );
      });
    });
    
    Promise.all(insertRequestPromises)
      .then(resolve)
      .catch(reject);
  });
}

// Main seeding function
async function seedDatabase() {
  try {
    console.log('Starting database seeding...');
    
    // Hash passwords
    await hashPasswords();
    console.log('Passwords hashed successfully.');
    
    // Insert users
    await insertUsers();
    console.log('Users inserted successfully.');
    
    // Insert requests
    await insertRequests();
    console.log('Requests inserted successfully.');
    
    console.log('Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  }
}

// Run the seeding
seedDatabase(); 