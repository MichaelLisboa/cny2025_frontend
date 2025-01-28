export const truncateWish = (text, maxLength = 128) =>
  text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
