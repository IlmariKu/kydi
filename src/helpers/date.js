export function convertDateToString(date, noday = false, include_year = false) {
  const days = [
    "Sunnuntai",
    "Maanantai",
    "Tiistai",
    "Keskiviikko",
    "Torstai",
    "Perjantai",
    "Lauantai",
  ];
  return `${noday ? "" : `${days[date.getDay()]} `}${date.getDate()}.${
    date.getMonth() + 1
  }.${include_year ? date.getFullYear() : ""}`;
}
