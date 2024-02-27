import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatDistance } from "date-fns";
import { enGB, uk } from "date-fns/locale";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
// created by chatgpt
export function isBase64Image(imageData) {
  const base64Regex = /^data:image\/(png|jpe?g|gif|webp);base64,/;
  return base64Regex.test(imageData);
}

// created by chatgpt
export function formatDateString(dateString) {
  const locales = { enGB, uk };
  const localeId = "enGB"; // Уточнение типа

  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  const baseDate = new Date();
  // const date = new Date(dateString);
  // const formattedDate = date.toLocaleDateString(undefined, options);

  // const time = date.toLocaleTimeString([], {
  //   hour: "numeric",
  //   minute: "2-digit",
  // });

  // return `${time} - ${formattedDate}`;
  return formatDistance(new Date(dateString), baseDate, {
    addSuffix: true,
    locale: locales[localeId],
  });
}

// created by chatgpt
export function formatPostCount(count) {
  if (count === 0) {
    return "No Posts";
  } else {
    const postCount = count.toString().padStart(2, "0");
    const postWord = count === 1 ? "Post" : "Posts";
    return `${postCount} ${postWord}`;
  }
}
