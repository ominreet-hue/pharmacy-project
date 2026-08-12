/* ============================================================
   MedFind — Medicine database + helper functions
   ============================================================ */

export const medicines = [
  {
    id: 1,
    name: "Panadol",
    activeIngredient: "Paracetamol",
    dosage: "500mg",
    form: "Tablet",
    manufacturer: "GSK",
    price: 50,
    available: true,
    category: "Pain Relief",
    icon: "💊",
    description: "Panadol is a widely used pain reliever and fever reducer containing paracetamol as its active ingredient.",
    usage: "Used for the relief of mild to moderate pain such as headache, toothache, and muscle aches, and to reduce fever.",
    alternatives: [2, 3]
  },
  {
    id: 2,
    name: "CetaMed",
    activeIngredient: "Paracetamol",
    dosage: "500mg",
    form: "Tablet",
    manufacturer: "EIPICO",
    price: 35,
    available: true,
    category: "Pain Relief",
    icon: "💊",
    description: "CetaMed is a generic paracetamol tablet used for pain relief and fever reduction.",
    usage: "For the relief of mild to moderate pain and fever. Suitable for adults and children over 12 years.",
    alternatives: [1, 3]
  },
  {
    id: 3,
    name: "Paramed",
    activeIngredient: "Paracetamol",
    dosage: "500mg",
    form: "Tablet",
    manufacturer: "Pharco",
    price: 42,
    available: true,
    category: "Pain Relief",
    icon: "💊",
    description: "Paramed tablets contain paracetamol for effective relief of mild pain and fever.",
    usage: "Used to treat mild to moderate pain and reduce fever. Follow the recommended dosage.",
    alternatives: [1, 2]
  },
  {
    id: 4,
    name: "Augmentin",
    activeIngredient: "Amoxicillin + Clavulanic Acid",
    dosage: "1g",
    form: "Tablet",
    manufacturer: "GSK",
    price: 120,
    available: true,
    category: "Antibiotics",
    icon: "🧪",
    description: "Augmentin is a broad-spectrum antibiotic combining amoxicillin with clavulanic acid.",
    usage: "Used to treat bacterial infections including respiratory, ear, and urinary tract infections. Take as prescribed.",
    alternatives: [5, 6]
  },
  {
    id: 5,
    name: "Amoxil",
    activeIngredient: "Amoxicillin",
    dosage: "500mg",
    form: "Capsule",
    manufacturer: "EIPICO",
    price: 85,
    available: true,
    category: "Antibiotics",
    icon: "🧪",
    description: "Amoxil is a penicillin-type antibiotic used to treat a wide variety of bacterial infections.",
    usage: "Used for bacterial infections of the respiratory tract, ear, and urinary tract. Complete the full course.",
    alternatives: [4, 6]
  },
  {
    id: 6,
    name: "Clavoxil",
    activeIngredient: "Amoxicillin + Clavulanic Acid",
    dosage: "1g",
    form: "Tablet",
    manufacturer: "Pharco",
    price: 95,
    available: false,
    category: "Antibiotics",
    icon: "🧪",
    description: "Clavoxil is a combination antibiotic effective against a broad range of bacteria.",
    usage: "Used to treat bacterial infections. Always complete the full prescribed course.",
    alternatives: [4, 5]
  },
  {
    id: 7,
    name: "Vitamin D3",
    activeIngredient: "Cholecalciferol",
    dosage: "5000 IU",
    form: "Capsule",
    manufacturer: "Novartis",
    price: 60,
    available: true,
    category: "Vitamins",
    icon: "☀️",
    description: "Vitamin D3 supplement supports bone health and immune function.",
    usage: "Used to prevent and treat vitamin D deficiency. Take one capsule daily or as directed.",
    alternatives: [8, 9]
  },
  {
    id: 8,
    name: "D-Cure",
    activeIngredient: "Cholecalciferol",
    dosage: "5000 IU",
    form: "Capsule",
    manufacturer: "EIPICO",
    price: 45,
    available: true,
    category: "Vitamins",
    icon: "☀️",
    description: "D-Cure provides vitamin D3 to support calcium absorption and bone health.",
    usage: "Used to maintain healthy vitamin D levels. Take as directed by your doctor or pharmacist.",
    alternatives: [7, 9]
  },
  {
    id: 9,
    name: "VitaD",
    activeIngredient: "Cholecalciferol",
    dosage: "2000 IU",
    form: "Tablet",
    manufacturer: "Pharco",
    price: 38,
    available: true,
    category: "Vitamins",
    icon: "☀️",
    description: "VitaD tablets provide a daily dose of vitamin D for bone and immune support.",
    usage: "Used as a daily vitamin D supplement to support overall bone health.",
    alternatives: [7, 8]
  },
  {
    id: 10,
    name: "Zyrtec",
    activeIngredient: "Cetirizine",
    dosage: "10mg",
    form: "Tablet",
    manufacturer: "UCB",
    price: 70,
    available: true,
    category: "Allergy",
    icon: "🌿",
    description: "Zyrtec is an antihistamine used to relieve allergy symptoms.",
    usage: "Used for hay fever, allergic rhinitis, and skin allergies. Usually taken once daily.",
    alternatives: [11, 12]
  },
  {
    id: 11,
    name: "Cetazine",
    activeIngredient: "Cetirizine",
    dosage: "10mg",
    form: "Tablet",
    manufacturer: "EIPICO",
    price: 30,
    available: true,
    category: "Allergy",
    icon: "🌿",
    description: "Cetazine is a generic cetirizine tablet for allergy symptom relief.",
    usage: "Used to relieve symptoms of allergies such as sneezing, runny nose, and itching.",
    alternatives: [10, 12]
  },
  {
    id: 12,
    name: "Allerstop",
    activeIngredient: "Loratadine",
    dosage: "10mg",
    form: "Tablet",
    manufacturer: "Pharco",
    price: 40,
    available: true,
    category: "Allergy",
    icon: "🌿",
    description: "Allerstop contains loratadine, a non-drowsy antihistamine for allergy relief.",
    usage: "Used for seasonal allergies and chronic skin reactions. Non-drowsy formula.",
    alternatives: [10, 11]
  },
  {
    id: 13,
    name: "Glucophage",
    activeIngredient: "Metformin",
    dosage: "850mg",
    form: "Tablet",
    manufacturer: "Merck",
    price: 90,
    available: true,
    category: "Diabetes",
    icon: "🩸",
    description: "Glucophage is used to control blood sugar levels in type 2 diabetes.",
    usage: "Used along with diet and exercise to manage blood sugar in type 2 diabetes.",
    alternatives: [14, 15]
  },
  {
    id: 14,
    name: "Metform",
    activeIngredient: "Metformin",
    dosage: "850mg",
    form: "Tablet",
    manufacturer: "EIPICO",
    price: 55,
    available: true,
    category: "Diabetes",
    icon: "🩸",
    description: "Metform is a generic metformin tablet for blood sugar control.",
    usage: "Used to manage blood sugar levels in type 2 diabetes. Take with meals.",
    alternatives: [13, 15]
  },
  {
    id: 15,
    name: "Glucovance",
    activeIngredient: "Metformin + Glibenclamide",
    dosage: "500/5mg",
    form: "Tablet",
    manufacturer: "Pharco",
    price: 78,
    available: true,
    category: "Diabetes",
    icon: "🩸",
    description: "Glucovance combines metformin and glibenclamide for blood sugar control.",
    usage: "Used when metformin alone does not adequately control blood sugar. Take as prescribed.",
    alternatives: [13, 14]
  },
  {
    id: 16,
    name: "Concor",
    activeIngredient: "Bisoprolol",
    dosage: "5mg",
    form: "Tablet",
    manufacturer: "Merck",
    price: 110,
    available: true,
    category: "Heart",
    icon: "❤️",
    description: "Concor is a beta-blocker used to treat high blood pressure and heart conditions.",
    usage: "Used for hypertension and certain heart conditions. Take regularly for best results.",
    alternatives: [17, 18]
  },
  {
    id: 17,
    name: "Bisopro",
    activeIngredient: "Bisoprolol",
    dosage: "5mg",
    form: "Tablet",
    manufacturer: "EIPICO",
    price: 72,
    available: true,
    category: "Heart",
    icon: "❤️",
    description: "Bisopro is a generic bisoprolol tablet for blood pressure management.",
    usage: "Used to treat high blood pressure. Take once daily, preferably in the morning.",
    alternatives: [16, 18]
  },
  {
    id: 18,
    name: "Tenormin",
    activeIngredient: "Atenolol",
    dosage: "50mg",
    form: "Tablet",
    manufacturer: "Pharco",
    price: 88,
    available: true,
    category: "Heart",
    icon: "❤️",
    description: "Tenormin is a beta-blocker used for high blood pressure and angina.",
    usage: "Used to treat hypertension and prevent angina. Take as directed by your doctor.",
    alternatives: [16, 17]
  },
  {
    id: 19,
    name: "Coldrex",
    activeIngredient: "Paracetamol + Phenylephrine",
    dosage: "500/5mg",
    form: "Tablet",
    manufacturer: "GSK",
    price: 65,
    available: true,
    category: "Cold & Flu",
    icon: "🤧",
    description: "Coldrex provides relief from cold and flu symptoms including congestion and fever.",
    usage: "Used for temporary relief of cold and flu symptoms. Do not exceed the recommended dose.",
    alternatives: [20, 21]
  },
  {
    id: 20,
    name: "FluStop",
    activeIngredient: "Paracetamol + Pseudoephedrine",
    dosage: "500/30mg",
    form: "Tablet",
    manufacturer: "EIPICO",
    price: 48,
    available: true,
    category: "Cold & Flu",
    icon: "🤧",
    description: "FluStop tablets relieve nasal congestion, fever, and body aches from colds.",
    usage: "Used for relief of cold and flu symptoms. Take every 6 hours as needed.",
    alternatives: [19, 21]
  },
  {
    id: 21,
    name: "Rhinex",
    activeIngredient: "Paracetamol + Chlorpheniramine",
    dosage: "500/4mg",
    form: "Tablet",
    manufacturer: "Pharco",
    price: 52,
    available: false,
    category: "Cold & Flu",
    icon: "🤧",
    description: "Rhinex combines a pain reliever with an antihistamine for cold symptom relief.",
    usage: "Used to relieve multiple cold symptoms. May cause drowsiness.",
    alternatives: [19, 20]
  },
  {
    id: 22,
    name: "Motilium",
    activeIngredient: "Domperidone",
    dosage: "10mg",
    form: "Tablet",
    manufacturer: "Johnson & Johnson",
    price: 58,
    available: true,
    category: "Digestive Health",
    icon: "🍃",
    description: "Motilium is used to relieve nausea and digestive discomfort.",
    usage: "Used for nausea, bloating, and feelings of fullness. Take before meals.",
    alternatives: [23, 24]
  },
  {
    id: 23,
    name: "Domperid",
    activeIngredient: "Domperidone",
    dosage: "10mg",
    form: "Tablet",
    manufacturer: "EIPICO",
    price: 32,
    available: true,
    category: "Digestive Health",
    icon: "🍃",
    description: "Domperid is a generic domperidone tablet for digestive comfort.",
    usage: "Used to relieve nausea and digestive discomfort. Take as directed.",
    alternatives: [22, 24]
  },
  {
    id: 24,
    name: "Gastro-Stop",
    activeIngredient: "Loperamide",
    dosage: "2mg",
    form: "Capsule",
    manufacturer: "Pharco",
    price: 36,
    available: true,
    category: "Digestive Health",
    icon: "🍃",
    description: "Gastro-Stop is used for the symptomatic relief of diarrhea.",
    usage: "Used to treat acute and chronic diarrhea. Follow dosage instructions carefully.",
    alternatives: [22, 23]
  }
];

export const categories = [
  { name: "Pain Relief", icon: "💊" },
  { name: "Antibiotics", icon: "🧪" },
  { name: "Vitamins", icon: "☀️" },
  { name: "Allergy", icon: "🌿" },
  { name: "Diabetes", icon: "🩸" },
  { name: "Heart", icon: "❤️" },
  { name: "Cold & Flu", icon: "🤧" },
  { name: "Digestive Health", icon: "🍃" }
];

export const pharmacies = [
  { id: 1, name: "Seif Pharmacy", distance: 0.8, address: "Tahrir Square, Cairo", rating: 4.7 },
  { id: 2, name: "El-Ezaby Pharmacy", distance: 1.2, address: "Nasr City, Cairo", rating: 4.5 },
  { id: 3, name: "Roshdy Pharmacy", distance: 2.1, address: "Maadi, Cairo", rating: 4.3 },
  { id: 4, name: "Dawaee Pharmacy", distance: 0.5, address: "Downtown, Cairo", rating: 4.6 },
  { id: 5, name: "19011 Pharmacy", distance: 1.6, address: "Heliopolis, Cairo", rating: 4.4 },
  { id: 6, name: "Green Pharmacy", distance: 3.0, address: "6th of October City", rating: 4.2 }
];

export function getMedicineById(id) {
  return medicines.find((m) => m.id === Number(id));
}

export function searchMedicines(query) {
  const q = query.trim().toLowerCase();
  if (!q) return [...medicines];
  return medicines.filter(
    (m) =>
      m.name.toLowerCase().includes(q) ||
      m.activeIngredient.toLowerCase().includes(q) ||
      m.category.toLowerCase().includes(q)
  );
}

export function getByCategory(category) {
  return medicines.filter((m) => m.category === category);
}

export function getAlternatives(id) {
  const med = getMedicineById(id);
  if (!med || !med.alternatives) return [];
  return med.alternatives.map((aid) => getMedicineById(aid)).filter(Boolean);
}

export function getCheapestAlternative(id) {
  const alts = getAlternatives(id);
  if (!alts.length) return null;
  return alts.reduce((min, m) => (m.price < min.price ? m : min), alts[0]);
}

export function priceDiff(original, alt) {
  return original.price - alt.price;
}

export function pctDiff(original, alt) {
  if (!original.price) return 0;
  return Math.round(((original.price - alt.price) / original.price) * 100);
}

export function formatPrice(price) {
  return `${price} EGP`;
}

export function availabilityBadge(med) {
  return med.available
    ? '<span class="badge badge--ok">Available</span>'
    : '<span class="badge badge--no">Out of stock</span>';
}
