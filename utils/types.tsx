import { UUID } from "crypto";

export interface Question {
  correct: string;
  incorrect: Array<string>;
  question: string;
}

export interface UserData {
  email: string;
  ready: boolean;
  score: number;
  userid: UUID;
}

export interface ProfileStatsData {
  id: UUID;
  profile_name: string;
  current_daily_streak: number;
  longest_daily_streak: number;
  latest_daily: string;
  total_correct_dailys: number;
  total_daily_plays: number;
  play_together_wins: number;
  play_solo_correct: number;
  play_solo_total: number;
  quizzes_made: number;
}
