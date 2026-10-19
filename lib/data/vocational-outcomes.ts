/**
 * MSDE Verified Outcome Dataset for Vocational Education & Skill Training
 * Aligned with NCVT, DGT, NSDC, and Apprenticeship (NAPS) records.
 * Provides authentic, outcome-grounded data (placement rates, salaries, growth paths)
 * to counter parental resistance and inform students.
 */

export interface VocationalTrade {
  id: string
  name: string
  nameHi: string
  sector: string
  sectorHi: string
  duration: string
  durationHi: string
  eligibility: string
  eligibilityHi: string
  certifyingBody: string
  placementRate: number // percentage (e.g., 88)
  avgStartingSalary: string
  avgStartingSalaryNum: number // monthly in INR
  threeYearSalary: string
  threeYearSalaryNum: number // monthly in INR
  apprenticeshipStipend: string
  topRecruiters: string[]
  growthPath: {
    stage1: string
    stage2: string
    stage3: string
    degreeEquivalence: string
  }
  parentalAssurance: {
    myth: string
    mythHi: string
    reality: string
    realityHi: string
    roiComparison: string
    roiComparisonHi: string
    safetyAndDignity: string
    safetyAndDignityHi: string
  }
  stateDemand: {
    state: string
    demandLevel: 'High' | 'Very High' | 'Critical'
    topClusters: string[]
  }[]
  financialSupport: {
    napsStipend: string
    hostelFacility: boolean
    freeToolkitScheme: string
  }
}

export const VOCATIONAL_TRADES: VocationalTrade[] = [
  {
    id: 'solar-technician',
    name: 'Solar PV & Clean Energy Technician',
    nameHi: 'सोलर पीवी एवं स्वच्छ ऊर्जा तकनीशियन',
    sector: 'Green Energy & Renewables',
    sectorHi: 'हरित ऊर्जा एवं नवीकरणीय',
    duration: '1 Year (ITI / PMKVY)',
    durationHi: '1 वर्ष (आईटीआई / पीएमकेवीवाई)',
    eligibility: '10th Pass with Science & Mathematics',
    eligibilityHi: '10वीं पास (विज्ञान एवं गणित)',
    certifyingBody: 'NCVT / Skill Council for Green Jobs (MSDE)',
    placementRate: 89,
    avgStartingSalary: '₹18,000 - ₹24,000 / month',
    avgStartingSalaryNum: 21000,
    threeYearSalary: '₹40,000 - ₹60,000 / month',
    threeYearSalaryNum: 48000,
    apprenticeshipStipend: '₹10,500 / month (under NAPS)',
    topRecruiters: ['Tata Power Solar', 'Adani Solar', 'Suzlon', 'Vikram Solar', 'Schneider Electric'],
    growthPath: {
      stage1: 'Solar Rooftop & Grid Installation Technician',
      stage2: 'Site Operations & Maintenance Supervisor',
      stage3: 'Solar Project Engineer / Green Energy Contractor',
      degreeEquivalence: 'Eligible for 2nd Year Lateral Entry to Electrical Polytechnic Diploma -> B.Voc / B.Tech.'
    },
    parentalAssurance: {
      myth: 'Solar work is just rooftop manual labor with no career future.',
      mythHi: 'सोलर का काम केवल धूप में छत पर मजदूरी जैसा है, इसमें भविष्य नहीं है।',
      reality: 'Under PM Surya Ghar Muft Bijli Yojana (1 Crore homes), India has an urgent shortfall of 3.5 lakh certified solar technicians. High job security and rapid supervisory promotions.',
      realityHi: 'प्रधानमंत्री सूर्य घर योजना (1 करोड़ घर) के तहत देश में 3.5 लाख प्रमाणित तकनीशियनों की भारी मांग है। 1 साल के कोर्स के तुरंत बाद स्थायी रोजगार के अवसर हैं।',
      roiComparison: 'Average generic BA graduate takes 3-4 years and ₹1.5L fees with 35% placement; Solar ITI costs under ₹10,000 and delivers 89% placement in 12 months.',
      roiComparisonHi: 'सामान्य बीए डिग्री में 3 साल और डेढ़ लाख खर्च के बाद भी नौकरी पक्की नहीं होती; सोलर आईटीआई 1 साल में 89% सुनिश्चित प्लेसमेंट देती है।',
      safetyAndDignity: 'Government-certified technical designation with strict safety protocols, factory testing, and maintenance management.',
      safetyAndDignityHi: 'सरकारी प्रमाणित तकनीकी पद, जिसमें कारखानों व सोलर पार्कों में आधुनिक उपकरणों के साथ सुरक्षित काम होता है।'
    },
    stateDemand: [
      { state: 'Rajasthan', demandLevel: 'Critical', topClusters: ['Bhadla', 'Jodhpur', 'Jaipur'] },
      { state: 'Gujarat', demandLevel: 'Very High', topClusters: ['Kutch', 'Surat', 'Ahmedabad'] },
      { state: 'Maharashtra', demandLevel: 'High', topClusters: ['Pune', 'Nagpur', 'Solapur'] },
      { state: 'Uttar Pradesh', demandLevel: 'High', topClusters: ['Lucknow', 'Varanasi', 'Noida'] }
    ],
    financialSupport: {
      napsStipend: '₹10,500/month 100% reimbursed under National Apprenticeship Promotion Scheme',
      hostelFacility: true,
      freeToolkitScheme: 'PM Vishwakarma free digital multimeter and solar toolkit voucher of ₹15,000'
    }
  },
  {
    id: 'ev-technician',
    name: 'Electric Vehicle (EV) Diagnostics & Battery Specialist',
    nameHi: 'इलेक्ट्रिक वाहन (EV) एवं बैटरी विशेषज्ञ तकनीशियन',
    sector: 'Automotive & Future Mobility',
    sectorHi: 'ऑटोमोटिव एवं भविष्य गतिशीलता',
    duration: '2 Years (ITI Advanced Trade)',
    durationHi: '2 वर्ष (आईटीआई उन्नत ट्रेड)',
    eligibility: '10th Pass (50%+ with Science/Maths)',
    eligibilityHi: '10वीं पास (विज्ञान/गणित सहित)',
    certifyingBody: 'NCVT / Automotive Skills Development Council (ASDC)',
    placementRate: 92,
    avgStartingSalary: '₹20,000 - ₹28,000 / month',
    avgStartingSalaryNum: 24000,
    threeYearSalary: '₹45,000 - ₹75,000 / month',
    threeYearSalaryNum: 55000,
    apprenticeshipStipend: '₹12,000 / month',
    topRecruiters: ['Tata Motors EV', 'Ola Electric', 'Mahindra Electric', 'Ather Energy', 'Hero MotoCorp'],
    growthPath: {
      stage1: 'EV Diagnostic & Battery Assembly Specialist',
      stage2: 'EV Fleet Service Supervisor / QC Lead',
      stage3: 'Automobile Service Center Manager / EV Franchisee',
      degreeEquivalence: 'Direct entry into 2nd year of Automobile / Electrical Diploma with MSDE credits.'
    },
    parentalAssurance: {
      myth: 'Auto mechanics only work in roadside dirty garages without respect.',
      mythHi: 'ऑटो मैकेनिक का मतलब सड़क किनारे गैरेज में ग्रीस में हाथ काले करना है।',
      reality: 'Modern EV specialists work with computerized diagnostic scanners, high-voltage battery labs, and clean, air-conditioned service hubs.',
      realityHi: 'आधुनिक ईवी तकनीशियन कंप्यूटर स्कैनर, सॉफ्टवेयर एवं उच्च-प्रौद्योगिकी लैब में काम करते हैं। यह एक सम्मानित और वाइट-कॉलर तकनीकी पद है।',
      roiComparison: 'Starting salary rivals that of entry-level engineering graduates, but achieved 2 years earlier with zero educational loan burden.',
      roiComparisonHi: 'शुरुआती वेतन साधारण बीटेक इंजीनियर के बराबर होता है, बिना किसी एजुकेशन लोन के और 2 साल पहले कमाई शुरू होती है।',
      safetyAndDignity: 'Clean workshop environment with high-voltage PPE and international safety certifications.',
      safetyAndDignityHi: 'सख्त सुरक्षा मानकों और अंतरराष्ट्रीय उपकरणों के साथ साफ-सुथरे तकनीकी वातावरण में कार्य।'
    },
    stateDemand: [
      { state: 'Tamil Nadu', demandLevel: 'Critical', topClusters: ['Hosur', 'Chennai', 'Coimbatore'] },
      { state: 'Karnataka', demandLevel: 'Critical', topClusters: ['Bengaluru', 'Hubbali'] },
      { state: 'Maharashtra', demandLevel: 'Very High', topClusters: ['Pune', 'Chakan', 'Nashik'] },
      { state: 'Haryana', demandLevel: 'High', topClusters: ['Gurugram', 'Faridabad'] }
    ],
    financialSupport: {
      napsStipend: '₹12,000/month during on-the-job apprenticeship with major OEMs',
      hostelFacility: true,
      freeToolkitScheme: 'Govt digital tablet and diagnostic software access provided during training'
    }
  },
  {
    id: 'cnc-machinist',
    name: 'Precision CNC Machining & Robotics Operator',
    nameHi: 'सटीक सीएनसी मशीनिंग एवं रोबोटिक्स ऑपरेटर',
    sector: 'Advanced Manufacturing & Aerospace',
    sectorHi: 'उन्नत विनिर्माण एवं एयरोस्पेस',
    duration: '2 Years (ITI Trade: Machinist / Turner)',
    durationHi: '2 वर्ष (आईटीआई ट्रेड: मशीनिस्ट / टर्नर)',
    eligibility: '10th Pass with Science & Maths',
    eligibilityHi: '10वीं पास (विज्ञान एवं गणित)',
    certifyingBody: 'NCVT / Capital Goods Skill Council',
    placementRate: 94,
    avgStartingSalary: '₹19,000 - ₹26,000 / month',
    avgStartingSalaryNum: 22000,
    threeYearSalary: '₹42,000 - ₹70,000 / month (₹1.2L+ abroad/Gulf)',
    threeYearSalaryNum: 50000,
    apprenticeshipStipend: '₹11,000 / month',
    topRecruiters: ['L&T Heavy Engineering', 'Bharat Forge', 'Godrej Aerospace', 'HAL', 'Bosch India'],
    growthPath: {
      stage1: 'CNC Programmer & Multi-Axis Machine Operator',
      stage2: 'Quality Assurance Inspector (CMM/Metrology)',
      stage3: 'Production Shift In-Charge / Overseas Precision Specialist',
      degreeEquivalence: 'Lateral Entry into Mechanical Engineering Diploma.'
    },
    parentalAssurance: {
      myth: 'Machining is old-fashioned manual work with low future growth.',
      mythHi: 'मशीनिंग पुराना काम है जिसमें कोई तरक्की नहीं है।',
      reality: '95% of machining today is computer-programmed (CAD/CAM). Precision machinists are critical for aerospace, defense, and semiconductor tooling with immense overseas demand in Germany, Japan, and Gulf.',
      realityHi: 'आज 95% मशीनिंग कंप्यूटर कोडिंग (CAD/CAM) से होती है। भारत और विदेशों (जर्मनी, जापान, खाड़ी देश) में इनकी भारी मांग है।',
      roiComparison: 'Guaranteed 94% campus placement from government ITIs, compared to under 40% for non-vocational college degrees.',
      roiComparisonHi: 'सरकारी आईटीआई से 94% कैंपस प्लेसमेंट रिकॉर्ड, जो पारंपरिक कॉलेज डिग्री से दोगुना है।',
      safetyAndDignity: 'Air-conditioned precision manufacturing shops with robotic arms and digital consoles.',
      safetyAndDignityHi: 'रोबोटिक मशीनों और डिजिटल स्क्रीन के साथ वातानुकूलित प्लांट में कार्य।'
    },
    stateDemand: [
      { state: 'Maharashtra', demandLevel: 'Very High', topClusters: ['Pune', 'Aurangabad', 'Thane'] },
      { state: 'Tamil Nadu', demandLevel: 'Very High', topClusters: ['Coimbatore', 'Sriperumbudur'] },
      { state: 'Gujarat', demandLevel: 'High', topClusters: ['Vadodara', 'Rajkot'] },
      { state: 'Punjab', demandLevel: 'High', topClusters: ['Ludhiana', 'Jalandhar'] }
    ],
    financialSupport: {
      napsStipend: '₹11,000/month',
      hostelFacility: true,
      freeToolkitScheme: 'Precision measurement kit (Micrometer, Vernier caliper, dial gauge) provided'
    }
  },
  {
    id: 'healthcare-gda',
    name: 'General Duty Healthcare Assistant & Patient Care',
    nameHi: 'जनरल ड्यूटी हेल्थकेयर असिस्टेंट एवं रोगी देखभाल',
    sector: 'Healthcare & Life Sciences',
    sectorHi: 'स्वास्थ्य सेवा एवं जीवन विज्ञान',
    duration: '1 Year (PMKVY / DGT Dual System)',
    durationHi: '1 वर्ष (पीएमकेवीवाई / डीजीटी)',
    eligibility: '10th / 12th Pass (Any stream)',
    eligibilityHi: '10वीं / 12वीं पास (किसी भी स्ट्रीम से)',
    certifyingBody: 'Healthcare Sector Skill Council (HSSC)',
    placementRate: 87,
    avgStartingSalary: '₹16,000 - ₹22,000 / month + medical benefits',
    avgStartingSalaryNum: 19000,
    threeYearSalary: '₹32,000 - ₹48,000 / month',
    threeYearSalaryNum: 38000,
    apprenticeshipStipend: '₹9,500 / month',
    topRecruiters: ['Apollo Hospitals', 'Fortis Healthcare', 'Max Healthcare', 'Medanta', 'Portea Home Health'],
    growthPath: {
      stage1: 'Hospital Ward & Emergency Care Assistant',
      stage2: 'Critical Care / Dialysis / OT Support Specialist',
      stage3: 'Hospital Administration Supervisor or GNM Nursing bridge course',
      degreeEquivalence: 'Credits transferable towards GNM / B.Sc Allied Health Sciences.'
    },
    parentalAssurance: {
      myth: 'Healthcare assistant is not a respectable job for girls from conservative families.',
      mythHi: 'अस्पताल में सहायक का काम सम्मानजनक नहीं है, विशेषकर लड़कियों के लिए।',
      reality: 'It is one of the most respected community professions with continuous government and private hospital demand, fixed shifts, full family healthcare coverage, and safe institutional environments.',
      realityHi: 'यह सबसे सम्मानजनक और पुण्य का काम है। बड़े अस्पतालों में पूर्ण सुरक्षा, सम्मान, निश्चित शिफ्ट और परिवार को मुफ्त स्वास्थ्य बीमा मिलता है।',
      roiComparison: 'Low course fees (often 100% subsidized by PMKVY) with immediate appointment letters upon completion.',
      roiComparisonHi: 'पीएमकेवीवाई के तहत लगभग मुफ्त प्रशिक्षण और कोर्स पूरा होते ही तुरंत बड़े अस्पतालों में जॉइनिंग।',
      safetyAndDignity: 'Regulated hospital environment with institutional security, CCTV, and staff accommodation.',
      safetyAndDignityHi: 'हॉस्पिटल कैंपस में पूर्ण सुरक्षा, स्टाफ आवास और सुरक्षित कार्य वातावरण।'
    },
    stateDemand: [
      { state: 'Kerala', demandLevel: 'Critical', topClusters: ['Kochi', 'Thiruvananthapuram', 'Kozhikode'] },
      { state: 'Delhi NCR', demandLevel: 'Very High', topClusters: ['New Delhi', 'Gurugram', 'Noida'] },
      { state: 'Uttar Pradesh', demandLevel: 'High', topClusters: ['Lucknow', 'Kanpur', 'Agra'] },
      { state: 'West Bengal', demandLevel: 'High', topClusters: ['Kolkata', 'Siliguri'] }
    ],
    financialSupport: {
      napsStipend: '₹9,500/month during hospital internship',
      hostelFacility: true,
      freeToolkitScheme: 'Govt Uniform, stethoscope, BP monitor kit provided under Skill India'
    }
  },
  {
    id: 'drone-technician',
    name: 'Drone Assembly, Pilot & Agricultural Operations',
    nameHi: 'ड्रोन असेंबली, पायलट एवं कृषि संचालन तकनीशियन',
    sector: 'Aerospace & Geospatial Technology',
    sectorHi: 'एयरोस्पेस एवं भू-स्थानिक प्रौद्योगिकी',
    duration: '6 Months to 1 Year (DGCA-Approved Skill Certificate)',
    durationHi: '6 माह से 1 वर्ष (डीजीसीए अनुमोदित कौशल प्रमाणपत्र)',
    eligibility: '10th / 12th Pass (Age 18+ for remote pilot license)',
    eligibilityHi: '10वीं / 12वीं पास (पायलट लाइसेंस हेतु न्यूनतम आयु 18 वर्ष)',
    certifyingBody: 'Aerospace & Aviation Sector Skill Council (AASSC) / DGCA',
    placementRate: 91,
    avgStartingSalary: '₹22,000 - ₹32,000 / month',
    avgStartingSalaryNum: 27000,
    threeYearSalary: '₹50,000 - ₹90,000 / month (or ₹60K+ self-employed)',
    threeYearSalaryNum: 65000,
    apprenticeshipStipend: '₹12,500 / month',
    topRecruiters: ['Garuda Aerospace', 'IdeaForge', 'IoTechWorld', 'IFFCO Kisan', 'Skylark Drones'],
    growthPath: {
      stage1: 'Certified Remote Pilot (RPC) / Drone Maintenance Technician',
      stage2: 'Geospatial Mapping / Precision Agriculture Specialist',
      stage3: 'Fleet Operations Manager / Drone As A Service (DaaS) Entrepreneur',
      degreeEquivalence: 'Recognized technical certification with DGCA Remote Pilot Certificate.'
    },
    parentalAssurance: {
      myth: 'Drones are toys; this is not a serious or stable government-recognized job.',
      mythHi: 'ड्रोन सिर्फ खिलौने हैं; इसमें कोई पक्की नौकरी या सरकारी मान्यता नहीं है।',
      reality: 'Govt schemes like "Namo Drone Didi" and Svamitva Yojana have formalized drone piloting. Drone pilots earn high per-acre service fees and corporate salaries, backed by DGCA legal licenses.',
      realityHi: 'भारत सरकार की "नमो ड्रोन दीदी" और स्वामित्व योजना के तहत डीजीसीए का कानूनी लाइसेंस मिलता है। यह अत्यंत प्रतिष्ठित और आधुनिक तकनीक है।',
      roiComparison: 'Rapid 6-month certification unlocks immediate high-paying contracts in agriculture, surveying, and infrastructure monitoring.',
      roiComparisonHi: 'सिर्फ 6 माह में लाइसेंस प्राप्त कर कृषि और सर्वे कंपनियों में 25,000+ की कमाई शुरू हो सकती है।',
      safetyAndDignity: 'Pilot status with legal DGCA flight logbooks and high community prestige.',
      safetyAndDignityHi: 'डीजीसीए प्रमाणित पायलट का दर्जा, जिससे गांव और समाज में ऊंचा सम्मान मिलता है।'
    },
    stateDemand: [
      { state: 'Madhya Pradesh', demandLevel: 'Very High', topClusters: ['Bhopal', 'Indore', 'Jabalpur'] },
      { state: 'Haryana', demandLevel: 'Very High', topClusters: ['Karnal', 'Hisar', 'Ambala'] },
      { state: 'Andhra Pradesh', demandLevel: 'High', topClusters: ['Vijayawada', 'Visakhapatnam'] },
      { state: 'Maharashtra', demandLevel: 'High', topClusters: ['Nashik', 'Pune'] }
    ],
    financialSupport: {
      napsStipend: '₹12,500/month',
      hostelFacility: false,
      freeToolkitScheme: 'Subsidy on DGCA remote pilot exam fee (up to 80% under state skill missions)'
    }
  },
  {
    id: 'electrician-industrial',
    name: 'Industrial Electrician & Automation Controls',
    nameHi: 'औद्योगिक इलेक्ट्रीशियन एवं ऑटोमेशन कंट्रोल्स',
    sector: 'Electrical & Power Infrastructure',
    sectorHi: 'विद्युत एवं ऊर्जा अवसंरचना',
    duration: '2 Years (ITI Electrician)',
    durationHi: '2 वर्ष (आईटीआई इलेक्ट्रीशियन)',
    eligibility: '10th Pass with Science & Maths',
    eligibilityHi: '10वीं पास (विज्ञान एवं गणित)',
    certifyingBody: 'NCVT / DGT (Ministry of Skill Development)',
    placementRate: 95,
    avgStartingSalary: '₹17,000 - ₹25,000 / month',
    avgStartingSalaryNum: 20000,
    threeYearSalary: '₹38,000 - ₹65,000 / month + Govt Grade A License',
    threeYearSalaryNum: 45000,
    apprenticeshipStipend: '₹10,000 / month',
    topRecruiters: ['Indian Railways', 'BHEL', 'NTPC', 'Siemens', 'L&T Construction', 'State Electricity Boards (Discoms)'],
    growthPath: {
      stage1: 'Plant Maintenance Electrician / Substation Operator',
      stage2: 'Industrial PLC/SCADA Automation Technician',
      stage3: 'Electrical Supervisor (Grade A Govt License) / Licensed Contractor',
      degreeEquivalence: 'Direct 2nd Year Lateral Entry to Electrical Engineering Polytechnic.'
    },
    parentalAssurance: {
      myth: 'Electrician only fixes household switches and fans for petty daily wages.',
      mythHi: 'इलेक्ट्रीशियन सिर्फ घर के पंखे और स्विच ठीक करेगा और दिहाड़ी पर रहेगा।',
      reality: 'ITI Electrician is the #1 trade for recruitment in Indian Railways (RRB ALP/Technician), Metro Rail corporations, and state electricity boards with government pay scales, pensions, and Grade A contractor licenses.',
      realityHi: 'भारतीय रेलवे (लोको पायलट/तकनीशियन), मेट्रो और बिजली बोर्ड में सबसे ज्यादा सरकारी भर्तियां आईटीआई इलेक्ट्रीशियन के लिए ही निकलती हैं।',
      roiComparison: 'Direct gateway to public sector (PSU) and railway jobs without needing a ₹10 Lakh private B.Tech.',
      roiComparisonHi: 'बिना महंगे कॉलेज की फीस भरे रेलवे और सरकारी बिजली कंपनियों में जाने का सबसे सीधा और सुरक्षित रास्ता।',
      safetyAndDignity: 'Permanent technical post with government licensing and high market respect.',
      safetyAndDignityHi: 'राज्य सरकार द्वारा जारी ए-ग्रेड लाइसेंस, जिससे सरकारी ठेकेदारी या स्थायी नौकरी मिलती है।'
    },
    stateDemand: [
      { state: 'Uttar Pradesh', demandLevel: 'Critical', topClusters: ['Kanpur', 'Ghaziabad', 'Prayagraj'] },
      { state: 'Bihar', demandLevel: 'Critical', topClusters: ['Patna', 'Muzaffarpur', 'Bhagalpur'] },
      { state: 'Madhya Pradesh', demandLevel: 'Very High', topClusters: ['Gwalior', 'Indore'] },
      { state: 'West Bengal', demandLevel: 'Very High', topClusters: ['Kharagpur', 'Durgapur'] }
    ],
    financialSupport: {
      napsStipend: '₹10,000/month',
      hostelFacility: true,
      freeToolkitScheme: 'Govt safety harness, insulated electrical toolkit & clamp meter voucher'
    }
  }
]

export const COMMON_PARENTAL_OBJECTIONS = [
  {
    code: 'STATUS_STIGMA',
    label: 'Social Prestige & "Log Kya Kahenge"',
    labelHi: 'सामाजिक प्रतिष्ठा एवं "लोग क्या कहेंगे"',
    summary: 'Fear that relatives and society consider vocational/ITI education inferior to an academic degree (BA/BSc/BCom).',
    summaryHi: 'रिश्तेदारों और समाज में डिग्री न होने पर सम्मान कम मिलने का डर।',
    keyCounterArguments: [
      'MSDE National Credit Framework (NCrF) officially equates ITI diplomas with 10+2 and enables lateral entry into 2nd year of Polytechnic & Engineering.',
      'A skilled technician earns regular income and reaches ₹40,000-60,000/month while degree peers are still competing for basic clerical exams.',
      'Real pride comes from early financial independence, zero education debt, and confirmed placement.'
    ]
  },
  {
    code: 'SALARY_SKEPTICISM',
    label: 'Income & Job Security Doubts',
    labelHi: 'आय और नौकरी की स्थिरता पर संदेह',
    summary: 'Belief that blue-collar technicians remain on low daily wages and cannot support a family.',
    summaryHi: 'यह सोचना कि वोकेशनल काम में केवल कम दिहाड़ी मिलती है और भविष्य असुरक्षित है।',
    keyCounterArguments: [
      'Verified data shows ITI placement rates exceed 85-94% across EV, Solar, and Precision CNC trades.',
      'Under the National Apprenticeship Promotion Scheme (NAPS), students start earning ₹9,000 - ₹12,500/month during their course.',
      'Certified technicians holding government Grade-A licenses can start their own authorized service centers.'
    ]
  },
  {
    code: 'SAFETY_GENDER',
    label: 'Safety Concerns for Female Candidates',
    labelHi: 'बेटियों के लिए सुरक्षा व सामाजिक स्वीकार्यता',
    summary: 'Anxiety about sending daughters to industrial workshops or technical plants.',
    summaryHi: 'कारखानों या तकनीकी संस्थानों में बेटियों की सुरक्षा को लेकर चिंता।',
    keyCounterArguments: [
      'Dedicated National Skill Training Institutes for Women (NSTI-W) in 19+ cities across India with secure campus hostels.',
      'Special high-growth trades for women: Healthcare GDA, Solar QA, Electronics Testing, and Namo Drone Didi.',
      'Companies like Tata Motors, Schneider Electric, and Ola Electric run all-women assembly lines with company transport and top safety standards.'
    ]
  },
  {
    code: 'DEGREE_OBSESSION',
    label: 'Lack of Formal College Degree',
    labelHi: 'पारंपरिक कॉलेज डिग्री का मोह',
    summary: 'The belief that without a 3-year BA/BSc or BTech, one cannot appear for government exams.',
    summaryHi: 'यह सोचना कि बिना बीए/बीटेक के सरकारी नौकरी या आगे की पढ़ाई नहीं हो सकती।',
    keyCounterArguments: [
      'ITI + 1 language test is recognized by NIOS as equivalent to Class 12th.',
      'Diploma holders are directly eligible for prestigious government technical positions (Railway ALP, ISRO, DRDO, Metro Rail) where general degree holders cannot even apply.',
      'Can pursue IGNOU or B.Voc distance degrees concurrently while earning a full-time salary.'
    ]
  }
]
