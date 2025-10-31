// utils/avatarUtils.ts

export const getInitials = (name: string): string => {
  return name
    .split(" ")
    .map((word: string) => word[0])
    .join("");
};

export const getRandomColor = (): string => {
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
};
