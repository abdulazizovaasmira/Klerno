import { User, Community, Lesson, TimeSlot, Review } from './types';

// Predefined list of subjects
export const SUBJECTS = [
  "Biology",
  "Chemistry",
  "Mathematics",
  "Engineering",
  "IT & Coding",
  "Physics",
  "Economics",
  "Languages",
  "History",
  "Medicine"
];

// List of supported countries with their flags, codes, and default timezones
export const COUNTRIES = [
  { code: "AF", name: "Afghanistan", flag: "🇦🇫", timezone: "Asia/Kabul" },
  { code: "AL", name: "Albania", flag: "🇦🇱", timezone: "Europe/Tirane" },
  { code: "DZ", name: "Algeria", flag: "🇩🇿", timezone: "Africa/Algiers" },
  { code: "AD", name: "Andorra", flag: "🇦🇩", timezone: "Europe/Andorra" },
  { code: "AO", name: "Angola", flag: "🇦🇴", timezone: "Africa/Luanda" },
  { code: "AG", name: "Antigua and Barbuda", flag: "🇦🇬", timezone: "America/Antigua" },
  { code: "AR", name: "Argentina", flag: "🇦🇷", timezone: "America/Argentina/Buenos_Aires" },
  { code: "AM", name: "Armenia", flag: "🇦🇲", timezone: "Asia/Yerevan" },
  { code: "AU", name: "Australia", flag: "🇦🇺", timezone: "Australia/Sydney" },
  { code: "AT", name: "Austria", flag: "🇦🇹", timezone: "Europe/Vienna" },
  { code: "AZ", name: "Azerbaijan", flag: "🇦🇿", timezone: "Asia/Baku" },
  { code: "BS", name: "Bahamas", flag: "🇧🇸", timezone: "America/Nassau" },
  { code: "BH", name: "Bahrain", flag: "🇧🇭", timezone: "Asia/Bahrain" },
  { code: "BD", name: "Bangladesh", flag: "🇧🇩", timezone: "Asia/Dhaka" },
  { code: "BB", name: "Barbados", flag: "🇧🇧", timezone: "America/Barbados" },
  { code: "BY", name: "Belarus", flag: "🇧🇾", timezone: "Europe/Minsk" },
  { code: "BE", name: "Belgium", flag: "🇧🇪", timezone: "Europe/Brussels" },
  { code: "BZ", name: "Belize", flag: "🇧🇿", timezone: "America/Belize" },
  { code: "BJ", name: "Benin", flag: "🇧🇯", timezone: "Africa/Porto-Novo" },
  { code: "BT", name: "Bhutan", flag: "🇧🇹", timezone: "Asia/Thimphu" },
  { code: "BO", name: "Bolivia", flag: "🇧🇴", timezone: "America/La_Paz" },
  { code: "BA", name: "Bosnia and Herzegovina", flag: "🇧🇦", timezone: "Europe/Sarajevo" },
  { code: "BW", name: "Botswana", flag: "🇧🇼", timezone: "Africa/Gaborone" },
  { code: "BR", name: "Brazil", flag: "🇧🇷", timezone: "America/Sao_Paulo" },
  { code: "BN", name: "Brunei", flag: "🇧🇳", timezone: "Asia/Brunei" },
  { code: "BG", name: "Bulgaria", flag: "🇧🇬", timezone: "Europe/Sofia" },
  { code: "BF", name: "Burkina Faso", flag: "🇧🇫", timezone: "Africa/Ouagadougou" },
  { code: "BI", name: "Burundi", flag: "🇧🇮", timezone: "Africa/Bujumbura" },
  { code: "CV", name: "Cabo Verde", flag: "🇨🇻", timezone: "Atlantic/Cape_Verde" },
  { code: "KH", name: "Cambodia", flag: "🇰🇭", timezone: "Asia/Phnom_Penh" },
  { code: "CM", name: "Cameroon", flag: "🇨🇲", timezone: "Africa/Douala" },
  { code: "CA", name: "Canada", flag: "🇨🇦", timezone: "America/Toronto" },
  { code: "CF", name: "Central African Republic", flag: "🇨🇫", timezone: "Africa/Bangui" },
  { code: "TD", name: "Chad", flag: "🇹🇩", timezone: "Africa/Ndjamena" },
  { code: "CL", name: "Chile", flag: "🇨🇱", timezone: "America/Santiago" },
  { code: "CN", name: "China", flag: "🇨🇳", timezone: "Asia/Shanghai" },
  { code: "CO", name: "Colombia", flag: "🇨🇴", timezone: "America/Bogota" },
  { code: "KM", name: "Comoros", flag: "🇰🇲", timezone: "Indian/Comoro" },
  { code: "CG", name: "Congo", flag: "🇨🇬", timezone: "Africa/Brazzaville" },
  { code: "CD", name: "Congo (DRC)", flag: "🇨🇩", timezone: "Africa/Kinshasa" },
  { code: "CR", name: "Costa Rica", flag: "🇨🇷", timezone: "America/Costa_Rica" },
  { code: "CI", name: "Cote d'Ivoire", flag: "🇨🇮", timezone: "Africa/Abidjan" },
  { code: "HR", name: "Croatia", flag: "🇭🇷", timezone: "Europe/Zagreb" },
  { code: "CU", name: "Cuba", flag: "🇨🇺", timezone: "America/Havana" },
  { code: "CY", name: "Cyprus", flag: "🇨🇾", timezone: "Asia/Nicosia" },
  { code: "CZ", name: "Czech Republic", flag: "🇨🇿", timezone: "Europe/Prague" },
  { code: "DK", name: "Denmark", flag: "🇩🇰", timezone: "Europe/Copenhagen" },
  { code: "DJ", name: "Djibouti", flag: "🇩🇯", timezone: "Africa/Djibouti" },
  { code: "DM", name: "Dominica", flag: "🇩🇲", timezone: "America/Dominica" },
  { code: "DO", name: "Dominican Republic", flag: "🇩🇴", timezone: "America/Santo_Domingo" },
  { code: "EC", name: "Ecuador", flag: "🇪🇨", timezone: "America/Guayaquil" },
  { code: "EG", name: "Egypt", flag: "🇪🇬", timezone: "Africa/Cairo" },
  { code: "SV", name: "El Salvador", flag: "🇸🇻", timezone: "America/El_Salvador" },
  { code: "GQ", name: "Equatorial Guinea", flag: "🇬🇶", timezone: "Africa/Malabo" },
  { code: "ER", name: "Eritrea", flag: "🇪🇷", timezone: "Africa/Asmara" },
  { code: "EE", name: "Estonia", flag: "🇪🇪", timezone: "Europe/Tallinn" },
  { code: "SZ", name: "Eswatini", flag: "🇸🇿", timezone: "Africa/Mbabane" },
  { code: "ET", name: "Ethiopia", flag: "🇪🇹", timezone: "Africa/Addis_Ababa" },
  { code: "FJ", name: "Fiji", flag: "🇫🇯", timezone: "Pacific/Fiji" },
  { code: "FI", name: "Finland", flag: "🇫🇮", timezone: "Europe/Helsinki" },
  { code: "FR", name: "France", flag: "🇫🇷", timezone: "Europe/Paris" },
  { code: "GA", name: "Gabon", flag: "🇬🇦", timezone: "Africa/Libreville" },
  { code: "GM", name: "Gambia", flag: "🇬🇲", timezone: "Africa/Banjul" },
  { code: "GE", name: "Georgia", flag: "🇬🇪", timezone: "Asia/Tbilisi" },
  { code: "DE", name: "Germany", flag: "🇩🇪", timezone: "Europe/Berlin" },
  { code: "GH", name: "Ghana", flag: "🇬🇭", timezone: "Africa/Accra" },
  { code: "GR", name: "Greece", flag: "🇬🇷", timezone: "Europe/Athens" },
  { code: "GD", name: "Grenada", flag: "🇬🇩", timezone: "America/Grenada" },
  { code: "GT", name: "Guatemala", flag: "🇬🇹", timezone: "America/Guatemala" },
  { code: "GN", name: "Guinea", flag: "🇬🇳", timezone: "Africa/Conakry" },
  { code: "GW", name: "Guinea-Bissau", flag: "🇬🇼", timezone: "Africa/Bissau" },
  { code: "GY", name: "Guyana", flag: "🇬🇾", timezone: "America/Guyana" },
  { code: "HT", name: "Haiti", flag: "🇭🇹", timezone: "America/Port-au-Prince" },
  { code: "HN", name: "Honduras", flag: "🇭🇳", timezone: "America/Tegucigalpa" },
  { code: "HU", name: "Hungary", flag: "🇭🇺", timezone: "Europe/Budapest" },
  { code: "IS", name: "Iceland", flag: "🇮🇸", timezone: "Atlantic/Reykjavik" },
  { code: "IN", name: "India", flag: "🇮🇳", timezone: "Asia/Kolkata" },
  { code: "ID", name: "Indonesia", flag: "🇮🇩", timezone: "Asia/Jakarta" },
  { code: "IR", name: "Iran", flag: "🇮🇷", timezone: "Asia/Tehran" },
  { code: "IQ", name: "Iraq", flag: "🇮🇶", timezone: "Asia/Baghdad" },
  { code: "IE", name: "Ireland", flag: "🇮🇪", timezone: "Europe/Dublin" },
  { code: "IL", name: "Israel", flag: "🇮🇱", timezone: "Asia/Jerusalem" },
  { code: "IT", name: "Italy", flag: "🇮🇹", timezone: "Europe/Rome" },
  { code: "JM", name: "Jamaica", flag: "🇯🇲", timezone: "America/Jamaica" },
  { code: "JP", name: "Japan", flag: "🇯🇵", timezone: "Asia/Tokyo" },
  { code: "JO", name: "Jordan", flag: "🇯🇴", timezone: "Asia/Amman" },
  { code: "KZ", name: "Kazakhstan", flag: "🇰🇿", timezone: "Asia/Almaty" },
  { code: "KE", name: "Kenya", flag: "🇰🇪", timezone: "Africa/Nairobi" },
  { code: "KI", name: "Kiribati", flag: "🇰🇮", timezone: "Pacific/Tarawa" },
  { code: "KP", name: "Korea (North)", flag: "🇰🇵", timezone: "Asia/Pyongyang" },
  { code: "KR", name: "Korea (South)", flag: "🇰🇷", timezone: "Asia/Seoul" },
  { code: "KW", name: "Kuwait", flag: "🇰🇼", timezone: "Asia/Kuwait" },
  { code: "KG", name: "Kyrgyzstan", flag: "🇰🇬", timezone: "Asia/Bishkek" },
  { code: "LA", name: "Laos", flag: "🇱🇦", timezone: "Asia/Vientiane" },
  { code: "LV", name: "Latvia", flag: "🇱🇻", timezone: "Europe/Riga" },
  { code: "LB", name: "Lebanon", flag: "🇱🇧", timezone: "Asia/Beirut" },
  { code: "LS", name: "Lesotho", flag: "🇱🇸", timezone: "Africa/Maseru" },
  { code: "LR", name: "Liberia", flag: "🇱🇷", timezone: "Africa/Monrovia" },
  { code: "LY", name: "Libya", flag: "🇱🇾", timezone: "Africa/Tripoli" },
  { code: "LI", name: "Liechtenstein", flag: "🇱🇮", timezone: "Europe/Vaduz" },
  { code: "LT", name: "Lithuania", flag: "🇱🇹", timezone: "Europe/Vilnius" },
  { code: "LU", name: "Luxembourg", flag: "🇱🇺", timezone: "Europe/Luxembourg" },
  { code: "MG", name: "Madagascar", flag: "🇲🇬", timezone: "Indian/Antananarivo" },
  { code: "MW", name: "Malawi", flag: "🇲🇼", timezone: "Africa/Blantyre" },
  { code: "MY", name: "Malaysia", flag: "🇲🇾", timezone: "Asia/Kuala_Lumpur" },
  { code: "MV", name: "Maldives", flag: "🇲🇻", timezone: "Indian/Maldives" },
  { code: "ML", name: "Mali", flag: "🇲🇱", timezone: "Africa/Bamako" },
  { code: "MT", name: "Malta", flag: "🇲🇹", timezone: "Europe/Malta" },
  { code: "MH", name: "Marshall Islands", flag: "🇲🇭", timezone: "Pacific/Majuro" },
  { code: "MR", name: "Mauritania", flag: "🇲🇷", timezone: "Africa/Nouakchott" },
  { code: "MU", name: "Mauritius", flag: "🇲🇺", timezone: "Indian/Mauritius" },
  { code: "MX", name: "Mexico", flag: "🇲🇽", timezone: "America/Mexico_City" },
  { code: "FM", name: "Micronesia", flag: "🇫🇲", timezone: "Pacific/Chuuk" },
  { code: "MD", name: "Moldova", flag: "🇲🇩", timezone: "Europe/Chisinau" },
  { code: "MC", name: "Monaco", flag: "🇲🇨", timezone: "Europe/Monaco" },
  { code: "MN", name: "Mongolia", flag: "🇲🇳", timezone: "Asia/Ulaanbaatar" },
  { code: "ME", name: "Montenegro", flag: "🇲🇪", timezone: "Europe/Podgorica" },
  { code: "MA", name: "Morocco", flag: "🇲🇦", timezone: "Africa/Casablanca" },
  { code: "MZ", name: "Mozambique", flag: "🇲🇿", timezone: "Africa/Maputo" },
  { code: "MM", name: "Myanmar", flag: "🇲🇲", timezone: "Asia/Yangon" },
  { code: "NA", name: "Namibia", flag: "🇳🇦", timezone: "Africa/Windhoek" },
  { code: "NR", name: "Nauru", flag: "🇳🇷", timezone: "Pacific/Nauru" },
  { code: "NP", name: "Nepal", flag: "🇳🇵", timezone: "Asia/Kathmandu" },
  { code: "NL", name: "Netherlands", flag: "🇳🇱", timezone: "Europe/Amsterdam" },
  { code: "NZ", name: "New Zealand", flag: "🇳🇿", timezone: "Pacific/Auckland" },
  { code: "NI", name: "Nicaragua", flag: "🇳🇮", timezone: "America/Managua" },
  { code: "NE", name: "Niger", flag: "🇳🇪", timezone: "Africa/Niamey" },
  { code: "NG", name: "Nigeria", flag: "🇳🇬", timezone: "Africa/Lagos" },
  { code: "MK", name: "North Macedonia", flag: "🇲🇰", timezone: "Europe/Skopje" },
  { code: "NO", name: "Norway", flag: "🇳🇴", timezone: "Europe/Oslo" },
  { code: "OM", name: "Oman", flag: "🇴🇲", timezone: "Asia/Muscat" },
  { code: "PK", name: "Pakistan", flag: "🇵🇰", timezone: "Asia/Karachi" },
  { code: "PW", name: "Palau", flag: "🇵🇼", timezone: "Pacific/Palau" },
  { code: "PS", name: "Palestine", flag: "🇵🇸", timezone: "Asia/Hebron" },
  { code: "PA", name: "Panama", flag: "🇵🇦", timezone: "America/Panama" },
  { code: "PG", name: "Papua New Guinea", flag: "🇵🇬", timezone: "Pacific/Port_Moresby" },
  { code: "PY", name: "Paraguay", flag: "🇵🇾", timezone: "America/Asuncion" },
  { code: "PE", name: "Peru", flag: "🇵🇪", timezone: "America/Lima" },
  { code: "PH", name: "Philippines", flag: "🇵🇭", timezone: "Asia/Manila" },
  { code: "PL", name: "Poland", flag: "🇵🇱", timezone: "Europe/Warsaw" },
  { code: "PT", name: "Portugal", flag: "🇵🇹", timezone: "Europe/Lisbon" },
  { code: "QA", name: "Qatar", flag: "🇶🇦", timezone: "Asia/Qatar" },
  { code: "RO", name: "Romania", flag: "🇷🇴", timezone: "Europe/Bucharest" },
  { code: "RU", name: "Russia", flag: "🇷🇺", timezone: "Europe/Moscow" },
  { code: "RW", name: "Rwanda", flag: "🇷🇼", timezone: "Africa/Kigali" },
  { code: "KN", name: "Saint Kitts and Nevis", flag: "🇰🇳", timezone: "America/St_Kitts" },
  { code: "LC", name: "Saint Lucia", flag: "🇱🇨", timezone: "America/St_Lucia" },
  { code: "VC", name: "Saint Vincent and the Grenadines", flag: "🇻🇨", timezone: "America/St_Vincent" },
  { code: "WS", name: "Samoa", flag: "🇼🇸", timezone: "Pacific/Apia" },
  { code: "SM", name: "San Marino", flag: "🇸🇲", timezone: "Europe/San_Marino" },
  { code: "ST", name: "Sao Tome and Principe", flag: "🇸🇹", timezone: "Africa/Sao_Tom" },
  { code: "SA", name: "Saudi Arabia", flag: "🇸🇦", timezone: "Asia/Riyadh" },
  { code: "SN", name: "Senegal", flag: "🇸🇳", timezone: "Africa/Dakar" },
  { code: "RS", name: "Serbia", flag: "🇷🇸", timezone: "Europe/Belgrade" },
  { code: "SC", name: "Seychelles", flag: "🇸🇨", timezone: "Indian/Mahe" },
  { code: "SL", name: "Sierra Leone", flag: "🇸🇱", timezone: "Africa/Freetown" },
  { code: "SG", name: "Singapore", flag: "🇸🇬", timezone: "Asia/Singapore" },
  { code: "SK", name: "Slovakia", flag: "🇸🇰", timezone: "Europe/Bratislava" },
  { code: "SI", name: "Slovenia", flag: "🇸🇮", timezone: "Europe/Ljubljana" },
  { code: "SB", name: "Solomon Islands", flag: "🇸🇧", timezone: "Pacific/Guadalcanal" },
  { code: "SO", name: "Somalia", flag: "🇸🇴", timezone: "Africa/Mogadishu" },
  { code: "ZA", name: "South Africa", flag: "🇿🇦", timezone: "Africa/Johannesburg" },
  { code: "SS", name: "South Sudan", flag: "🇸🇸", timezone: "Africa/Juba" },
  { code: "ES", name: "Spain", flag: "🇪🇸", timezone: "Europe/Madrid" },
  { code: "LK", name: "Sri Lanka", flag: "🇱🇰", timezone: "Asia/Colombo" },
  { code: "SD", name: "Sudan", flag: "🇸🇩", timezone: "Africa/Khartoum" },
  { code: "SR", name: "Suriname", flag: "🇸🇷", timezone: "America/Paramaribo" },
  { code: "SE", name: "Sweden", flag: "🇸🇪", timezone: "Europe/Stockholm" },
  { code: "CH", name: "Switzerland", flag: "🇨🇭", timezone: "Europe/Zurich" },
  { code: "SY", name: "Syria", flag: "🇸🇾", timezone: "Asia/Damascus" },
  { code: "TW", name: "Taiwan", flag: "🇹🇼", timezone: "Asia/Taipei" },
  { code: "TJ", name: "Tajikistan", flag: "🇹🇯", timezone: "Asia/Dushanbe" },
  { code: "TZ", name: "Tanzania", flag: "🇹🇿", timezone: "Africa/Dar_es_Salaam" },
  { code: "TH", name: "Thailand", flag: "🇹🇭", timezone: "Asia/Bangkok" },
  { code: "TL", name: "Timor-Leste", flag: "🇹🇱", timezone: "Asia/Dili" },
  { code: "TG", name: "Togo", flag: "🇹🇬", timezone: "Africa/Lome" },
  { code: "TO", name: "Tonga", flag: "🇹🇴", timezone: "Pacific/Tongatapu" },
  { code: "TT", name: "Trinidad and Tobago", flag: "🇹🇹", timezone: "America/Port_of_Spain" },
  { code: "TN", name: "Tunisia", flag: "🇹🇳", timezone: "Africa/Tunis" },
  { code: "TR", name: "Turkey", flag: "🇹🇷", timezone: "Europe/Istanbul" },
  { code: "TM", name: "Turkmenistan", flag: "🇹🇲", timezone: "Asia/Ashgabat" },
  { code: "TV", name: "Tuvalu", flag: "🇹🇻", timezone: "Pacific/Funafuti" },
  { code: "UG", name: "Uganda", flag: "🇺🇬", timezone: "Africa/Kampala" },
  { code: "UA", name: "Ukraine", flag: "🇺🇦", timezone: "Europe/Kyiv" },
  { code: "AE", name: "United Arab Emirates", flag: "🇦🇪", timezone: "Asia/Dubai" },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧", timezone: "Europe/London" },
  { code: "US", name: "United States", flag: "🇺🇸", timezone: "America/New_York" },
  { code: "UY", name: "Uruguay", flag: "🇺🇾", timezone: "America/Montevideo" },
  { code: "UZ", name: "Uzbekistan", flag: "🇺🇿", timezone: "Asia/Tashkent" },
  { code: "VU", name: "Vanuatu", flag: "🇻🇺", timezone: "Pacific/Efate" },
  { code: "VA", name: "Vatican City", flag: "🇻🇦", timezone: "Europe/Vatican" },
  { code: "VE", name: "Venezuela", flag: "🇻🇪", timezone: "America/Caracas" },
  { code: "VN", name: "Vietnam", flag: "🇻🇳", timezone: "Asia/Ho_Chi_Minh" },
  { code: "YE", name: "Yemen", flag: "🇾🇪", timezone: "Asia/Aden" },
  { code: "ZM", name: "Zambia", flag: "🇿🇲", timezone: "Africa/Lusaka" },
  { code: "ZW", name: "Zimbabwe", flag: "🇿🇼", timezone: "Africa/Harare" }
];

// Weekdays for availability settings
export const WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

// Available hours for booking
export const AVAILABLE_HOURS = [
  "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"
];

// Native Timezone Helper: format a given Date object in a target timezone
export function formatInTimezone(date: Date, timezone: string, formatStyle: 'short' | 'full' | 'time' = 'short'): string {
  try {
    const options: Intl.DateTimeFormatOptions = {};
    if (formatStyle === 'time') {
      options.hour = '2-digit';
      options.minute = '2-digit';
      options.hour12 = false;
    } else if (formatStyle === 'short') {
      options.weekday = 'short';
      options.month = 'short';
      options.day = 'numeric';
      options.hour = '2-digit';
      options.minute = '2-digit';
      options.hour12 = false;
    } else {
      options.weekday = 'long';
      options.month = 'long';
      options.day = 'numeric';
      options.hour = '2-digit';
      options.minute = '2-digit';
      options.hour12 = false;
    }
    options.timeZone = timezone;
    options.timeZoneName = 'short';

    return new Intl.DateTimeFormat('en-US', options).format(date);
  } catch (e) {
    return date.toLocaleString();
  }
}

// Convert a specific slot (on a specific date and time) from teacher's timezone into a standard Date object
export function getUtcDateFromSlot(dateStr: string, timeStr: string, timezone: string): Date {
  // Construct a date string in format YYYY-MM-DDTHH:MM:00
  const combined = `${dateStr}T${timeStr}:00`;
  
  // To parse this relative to a specific timezone natively:
  // We can format a baseline and find the offset, then shift
  const systemDate = new Date(combined); // Treated as system local time or UTC depending on platform
  
  // A safe native parsing mechanism utilizing offset computation:
  try {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      year: 'numeric', month: 'numeric', day: 'numeric',
      hour: 'numeric', minute: 'numeric', second: 'numeric',
      hour12: false
    });
    
    // Find the offset by formatting a dummy UTC date
    const utcDate = new Date(Date.UTC(systemDate.getFullYear(), systemDate.getMonth(), systemDate.getDate(), systemDate.getHours(), systemDate.getMinutes()));
    const parts = formatter.formatToParts(utcDate);
    const getPart = (type: string) => parseInt(parts.find(p => p.type === type)?.value || '0', 10);
    
    // Get formatted representation parts
    const year = getPart('year');
    const month = getPart('month');
    const day = getPart('day');
    const hour = getPart('hour') % 24;
    const minute = getPart('minute');
    
    const formattedLocal = new Date(Date.UTC(year, month - 1, day, hour, minute));
    const offsetMs = utcDate.getTime() - formattedLocal.getTime();
    
    // Target UTC timestamp is local systemDate timestamp + offset diff
    return new Date(systemDate.getTime() + offsetMs);
  } catch (e) {
    return systemDate;
  }
}

// Get display times in both student and teacher timezones for a lesson
export function getDualTimeDetails(
  dateStr: string, // "2026-06-28"
  timeStr: string, // "14:00"
  teacherTz: string,
  studentTz: string
): { studentTime: string; teacherTime: string; utcTime: string } {
  const utcDate = getUtcDateFromSlot(dateStr, timeStr, teacherTz);
  return {
    studentTime: formatInTimezone(utcDate, studentTz, 'short'),
    teacherTime: formatInTimezone(utcDate, teacherTz, 'short'),
    utcTime: utcDate.toISOString()
  };
}

// Initial mock reviews
const INITIAL_REVIEWS: Record<string, Review[]> = {
  "t1": [
    { id: "r1", reviewerName: "Amara Okoro", rating: 5, comment: "Dr. Evelyn is fantastic. She explained complex linear algebra concepts using simple, visual methods.", date: "2026-06-15" },
    { id: "r2", reviewerName: "Liam Johnson", rating: 5, comment: "Very patient and structured. I got an A on my midterm thanks to her lessons!", date: "2026-06-20" }
  ],
  "t2": [
    { id: "r3", reviewerName: "Sofia Rossi", rating: 5, comment: "I learned more Rust with Marcus in 2 hours than in 2 weeks of online tutorials. High recommendation!", date: "2026-06-18" },
    { id: "r4", reviewerName: "Chen Wei", rating: 4, comment: "Great code-along session. Very knowledgeable about asynchronous backend structures.", date: "2026-06-22" }
  ],
  "t3": [
    { id: "r5", reviewerName: "Lucas Dupont", rating: 5, comment: "A brilliant medical educator. Helped me prepare for my anatomy exams. Highly professional.", date: "2026-06-10" }
  ],
  "t4": [
    { id: "r6", reviewerName: "Elena Petrova", rating: 5, comment: "Her physics diagrams are incredible. She breaks down quantum mechanics into digestible steps.", date: "2026-06-14" }
  ],
  "t5": [
    { id: "r7", reviewerName: "Taro Tanaka", rating: 5, comment: "Excellent conversational teacher. Friendly, energetic, and provides comprehensive feedback.", date: "2026-06-21" }
  ],
  "t6": [
    { id: "r8", reviewerName: "Zara Patel", rating: 5, comment: "Clear explanation of microeconomic models. Dynamic graphs really helped me visualize supply and demand shift mechanics.", date: "2026-06-23" }
  ]
};

// Initial list of mock teachers
export const INITIAL_TEACHERS: User[] = [
  {
    id: "t1",
    name: "Dr. Evelyn Vance",
    email: "evelyn.vance@klerno.edu",
    role: "teacher",
    country: "United Kingdom",
    countryCode: "GB",
    timezone: "Europe/London",
    preferredSubjects: ["Mathematics", "Engineering"],
    bio: "PhD in Applied Mathematics from Oxford. Over 10 years of experience tutoring calculus, linear algebra, and structural mechanics to university and high school students. I focus on conceptual understanding and real-world engineering applications.",
    hourlyRate: 45,
    qualifications: "oxford_phd_mathematics.pdf (Verified)",
    rating: 5.0,
    reviews: INITIAL_REVIEWS["t1"],
    availability: [
      { dayOfWeek: "Monday", time: "10:00" },
      { dayOfWeek: "Monday", time: "14:00" },
      { dayOfWeek: "Wednesday", time: "10:00" },
      { dayOfWeek: "Wednesday", time: "16:00" },
      { dayOfWeek: "Friday", time: "11:00" },
      { dayOfWeek: "Friday", time: "15:00" }
    ],
    stripeExpressStatus: "active",
    languages: ["English", "French"],
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200&h=200"
  },
  {
    id: "t2",
    name: "Marcus Thorne",
    email: "marcus.thorne@klerno.dev",
    role: "teacher",
    country: "Germany",
    countryCode: "DE",
    timezone: "Europe/Berlin",
    preferredSubjects: ["IT & Coding", "Engineering"],
    bio: "Senior Software Architect and open-source contributor. I specialize in teaching systems programming (C++/Rust), backend web technologies (Go/Node.js), and database systems. Classes are highly interactive and feature-centric.",
    hourlyRate: 50,
    qualifications: "msc_computer_science_tum.pdf (Verified)",
    rating: 4.8,
    reviews: INITIAL_REVIEWS["t2"],
    availability: [
      { dayOfWeek: "Tuesday", time: "09:00" },
      { dayOfWeek: "Tuesday", time: "14:00" },
      { dayOfWeek: "Thursday", time: "09:00" },
      { dayOfWeek: "Thursday", time: "18:00" },
      { dayOfWeek: "Saturday", time: "10:00" }
    ],
    stripeExpressStatus: "active",
    languages: ["English", "German"],
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200&h=200"
  },
  {
    id: "t3",
    name: "Dr. Aris Thorne",
    email: "aris.thorne@klerno.edu",
    role: "teacher",
    country: "Greece",
    countryCode: "FR", // mapped to FR default timezone for ease
    timezone: "Europe/Paris",
    preferredSubjects: ["Medicine", "Biology"],
    bio: "Cardiology Fellow and Medical Educator. Passionate about helping medical students master human anatomy, physiology, pathology, and USMLE preparation through visual memory mapping and interactive clinical case scenarios.",
    hourlyRate: 60,
    qualifications: "md_qualification_athens.pdf (Verified)",
    rating: 5.0,
    reviews: INITIAL_REVIEWS["t3"],
    availability: [
      { dayOfWeek: "Wednesday", time: "15:00" },
      { dayOfWeek: "Wednesday", time: "19:00" },
      { dayOfWeek: "Thursday", time: "15:00" },
      { dayOfWeek: "Friday", time: "15:00" },
      { dayOfWeek: "Saturday", time: "09:00" }
    ],
    stripeExpressStatus: "active",
    languages: ["English", "Greek"],
    avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200&h=200"
  },
  {
    id: "t4",
    name: "Prof. Clara Vance",
    email: "clara.vance@klerno.edu",
    role: "teacher",
    country: "United States",
    countryCode: "US",
    timezone: "America/New_York",
    preferredSubjects: ["Physics", "Chemistry"],
    bio: "Physics Professor with 15 years in academic research. I make mechanics, thermodynamics, electromagnetism, and organic chemistry intuitive using customized simulation screens, practical thought-experiments, and step-by-step math breakdowns.",
    hourlyRate: 48,
    qualifications: "mit_postdoc_physics.pdf (Verified)",
    rating: 5.0,
    reviews: INITIAL_REVIEWS["t4"],
    availability: [
      { dayOfWeek: "Monday", time: "09:00" },
      { dayOfWeek: "Tuesday", time: "11:00" },
      { dayOfWeek: "Thursday", time: "11:00" },
      { dayOfWeek: "Friday", time: "09:00" },
      { dayOfWeek: "Sunday", time: "14:00" }
    ],
    stripeExpressStatus: "active",
    languages: ["English", "Spanish"],
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200"
  },
  {
    id: "t5",
    name: "Yuki Tanaka",
    email: "yuki.tanaka@klerno.com",
    role: "teacher",
    country: "Japan",
    countryCode: "JP",
    timezone: "Asia/Tokyo",
    preferredSubjects: ["Languages", "History"],
    bio: "Certified Japanese language instructor and East Asian history expert. Focusing on natural conversation, vocabulary build-ups, and structural JLPT prep, combined with rich cultural and historical context notes.",
    hourlyRate: 30,
    qualifications: "japanese_teaching_license.jpg (Verified)",
    rating: 5.0,
    reviews: INITIAL_REVIEWS["t5"],
    availability: [
      { dayOfWeek: "Monday", time: "08:00" },
      { dayOfWeek: "Wednesday", time: "08:00" },
      { dayOfWeek: "Wednesday", time: "20:00" },
      { dayOfWeek: "Friday", time: "08:00" },
      { dayOfWeek: "Saturday", time: "20:00" }
    ],
    stripeExpressStatus: "active",
    languages: ["Japanese", "English"],
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200&h=200"
  },
  {
    id: "t6",
    name: "Dr. Vikram Patel",
    email: "vikram.patel@klerno.com",
    role: "teacher",
    country: "India",
    countryCode: "IN",
    timezone: "Asia/Kolkata",
    preferredSubjects: ["Economics", "Mathematics"],
    bio: "Ph.D. in Econometrics. Expert tutor in microeconomics, macroeconomics, game theory, and statistical modeling. Helping university students write high-quality empirical theses and master complicated mathematical modeling.",
    hourlyRate: 35,
    qualifications: "phd_economics_jnu.pdf (Verified)",
    rating: 5.0,
    reviews: INITIAL_REVIEWS["t6"],
    availability: [
      { dayOfWeek: "Tuesday", time: "10:00" },
      { dayOfWeek: "Tuesday", time: "15:00" },
      { dayOfWeek: "Thursday", time: "10:00" },
      { dayOfWeek: "Thursday", time: "15:00" },
      { dayOfWeek: "Saturday", time: "14:00" }
    ],
    stripeExpressStatus: "active",
    languages: ["English", "Hindi"],
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200&h=200"
  }
];

// Initial mock lessons
export const INITIAL_LESSONS: Lesson[] = [
  {
    id: "l1",
    teacherId: "t1",
    studentId: "student_demo",
    teacherName: "Dr. Evelyn Vance",
    studentName: "Demo Student",
    subject: "Mathematics",
    date: "2026-06-27",
    timeSlot: "14:00",
    hourlyRate: 45,
    price: 45,
    platformFee: 4.5,
    teacherEarnings: 40.5,
    status: "confirmed",
    teacherTimezone: "Europe/London",
    studentTimezone: "America/New_York",
    studentLocalTime: "Sat, Jun 27, 09:00 EDT",
    teacherLocalTime: "Sat, Jun 27, 14:00 BST",
    paymentCaptured: false
  },
  {
    id: "l2",
    teacherId: "t2",
    studentId: "student_demo",
    teacherName: "Marcus Thorne",
    studentName: "Demo Student",
    subject: "IT & Coding",
    date: "2026-06-23",
    timeSlot: "14:00",
    hourlyRate: 50,
    price: 50,
    platformFee: 5.0,
    teacherEarnings: 45.0,
    status: "completed",
    teacherTimezone: "Europe/Berlin",
    studentTimezone: "America/New_York",
    studentLocalTime: "Tue, Jun 23, 08:00 EDT",
    teacherLocalTime: "Tue, Jun 23, 14:00 CEST",
    paymentCaptured: true
  }
];

// Map of initial mock communities
export const INITIAL_COMMUNITIES: Community[] = SUBJECTS.map(subject => {
  const slug = subject.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-');
  
  // Find teachers for this subject
  const relevantTeacherIds = INITIAL_TEACHERS
    .filter(t => t.preferredSubjects.includes(subject))
    .map(t => t.id);

  return {
    slug,
    name: `${subject} Club`,
    description: `Global community of students and world-class teachers discussing topics in ${subject}. Join the study sessions and get answers to your homework questions.`,
    iconName: getIconForSubject(subject),
    memberCount: Math.floor(Math.random() * 800) + 120,
    pinnedTeacherIds: relevantTeacherIds,
    discussionFeed: [
      {
        id: `p1-${slug}`,
        authorName: "Alex Mercer",
        authorRole: "student",
        content: `What is the best way to develop an intuitive feel for ${subject} concepts without just memorizing formulas? Is there a resource or visualization tools you recommend?`,
        date: "2026-06-22",
        likes: 12,
        replies: [
          {
            id: `pr1-${slug}`,
            authorName: relevantTeacherIds.length > 0 ? INITIAL_TEACHERS.find(t => t.id === relevantTeacherIds[0])?.name || "Teacher" : "Expert Tutor",
            authorRole: "teacher",
            content: "Excellent question! I always tell my students to sketch dynamic system layouts and try to explain the mechanism to a friend using natural metaphors first. Feel free to book a quick trial to see how we map this!",
            date: "2026-06-23"
          }
        ]
      },
      {
        id: `p2-${slug}`,
        authorName: "Sarah Jenkins",
        authorRole: "student",
        content: `Studying for the upcoming standardized test in ${subject}. Anyone want to form a weekly peer-study timezone-synchronized group? I'm in America/New_York timezone!`,
        date: "2026-06-24",
        likes: 8,
        replies: []
      }
    ],
    qaList: [
      {
        id: `q1-${slug}`,
        question: `How do I master the core fundamentals of ${subject} as a beginner?`,
        askerName: "Jordan K.",
        date: "2026-06-21",
        answers: [
          {
            id: `a1-${slug}`,
            answererName: "Dr. Evelyn Vance",
            answererRole: "teacher",
            content: "Start with structured problem sets and don't skip the graphical visualizers. Master one fundamental model at a time before adding complexity. In our tutoring workspace, we use tailored visual maps.",
            date: "2026-06-22"
          }
        ]
      }
    ]
  };
});

function getIconForSubject(subject: string): string {
  switch (subject) {
    case "Biology": return "Dna";
    case "Chemistry": return "FlaskConical";
    case "Mathematics": return "Binary";
    case "Engineering": return "Cpu";
    case "IT & Coding": return "CodeXml";
    case "Physics": return "Atom";
    case "Economics": return "TrendingUp";
    case "Languages": return "Languages";
    case "History": return "BookOpen";
    case "Medicine": return "HeartPulse";
    default: return "GraduationCap";
  }
}

// Local Storage state management
export function loadState() {
  const defaultState = {
    users: INITIAL_TEACHERS,
    lessons: INITIAL_LESSONS,
    communities: INITIAL_COMMUNITIES,
    currentUser: {
      id: "student_demo",
      name: "Demo Student",
      email: "demo@klerno.com",
      role: "student" as const,
      country: "United States",
      countryCode: "US",
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "America/New_York",
      preferredSubjects: ["Mathematics", "IT & Coding"],
      joinedCommunities: ["mathematics", "it-coding"],
      savedTeachers: ["t1"]
    } as User | null
  };

  try {
    const users = localStorage.getItem('klerno_users');
    const lessons = localStorage.getItem('klerno_lessons');
    const communities = localStorage.getItem('klerno_communities');
    const currentUser = localStorage.getItem('klerno_current_user');

    return {
      users: users ? JSON.parse(users) : defaultState.users,
      lessons: lessons ? JSON.parse(lessons) : defaultState.lessons,
      communities: communities ? JSON.parse(communities) : defaultState.communities,
      currentUser: currentUser ? JSON.parse(currentUser) : defaultState.currentUser
    };
  } catch (e) {
    return defaultState;
  }
}

export function saveState(state: { users: User[]; lessons: Lesson[]; communities: Community[]; currentUser: User | null }) {
  try {
    localStorage.setItem('klerno_users', JSON.stringify(state.users));
    localStorage.setItem('klerno_lessons', JSON.stringify(state.lessons));
    localStorage.setItem('klerno_communities', JSON.stringify(state.communities));
    localStorage.setItem('klerno_current_user', JSON.stringify(state.currentUser));
  } catch (e) {
    console.error("Failed to save state to localStorage", e);
  }
}
