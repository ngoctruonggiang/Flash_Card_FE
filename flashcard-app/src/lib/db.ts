import fs from "fs/promises";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");

export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  role: string;
  createdAt: string;
  lastLoginAt: string | null;
}

export interface Deck {
  id: number;
  userId: number;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface Card {
  id: number;
  deckId: number;
  front: string;
  back: string;
  tags: string;
  createdAt: string;
  updatedAt: string;
  nextReview: string | null;
  interval: number;
  easeFactor: number;
  repetitions: number;
}

export interface Review {
  id: number;
  cardId: number;
  quality: string;
  reviewedAt: string;
}

const ensureDataDir = async () => {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
};

const readJson = async <T>(filename: string, defaultValue: T): Promise<T> => {
  await ensureDataDir();
  const filePath = path.join(DATA_DIR, filename);
  try {
    const data = await fs.readFile(filePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    // If file doesn't exist, write default value
    await fs.writeFile(filePath, JSON.stringify(defaultValue, null, 2));
    return defaultValue;
  }
};

const writeJson = async <T>(filename: string, data: T): Promise<void> => {
  await ensureDataDir();
  const filePath = path.join(DATA_DIR, filename);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
};

export const db = {
  users: {
    findAll: () => readJson<User[]>("users.json", []),
    save: (users: User[]) => writeJson("users.json", users),
  },
  decks: {
    findAll: () => readJson<Deck[]>("decks.json", []),
    save: (decks: Deck[]) => writeJson("decks.json", decks),
  },
  cards: {
    findAll: () => readJson<Card[]>("cards.json", []),
    save: (cards: Card[]) => writeJson("cards.json", cards),
  },
  reviews: {
    findAll: () => readJson<Review[]>("reviews.json", []),
    save: (reviews: Review[]) => writeJson("reviews.json", reviews),
  },
};
