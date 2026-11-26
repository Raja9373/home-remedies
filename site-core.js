(function () {
  'use strict';

  var CORE_KEY_LANG = 'hrw_user_lang';
  var CORE_KEY_COUNTRY = 'hrw_user_country';
  var CORE_KEY_MANUAL = 'hrw_lang_manual';
  var CORE_KEY_VERSION = 'hrw_site_version';
  var GEO_CACHE_KEY = 'hrw_geo_cache_v1';

  // All 249 ISO 3166-1 alpha-2 country/territory codes -> primary official language code
  var ALL_249_COUNTRY_LANG = {
    AD: 'ca', AE: 'ar', AF: 'fa', AG: 'en', AI: 'en', AL: 'sq', AM: 'hy', AO: 'pt', AQ: 'en', AR: 'es',
    AS: 'en', AT: 'de', AU: 'en', AW: 'nl', AX: 'sv', AZ: 'az', BA: 'bs', BB: 'en', BD: 'bn', BE: 'fr',
    BF: 'fr', BG: 'bg', BH: 'ar', BI: 'fr', BJ: 'fr', BL: 'fr', BM: 'en', BN: 'ms', BO: 'es', BQ: 'nl',
    BR: 'pt', BS: 'en', BT: 'dz', BV: 'no', BW: 'en', BY: 'be', BZ: 'en', CA: 'en', CC: 'en', CD: 'fr',
    CF: 'fr', CG: 'fr', CH: 'de', CI: 'fr', CK: 'en', CL: 'es', CM: 'fr', CN: 'zh', CO: 'es', CR: 'es',
    CU: 'es', CV: 'pt', CW: 'nl', CX: 'en', CY: 'el', CZ: 'cs', DE: 'de', DJ: 'fr', DK: 'da', DM: 'en',
    DO: 'es', DZ: 'ar', EC: 'es', EE: 'et', EG: 'ar', EH: 'ar', ER: 'ti', ES: 'es', ET: 'am', FI: 'fi',
    FJ: 'en', FK: 'en', FM: 'en', FO: 'fo', FR: 'fr', GA: 'fr', GB: 'en', GD: 'en', GE: 'ka', GF: 'fr',
    GG: 'en', GH: 'en', GI: 'en', GL: 'kl', GM: 'en', GN: 'fr', GP: 'fr', GQ: 'es', GR: 'el', GS: 'en',
    GT: 'es', GU: 'en', GW: 'pt', GY: 'en', HK: 'zh', HM: 'en', HN: 'es', HR: 'hr', HT: 'ht', HU: 'hu',
    ID: 'id', IE: 'en', IL: 'he', IM: 'en', IN: 'hi', IO: 'en', IQ: 'ar', IR: 'fa', IS: 'is', IT: 'it',
    JE: 'en', JM: 'en', JO: 'ar', JP: 'ja', KE: 'sw', KG: 'ky', KH: 'km', KI: 'en', KM: 'ar', KN: 'en',
    KP: 'ko', KR: 'ko', KW: 'ar', KY: 'en', KZ: 'kk', LA: 'lo', LB: 'ar', LC: 'en', LI: 'de', LK: 'si',
    LR: 'en', LS: 'st', LT: 'lt', LU: 'fr', LV: 'lv', LY: 'ar', MA: 'ar', MC: 'fr', MD: 'ro', ME: 'sr',
    MF: 'fr', MG: 'mg', MH: 'en', MK: 'mk', ML: 'fr', MM: 'my', MN: 'mn', MO: 'zh', MP: 'en', MQ: 'fr',
    MR: 'ar', MS: 'en', MT: 'mt', MU: 'en', MV: 'dv', MW: 'en', MX: 'es', MY: 'ms', MZ: 'pt', NA: 'en',
    NC: 'fr', NE: 'fr', NF: 'en', NG: 'en', NI: 'es', NL: 'nl', NO: 'no', NP: 'ne', NR: 'en', NU: 'en',
    NZ: 'en', OM: 'ar', PA: 'es', PE: 'es', PF: 'fr', PG: 'en', PH: 'tl', PK: 'ur', PL: 'pl', PM: 'fr',
    PN: 'en', PR: 'es', PS: 'ar', PT: 'pt', PW: 'en', PY: 'es', QA: 'ar', RE: 'fr', RO: 'ro', RS: 'sr',
    RU: 'ru', RW: 'rw', SA: 'ar', SB: 'en', SC: 'en', SD: 'ar', SE: 'sv', SG: 'en', SH: 'en', SI: 'sl',
    SJ: 'no', SK: 'sk', SL: 'en', SM: 'it', SN: 'fr', SO: 'so', SR: 'nl', SS: 'en', ST: 'pt', SV: 'es',
    SX: 'nl', SY: 'ar', SZ: 'en', TC: 'en', TD: 'fr', TF: 'fr', TG: 'fr', TH: 'th', TJ: 'tg', TK: 'en',
    TL: 'pt', TM: 'tk', TN: 'ar', TO: 'en', TR: 'tr', TT: 'en', TV: 'en', TW: 'zh', TZ: 'sw', UA: 'uk',
    UG: 'en', UM: 'en', US: 'en', UY: 'es', UZ: 'uz', VA: 'it', VC: 'en', VE: 'es', VG: 'en', VI: 'en',
    VN: 'vi', VU: 'en', WF: 'fr', WS: 'sm', YE: 'ar', YT: 'fr', ZA: 'en', ZM: 'en', ZW: 'en'
  };

  // Alias codes returned by some Geo-IP APIs
  var CC_ALIASES = { UK: 'GB' };

  var COUNTRY_SHORT_NAMES = {
    US: 'USA', GB: 'UK', AE: 'UAE', IN: 'India', NP: 'Nepal', JP: 'Japan',
    DE: 'Germany', FR: 'France', ES: 'Spain', BR: 'Brazil', AU: 'Australia',
    PK: 'Pakistan', BD: 'Bangladesh', CN: 'China', KR: 'Korea', SA: 'Saudi Arabia',
    IT: 'Italy', RU: 'Russia', TR: 'Turkey', ID: 'Indonesia', TH: 'Thailand',
    VN: 'Vietnam', EG: 'Egypt', CA: 'Canada', MX: 'Mexico'
  };

  var SOUTH_HEMI = {
    AO: 1, AQ: 1, AR: 1, AU: 1, BO: 1, BR: 1, BV: 1, BW: 1, CC: 1, CK: 1,
    CL: 1, CX: 1, EC: 1, FJ: 1, FK: 1, GS: 1, HM: 1, ID: 1, KE: 1, LS: 1,
    MG: 1, MU: 1, MW: 1, MZ: 1, NA: 1, NC: 1, NF: 1, NU: 1, NZ: 1, PE: 1,
    PF: 1, PG: 1, PN: 1, PY: 1, RE: 1, RW: 1, SB: 1, SC: 1, SH: 1, SZ: 1,
    TF: 1, TK: 1, TL: 1, TO: 1, TV: 1, TZ: 1, UY: 1, VU: 1, WF: 1, WS: 1,
    YT: 1, ZA: 1, ZM: 1, ZW: 1
  };

  var TIMEZONE_TO_CC = {
    'Asia/Kolkata': 'IN', 'Asia/Calcutta': 'IN', 'Asia/Kathmandu': 'NP', 'Asia/Katmandu': 'NP',
    'Asia/Karachi': 'PK', 'Asia/Dhaka': 'BD', 'Asia/Colombo': 'LK', 'Asia/Tokyo': 'JP',
    'Asia/Seoul': 'KR', 'Asia/Pyongyang': 'KP', 'Asia/Shanghai': 'CN', 'Asia/Chongqing': 'CN',
    'Asia/Hong_Kong': 'HK', 'Asia/Taipei': 'TW', 'Asia/Macau': 'MO', 'Asia/Singapore': 'SG',
    'Asia/Bangkok': 'TH', 'Asia/Ho_Chi_Minh': 'VN', 'Asia/Saigon': 'VN', 'Asia/Jakarta': 'ID',
    'Asia/Kuala_Lumpur': 'MY', 'Asia/Manila': 'PH', 'Asia/Phnom_Penh': 'KH', 'Asia/Vientiane': 'LA',
    'Asia/Ulaanbaatar': 'MN', 'Asia/Yangon': 'MM', 'Asia/Thimphu': 'BT', 'Asia/Brunei': 'BN',
    'Asia/Dubai': 'AE', 'Asia/Riyadh': 'SA', 'Asia/Qatar': 'QA', 'Asia/Kuwait': 'KW',
    'Asia/Muscat': 'OM', 'Asia/Bahrain': 'BH', 'Asia/Amman': 'JO', 'Asia/Baghdad': 'IQ',
    'Asia/Beirut': 'LB', 'Asia/Damascus': 'SY', 'Asia/Aden': 'YE', 'Asia/Tehran': 'IR',
    'Asia/Kabul': 'AF', 'Asia/Jerusalem': 'IL', 'Asia/Baku': 'AZ', 'Asia/Yerevan': 'AM',
    'Asia/Tbilisi': 'GE', 'Asia/Almaty': 'KZ', 'Asia/Tashkent': 'UZ', 'Asia/Bishkek': 'KG',
    'Asia/Dushanbe': 'TJ', 'Asia/Ashgabat': 'TM', 'Indian/Maldives': 'MV', 'Indian/Mauritius': 'MU',
    'Africa/Cairo': 'EG', 'Africa/Casablanca': 'MA', 'Africa/Algiers': 'DZ', 'Africa/Tunis': 'TN',
    'Africa/Tripoli': 'LY', 'Africa/Khartoum': 'SD', 'Africa/Addis_Ababa': 'ET', 'Africa/Mogadishu': 'SO',
    'Africa/Johannesburg': 'ZA', 'Africa/Nairobi': 'KE', 'Africa/Dar_es_Salaam': 'TZ', 'Africa/Lagos': 'NG',
    'Africa/Accra': 'GH', 'Africa/Dakar': 'SN', 'Africa/Abidjan': 'CI', 'Africa/Kinshasa': 'CD',
    'Africa/Luanda': 'AO', 'Africa/Maputo': 'MZ', 'Africa/Windhoek': 'NA', 'Africa/Kampala': 'UG',
    'Africa/Kigali': 'RW', 'Africa/Harare': 'ZW', 'Africa/Lusaka': 'ZM', 'Indian/Antananarivo': 'MG',
    'Europe/London': 'GB', 'Europe/Dublin': 'IE', 'Europe/Berlin': 'DE', 'Europe/Vienna': 'AT',
    'Europe/Zurich': 'CH', 'Europe/Paris': 'FR', 'Europe/Brussels': 'BE', 'Europe/Luxembourg': 'LU',
    'Europe/Madrid': 'ES', 'Europe/Rome': 'IT', 'Europe/Lisbon': 'PT', 'Europe/Amsterdam': 'NL',
    'Europe/Warsaw': 'PL', 'Europe/Prague': 'CZ', 'Europe/Bratislava': 'SK', 'Europe/Budapest': 'HU',
    'Europe/Bucharest': 'RO', 'Europe/Sofia': 'BG', 'Europe/Belgrade': 'RS', 'Europe/Zagreb': 'HR',
    'Europe/Ljubljana': 'SI', 'Europe/Sarajevo': 'BA', 'Europe/Skopje': 'MK', 'Europe/Tirane': 'AL',
    'Europe/Chisinau': 'MD', 'Europe/Minsk': 'BY', 'Europe/Moscow': 'RU', 'Europe/Kiev': 'UA',
    'Europe/Kyiv': 'UA', 'Europe/Istanbul': 'TR', 'Europe/Athens': 'GR', 'Europe/Nicosia': 'CY',
    'Europe/Stockholm': 'SE', 'Europe/Oslo': 'NO', 'Europe/Copenhagen': 'DK', 'Europe/Helsinki': 'FI',
    'Europe/Reykjavik': 'IS', 'Europe/Tallinn': 'EE', 'Europe/Riga': 'LV', 'Europe/Vilnius': 'LT',
    'Europe/Malta': 'MT', 'Europe/Andorra': 'AD', 'Europe/Monaco': 'MC',
    'America/New_York': 'US', 'America/Chicago': 'US', 'America/Denver': 'US', 'America/Los_Angeles': 'US',
    'America/Phoenix': 'US', 'America/Anchorage': 'US', 'Pacific/Honolulu': 'US',
    'America/Toronto': 'CA', 'America/Vancouver': 'CA', 'America/Montreal': 'CA',
    'America/Mexico_City': 'MX', 'America/Bogota': 'CO', 'America/Lima': 'PE', 'America/Santiago': 'CL',
    'America/Argentina/Buenos_Aires': 'AR', 'America/Sao_Paulo': 'BR', 'America/Caracas': 'VE',
    'America/Guayaquil': 'EC', 'America/La_Paz': 'BO', 'America/Asuncion': 'PY', 'America/Montevideo': 'UY',
    'America/Havana': 'CU', 'America/Santo_Domingo': 'DO', 'America/Guatemala': 'GT',
    'America/Costa_Rica': 'CR', 'America/Panama': 'PA', 'America/Port-au-Prince': 'HT',
    'America/Jamaica': 'JM', 'America/Puerto_Rico': 'PR', 'America/Godthab': 'GL',
    'Australia/Sydney': 'AU', 'Australia/Melbourne': 'AU', 'Australia/Brisbane': 'AU',
    'Australia/Perth': 'AU', 'Australia/Adelaide': 'AU', 'Pacific/Auckland': 'NZ',
    'Pacific/Fiji': 'FJ', 'Pacific/Port_Moresby': 'PG', 'Pacific/Apia': 'WS'
  };

  var RTL_LANGS = { ar: true, ur: true, fa: true, he: true, dv: true, ps: true, sd: true, ug: true, yi: true };

  var LANG_LABELS = {
    hi: 'Hindi (India)', en: 'English', es: 'Español (Spanish)', ja: '日本語 (Japanese)',
    fr: 'Français (French)', de: 'Deutsch (German)', pt: 'Português (Portuguese)',
    ar: 'العربية (Arabic)', zh: '中文 (Chinese)', ko: '한국어 (Korean)',
    ru: 'Русский (Russian)', it: 'Italiano (Italian)', tr: 'Türkçe (Turkish)',
    id: 'Bahasa Indonesia', th: 'ไทย (Thai)', vi: 'Tiếng Việt (Vietnamese)',
    bn: 'বাংলা (Bengali)', ur: 'اردو (Urdu)', ne: 'नेपाली (Nepali)',
    ta: 'தமிழ் (Tamil)', te: 'తెలుగు (Telugu)', mr: 'मराठी (Marathi)',
    nl: 'Nederlands (Dutch)', pl: 'Polski (Polish)', uk: 'Українська (Ukrainian)',
    fa: 'فارسی (Persian)', ms: 'Bahasa Melayu', tl: 'Filipino',
    el: 'Ελληνικά (Greek)', sv: 'Svenska (Swedish)', da: 'Dansk (Danish)',
    no: 'Norsk (Norwegian)', fi: 'Suomi (Finnish)', cs: 'Čeština (Czech)',
    sk: 'Slovenčina (Slovak)', hu: 'Magyar (Hungarian)', ro: 'Română (Romanian)',
    bg: 'Български (Bulgarian)', hr: 'Hrvatski (Croatian)', sr: 'Српски (Serbian)',
    sl: 'Slovenščina (Slovenian)', bs: 'Bosanski (Bosnian)', sq: 'Shqip (Albanian)',
    mk: 'Македонски (Macedonian)', lt: 'Lietuvių (Lithuanian)', lv: 'Latviešu (Latvian)',
    et: 'Eesti (Estonian)', is: 'Íslenska (Icelandic)', mt: 'Malti (Maltese)',
    ka: 'ქართული (Georgian)', hy: 'Հայերեն (Armenian)', az: 'Azərbaycan',
    kk: 'Қазақ (Kazakh)', uz: "O'zbek (Uzbek)", ky: 'Кыргызча',
    tg: 'Тоҷикӣ (Tajik)', tk: 'Türkmençe', mn: 'Монгол (Mongolian)',
    km: 'ខ្មែរ (Khmer)', lo: 'ລາວ (Lao)', my: 'မြန်မာ (Burmese)',
    si: 'සිංහල (Sinhala)', he: 'עברית (Hebrew)', sw: 'Kiswahili (Swahili)',
    am: 'አማርኛ (Amharic)', so: 'Soomaali (Somali)', ht: 'Kreyòl Ayisyen',
    mg: 'Malagasy', rw: 'Kinyarwanda', sm: 'Gagana Samoa',
    ca: 'Català (Catalan)', be: 'Беларуская (Belarusian)', dz: 'རྫོང་ཁ (Dzongkha)',
    dv: 'ދިވެހި (Dhivehi)', kl: 'Kalaallisut', fo: 'Føroyskt',
    ti: 'ትግርኛ (Tigrinya)', st: 'Sesotho', gu: 'ગુજરાતી (Gujarati)',
    pa: 'ਪੰਜਾਬੀ (Punjabi)', kn: 'ಕನ್ನಡ (Kannada)', ml: 'മലയാളം (Malayalam)'
  };

  var LOCALE_CODES = {
    hi: 'hi_IN', en: 'en_US', es: 'es_ES', ja: 'ja_JP', fr: 'fr_FR',
    de: 'de_DE', pt: 'pt_BR', ar: 'ar_SA', zh: 'zh_CN', ko: 'ko_KR',
    ru: 'ru_RU', it: 'it_IT', tr: 'tr_TR', id: 'id_ID', th: 'th_TH',
    vi: 'vi_VN', bn: 'bn_BD', ur: 'ur_PK', ne: 'ne_NP', ta: 'ta_IN',
    te: 'te_IN', mr: 'mr_IN', nl: 'nl_NL', pl: 'pl_PL', uk: 'uk_UA',
    fa: 'fa_IR', ms: 'ms_MY', tl: 'tl_PH', el: 'el_GR', sv: 'sv_SE',
    ro: 'ro_RO', hu: 'hu_HU', cs: 'cs_CZ', bg: 'bg_BG', sr: 'sr_RS',
    hr: 'hr_HR', sk: 'sk_SK', he: 'he_IL', sw: 'sw_KE', si: 'si_LK'
  };

  // Curated instant native UI translations (zero delay for key UI labels)
  var UI_I18N = {
    en: {
      brandSub: 'World Traditions',
      navHome: 'Home',
      navAZ: 'A-Z',
      navPoints: 'Acupressure Points',
      navMudras: 'Mudras',
      navIngredients: 'Ingredients',
      navPoocho: 'Ask Grandma (Q&A)',
      navBhejo: 'Share Remedy',
      navCompare: 'Compare',
      navContact: 'Contact',
      heroTitle: 'World Traditions, For the World.',
      heroSubtitle: 'What does the world use for common ailments? Search any symptom or country.',
      searchPlaceholder: 'Search condition or country... e.g. Cough, Headache, Japan',
      searchBtn: 'Search',
      pill1: '1. Search Problem',
      pill2: '2. View 10+ Countries',
      pill3: '3. Explore More',
      aajBtn: 'View Remedy',
      categoriesTitle: 'Remedy Categories',
      categoriesSub: 'Choose a wellness category and explore global household traditions',
      azTitle: 'All 720 Conditions (A–Z Directory)',
      azSub: 'Click any letter or category to open remedies from 10+ countries',
      demoTitle: 'What Does the World Take for Cough?',
      demoPageLink: 'View Full Cough Guide →',
      moreBtn: 'Load Next 10 Countries',
      lessBtn: 'Show First 10 Countries Only',
      specialTitle: 'Featured Global Traditions',
      specialSub: 'Notable household wellness traditions from around the world',
      allPointsLink: '📍 All 60 Acupressure Points →',
      allMudrasLink: '🧘 All 42 Yoga Mudras →',
      ingredientsTitle: 'Kitchen Ingredients & Traditional Uses',
      allIngredientsLink: 'View All 20 Ingredients →',
      seasonTitle: 'Seasonal Home Traditions',
      seasonSub: 'Explore traditional care tailored to the current season',
      popularTitle: 'Most Searched Home Remedies Worldwide',
      popularSub: 'Direct guides for popular home remedies, acupressure points & yoga mudras',
      faqTitle: 'Frequently Asked Questions (FAQ)',
      faqSub: 'Essential answers about traditional home remedies, acupressure & mudras',
      safetyTitle: 'Important Safety Notice',
      safetyText: 'This site shares traditional cultural knowledge only — it does not sell medicine or claim medical cures. Always consult a qualified doctor if you have allergies, are pregnant, or if symptoms persist beyond 2–3 days. For serious conditions like heart attack, cancer, stroke, TB, or pneumonia, seek emergency medical care immediately.',
      acuBtn: 'Acupressure Point',
      mudraBtn: 'Yoga Mudra',
      printBtn: '🖨️ Print Guide',
      waBtn: '💬 Share on WhatsApp',
      backHome: '← Back to Home',
      modalClose: 'Got It'
    },
    ja: {
      brandSub: '世界の伝統的な知恵',
      navHome: 'ホーム',
      navAZ: 'A–Z 一覧',
      navPoints: 'ツボ (指圧)',
      navMudras: 'ムドラ',
      navIngredients: '食材ガイド',
      navPoocho: 'お悩みQ&A',
      navBhejo: '知恵を投稿',
      navCompare: '国別比較',
      navContact: 'お問い合わせ',
      heroTitle: '世界の伝統的な家庭の知恵を、あなたへ。',
      heroSubtitle: '頭痛や咳に世界では何が使われている？症状や国名で検索できます。',
      searchPlaceholder: '症状や国名を入力... 例: Cough, Headache, Japan',
      searchBtn: '検索',
      pill1: '1. 症状を入力',
      pill2: '2. 10カ国以上を比較',
      pill3: '3. 詳細を見る',
      aajBtn: '詳しく見る',
      categoriesTitle: 'カテゴリーから探す',
      categoriesSub: '気になる症状を選んで世界中の伝統的なケア方法を見る',
      azTitle: '全720症状 (A–Zディレクトリ)',
      azSub: '文字やカテゴリーをクリックして10カ国以上のページを開く',
      demoTitle: '咳 (Cough) に世界では何を使う？',
      demoPageLink: '咳の完全ガイドを見る →',
      moreBtn: 'さらに10カ国を表示',
      lessBtn: '最初の10カ国のみ表示',
      specialTitle: '世界の代表的な伝統ケア',
      specialSub: '各地に伝わる身近な自然の知恵',
      allPointsLink: '📍 全60カ所のツボ一覧 →',
      allMudrasLink: '🧘 全42種類のムドラ一覧 →',
      ingredientsTitle: '身近な食材と伝統的な活用法',
      allIngredientsLink: '全20種類の食材を見る →',
      seasonTitle: '季節ごとの伝統的なケア',
      seasonSub: '今の季節に合った伝統的なセルフケア',
      popularTitle: '世界中でよく検索される家庭の知恵',
      popularSub: '人気の家庭療法・ツボ・ムドラガイドへすぐアクセス',
      faqTitle: 'よくある質問 (FAQ)',
      faqSub: '家庭療法・指圧のツボ・ヨガムドラに関する基本的な疑問',
      safetyTitle: '重要な安全上の注意',
      safetyText: '当サイトは伝統的・文化的な情報のみを提供しており、医薬品の販売や治療の保証は行いません。アレルギーがある方、妊娠中の方、症状が2〜3日以上続く場合は必ず医師にご相談ください。重篤な症状の場合は直ちに医療機関を受診してください。',
      acuBtn: 'ツボを見る',
      mudraBtn: 'ムドラを見る',
      printBtn: '🖨️ 印刷する',
      waBtn: '💬 WhatsAppで共有',
      backHome: '← ホームに戻る',
      modalClose: '閉じる'
    },
    es: {
      brandSub: 'Tradiciones del Mundo',
      navHome: 'Inicio',
      navAZ: 'A–Z',
      navPoints: 'Puntos de Acupresión',
      navMudras: 'Mudras',
      navIngredients: 'Ingredientes',
      navPoocho: 'Preguntas',
      navBhejo: 'Enviar Remedio',
      navCompare: 'Comparar',
      navContact: 'Contacto',
      heroTitle: 'Tradiciones del Mundo, Para el Mundo.',
      heroSubtitle: '¿Qué toma el mundo para el dolor de cabeza o la tos? Busca en tu idioma.',
      searchPlaceholder: 'Escribe tu problema o país... ej. Cough, Headache, Spain',
      searchBtn: 'Buscar',
      pill1: '1. Busca tu síntoma',
      pill2: '2. Explora 10+ países',
      pill3: '3. Ver más detalles',
      aajBtn: 'Ver Remedio',
      categoriesTitle: 'Categorías de Remedios',
      categoriesSub: 'Elige una categoría y descubre remedios caseros tradicionales del mundo',
      azTitle: 'Las 720 Condiciones (Directorio A–Z)',
      azSub: 'Haz clic en una letra o categoría para abrir la guía de 10+ países',
      demoTitle: '¿Qué Usa el Mundo para la Tos?',
      demoPageLink: 'Ver Guía Completa de Tos →',
      moreBtn: 'Ver 10 Países Más',
      lessBtn: 'Mostrar Solo 10 Países',
      specialTitle: 'Tradiciones Destacadas',
      specialSub: 'Prácticas caseras tradicionales alrededor del mundo',
      allPointsLink: '📍 Ver los 60 Puntos de Acupresión →',
      allMudrasLink: '🧘 Ver los 42 Mudras →',
      ingredientsTitle: 'Ingredientes de Cocina y Usos Tradicionales',
      allIngredientsLink: 'Ver los 20 Ingredientes →',
      seasonTitle: 'Remedios por Temporada',
      seasonSub: 'Cuidados tradicionales según la estación actual',
      popularTitle: 'Remedios Caseros Más Buscados',
      popularSub: 'Guías directas de remedios naturales, acupresión y mudras',
      faqTitle: 'Preguntas Frecuentes (FAQ)',
      faqSub: 'Respuestas esenciales sobre remedios tradicionales, acupresión y yoga mudras',
      safetyTitle: 'Aviso Importante de Seguridad',
      safetyText: 'Este sitio comparte únicamente información cultural y tradicional; no vende medicamentos ni garantiza curas médicas. Consulta a un médico si tienes alergias, estás embarazada o los síntomas duran más de 2–3 días.',
      acuBtn: 'Ver Acupresión',
      mudraBtn: 'Ver Mudra',
      printBtn: '🖨️ Imprimir',
      waBtn: '💬 Compartir en WhatsApp',
      backHome: '← Volver al Inicio',
      modalClose: 'Entendido'
    },
    fr: {
      brandSub: 'Traditions du Monde',
      navHome: 'Accueil',
      navAZ: 'A–Z',
      navPoints: "Points d'Acupression",
      navMudras: 'Mudras',
      navIngredients: 'Ingrédients',
      navPoocho: 'Questions',
      navBhejo: 'Partager',
      navCompare: 'Comparer',
      navContact: 'Contact',
      heroTitle: 'Les Traditions du Monde, Pour le Monde.',
      heroSubtitle: 'Que prend le monde contre les maux de tête ou la toux ? Recherchez ici.',
      searchPlaceholder: 'Écrivez un symptôme ou pays... ex. Cough, Headache, France',
      searchBtn: 'Rechercher',
      pill1: '1. Cherchez',
      pill2: '2. Comparez 10+ pays',
      pill3: '3. En savoir plus',
      aajBtn: 'Voir le Remède',
      categoriesTitle: 'Catégories de Remèdes',
      categoriesSub: 'Choisissez une catégorie et explorez les traditions familiales du monde',
      azTitle: 'Toutes les 720 Conditions (A–Z)',
      azSub: 'Cliquez sur une lettre pour voir les traditions de 10+ pays',
      demoTitle: 'Que Prend le Monde Contre la Toux ?',
      demoPageLink: 'Voir le Guide Complet →',
      moreBtn: 'Voir 10 Pays Suivants',
      lessBtn: 'Voir Seulement 10 Pays',
      specialTitle: 'Traditions Spéciales',
      specialSub: 'Savoirs traditionnels populaires à travers le monde',
      allPointsLink: "📍 Les 60 Points d'Acupression →",
      allMudrasLink: '🧘 Les 42 Mudras →',
      ingredientsTitle: 'Ingrédients Naturels et Usages Traditionnels',
      allIngredientsLink: 'Voir les 20 Ingrédients →',
      seasonTitle: 'Remèdes de Saison',
      seasonSub: 'Soins traditionnels adaptés à la saison actuelle',
      popularTitle: 'Remèdes Maison les Plus Recherchés',
      popularSub: "Guides directs sur les remèdes, l'acupression et les mudras",
      faqTitle: 'Questions Fréquentes (FAQ)',
      faqSub: 'Réponses essentielles sur les remèdes traditionnels et le bien-être',
      safetyTitle: 'Avertissement Important',
      safetyText: 'Ce site partage uniquement des connaissances culturelles traditionnelles et ne remplace pas un avis médical. Consultez un médecin en cas d’allergie, de grossesse ou si les symptômes persistent plus de 2 à 3 jours.',
      acuBtn: 'Acupression',
      mudraBtn: 'Mudra',
      printBtn: '🖨️ Imprimer',
      waBtn: '💬 Partager sur WhatsApp',
      backHome: '← Retour à l’Accueil',
      modalClose: 'Compris'
    },
    de: {
      brandSub: 'Traditionen der Welt',
      navHome: 'Startseite',
      navAZ: 'A–Z',
      navPoints: 'Akupressurpunkte',
      navMudras: 'Mudras',
      navIngredients: 'Zutaten',
      navPoocho: 'Fragen & Antworten',
      navBhejo: 'Hausmittel senden',
      navCompare: 'Vergleichen',
      navContact: 'Kontakt',
      heroTitle: 'Traditionen der Welt, Für die Welt.',
      heroSubtitle: 'Was nutzt die Welt bei Kopfschmerzen oder Husten? Jetzt suchen.',
      searchPlaceholder: 'Symptom oder Land eingeben... z.B. Cough, Headache, Germany',
      searchBtn: 'Suchen',
      pill1: '1. Symptom eingeben',
      pill2: '2. 10+ Länder ansehen',
      pill3: '3. Mehr entdecken',
      aajBtn: 'Ansehen',
      categoriesTitle: 'Hausmittel-Kategorien',
      categoriesSub: 'Wählen Sie eine Kategorie und entdecken Sie weltweite Hausmittel',
      azTitle: 'Alle 720 Beschwerden (A–Z)',
      azSub: 'Klicken Sie auf einen Buchstaben für weltweite Hausmittel',
      demoTitle: 'Was Nutzt die Welt bei Husten?',
      demoPageLink: 'Vollständigen Leitfaden ansehen →',
      moreBtn: 'Nächste 10 Länder laden',
      lessBtn: 'Nur erste 10 Länder zeigen',
      specialTitle: 'Besondere Traditionen',
      specialSub: 'Bekannte Hausmittel aus verschiedenen Kulturen',
      allPointsLink: '📍 Alle 60 Akupressurpunkte →',
      allMudrasLink: '🧘 Alle 42 Yoga-Mudras →',
      ingredientsTitle: 'Küchenzutaten & Traditionelle Anwendung',
      allIngredientsLink: 'Alle 20 Zutaten ansehen →',
      seasonTitle: 'Saisonale Hausmittel',
      seasonSub: 'Traditionelle Pflege passend zur aktuellen Jahreszeit',
      popularTitle: 'Meistgesuchte Hausmittel Weltweit',
      popularSub: 'Direkte Anleitungen für Hausmittel, Akupressur und Mudras',
      faqTitle: 'Häufig Gestellte Fragen (FAQ)',
      faqSub: 'Wichtige Antworten rund um traditionelle Hausmittel',
      safetyTitle: 'Wichtiger Sicherheitshinweis',
      safetyText: 'Diese Website vermittelt ausschließlich kulturelles Traditionswissen und ersetzt keine ärztliche Behandlung. Bei Allergien, Schwangerschaft oder anhaltenden Beschwerden über 2–3 Tage bitte ärztlichen Rat einholen.',
      acuBtn: 'Akupressurpunkt',
      mudraBtn: 'Yoga Mudra',
      printBtn: '🖨️ Drucken',
      waBtn: '💬 Per WhatsApp teilen',
      backHome: '← Zur Startseite',
      modalClose: 'Verstanden'
    },
    pt: {
      brandSub: 'Tradições do Mundo',
      navHome: 'Início',
      navAZ: 'A–Z',
      navPoints: 'Pontos de Acupressão',
      navMudras: 'Mudras',
      navIngredients: 'Ingredientes',
      navPoocho: 'Perguntas',
      navBhejo: 'Enviar Receita',
      navCompare: 'Comparar',
      navContact: 'Contato',
      heroTitle: 'Tradições do Mundo, Para o Mundo.',
      heroSubtitle: 'O que o mundo usa para dor de cabeça ou tosse? Pesquise aqui.',
      searchPlaceholder: 'Digite o sintoma ou país... ex. Cough, Headache, Brazil',
      searchBtn: 'Buscar',
      pill1: '1. Buscar sintoma',
      pill2: '2. Ver 10+ países',
      pill3: '3. Explorar mais',
      aajBtn: 'Ver Remédio',
      categoriesTitle: 'Categorias de Remédios',
      categoriesSub: 'Escolha uma categoria e explore tradições caseiras do mundo todo',
      azTitle: 'Todas as 720 Condições (A–Z)',
      azSub: 'Clique em uma letra para abrir guias de 10+ países',
      demoTitle: 'O Que o Mundo Usa para Tosse?',
      demoPageLink: 'Ver Guia Completo →',
      moreBtn: 'Carregar Próximos 10 Países',
      lessBtn: 'Mostrar Apenas 10 Países',
      specialTitle: 'Tradições em Destaque',
      specialSub: 'Sabedoria tradicional caseira ao redor do mundo',
      allPointsLink: '📍 Todos os 60 Pontos de Acupressão →',
      allMudrasLink: '🧘 Todos os 42 Mudras →',
      ingredientsTitle: 'Ingredientes Caseiros e Usos Tradicionais',
      allIngredientsLink: 'Ver Todos os 20 Ingredientes →',
      seasonTitle: 'Cuidados da Estação',
      seasonSub: 'Práticas tradicionais para o clima atual',
      popularTitle: 'Remédios Caseiros Mais Pesquisados',
      popularSub: 'Guias diretos de remédios naturais, acupressão e mudras',
      faqTitle: 'Perguntas Frequentes (FAQ)',
      faqSub: 'Respostas essenciais sobre tradições caseiras e bem-estar',
      safetyTitle: 'Aviso Importante de Segurança',
      safetyText: 'Este site compartilha apenas conhecimento cultural tradicional e não substitui orientação médica. Consulte um médico em caso de alergia, gravidez ou sintomas por mais de 2–3 dias.',
      acuBtn: 'Ver Acupressão',
      mudraBtn: 'Ver Mudra',
      printBtn: '🖨️ Imprimir',
      waBtn: '💬 Compartilhar no WhatsApp',
      backHome: '← Voltar ao Início',
      modalClose: 'Entendi'
    },
    ar: {
      brandSub: 'تقاليد العالم الصحية',
      navHome: 'الرئيسية',
      navAZ: 'دليل أ–ي',
      navPoints: 'نقاط العلاج بالإبر',
      navMudras: 'مودرا اليوغا',
      navIngredients: 'المكونات',
      navPoocho: 'أسئلة وأجوبة',
      navBhejo: 'أرسل وصفة',
      navCompare: 'مقارنة الدول',
      navContact: 'اتصل بنا',
      heroTitle: 'تقاليد العالم، لجميع شعوب العالم.',
      heroSubtitle: 'ماذا تستخدم دول العالم لتخفيف الصداع أو السعال؟ ابحث بلغتك.',
      searchPlaceholder: 'اكتب الأعراض أو الدولة... مثل Cough, Headache',
      searchBtn: 'بحث',
      pill1: '1. اكتب المشكلة',
      pill2: '2. شاهد +10 دول',
      pill3: '3. اكتشف المزيد',
      aajBtn: 'عرض الوصفة',
      categoriesTitle: 'أقسام الوصفات المنزلية',
      categoriesSub: 'اختر القسم واستكشف العادات المنزلية التقليدية حول العالم',
      azTitle: 'جميع الحالات (720 حالة)',
      azSub: 'اضغط على أي حرف لفتح طرق العناية التقليدية في أكثر من 10 دول',
      demoTitle: 'ماذا يستخدم العالم للسعال؟',
      demoPageLink: 'عرض الدليل الكامل ←',
      moreBtn: 'عرض 10 دول إضافية',
      lessBtn: 'عرض أول 10 دول فقط',
      specialTitle: 'تقاليد عالمية مميزة',
      specialSub: 'موروثات العناية المنزلية عبر الثقافات',
      allPointsLink: '📍 جميع نقاط العلاج بالضغط (60) ←',
      allMudrasLink: '🧘 جميع وضعيات اليد (42 مودرا) ←',
      ingredientsTitle: 'مكونات المطبخ واستخداماتها التقليدية',
      allIngredientsLink: 'عرض جميع المكونات (20) ←',
      seasonTitle: 'وصفات الموسم الحالي',
      seasonSub: 'عناية تقليدية مناسبة لطقس الموسم الحالي',
      popularTitle: 'أكثر الوصفات المنزلية بحثاً عالمياً',
      popularSub: 'أدلة سريعة للوصفات المنزلية ونقاط الضغط والمودرا',
      faqTitle: 'الأسئلة الشائعة',
      faqSub: 'إجابات مهمة حول الوصفات التقليدية والعناية الطبيعية',
      safetyTitle: 'تنبيه أمان مهم',
      safetyText: 'يقدم هذا الموقع معلومات ثقافية وتقليدية فقط ولا يبيع أدوية ولا يقدم علاجاً طبياً. استشر الطبيب دائماً عند وجود حساسية أو حمل أو استمرار الأعراض لأكثر من 2-3 أيام.',
      acuBtn: 'نقطة الضغط',
      mudraBtn: 'مودرا اليد',
      printBtn: '🖨️ طباعة',
      waBtn: '💬 مشاركة واتساب',
      backHome: '← العودة للرئيسية',
      modalClose: 'حسناً'
    },
    bn: {
      brandSub: 'বিশ্বের ঘরোয়া ঐতিহ্য',
      navHome: 'হোম',
      navAZ: 'A–Z তালিকা',
      navPoints: 'অ্যাকুপ্রেশার পয়েন্ট',
      navMudras: 'হস্ত মুদ্রা',
      navIngredients: 'উপাদান গাইড',
      navPoocho: 'জিজ্ঞাসা (Q&A)',
      navBhejo: 'টোটকা পাঠান',
      navCompare: 'তুলনা করুন',
      navContact: 'যোগাযোগ',
      heroTitle: 'বিশ্বের ঐতিহ্য, সবার জন্য।',
      heroSubtitle: 'সর্দি, কাশি বা মাথাব্যথায় বিশ্বের বিভিন্ন দেশে কী ব্যবহার করা হয়? সহজেই খুঁজুন।',
      searchPlaceholder: 'সমস্যা বা দেশের নাম লিখুন... যেমন Khansi, Cough',
      searchBtn: 'খুঁজুন',
      pill1: '১. সমস্যা লিখুন',
      pill2: '২. ১০+ দেশ দেখুন',
      pill3: '৩. বিস্তারিত পড়ুন',
      aajBtn: 'দেখুন',
      categoriesTitle: 'বিভাগসমূহ',
      categoriesSub: 'আপনার প্রয়োজনীয় বিভাগ বেছে নিন এবং বিশ্বব্যাপী ঘরোয়া রীতি দেখুন',
      azTitle: 'সকল ৭২০টি সমস্যা (A–Z)',
      azSub: 'যেকোনো অক্ষরে ক্লিক করে ১০+ দেশের ঘরোয়া তথ্য দেখুন',
      demoTitle: 'কাশিতে বিশ্ববাসী কী ব্যবহার করে?',
      demoPageLink: 'সম্পূর্ণ পাতা দেখুন →',
      moreBtn: 'আরও ১০টি দেশ দেখুন',
      lessBtn: 'শুধু প্রথম ১০টি দেশ দেখুন',
      specialTitle: 'বিশেষ ঘরোয়া ঐতিহ্য',
      specialSub: 'বিশ্বের জনপ্রিয় প্রাকৃতিক যত্নের ধারণা',
      allPointsLink: '📍 সকল ৬০টি অ্যাকুপ্রেশার পয়েন্ট →',
      allMudrasLink: '🧘 সকল ৪২টি হস্ত মুদ্রা →',
      ingredientsTitle: 'রান্নাঘরের ২০টি উপাদান গাইড',
      allIngredientsLink: 'সকল ২০টি উপাদান দেখুন →',
      seasonTitle: 'এই মৌসুমের ঘরোয়া যত্ন',
      seasonSub: 'বর্তমান ঋতু অনুযায়ী প্রাকৃতিক যত্ন',
      popularTitle: 'ইন্টারনেটে সবচেয়ে বেশি খোঁজা ঘরোয়া টোটকা',
      popularSub: 'জনপ্রিয় ঘরোয়া রীতি, অ্যাকুপ্রেশার ও মুদ্রা গাইড',
      faqTitle: 'সাধারণ প্রশ্ন ও উত্তর (FAQ)',
      faqSub: 'ঘরোয়া ঐতিহ্য, অ্যাকুপ্রেশার ও মুদ্রা সম্পর্কে জরুরি তথ্য',
      safetyTitle: 'জরুরি সতর্কতা',
      safetyText: 'এই সাইট শুধুমাত্র ঐতিহ্যবাহী ও সাংস্কৃতিক তথ্য দেয়; কোনো ওষুধ বিক্রি করে না বা চিকিৎসার দাবি করে না। অ্যালার্জি, গর্ভাবস্থা বা ২–৩ দিনের বেশি সমস্যা থাকলে অবশ্যই ডাক্তারের পরামর্শ নিন।',
      acuBtn: 'অ্যাকুপ্রেশার দেখুন',
      mudraBtn: 'মুদ্রা দেখুন',
      printBtn: '🖨️ প্রিন্ট করুন',
      waBtn: '💬 WhatsApp-এ শেয়ার',
      backHome: '← হোমে ফিরুন',
      modalClose: 'ঠিক আছে'
    },
    ur: {
      brandSub: 'دنیا کی روایات',
      navHome: 'ہوم',
      navAZ: 'A–Z فہرست',
      navPoints: 'ایکیو پریشر پوائنٹس',
      navMudras: 'ہست مدرا',
      navIngredients: 'اجزاء گائیڈ',
      navPoocho: 'سوال و جواب',
      navBhejo: 'نسخہ بھیجیں',
      navCompare: 'موازنہ',
      navContact: 'رابطہ',
      heroTitle: 'دنیا کی روایت، دنیا کے لیے۔',
      heroSubtitle: 'سر درد یا کھانسی میں دنیا بھر میں کیا استعمال ہوتا ہے؟ اپنی زبان میں تلاش کریں۔',
      searchPlaceholder: 'اپنا مسئلہ یا ملک لکھیں... جیسے Cough, Headache',
      searchBtn: 'تلاش کریں',
      pill1: '1. مسئلہ لکھیں',
      pill2: '2. 10+ ممالک دیکھیں',
      pill3: '3. مزید جانیں',
      aajBtn: 'دیکھیں',
      categoriesTitle: 'گھریلو روایات کی اقسام',
      categoriesSub: 'اپنا مسئلہ منتخب کریں اور عالمی روایات دیکھیں',
      azTitle: 'تمام 720 مسائل (A–Z ڈائریکٹری)',
      azSub: '10+ ممالک کی روایات دیکھنے کے لیے کسی بھی حرف پر کلک کریں',
      demoTitle: 'کھانسی میں دنیا کیا استعمال کرتی ہے؟',
      demoPageLink: 'مکمل صفحہ دیکھیں ←',
      moreBtn: 'اگلے 10 ممالک دیکھیں',
      lessBtn: 'صرف پہلے 10 ممالک دیکھیں',
      specialTitle: 'خاص عالمی روایات',
      specialSub: 'دنیا بھر کی معروف گھریلو روایات',
      allPointsLink: '📍 تمام 60 ایکیو پریشر پوائنٹس ←',
      allMudrasLink: '🧘 تمام 42 ہست مدرا ←',
      ingredientsTitle: 'کچن کے اجزاء اور روایتی فوائد',
      allIngredientsLink: 'تمام 20 اجزاء دیکھیں ←',
      seasonTitle: 'اس موسم کی گھریلو دیکھ بھال',
      seasonSub: 'موجودہ موسم کے مطابق روایتی دیکھ بھال',
      popularTitle: 'سب سے زیادہ تلاش کیے جانے والے گھریلو نسخے',
      popularSub: 'مقبول گھریلو روایات، ایکیو پریشر اور مدرا گائیڈز',
      faqTitle: 'عام سوالات و جوابات (FAQ)',
      faqSub: 'گھریلو روایات، ایکیو پریشر اور مدرا سے متعلق اہم معلومات',
      safetyTitle: 'اہم احتیاطی ہدایت',
      safetyText: 'یہ ویب سائٹ صرف روایتی اور ثقافتی معلومات فراہم کرتی ہے؛ کوئی دوا فروخت نہیں کرتی اور نہ ہی علاج کا دعویٰ کرتی ہے۔ الرجی، حمل یا 2-3 دن سے زیادہ علامات کی صورت میں فوراً ڈاکٹر سے مشورہ کریں۔',
      acuBtn: 'ایکیو پریشر دیکھیں',
      mudraBtn: 'مدرا دیکھیں',
      printBtn: '🖨️ پرنٹ کریں',
      waBtn: '💬 واٹس ایپ پر شیئر کریں',
      backHome: '← ہوم پر واپس جائیں',
      modalClose: 'ٹھیک ہے'
    },
    ne: {
      brandSub: 'विश्वका घरेलु परम्परा',
      navHome: 'गृहपृष्ठ',
      navAZ: 'A–Z सूची',
      navPoints: 'अक्युप्रेसर पोइन्ट',
      navMudras: 'हस्त मुद्रा',
      navIngredients: 'सामग्री गाइड',
      navPoocho: 'सोधपुछ (Q&A)',
      navBhejo: 'नुस्खा पठाउनुहोस्',
      navCompare: 'तुलना',
      navContact: 'सम्पर्क',
      heroTitle: 'विश्वको परम्परा, विश्वका लागि।',
      heroSubtitle: 'टाउको दुखाइ वा खोकीमा विश्वभर के प्रयोग गरिन्छ? आफ्नै भाषामा खोज्नुहोस्।',
      searchPlaceholder: 'समस्या वा देशको नाम लेख्नुहोस्... जस्तै Cough, Nepal',
      searchBtn: 'खोज्नुहोस्',
      pill1: '१. समस्या लेख्नुहोस्',
      pill2: '२. १०+ देश हेर्नुहोस्',
      pill3: '३. थप जान्नुहोस्',
      aajBtn: 'हेर्नुहोस्',
      categoriesTitle: 'परम्परा श्रेणीहरू',
      categoriesSub: 'आफ्नो समस्या छान्नुहोस् र विश्वका घरेलु उपायहरू हेर्नुहोस्',
      azTitle: 'सबै ७२० समस्याहरू (A–Z)',
      azSub: '१०+ देशहरूको परम्परा हेर्न कुनै अक्षरमा क्लिक गर्नुहोस्',
      demoTitle: 'खोकीमा विश्वभर के लिइन्छ?',
      demoPageLink: 'पूरा पृष्ठ हेर्नुहोस् →',
      moreBtn: 'थप १० देश हेर्नुहोस्',
      lessBtn: 'पहिलो १० देश मात्र देखाउनुहोस्',
      specialTitle: 'विशेष विश्व परम्परा',
      specialSub: 'विश्वभरका प्रमुख घरेलु परम्पराहरू',
      allPointsLink: '📍 सबै ६० अक्युप्रेसर पोइन्टहरू →',
      allMudrasLink: '🧘 सबै ४२ हस्त मुद्राहरू →',
      ingredientsTitle: 'भान्साका सामग्री र परम्परागत उपयोग',
      allIngredientsLink: 'सबै २० सामग्री हेर्नुहोस् →',
      seasonTitle: 'यो मौसमको घरेलु हेरचाह',
      seasonSub: 'हालको मौसम अनुसार परम्परागत हेरचाह',
      popularTitle: 'इन्टरनेटमा धेरै खोजिने घरेलु उपायहरू',
      popularSub: 'लोकप्रिय घरेलु उपाय, अक्युप्रेसर र मुद्रा गाइड',
      faqTitle: 'प्रायः सोधिने प्रश्नहरू (FAQ)',
      faqSub: 'घरेलु परम्परा, अक्युप्रेसर र मुद्रा सम्बन्धी आवश्यक उत्तरहरू',
      safetyTitle: 'महत्त्वपूर्ण सावधानी',
      safetyText: 'यो साइटले परम्परागत जानकारी मात्र दिन्छ; औषधि बेच्दैन र उपचारको दाबी गर्दैन। एलर्जी, गर्भावस्था वा २–३ दिनभन्दा बढी समस्या भएमा तुरुन्त डाक्टरसँग सल्लाह लिनुहोस्।',
      acuBtn: 'अक्युप्रेसर हेर्नुहोस्',
      mudraBtn: 'मुद्रा हेर्नुहोस्',
      printBtn: '🖨️ प्रिन्ट गर्नुहोस्',
      waBtn: '💬 WhatsApp मा सेयर',
      backHome: '← गृहपृष्ठमा फर्कनुहोस्',
      modalClose: 'ठीक छ'
    },
    zh: {
      brandSub: '世界传统居家智慧',
      navHome: '首页',
      navAZ: 'A–Z 目录',
      navPoints: '穴位指压',
      navMudras: '瑜伽手印',
      navIngredients: '食材指南',
      navPoocho: '问答专区',
      navBhejo: '分享妙方',
      navCompare: '各国对比',
      navContact: '联系我们',
      heroTitle: '世界的传统智慧，服务全世界。',
      heroSubtitle: '世界各地如何应对头痛或咳嗽？输入症状或国家即可查看。',
      searchPlaceholder: '输入症状或国家... 例如 Cough, Headache, China',
      searchBtn: '搜索',
      pill1: '1. 输入症状',
      pill2: '2. 查看10+国家',
      pill3: '3. 了解更多',
      aajBtn: '立即查看',
      categoriesTitle: '传统调理分类',
      categoriesSub: '选择健康分类，了解世界各地的家庭传统做法',
      azTitle: '全部720种常见症状 (A–Z)',
      azSub: '点击字母或分类查看全球10多个国家的传统方案',
      demoTitle: '咳嗽时世界各地用什么？',
      demoPageLink: '查看完整指南 →',
      moreBtn: '加载更多国家',
      lessBtn: '仅显示前10个国家',
      specialTitle: '全球精选传统',
      specialSub: '世界各地经典的家庭养生文化',
      allPointsLink: '📍 查看全部60个穴位 →',
      allMudrasLink: '🧘 查看全部42种手印 →',
      ingredientsTitle: '厨房食材与传统用途',
      allIngredientsLink: '查看全部20种食材 →',
      seasonTitle: '当季养生指南',
      seasonSub: '顺应当前季节的传统家庭调理',
      popularTitle: '全球热门搜索家庭传统指南',
      popularSub: '快速直达常见症状、穴位按压与瑜伽手印指南',
      faqTitle: '常见问题解答 (FAQ)',
      faqSub: '关于家庭传统疗法、指压穴位与手印的实用解答',
      safetyTitle: '重要安全提示',
      safetyText: '本网站仅分享传统与文化参考信息，不销售任何药品，也不提供医疗诊断或治疗承诺。如有过敏、孕期或症状持续超过2-3天，请及时就医。',
      acuBtn: '查看穴位',
      mudraBtn: '查看手印',
      printBtn: '🖨️ 打印页面',
      waBtn: '💬 WhatsApp分享',
      backHome: '← 返回首页',
      modalClose: '知道了'
    },
    ko: {
      brandSub: '세계의 전통 지혜',
      navHome: '홈',
      navAZ: 'A–Z 목록',
      navPoints: '지압 포인트',
      navMudras: '무드라',
      navIngredients: '식재료 가이드',
      navPoocho: '질문하기',
      navBhejo: '전통 지혜 공유',
      navCompare: '국가별 비교',
      navContact: '문의',
      heroTitle: '세계의 전통을, 모두를 위해.',
      heroSubtitle: '두통이나 기침에 세계 각국에서는 무엇을 활용할까요? 증상이나 국가를 검색해 보세요.',
      searchPlaceholder: '증상 또는 국가 입력... 예: Cough, Headache, Korea',
      searchBtn: '검색',
      pill1: '1. 증상 입력',
      pill2: '2. 10+ 국가 비교',
      pill3: '3. 자세히 보기',
      aajBtn: '자세히 보기',
      categoriesTitle: '건강 카테고리',
      categoriesSub: '카테고리를 선택해 세계 각국의 전통 생활 요법을 확인하세요',
      azTitle: '전체 720가지 증상 (A–Z)',
      azSub: '알파벳이나 카테고리를 클릭해 10개국 이상의 전통 정보를 확인하세요',
      demoTitle: '기침에는 세계적으로 무엇을 사용할까?',
      demoPageLink: '전체 가이드 보기 →',
      moreBtn: '10개국 더 보기',
      lessBtn: '처음 10개국만 보기',
      specialTitle: '세계의 특별한 전통',
      specialSub: '각국에 전해 내려오는 자연 친화적 생활 지혜',
      allPointsLink: '📍 60개 지압 포인트 전체 보기 →',
      allMudrasLink: '🧘 42개 요가 무드라 전체 보기 →',
      ingredientsTitle: '주방 식재료와 전통적 활용법',
      allIngredientsLink: '20가지 식재료 전체 보기 →',
      seasonTitle: '계절별 전통 케어',
      seasonSub: '현재 계절에 맞는 생활 관리 정보',
      popularTitle: '가장 많이 검색되는 가정 요법',
      popularSub: '인기 가정 요법, 지압 포인트 및 무드라 가이드 바로가기',
      faqTitle: '자주 묻는 질문 (FAQ)',
      faqSub: '전통 요법, 지압 및 요가 무드라에 관한 핵심 질문',
      safetyTitle: '중요 안전 안내',
      safetyText: '본 사이트는 전통 문화 정보만을 제공하며 의약품을 판매하거나 의학적 치료를 보장하지 않습니다. 알레르기, 임신 중이거나 증상이 2~3일 이상 지속되면 반드시 의사와 상담하세요.',
      acuBtn: '지압 보기',
      mudraBtn: '무드라 보기',
      printBtn: '🖨️ 인쇄하기',
      waBtn: '💬 WhatsApp 공유',
      backHome: '← 홈으로 돌아가기',
      modalClose: '확인'
    },
    ru: {
      brandSub: 'Традиции Мира',
      navHome: 'Главная',
      navAZ: 'A–Z Каталог',
      navPoints: 'Точки акупрессуры',
      navMudras: 'Мудры',
      navIngredients: 'Ингредиенты',
      navPoocho: 'Вопросы и ответы',
      navBhejo: 'Поделиться',
      navCompare: 'Сравнение',
      navContact: 'Контакты',
      heroTitle: 'Традиции Мира — Для Всего Мира.',
      heroSubtitle: 'Что используют в разных странах при головной боли или кашле? Ищите на своём языке.',
      searchPlaceholder: 'Введите симптом или страну... напр. Cough, Headache',
      searchBtn: 'Поиск',
      pill1: '1. Введите симптом',
      pill2: '2. 10+ стран мира',
      pill3: '3. Подробнее',
      aajBtn: 'Открыть',
      categoriesTitle: 'Категории традиций',
      categoriesSub: 'Выберите раздел и изучите домашние традиции разных народов',
      azTitle: 'Все 720 состояний (A–Z)',
      azSub: 'Нажмите на букву, чтобы открыть традиции 10+ стран',
      demoTitle: 'Что используют в мире при кашле?',
      demoPageLink: 'Открыть полный гид →',
      moreBtn: 'Показать ещё 10 стран',
      lessBtn: 'Показать только 10 стран',
      specialTitle: 'Особые мировые традиции',
      specialSub: 'Известные домашние практики разных стран',
      allPointsLink: '📍 Все 60 точек акупрессуры →',
      allMudrasLink: '🧘 Все 42 мудры йоги →',
      ingredientsTitle: 'Кухонные ингредиенты и их традиционное применение',
      allIngredientsLink: 'Все 20 ингредиентов →',
      seasonTitle: 'Сезонные советы',
      seasonSub: 'Традиционный уход в зависимости от времени года',
      popularTitle: 'Самые популярные запросы',
      popularSub: 'Быстрые переходы к домашним средствам, точкам и мудрам',
      faqTitle: 'Часто задаваемые вопросы (FAQ)',
      faqSub: 'Ответы о традиционных практиках, акупрессуре и мудрах',
      safetyTitle: 'Важное предупреждение',
      safetyText: 'Сайт содержит только культурно-справочную информацию и не заменяет врача. При аллергии, беременности или симптомах дольше 2–3 дней обязательно обратитесь к врачу.',
      acuBtn: 'Акупрессура',
      mudraBtn: 'Мудра',
      printBtn: '🖨️ Печать',
      waBtn: '💬 Поделиться',
      backHome: '← На главную',
      modalClose: 'Понятно'
    },
    it: {
      brandSub: 'Tradizioni dal Mondo',
      navHome: 'Home',
      navAZ: 'A–Z',
      navPoints: 'Punti di Digitopressione',
      navMudras: 'Mudra',
      navIngredients: 'Ingredienti',
      navPoocho: 'Domande',
      navBhejo: 'Invia Rimedio',
      navCompare: 'Confronta',
      navContact: 'Contatti',
      heroTitle: 'Tradizioni dal Mondo, Per il Mondo.',
      heroSubtitle: 'Cosa usa il mondo per mal di testa o tosse? Cerca il tuo sintomo.',
      searchPlaceholder: 'Scrivi un sintomo o paese... es. Cough, Italy',
      searchBtn: 'Cerca',
      pill1: '1. Cerca sintomo',
      pill2: '2. Vedi 10+ paesi',
      pill3: '3. Scopri di più',
      aajBtn: 'Scopri',
      categoriesTitle: 'Categorie di Rimedi',
      categoriesSub: 'Scegli una categoria per esplorare le tradizioni popolari nel mondo',
      azTitle: 'Tutte le 720 Condizioni (A–Z)',
      azSub: 'Clicca su una lettera per aprire i rimedi di oltre 10 paesi',
      demoTitle: 'Cosa Usa il Mondo per la Tosse?',
      demoPageLink: 'Vedi Guida Completa →',
      moreBtn: 'Carica Altri 10 Paesi',
      lessBtn: 'Mostra Solo 10 Paesi',
      specialTitle: 'Tradizioni Speciali',
      specialSub: 'Rimedi tradizionali conosciuti in tutto il mondo',
      allPointsLink: '📍 Tutti i 60 Punti di Digitopressione →',
      allMudrasLink: '🧘 Tutti i 42 Mudra →',
      ingredientsTitle: 'Ingredienti Naturali e Usi Tradizionali',
      allIngredientsLink: 'Vedi Tutti i 20 Ingredienti →',
      seasonTitle: 'Rimedi di Stagione',
      seasonSub: 'Cure tradizionali adatte alla stagione attuale',
      popularTitle: 'Rimedi Casalinghi Più Cercati',
      popularSub: 'Guide rapide a rimedi naturali, digitopressione e mudra',
      faqTitle: 'Domande Frequenti (FAQ)',
      faqSub: 'Risposte essenziali su tradizioni casalinghe e benessere',
      safetyTitle: 'Avviso Importante di Sicurezza',
      safetyText: 'Questo sito condivide esclusivamente informazioni culturali e tradizionali e non sostituisce il parere medico. Consulta un medico in caso di allergie, gravidanza o sintomi persistenti oltre 2-3 giorni.',
      acuBtn: 'Digitopressione',
      mudraBtn: 'Mudra',
      printBtn: '🖨️ Stampa',
      waBtn: '💬 Condividi su WhatsApp',
      backHome: '← Torna alla Home',
      modalClose: 'Ho capito'
    },
    tr: {
      brandSub: 'Dünya Gelenekleri',
      navHome: 'Ana Sayfa',
      navAZ: 'A–Z Dizin',
      navPoints: 'Akupresür Noktaları',
      navMudras: 'Mudralar',
      navIngredients: 'Malzemeler',
      navPoocho: 'Soru & Cevap',
      navBhejo: 'Tarif Gönder',
      navCompare: 'Karşılaştır',
      navContact: 'İletişim',
      heroTitle: 'Dünyanın Gelenekleri, Dünya İçin.',
      heroSubtitle: 'Baş ağrısı veya öksürük için dünyada neler kullanılır? Kendi dilinizde arayın.',
      searchPlaceholder: 'Sorun veya ülke yazın... örn. Cough, Turkey',
      searchBtn: 'Ara',
      pill1: '1. Sorunu Yaz',
      pill2: '2. 10+ Ülke Gör',
      pill3: '3. Daha Fazlası',
      aajBtn: 'İncele',
      categoriesTitle: 'Kategori Seçin',
      categoriesSub: 'Sorununuzu seçin ve dünya genelindeki geleneksel yöntemleri inceleyin',
      azTitle: 'Tüm 720 Durum (A–Z)',
      azSub: '10+ ülke rehberini açmak için bir harfe tıklayın',
      demoTitle: 'Öksürük İçin Dünyada Neler Kullanılır?',
      demoPageLink: 'Tam Rehberi Gör →',
      moreBtn: 'Sonraki 10 Ülkeyi Göster',
      lessBtn: 'Sadece İlk 10 Ülkeyi Göster',
      specialTitle: 'Özel Dünya Gelenekleri',
      specialSub: 'Dünyadan öne çıkan geleneksel ev yöntemleri',
      allPointsLink: '📍 Tüm 60 Akupresür Noktası →',
      allMudrasLink: '🧘 Tüm 42 Yoga Mudrası →',
      ingredientsTitle: 'Mutfak Malzemeleri ve Geleneksel Kullanımlar',
      allIngredientsLink: 'Tüm 20 Malzemeyi Gör →',
      seasonTitle: 'Bu Mevsimin Yöntemleri',
      seasonSub: 'Mevcut mevsime uygun geleneksel bakım',
      popularTitle: 'En Çok Aranan Ev Yöntemleri',
      popularSub: 'Popüler doğal bakım, akupresür ve mudra rehberleri',
      faqTitle: 'Sıkça Sorulan Sorular (SSS)',
      faqSub: 'Ev yöntemleri, akupresür ve mudralar hakkında temel yanıtlar',
      safetyTitle: 'Önemli Güvenlik Uyarısı',
      safetyText: 'Bu site yalnızca geleneksel kültürel bilgi paylaşır; ilaç satmaz ve tedavi iddiasında bulunmaz. Alerji, hamilelik veya 2-3 günden uzun süren şikayetlerde doktora başvurun.',
      acuBtn: 'Akupresür',
      mudraBtn: 'Mudra',
      printBtn: '🖨️ Yazdır',
      waBtn: '💬 WhatsApp ile Paylaş',
      backHome: '← Ana Sayfaya Dön',
      modalClose: 'Tamam'
    },
    id: {
      brandSub: 'Tradisi Dunia',
      navHome: 'Beranda',
      navAZ: 'A–Z',
      navPoints: 'Titik Akupresur',
      navMudras: 'Mudra',
      navIngredients: 'Bahan Alami',
      navPoocho: 'Tanya Jawab',
      navBhejo: 'Kirim Tradisi',
      navCompare: 'Bandingkan',
      navContact: 'Kontak',
      heroTitle: 'Tradisi Dunia, Untuk Dunia.',
      heroSubtitle: 'Apa yang digunakan dunia untuk sakit kepala atau batuk? Cari di sini.',
      searchPlaceholder: 'Tulis keluhan atau negara... mis. Cough, Indonesia',
      searchBtn: 'Cari',
      pill1: '1. Tulis Keluhan',
      pill2: '2. Lihat 10+ Negara',
      pill3: '3. Lihat Detail',
      aajBtn: 'Lihat',
      categoriesTitle: 'Kategori Perawatan',
      categoriesSub: 'Pilih kategori dan jelajahi tradisi rumah tangga dari seluruh dunia',
      azTitle: 'Semua 720 Kondisi (A–Z)',
      azSub: 'Klik huruf atau kategori untuk membuka panduan dari 10+ negara',
      demoTitle: 'Apa yang Digunakan Dunia untuk Batuk?',
      demoPageLink: 'Lihat Panduan Lengkap →',
      moreBtn: 'Muat 10 Negara Berikutnya',
      lessBtn: 'Tampilkan 10 Negara Pertama',
      specialTitle: 'Tradisi Pilihan Dunia',
      specialSub: 'Kebiasaan tradisional populer dari berbagai negara',
      allPointsLink: '📍 Semua 60 Titik Akupresur →',
      allMudrasLink: '🧘 Semua 42 Mudra Yoga →',
      ingredientsTitle: 'Bahan Dapur & Manfaat Tradisional',
      allIngredientsLink: 'Lihat Semua 20 Bahan →',
      seasonTitle: 'Perawatan Musiman',
      seasonSub: 'Perawatan tradisional sesuai musim saat ini',
      popularTitle: 'Panduan Pengobatan Rumahan Paling Dicari',
      popularSub: 'Akses langsung panduan alami, akupresur, dan mudra',
      faqTitle: 'Pertanyaan Umum (FAQ)',
      faqSub: 'Jawaban penting seputar tradisi alami, akupresur, dan mudra',
      safetyTitle: 'Peringatan Keamanan Penting',
      safetyText: 'Situs ini hanya menyajikan informasi tradisi budaya; tidak menjual obat atau menjanjikan penyembuhan medis. Konsultasikan dengan dokter jika memiliki alergi, hamil, atau gejala berlanjut lebih dari 2–3 hari.',
      acuBtn: 'Lihat Akupresur',
      mudraBtn: 'Lihat Mudra',
      printBtn: '🖨️ Cetak',
      waBtn: '💬 Bagikan di WhatsApp',
      backHome: '← Kembali ke Beranda',
      modalClose: 'Mengerti'
    },
    th: {
      brandSub: 'ภูมิปัญญาพื้นบ้านโลก',
      navHome: 'หน้าแรก',
      navAZ: 'A–Z ทั้งหมด',
      navPoints: 'จุดกดจุด',
      navMudras: 'มุทรา',
      navIngredients: 'สมุนไพรใกล้ตัว',
      navPoocho: 'ถาม-ตอบ',
      navBhejo: 'แบ่งปันภูมิปัญญา',
      navCompare: 'เปรียบเทียบ',
      navContact: 'ติดต่อ',
      heroTitle: 'ภูมิปัญญาโลก เพื่อทุกคนบนโลก',
      heroSubtitle: 'ทั่วโลกใช้อะไรดูแลอาการปวดหัวหรือไอ? ค้นหาในภาษาของคุณได้เลย',
      searchPlaceholder: 'พิมพ์อาการหรือประเทศ... เช่น Cough, Thailand',
      searchBtn: 'ค้นหา',
      pill1: '1. พิมพ์อาการ',
      pill2: '2. ดู 10+ ประเทศ',
      pill3: '3. ดูเพิ่มเติม',
      aajBtn: 'ดูข้อมูล',
      categoriesTitle: 'หมวดหมู่ภูมิปัญญา',
      categoriesSub: 'เลือกหมวดหมู่เพื่อดูวิธีดูแลสุขภาพตามภูมิปัญญาทั่วโลก',
      azTitle: 'อาการทั้งหมด 720 รายการ (A–Z)',
      azSub: 'คลิกตัวอักษรเพื่อเปิดข้อมูลจาก 10+ ประเทศ',
      demoTitle: 'ทั่วโลกใช้อะไรสำหรับอาการไอ?',
      demoPageLink: 'ดูคู่มือฉบับเต็ม →',
      moreBtn: 'ดูเพิ่มอีก 10 ประเทศ',
      lessBtn: 'แสดงเฉพาะ 10 ประเทศแรก',
      specialTitle: 'ภูมิปัญญาเด่นจากทั่วโลก',
      specialSub: 'วิธีดูแลตัวเองแบบดั้งเดิมจากหลายวัฒนธรรม',
      allPointsLink: '📍 จุดกดจุดทั้ง 60 จุด →',
      allMudrasLink: '🧘 มุทราโยคะทั้ง 42 ท่า →',
      ingredientsTitle: 'วัตถุดิบในครัวและการใช้แบบดั้งเดิม',
      allIngredientsLink: 'ดูวัตถุดิบทั้ง 20 ชนิด →',
      seasonTitle: 'การดูแลตามฤดูกาล',
      seasonSub: 'วิธีดูแลสุขภาพตามฤดูกาลปัจจุบัน',
      popularTitle: 'หัวข้อภูมิปัญญาที่ถูกค้นหามากที่สุด',
      popularSub: 'เข้าถึงคู่มือดูแลตัวเอง จุดกดจุด และมุทราได้ทันที',
      faqTitle: 'คำถามที่พบบ่อย (FAQ)',
      faqSub: 'คำตอบสำคัญเกี่ยวกับวิธีดูแลแบบดั้งเดิม การกดจุด และมุทรา',
      safetyTitle: 'คำแนะนำด้านความปลอดภัย',
      safetyText: 'เว็บไซต์นี้ให้ข้อมูลเชิงวัฒนธรรมและภูมิปัญญาเท่านั้น ไม่ได้จำหน่ายยาหรือรับรองการรักษาทางการแพทย์ หากมีอาการแพ้ ตั้งครรภ์ หรืออาการไม่ดีขึ้นภายใน 2-3 วัน ควรปรึกษาแพทย์ทันที',
      acuBtn: 'ดูจุดกดจุด',
      mudraBtn: 'ดูท่ามุทรา',
      printBtn: '🖨️ พิมพ์หน้านี้',
      waBtn: '💬 แชร์ทาง WhatsApp',
      backHome: '← กลับหน้าแรก',
      modalClose: 'ตกลง'
    },
    vi: {
      brandSub: 'Truyền Thống Thế Giới',
      navHome: 'Trang chủ',
      navAZ: 'Danh mục A–Z',
      navPoints: 'Huyệt đạo',
      navMudras: 'Thủ ấn Mudra',
      navIngredients: 'Nguyên liệu',
      navPoocho: 'Hỏi đáp',
      navBhejo: 'Gửi mẹo hay',
      navCompare: 'So sánh',
      navContact: 'Liên hệ',
      heroTitle: 'Truyền Thống Thế Giới, Dành Cho Mọi Người.',
      heroSubtitle: 'Thế giới dùng gì khi đau đầu hoặc ho? Tìm kiếm ngay theo triệu chứng hoặc quốc gia.',
      searchPlaceholder: 'Nhập triệu chứng hoặc quốc gia... vd Cough, Vietnam',
      searchBtn: 'Tìm kiếm',
      pill1: '1. Nhập vấn đề',
      pill2: '2. Xem 10+ quốc gia',
      pill3: '3. Xem thêm',
      aajBtn: 'Xem ngay',
      categoriesTitle: 'Danh Mục Truyền Thống',
      categoriesSub: 'Chọn danh mục để khám phá kinh nghiệm dân gian khắp thế giới',
      azTitle: 'Tất Cả 720 Vấn Đề (A–Z)',
      azSub: 'Nhấp vào chữ cái để xem kinh nghiệm từ 10+ quốc gia',
      demoTitle: 'Thế Giới Dùng Gì Khi Bị Ho?',
      demoPageLink: 'Xem hướng dẫn đầy đủ →',
      moreBtn: 'Xem Thêm 10 Quốc Gia',
      lessBtn: 'Chỉ Hiện 10 Quốc Gia Đầu',
      specialTitle: 'Truyền Thống Nổi Bật',
      specialSub: 'Những kinh nghiệm chăm sóc sức khỏe dân gian tiêu biểu',
      allPointsLink: '📍 Xem 60 Huyệt Đạo →',
      allMudrasLink: '🧘 Xem 42 Thủ Ấn Mudra →',
      ingredientsTitle: 'Nguyên Liệu Nhà Bếp & Công Dụng Truyền Thống',
      allIngredientsLink: 'Xem Tất Cả 20 Nguyên Liệu →',
      seasonTitle: 'Chăm Sóc Theo Mùa',
      seasonSub: 'Kinh nghiệm dân gian phù hợp với mùa hiện tại',
      popularTitle: 'Mẹo Dân Gian Được Tìm Kiếm Nhiều Nhất',
      popularSub: 'Truy cập nhanh hướng dẫn dân gian, bấm huyệt và thủ ấn',
      faqTitle: 'Câu Hỏi Thường Gặp (FAQ)',
      faqSub: 'Giải đáp thiết yếu về phương pháp dân gian, bấm huyệt và mudra',
      safetyTitle: 'Lưu Ý An Toàn Quan Trọng',
      safetyText: 'Trang web chỉ chia sẻ thông tin văn hóa truyền thống, không bán thuốc và không thay thế chẩn đoán y tế. Hãy hỏi ý kiến bác sĩ nếu bạn bị dị ứng, mang thai hoặc triệu chứng kéo dài quá 2–3 ngày.',
      acuBtn: 'Xem Huyệt Đạo',
      mudraBtn: 'Xem Thủ Ấn',
      printBtn: '🖨️ In trang',
      waBtn: '💬 Chia sẻ WhatsApp',
      backHome: '← Về Trang Chủ',
      modalClose: 'Đã hiểu'
    },
    ta: {
      brandSub: 'உலகப் பாரம்பரியம்',
      navHome: 'முகப்பு',
      navAZ: 'A–Z பட்டியல்',
      navPoints: 'அக்குபிரஷர் புள்ளிகள்',
      navMudras: 'முத்திரைகள்',
      navIngredients: 'பொருட்கள்',
      navPoocho: 'கேள்வி பதில்',
      navBhejo: 'குறிப்பு அனுப்பு',
      navCompare: 'ஒப்பிடு',
      navContact: 'தொடர்பு',
      heroTitle: 'உலகப் பாரம்பரியம், உலக மக்களுக்காக.',
      heroSubtitle: 'தலைவலி அல்லது இருமலுக்கு உலக நாடுகள் என்ன பயன்படுத்துகின்றன? உங்கள் மொழியில் தேடுங்கள்.',
      searchPlaceholder: 'பிரச்சனை அல்லது நாடு लिखவும்... எ.கா. Cough, Headache',
      searchBtn: 'தேடு',
      pill1: '1. பிரச்சனை लिखவும்',
      pill2: '2. 10+ நாடுகள் பார்க்கவும்',
      pill3: '3. மேலும் பார்க்கவும்',
      aajBtn: 'பார்க்கவும்',
      categoriesTitle: 'பாரம்பரிய பிரிவுகள்',
      categoriesSub: 'உங்கள் பிரச்சனையைத் தேர்ந்தெடுத்து உலகப் பாரம்பரியங்களைப் பாருங்கள்',
      azTitle: 'அனைத்து 720 பிரச்சனைகள் (A–Z)',
      azSub: '10+ நாடுகளின் குறிப்புகளைப் பார்க்க எழுத்தை அழுத்தவும்',
      demoTitle: 'இருமலுக்கு உலகம் என்ன எடுக்கிறது?',
      demoPageLink: 'முழுப் பக்கம் பார்க்கவும் →',
      moreBtn: 'அடுத்த 10 நாடுகள்',
      lessBtn: 'முதல் 10 நாடுகள் மட்டும்',
      specialTitle: 'சிறப்புப் பாரம்பரியங்கள்',
      specialSub: 'உலகின் முக்கிய வீட்டுப் பாரம்பரிய தகவல்கள்',
      allPointsLink: '📍 அனைத்து 60 அக்குபிரஷர் புள்ளிகள் →',
      allMudrasLink: '🧘 அனைத்து 42 ஹஸ்த முத்திரைகள் →',
      ingredientsTitle: 'சமையலறைப் பொருட்கள் & நன்மைகள்',
      allIngredientsLink: 'அனைத்து 20 பொருட்கள் →',
      seasonTitle: 'பருவகாலக் குறிப்புகள்',
      seasonSub: 'தற்போதைய பருவத்திற்கு ஏற்ற பாரம்பரிய பராமரிப்பு',
      popularTitle: 'அதிகம் தேடப்படும் வீட்டுக் குறிப்புகள்',
      popularSub: 'பிரபல வீட்டுக் குறிப்புகள், அக்குபிரஷர் மற்றும் முத்திரை வழிகாட்டிகள்',
      faqTitle: 'அடிக்கடி கேட்கப்படும் கேள்விகள் (FAQ)',
      faqSub: 'வீட்டு வைத்தியம், அக்குபிரஷர் மற்றும் முத்திரைகள் குறித்த முக்கிய பதில்கள்',
      safetyTitle: 'முக்கிய பாதுகாப்பு எச்சரிக்கை',
      safetyText: 'இந்தத் தளம் பாரம்பரியத் தகவல்களை மட்டுமே வழங்குகிறது; மருந்து விற்கவோ மருத்துவ சிகிச்சையை மாற்றவோ இல்லை. ஒவ்வாமை, கர்ப்பம் அல்லது 2-3 நாட்களுக்கு மேல் அறிகுறிகள் இருந்தால் மருத்துவரை அணுகவும்.',
      acuBtn: 'அக்குபிரஷர்',
      mudraBtn: 'முத்திரை',
      printBtn: '🖨️ அச்சிடு',
      waBtn: '💬 WhatsApp பகிர்',
      backHome: '← முகப்புக்குச் செல்',
      modalClose: 'சரி'
    },
    te: {
      brandSub: 'ప్రపంచ సంప్రదాయాలు',
      navHome: 'హోమ్',
      navAZ: 'A–Z జాబితా',
      navPoints: 'ఆక్యుప్రెషర్ పాయింట్లు',
      navMudras: 'ముద్రలు',
      navIngredients: 'పదార్థాలు',
      navPoocho: 'ప్రశ్నలు',
      navBhejo: 'చిట్కా పంపండి',
      navCompare: 'పోల్చండి',
      navContact: 'సంప్రదించండి',
      heroTitle: 'ప్రపంచ సంప్రదాయం, ప్రపంచం కోసం.',
      heroSubtitle: 'తలనొప్పి లేదా దగ్గుకు ప్రపంచవ్యాప్తంగా ఏమి ఉపయోగిస్తారు? ఇక్కడ వెతకండి.',
      searchPlaceholder: 'సమస్య లేదా దేశం రాయండి... ఉదా. Cough, Headache',
      searchBtn: 'వెతకండి',
      pill1: '1. సమస్య రాయండి',
      pill2: '2. 10+ దేశాలు చూడండి',
      pill3: '3. మరిన్ని చూడండి',
      aajBtn: 'చూడండి',
      categoriesTitle: 'సంప్రదాయ విభాగాలు',
      categoriesSub: 'మీ సమస్యను ఎంచుకుని ప్రపంచవ్యాప్త ఇంటి చిట్కాలను చూడండి',
      azTitle: 'మొత్తం 720 సమస్యలు (A–Z)',
      azSub: '10+ దేశాల సమాచారం కోసం అక్షరంపై క్లిక్ చేయండి',
      demoTitle: 'దగ్గుకు ప్రపంచం ఏమి తీసుకుంటుంది?',
      demoPageLink: 'పూర్తి గైడ్ చూడండి →',
      moreBtn: 'తదుపరి 10 దేశాలు',
      lessBtn: 'మొదటి 10 దేశాలు మాత్రమే',
      specialTitle: 'ప్రత్యేక ప్రపంచ సంప్రదాయాలు',
      specialSub: 'ప్రపంచవ్యాప్త ముఖ్య ఇంటి సంప్రదాయాలు',
      allPointsLink: '📍 మొత్తం 60 ఆక్యుప్రెషర్ పాయింట్లు →',
      allMudrasLink: '🧘 మొత్తం 42 హస్త ముద్రలు →',
      ingredientsTitle: 'వంటగది పదార్థాలు & సంప్రదాయ ఉపయోగాలు',
      allIngredientsLink: 'మొత్తం 20 పదార్థాలు చూడండి →',
      seasonTitle: 'ఈ సీజన్ చిట్కాలు',
      seasonSub: 'ప్రస్తుత కాలానికి అనుగుణమైన సంప్రదాయ సంరక్షణ',
      popularTitle: 'ఎక్కువగా వెతికే ఇంటి చిట్కాలు',
      popularSub: 'ప్రముఖ చిట్కాలు, ఆక్యుప్రెషర్ మరియు ముద్ర గైడ్‌లు',
      faqTitle: 'తరచుగా అడిగే ప్రశ్నలు (FAQ)',
      faqSub: 'సంప్రదాయ ఇంటి చిట్కాలు, ఆక్యుప్రెషర్ మరియు ముద్రల వివరాలు',
      safetyTitle: 'ముఖ్యమైన భద్రతా సూచన',
      safetyText: 'ఈ సైట్ కేవలం సాంప్రదాయ సమాచారాన్ని మాత్రమే అందిస్తుంది; మందులు విక్రయించదు మరియు వైద్య చికిత్సకు ప్రత్యామ్నాయం కాదు. అలెర్జీ, గర్భధారణ లేదా 2-3 రోజులకు పైగా లక్షణాలు ఉంటే వైద్యుడిని సంప్రదించండి.',
      acuBtn: 'ఆక్యుప్రెషర్',
      mudraBtn: 'ముద్ర చూడండి',
      printBtn: '🖨️ ప్రింట్',
      waBtn: '💬 WhatsApp షేర్',
      backHome: '← హోమ్‌కు వెళ్ళండి',
      modalClose: 'సరే'
    },
    mr: {
      brandSub: 'जगाची परंपरा',
      navHome: 'मुख्यपृष्ठ',
      navAZ: 'A–Z यादी',
      navPoints: 'अ‍ॅक्युप्रेशर पॉईंट्स',
      navMudras: 'हस्त मुद्रा',
      navIngredients: 'साहित्य मार्गदर्शक',
      navPoocho: 'प्रश्नोत्तरे',
      navBhejo: 'उपाय पाठवा',
      navCompare: 'तुलना करा',
      navContact: 'संपर्क',
      heroTitle: 'जगाची परंपरा, जगासाठी.',
      heroSubtitle: 'डोकेदुखी किंवा खोकल्यावर जगभरात काय वापरतात? आपल्या भाषेत शोधा.',
      searchPlaceholder: 'समस्या किंवा देश लिहा... उदा. Cough, Headache',
      searchBtn: 'शोधा',
      pill1: '१. समस्या लिहा',
      pill2: '२. १०+ देश पहा',
      pill3: '३. अधिक पहा',
      aajBtn: 'पहा',
      categoriesTitle: 'परंपरा विभाग',
      categoriesSub: 'तुमची समस्या निवडा आणि जगभरातील घरगुती परंपरा पहा',
      azTitle: 'सर्व ७२० समस्या (A–Z)',
      azSub: '१०+ देशांची माहिती पाहण्यासाठी अक्षरावर क्लिक करा',
      demoTitle: 'खोकल्यावर जगभरात काय घेतले जाते?',
      demoPageLink: 'संपूर्ण पान पहा →',
      moreBtn: 'पुढील १० देश पहा',
      lessBtn: 'फक्त पहिले १० देश पहा',
      specialTitle: 'विशेष जागतिक परंपरा',
      specialSub: 'जगभरातील खास घरगुती पारंपरिक माहिती',
      allPointsLink: '📍 सर्व ६० अ‍ॅक्युप्रेशर पॉईंट्स →',
      allMudrasLink: '🧘 सर्व ४२ हस्त मुद्रा →',
      ingredientsTitle: 'स्वयंपाकघरातील २० घटक व फायदे',
      allIngredientsLink: 'सर्व २० घटक पहा →',
      seasonTitle: 'या ऋतूतील घरगुती काळजी',
      seasonSub: 'सध्याच्या हवामानानुसार पारंपरिक काळजी',
      popularTitle: 'सर्वाधिक शोधले जाणारे घरगुती उपाय',
      popularSub: 'लोकप्रिय घरगुती उपाय, अ‍ॅक्युप्रेशर आणि मुद्रा मार्गदर्शक',
      faqTitle: 'नेहमी विचारले जाणारे प्रश्न (FAQ)',
      faqSub: 'घरगुती परंपरा, अ‍ॅक्युप्रेशर आणि मुद्रांबद्दल महत्त्वाची उत्तरे',
      safetyTitle: 'महत्त्वाची सावधगिरी',
      safetyText: 'ही साइट केवळ पारंपरिक व सांस्कृतिक माहिती देते; कोणतेही औषध विकत नाही किंवा उपचाराचा दावा करत नाही. अ‍ॅलर्जी, गर्भधारणा किंवा २-३ दिवसांपेक्षा जास्त त्रास असल्यास डॉक्टरांचा सल्ला घ्या.',
      acuBtn: 'अ‍ॅक्युप्रेशर पहा',
      mudraBtn: 'मुद्रा पहा',
      printBtn: '🖨️ प्रिंट करा',
      waBtn: '💬 WhatsApp वर शेअर करा',
      backHome: '← मुख्यपृष्ठावर जा',
      modalClose: 'ठीक आहे'
    }
  };

  var HINGLISH_PAIRS = [
    ['Ye site keval paramparik jaankari ke liye hai. Hum koi dawa nahi bechte aur na hi kisi bimari ke ilaaj ka dawa karte hain. Zaroorat hone par doctor se salah lein.', 'This site is strictly for traditional educational information. We do not sell medicine or claim medical cures. Consult a doctor when needed.'],
    ['Ye site parampara ki jaankari deti hai, dawa nahi bechti, ilaaj ka dawa nahi karti.', 'This site shares traditional cultural knowledge only; it does not sell medicine or claim medical cures.'],
    ['Ye parampara ki jaankari hai, ilaaj ka dawa nahi karti. Agar takleef 2-3 din se zyada hai to doctor ko dikhayein.', 'This is traditional educational information and not a medical cure. If discomfort persists beyond 2–3 days, consult a doctor.'],
    ['Ye supportive jaankari hai, dawa ka badal nahi hai. Doctor ko dikhayein.', 'This is supportive traditional information, not a substitute for medicine. Please consult a doctor.'],
    ['Ye supportive jaankari hai, dawa ka badal nahi hai.', 'This is supportive traditional information, not a medicine substitute.'],
    ['Gambhir - Turant Doctor Ke Paas Jayein', 'Urgent — Consult a Doctor Immediately'],
    ['Gambhir hai, doctor ko dikhayein', 'Serious condition — consult a doctor'],
    ['Zaroori Savdhani', 'Important Safety Precaution'],
    ['Dhyaan Dein:', 'Please Note:'],
    ['Parampara me', 'Traditionally,'],
    ['More Dekhein - Agle 10 Desh', 'Load Next 10 Countries'],
    ['Kam Dekhein - Sirf Pehle 10 Desh', 'Show First 10 Countries Only'],
    ['Sabhi Desh Dekhein', 'Show All Countries'],
    ['Sabhi 720 Dekhein', 'View All 720'],
    ['Aur Conditions Dekhein', 'Load More Conditions'],
    ['Acupressure Dekho', 'Acupressure Point'],
    ['Mudra Dekho', 'Yoga Mudra'],
    ['Iske Gharelu Nuskhe Dekho', 'View Home Remedies'],
    ['Iska Acupressure Point Dekho', 'View Acupressure Point'],
    ['Iski Hast Mudra Dekho', 'View Yoga Mudra'],
    ['Saare 60 Points', 'All 60 Points'],
    ['Saare 60 Points Dekhein', 'View All 60 Points'],
    ['Saari 42 Mudrayein', 'All 42 Mudras'],
    ['Saari 42 Mudrayein Dekhein', 'View All 42 Mudras'],
    ['Print Karo', 'Print Guide'],
    ['WhatsApp Pe Bhejo', 'Share on WhatsApp'],
    ['Ye Point Kaha Hai?', 'Where Is This Point?'],
    ['Kaise Dabayein?', 'How to Apply Pressure?'],
    ['Kitni Der?', 'For How Long?'],
    ['Kab Nahi Karein?', 'When to Avoid?'],
    ['Haath Kaise Rakhein?', 'How to Hold Your Hand?'],
    ['Kaise Karein?', 'How to Practice?'],
    ['Kitni Der / Kab Karein?', 'Duration & Best Time'],
    ['Photo dekh ke samjhein - Ye point yaha hai', 'Visual Location Guide — Locate Point Here'],
    ['Photo dekh ke samjhein - Haath aise rakhna hai', 'Visual Guide — Hold Your Hand Like This'],
    ['Aaj Ka Nuskha', 'Remedy of the Day'],
    ['For:', 'For:'],
    ['Duniya Ki Parampara', 'World Traditions'],
    ['Duniya Ki Parampara, Duniya Ke Liye.', 'World Traditions, For the World.'],
    ['allergy wale ke liye nahi', '— avoid if allergic'],
    ['allergy wale dhyan rakhein', '— check for allergies first'],
    ['1 saal se chhote bachhon ko shahad na dein', 'Do not give honey to infants under 1 year old'],
    ['Pregnant mahilayein doctor ki salah lein', 'Pregnant individuals should consult a doctor first'],
    ['Adrak + Shahad + Tulsi', 'Ginger + Honey + Holy Basil (Tulsi)'],
    ['Adrak + Mah + Tulsi', 'Ginger + Honey + Holy Basil (Tulsi)'],
    ['Adrak Chai', 'Warm Ginger Tea'],
    ['Gunguna Namak Pani Garara', 'Warm Saltwater Gargle'],
    ['Gunguna Pani', 'Warm Water'],
    ['Shahad + Nimbu', 'Honey + Lemon'],
    ['Nariyal Tel', 'Coconut Oil'],
    ['Til Tel', 'Sesame Oil'],
    ['Haldi Doodh', 'Turmeric Warm Milk'],
    ['Saunf + Jeera Pani', 'Fennel + Cumin Water'],
    ['Bheegi Kishmish', 'Soaked Raisins'],
    ['Desi Ghee', 'Clarified Butter (Ghee)'],
    ['Gulab Jal', 'Rose Water'],
    ['Aloe Vera', 'Aloe Vera'],
    ['Khansi, Gala Kharab', 'Cough, Sore Throat'],
    ['Khansi', 'Cough'],
    ['Sar Dard', 'Headache'],
    ['Sardi Jukam', 'Common Cold'],
    ['Kabz', 'Constipation'],
    ['Pachan', 'Digestion'],
    ['Baal Jhadna', 'Hair Fall'],
    ['Neend', 'Sleep'],
    ['Thakan', 'Fatigue']
  ];

  function normalizeToEnglish(text) {
    if (!text) return text;
    var out = String(text);
    for (var i = 0; i < HINGLISH_PAIRS.length; i++) {
      var src = HINGLISH_PAIRS[i][0];
      var dst = HINGLISH_PAIRS[i][1];
      if (out.indexOf(src) !== -1) {
        out = out.split(src).join(dst);
      }
    }
    return out;
  }

  function getCountryDisplayName(cc, fallback) {
    if (COUNTRY_SHORT_NAMES[cc]) return COUNTRY_SHORT_NAMES[cc];
    try {
      if (typeof Intl !== 'undefined' && Intl.DisplayNames) {
        var dn = new Intl.DisplayNames(['en'], { type: 'region' });
        var name = dn.of(cc);
        if (name) return name;
      }
    } catch (e) {}
    return fallback || cc;
  }

  function resolveMetaForCountryCode(rawCc, fallbackCountryName) {
    var cc = String(rawCc || '').toUpperCase();
    if (CC_ALIASES[cc]) cc = CC_ALIASES[cc];
    var navLangRaw = ((navigator.languages && navigator.languages[0]) || navigator.language || '').toLowerCase().split(/[-_]/)[0];
    var lang = ALL_249_COUNTRY_LANG[cc] || (LANG_LABELS[navLangRaw] ? navLangRaw : 'en');
    if (cc === 'IN' && navLangRaw && LANG_LABELS[navLangRaw]) {
      lang = navLangRaw;
    }
    return {
      countryCode: cc || 'US',
      country: getCountryDisplayName(cc, fallbackCountryName),
      lang: lang,
      hemi: SOUTH_HEMI[cc] ? 'S' : 'N',
      source: 'geo'
    };
  }

  function guessGeoSync() {
    var cc = null;
    try {
      var tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (tz && TIMEZONE_TO_CC[tz]) {
        cc = TIMEZONE_TO_CC[tz];
      }
    } catch (e) {}

    var navLangRaw = '';
    try {
      navLangRaw = (navigator.languages && navigator.languages[0]) || navigator.language || '';
    } catch (e) {}

    var langParts = navLangRaw.toLowerCase().split(/[-_]/);
    var browserLang = langParts[0] || '';
    var browserRegion = (langParts[1] || '').toUpperCase();

    if (!cc && browserRegion && ALL_249_COUNTRY_LANG[browserRegion]) {
      cc = browserRegion;
    }

    if (cc) {
      var res = resolveMetaForCountryCode(cc);
      res.source = 'sync';
      return res;
    }

    var fallbackLang = LANG_LABELS[browserLang] ? browserLang : 'en';
    return {
      countryCode: 'US',
      country: fallbackLang === 'hi' ? 'India' : 'USA',
      lang: fallbackLang,
      hemi: 'N',
      source: 'sync'
    };
  }

  function fetchWithTimeout(url, ms) {
    var ctrl = typeof AbortController !== 'undefined' ? new AbortController() : null;
    var timer = ctrl ? setTimeout(function () { ctrl.abort(); }, ms) : null;
    return fetch(url, { signal: ctrl ? ctrl.signal : undefined, cache: 'no-store' })
      .then(function (r) {
        if (timer) clearTimeout(timer);
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      })
      .catch(function (err) {
        if (timer) clearTimeout(timer);
        throw err;
      });
  }

  function detectCountryByIP(callback) {
    try {
      var cached = sessionStorage.getItem(GEO_CACHE_KEY);
      if (cached) {
        var parsed = JSON.parse(cached);
        if (parsed && parsed.countryCode) {
          callback(parsed);
          return;
        }
      }
    } catch (e) {}

    fetchWithTimeout('https://ipapi.co/json/', 2500)
      .then(function (data) {
        var cc = (data && data.country_code || '').toUpperCase();
        if (!cc) throw new Error('no cc');
        return resolveMetaForCountryCode(cc, data.country_name);
      })
      .catch(function () {
        return fetchWithTimeout('https://ipwho.is/', 2500).then(function (data) {
          var cc = (data && data.country_code || '').toUpperCase();
          if (!cc) throw new Error('no cc');
          return resolveMetaForCountryCode(cc, data.country);
        });
      })
      .then(function (geo) {
        try {
          sessionStorage.setItem(GEO_CACHE_KEY, JSON.stringify(geo));
        } catch (e) {}
        callback(geo);
      })
      .catch(function () {});
  }

  var origTextMap = new WeakMap();
  var origElTextMap = new WeakMap();
  var origAttrMap = new WeakMap();
  var translatingTimer = null;
  var activeTargetLang = 'hi';

  function getTranslationCache(lang) {
    try {
      var raw = localStorage.getItem('hrw_tr_' + lang);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  }

  function saveTranslationCache(lang, cache) {
    try {
      var keys = Object.keys(cache);
      if (keys.length > 600) {
        var trimmed = {};
        keys.slice(keys.length - 450).forEach(function (k) { trimmed[k] = cache[k]; });
        cache = trimmed;
      }
      localStorage.setItem('hrw_tr_' + lang, JSON.stringify(cache));
    } catch (e) {}
  }

  function isProtectedNode(el, targetLang) {
    if (!el) return true;
    if (el.closest && el.closest('.notranslate, [translate="no"], svg, script, style, code, pre, .country-highlight, .brand-title')) {
      return true;
    }
    if (el.closest) {
      var curatedEl = el.closest('[data-hrw-curated]');
      if (curatedEl && curatedEl.getAttribute('data-hrw-curated') === targetLang) {
        return true;
      }
    }
    return false;
  }

  function collectTranslatableNodes(targetLang) {
    var nodes = [];
    if (!document.body) return nodes;
    var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode: function (node) {
        var parent = node.parentElement;
        if (!parent || isProtectedNode(parent, targetLang)) return NodeFilter.FILTER_REJECT;
        var tag = parent.tagName;
        if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'NOSCRIPT' || tag === 'OPTION' || tag === 'SELECT') {
          return NodeFilter.FILTER_REJECT;
        }
        var raw = origTextMap.has(node) ? origTextMap.get(node) : node.nodeValue;
        var trimmed = raw ? raw.trim() : '';
        if (!trimmed || trimmed.length < 2) return NodeFilter.FILTER_REJECT;
        if (/^[\d\s\W_]+$/.test(trimmed)) return NodeFilter.FILTER_REJECT;
        if (trimmed.indexOf('HomeRemediesWorld') !== -1 || trimmed.indexOf('@') !== -1) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });

    var current;
    while ((current = walker.nextNode())) {
      if (!origTextMap.has(current)) {
        origTextMap.set(current, current.nodeValue);
      }
      nodes.push(current);
    }
    return nodes;
  }

  function restoreOriginalDom() {
    if (!document.body) return;
    document.querySelectorAll('[data-hrw-curated]').forEach(function (el) {
      el.removeAttribute('data-hrw-curated');
      if (origElTextMap.has(el)) {
        el.textContent = origElTextMap.get(el);
      }
    });
    var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null);
    var n;
    while ((n = walker.nextNode())) {
      if (origTextMap.has(n)) {
        n.nodeValue = origTextMap.get(n);
      }
    }
    document.querySelectorAll('[placeholder]').forEach(function (el) {
      if (origAttrMap.has(el)) {
        el.setAttribute('placeholder', origAttrMap.get(el));
      }
    });
  }

  function translateBatchViaAPI(texts, targetLang) {
    if (!texts.length) return Promise.resolve([]);
    var joined = texts.join('\n[[HRW_SEP]]\n');
    var url = 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=' +
      encodeURIComponent(targetLang) + '&dt=t&q=' + encodeURIComponent(joined);

    return fetchWithTimeout(url, 4500).then(function (data) {
      var full = '';
      if (Array.isArray(data) && Array.isArray(data[0])) {
        data[0].forEach(function (seg) {
          if (seg && seg[0]) full += seg[0];
        });
      }
      var parts = full.split(/\s*\[\[HRW_SEP\]\]\s*/);
      if (parts.length !== texts.length) {
        return null;
      }
      return parts;
    });
  }

  function deepTranslatePage(targetLang) {
    if (!targetLang || targetLang === 'hi') {
      restoreOriginalDom();
      return;
    }

    var nodes = collectTranslatableNodes(targetLang);
    if (targetLang === 'en') {
      nodes.forEach(function (n) {
        var orig = origTextMap.get(n);
        if (orig) n.nodeValue = normalizeToEnglish(orig);
      });
      return;
    }

    var cache = getTranslationCache(targetLang);
    var missingMap = new Map();

    nodes.forEach(function (n) {
      var orig = origTextMap.get(n);
      if (!orig) return;
      var trimmed = orig.trim();
      var englishBase = normalizeToEnglish(trimmed);
      if (cache[englishBase]) {
        n.nodeValue = orig.replace(trimmed, cache[englishBase]);
      } else {
        n.nodeValue = orig.replace(trimmed, englishBase);
        if (!missingMap.has(englishBase)) {
          missingMap.set(englishBase, []);
        }
        missingMap.get(englishBase).push({ node: n, orig: orig, trimmed: trimmed });
      }
    });

    var missingKeys = Array.from(missingMap.keys());
    if (!missingKeys.length) return;

    var batches = [];
    for (var i = 0; i < missingKeys.length && i < 180; i += 18) {
      batches.push(missingKeys.slice(i, i + 18));
    }

    var seq = Promise.resolve();
    batches.forEach(function (batch) {
      seq = seq.then(function () {
        if (activeTargetLang !== targetLang) return;
        return translateBatchViaAPI(batch, targetLang)
          .then(function (translatedList) {
            if (!translatedList || activeTargetLang !== targetLang) return;
            batch.forEach(function (engKey, idx) {
              var tr = translatedList[idx];
              if (tr) {
                cache[engKey] = tr;
                var targets = missingMap.get(engKey) || [];
                targets.forEach(function (t) {
                  t.node.nodeValue = t.orig.replace(t.trimmed, tr);
                });
              }
            });
            saveTranslationCache(targetLang, cache);
          })
          .catch(function () {});
      });
    });
  }

  function applyCuratedUI(lang) {
    var hasNativeDict = !!UI_I18N[lang];
    var dict = UI_I18N[lang] || (lang === 'hi' ? null : UI_I18N.en);
    if (!dict) return;

    function setSel(sel, val) {
      if (!val) return;
      document.querySelectorAll(sel).forEach(function (el) {
        if (!origElTextMap.has(el)) {
          origElTextMap.set(el, el.textContent);
        }
        if (hasNativeDict) {
          el.setAttribute('data-hrw-curated', lang);
        } else {
          el.removeAttribute('data-hrw-curated');
        }
        el.textContent = val;
      });
    }

    setSel('.brand-sub', dict.brandSub);
    setSel('a.nav-link[href="index.html"], a.footer-link[href="index.html"]', dict.navHome);
    setSel('a.nav-link[href*="azSection"], a.footer-link[href*="azSection"]', dict.navAZ);
    setSel('a.nav-link[href="all-points.html"], a.footer-link[href="all-points.html"]', dict.navPoints);
    setSel('a.nav-link[href="all-mudras.html"], a.footer-link[href="all-mudras.html"]', dict.navMudras);
    setSel('a.nav-link[href="ingredients.html"], a.footer-link[href="ingredients.html"]', dict.navIngredients);
    setSel('a.nav-link[href="poocho.html"], a.footer-link[href="poocho.html"]', dict.navPoocho);
    setSel('a.nav-link[href="bhejo.html"], a.footer-link[href="bhejo.html"]', dict.navBhejo);
    setSel('a.nav-link[href="compare.html"], a.footer-link[href="compare.html"]', dict.navCompare);
    setSel('a.nav-link[href="contact.html"], a.footer-link[href="contact.html"]', dict.navContact);

    setSel('#heroTitle', dict.heroTitle);
    setSel('#heroSubtitle', dict.heroSubtitle);
    var searchInp = document.getElementById('searchInput');
    if (searchInp && dict.searchPlaceholder) {
      if (!origAttrMap.has(searchInp)) {
        origAttrMap.set(searchInp, searchInp.getAttribute('placeholder') || '');
      }
      searchInp.setAttribute('placeholder', dict.searchPlaceholder);
    }
    setSel('#searchBtn', dict.searchBtn);

    var pills = document.querySelectorAll('.hero-howto-pill');
    if (pills[0] && dict.pill1) {
      if (!origElTextMap.has(pills[0])) origElTextMap.set(pills[0], pills[0].textContent);
      if (hasNativeDict) pills[0].setAttribute('data-hrw-curated', lang);
      pills[0].textContent = dict.pill1;
    }
    if (pills[1] && dict.pill2) {
      if (!origElTextMap.has(pills[1])) origElTextMap.set(pills[1], pills[1].textContent);
      if (hasNativeDict) pills[1].setAttribute('data-hrw-curated', lang);
      pills[1].textContent = dict.pill2;
    }
    if (pills[2] && dict.pill3) {
      if (!origElTextMap.has(pills[2])) origElTextMap.set(pills[2], pills[2].textContent);
      if (hasNativeDict) pills[2].setAttribute('data-hrw-curated', lang);
      pills[2].textContent = dict.pill3;
    }

    setSel('#aajKaNuskhaBtn', dict.aajBtn);
    setSel('#categoriesHeading', dict.categoriesTitle);
    setSel('#categoriesHeading + .section-subtitle', dict.categoriesSub);
    setSel('#azHeading', dict.azTitle);
    setSel('#azHeading + .section-subtitle', dict.azSub);
    setSel('#demoHeading', dict.demoTitle);
    setSel('#main-demo .demo-page-link', dict.demoPageLink);
    setSel('#specialHeading', dict.specialTitle);
    setSel('#specialHeading + .section-subtitle', dict.specialSub);
    setSel('a.demo-page-link[href="all-points.html"]', dict.allPointsLink);
    setSel('a.demo-page-link[href="all-mudras.html"]', dict.allMudrasLink);
    setSel('#ingredientsHeading', dict.ingredientsTitle);
    setSel('a.demo-page-link[href="ingredients.html"]', dict.allIngredientsLink);
    setSel('#seasonHeading', dict.seasonTitle);
    setSel('#seasonHeading + .section-subtitle', dict.seasonSub);
    setSel('#popularTopicsHeading', dict.popularTitle);
    setSel('#popularTopicsHeading + .section-subtitle', dict.popularSub);
    setSel('#faqHeading', dict.faqTitle);
    setSel('#faqHeading + .section-subtitle', dict.faqSub);

    setSel('#safetyHeading span:last-child', dict.safetyTitle);
    setSel('.safety-text', dict.safetyText);

    setSel('.triangle-btn[data-triangle="Acupressure"], .card-acu-btn', dict.acuBtn);
    setSel('.triangle-btn[data-triangle="Mudra"], .card-mudra-btn', dict.mudraBtn);
    setSel('#printPageBtn', dict.printBtn);
    setSel('#whatsappShareBtn', dict.waBtn);
    setSel('.back-home-btn, .back-home-link', dict.backHome);
    setSel('#modalCloseBtn', dict.modalClose);
  }

  function ensureLanguageDropdown() {
    var sel = document.getElementById('languageSelect');
    if (!sel) {
      var topInner = document.querySelector('.topbar-inner');
      if (topInner) {
        var wrap = document.createElement('div');
        wrap.className = 'topbar-controls notranslate';
        wrap.setAttribute('translate', 'no');
        wrap.style.display = 'flex';
        wrap.style.alignItems = 'center';
        wrap.style.gap = '8px';
        wrap.style.flexShrink = '0';

        sel = document.createElement('select');
        sel.id = 'languageSelect';
        sel.className = 'top-select';
        sel.setAttribute('aria-label', 'Language Selector');
        sel.style.background = '#FFFFFF';
        sel.style.color = '#1A1A1A';
        sel.style.border = '1.5px solid rgba(26, 122, 76, 0.25)';
        sel.style.borderRadius = '10px';
        sel.style.padding = '7px 12px';
        sel.style.fontWeight = '700';
        sel.style.fontSize = '0.85rem';
        sel.style.cursor = 'pointer';
        wrap.appendChild(sel);
        topInner.appendChild(wrap);
      }
    }

    if (sel) {
      sel.classList.add('notranslate');
      sel.setAttribute('translate', 'no');
      Object.keys(LANG_LABELS).forEach(function (code) {
        var existing = sel.querySelector('option[value="' + code + '"]');
        if (!existing) {
          var opt = document.createElement('option');
          opt.value = code;
          opt.textContent = LANG_LABELS[code];
          sel.appendChild(opt);
        } else {
          existing.textContent = LANG_LABELS[code];
        }
      });
    }
    return sel;
  }

  function ensureCountryOption(countryName) {
    var cSel = document.getElementById('countrySelect');
    if (!cSel || !countryName) return cSel;
    var existing = Array.from(cSel.options).find(function (o) {
      return o.value.toLowerCase() === countryName.toLowerCase();
    });
    if (!existing) {
      var opt = document.createElement('option');
      opt.value = countryName;
      opt.textContent = '🌍 ' + countryName;
      cSel.appendChild(opt);
    }
    return cSel;
  }

  function applyLanguageAndCountry(langCode, countryName, isManual) {
    if (!langCode) langCode = 'en';
    activeTargetLang = langCode;

    document.documentElement.setAttribute('lang', langCode);
    document.documentElement.setAttribute('dir', RTL_LANGS[langCode] ? 'rtl' : 'ltr');

    var ogLocale = document.getElementById('ogLocale');
    if (ogLocale) {
      ogLocale.setAttribute('content', LOCALE_CODES[langCode] || (langCode + '_' + langCode.toUpperCase()));
    }

    try {
      localStorage.setItem(CORE_KEY_LANG, langCode);
      if (countryName) localStorage.setItem(CORE_KEY_COUNTRY, countryName);
      if (isManual) localStorage.setItem(CORE_KEY_MANUAL, '1');
    } catch (e) {}

    var langSel = ensureLanguageDropdown();
    if (langSel) {
      if (!langSel.querySelector('option[value="' + langCode + '"]')) {
        var opt = document.createElement('option');
        opt.value = langCode;
        opt.textContent = LANG_LABELS[langCode] || langCode.toUpperCase();
        langSel.appendChild(opt);
      }
      if (langSel.value !== langCode) {
        langSel.value = langCode;
      }
    }

    if (countryName) {
      ensureCountryOption(countryName);
    }

    if (typeof window.__HRW_SET_LANG__ === 'function') {
      window.__HRW_SET_LANG__(langCode);
    }

    if (langCode === 'hi') {
      restoreOriginalDom();
    } else {
      applyCuratedUI(langCode);
      deepTranslatePage(langCode);
    }
  }

  function getRealCurrentSeason(hemi) {
    var m = new Date().getMonth() + 1;
    if (hemi === 'S') {
      if (m >= 12 || m <= 2) return 'Garmi';
      if (m >= 3 && m <= 5) return 'Basant';
      if (m >= 6 && m <= 8) return 'Sardi';
      return 'Baarish';
    }
    if (m >= 3 && m <= 6) return 'Garmi';
    if (m >= 7 && m <= 9) return 'Baarish';
    if (m === 2) return 'Basant';
    return 'Sardi';
  }

  function autoSelectLiveSeason(hemi) {
    var tabsEl = document.getElementById('seasonTabs');
    if (!tabsEl) return;
    var season = getRealCurrentSeason(hemi);
    var targetBtn = tabsEl.querySelector('.season-tab[data-season="' + season + '"]');
    if (targetBtn && !targetBtn.classList.contains('active')) {
      targetBtn.click();
    }
  }

  function syncDynamicFreshness() {
    var currentYear = new Date().getFullYear();
    document.querySelectorAll('.footer-copy').forEach(function (el) {
      el.textContent = el.textContent.replace(/©\s*20\d{2}/, '© ' + currentYear);
    });

    var now = new Date();
    var tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 2);
    var msUntilMidnight = tomorrow.getTime() - now.getTime();
    if (msUntilMidnight > 0 && msUntilMidnight < 86500000) {
      setTimeout(function () {
        if (typeof window.__HRW_REFRESH_DAILY__ === 'function') {
          window.__HRW_REFRESH_DAILY__();
        }
      }, msUntilMidnight);
    }
  }

  function initAutoUpdate() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', function () {
        navigator.serviceWorker.register('/sw.js').then(function (reg) {
          if (reg && typeof reg.update === 'function') {
            reg.update();
          }
        }).catch(function () {});
      });
    }

    function checkVersion() {
      fetch('/version.json?t=' + Date.now(), { cache: 'no-store' })
        .then(function (res) {
          if (!res.ok) return null;
          return res.json();
        })
        .then(function (info) {
          if (!info || !info.version) return;
          var prev = '';
          try { prev = localStorage.getItem(CORE_KEY_VERSION) || ''; } catch (e) {}

          if (!prev) {
            try { localStorage.setItem(CORE_KEY_VERSION, info.version); } catch (e) {}
            return;
          }

          if (prev !== info.version) {
            try { localStorage.setItem(CORE_KEY_VERSION, info.version); } catch (e) {}
            var reloadedKey = 'hrw_reloaded_' + info.version;
            var alreadyReloaded = false;
            try { alreadyReloaded = sessionStorage.getItem(reloadedKey) === '1'; } catch (e) {}
            if (!alreadyReloaded) {
              try { sessionStorage.setItem(reloadedKey, '1'); } catch (e) {}
              if (window.caches && typeof window.caches.keys === 'function') {
                window.caches.keys().then(function (names) {
                  return Promise.all(names.map(function (n) { return window.caches.delete(n); }));
                }).finally(function () {
                  window.location.reload();
                });
              } else {
                window.location.reload();
              }
            }
          }
        })
        .catch(function () {});
    }

    checkVersion();
    setInterval(checkVersion, 10 * 60 * 1000);
    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState === 'visible') {
        checkVersion();
      }
    });
  }

  function observeDynamicContent() {
    if (!document.body || typeof MutationObserver === 'undefined') return;
    var observer = new MutationObserver(function () {
      if (activeTargetLang === 'hi') return;
      if (translatingTimer) clearTimeout(translatingTimer);
      translatingTimer = setTimeout(function () {
        applyCuratedUI(activeTargetLang);
        deepTranslatePage(activeTargetLang);
      }, 60);
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  function initGeoLocalization() {
    var params = new URLSearchParams(window.location.search);
    var urlLang = (params.get('lang') || '').trim().toLowerCase();
    var manualFlag = '';
    var savedLang = '';
    var savedCountry = '';

    try {
      manualFlag = localStorage.getItem(CORE_KEY_MANUAL) || '';
      savedLang = localStorage.getItem(CORE_KEY_LANG) || '';
      savedCountry = localStorage.getItem(CORE_KEY_COUNTRY) || '';
    } catch (e) {}

    var syncGuess = guessGeoSync();
    var initialLang = urlLang || (manualFlag === '1' && savedLang ? savedLang : syncGuess.lang);
    var initialCountry = (manualFlag === '1' && savedCountry) ? savedCountry : syncGuess.country;

    var langSel = ensureLanguageDropdown();
    if (langSel) {
      langSel.addEventListener('change', function () {
        applyLanguageAndCountry(langSel.value, null, true);
      });
    }

    applyLanguageAndCountry(initialLang, initialCountry, !!urlLang);
    autoSelectLiveSeason(syncGuess.hemi);

    if (!urlLang && manualFlag !== '1') {
      detectCountryByIP(function (ipGeo) {
        if (!ipGeo) return;
        autoSelectLiveSeason(ipGeo.hemi);
        if (ipGeo.lang && (ipGeo.lang !== activeTargetLang || ipGeo.country !== initialCountry)) {
          applyLanguageAndCountry(ipGeo.lang, ipGeo.country, false);
        }
      });
    }
  }

  window.HRWCore = {
    applyLanguage: function (lang) { applyLanguageAndCountry(lang, null, true); },
    getActiveLang: function () { return activeTargetLang; },
    normalizeToEnglish: normalizeToEnglish,
    supportedCountriesCount: Object.keys(ALL_249_COUNTRY_LANG).length
  };

  function boot() {
    syncDynamicFreshness();
    initAutoUpdate();
    initGeoLocalization();
    observeDynamicContent();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
