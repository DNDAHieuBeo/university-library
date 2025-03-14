interface Book {
  id: bumber;
  title: string;
  author: string;
  genre: string;
  rating: number;
  total_copies: number;
  available_copies: bumber;
  description: string;
  color: string;
  cover: string;
  video: string;
  summary: string;
  isLoanedBook?: boolean;
}
interface AuthCredentials {
  fullName: string;
  email: string;
  password: string;
  universityId: number;
  universityCard: string;
}