import { createClient } from "@/utils/supabase/client";
import { ProfileStatsData, Question, UserData } from "./types";
import { User } from "@supabase/supabase-js";
import { UUID } from "crypto";
var CryptoJS = require("crypto-js");

export function shuffleArray(array: Array<any>) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}

export function encryptQuestions(questions: Array<Question>) {
  var encrypted = CryptoJS.AES.encrypt(
    JSON.stringify(questions),
    process.env.key,
  ).toString();

  return encrypted;
}

export function decryptQuestions(encrypted: any) {
  var decrypted = CryptoJS.AES.decrypt(encrypted, process.env.key);
  return JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
}

export function decryptCorrect(encrypted: any) {
  var decrypted = CryptoJS.AES.decrypt(encrypted, process.env.key).toString(
    CryptoJS.enc.Utf8,
  );
  return decrypted;
}

export function encryptIncorrect(incorrect: any) {
  let encIncorrect : any[] = [];
  incorrect.map((option: any) => {
    encIncorrect.push(CryptoJS.AES.encrypt(option, process.env.key).toString());
  });
  return encIncorrect;
}

export function decryptIncorrect(encIncorrect: any) {
  let decIncorrect: any[] = [];
  encIncorrect.map((encOption: any) => {
    decIncorrect.push(
      CryptoJS.AES.decrypt(encOption, process.env.key).toString(CryptoJS.enc.Utf8),
    );
  });
  return decIncorrect;
}

export async function addQuiz(
  quizTitle: string,
  quizDescription: string,
  questions: Array<Question>,
) {
  const supabase = createClient();
  const quiz = encryptQuestions(questions);
  const user = await getUser();

  await supabase.from("quizzes").insert([
    {
      title: quizTitle,
      description: quizDescription,
      quiz: quiz,
      user_id: user?.id,
    },
  ]);
  if (user) {
    await updateProfileQuizzesMade(user);
  }
}

export async function editQuiz(
  id: string,
  quizTitle: string,
  quizDescription: string,
  questions: Array<Question>,
) {
  const supabase = createClient();
  const quiz = encryptQuestions(questions);

  const { error } = await supabase
    .from("quizzes")
    .update({
      title: quizTitle,
      description: quizDescription,
      quiz: quiz,
    })
    .eq("id", id);

  if (error) {
    console.log("error updating ");
  }
}

export async function getQuiz(id: string) {
  const supabase = createClient();
  let questions = await supabase
    .from("quizzes")
    .select("*")
    .eq("id", id)
    .then((response) => (response?.data ? response.data[0] : {}));

  return questions;
}

export async function getQuizzes(step: number, limit: number) {
  const supabase = createClient();
  const { data: quizzes } = await supabase
    .from("quizzes")
    .select("*")
    .range(step, limit);
  return quizzes;
}

export async function getQuestions(id: number) {
  const supabase = createClient();
  let questions = await supabase
    .from("quizzes")
    .select("*")
    .eq("id", id)
    .then((response) =>
      response?.data ? decryptQuestions(response?.data[0].quiz) : {},
    );
  return questions;
}

export async function createSession(quizid: number) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let question_data = await getQuestions(quizid);
  question_data = encryptQuestions(question_data);

  const users = [
    {
      userid: user?.id,
      email: user?.email,
      score: 0,
      ready: false,
    },
  ];

  const { data, error } = await supabase
    .from("play_together")
    .insert([
      {
        quiz: quizid,
        users: users,
        state: "NOT_STARTED",
        owner: user?.id,
        questions_data: question_data,
      },
    ])
    .select();
  if (error) {
    console.log(error);
  }
  return data ? data[0].id : [];
}

export async function getSession(id: string) {
  const supabase = createClient();
  let session = await supabase
    .from("play_together")
    .select("*")
    .eq("id", id)
    .then((response) => (response?.data ? response.data[0] : {}));
  return session;
}

export async function sessionUpdateState(
  id: string,
  nextQuestion: number,
  nextState: string,
  updatedUsersData: Array<UserData>,
) {
  const supabase = createClient();
  const { error } = await supabase
    .from("play_together")
    .update({
      state: nextState,
      current_question: nextQuestion,
      users: updatedUsersData,
      guesses_per_round: 0,
    })
    .eq("id", id);

  if (error) {
    console.log("error updating play_together session: ", error);
  }
}

export async function updateSessionsUserData(
  id: string,
  updatedUsersData: Array<UserData>,
) {
  const supabase = createClient();
  const { error } = await supabase
    .from("play_together")
    .update({
      users: updatedUsersData,
    })
    .eq("id", id);

  if (error) {
    console.log("error updating play_together session user data: ", error);
  }
}

export async function deleteSession(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("play_together").delete().eq("id", id);
  if (error) {
    console.log("error updating ", error);
  }
}

export function formatDate(date: string | Date) {
  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
}

export function getYesterday() {
  let yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return formatDate(yesterday);
}

export function getToday() {
  let today: string = new Date().toDateString();
  return formatDate(today);
}

export async function getDailyDate() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("daily")
    .select("*")
    .order("date", { ascending: false })
    .limit(1);

  if (error) {
    console.log("error getting daily date ", error);
  }

  if (data) {
    let d = new Date(data[0].date);
    d.setUTCDate(d.getUTCDate() + 1);
    return d.toISOString().substr(0, 10);
  }
  return null;
}

export async function addDaily(question: string, correct: string, incorrect: Array<string>) {
  const supabase = createClient();
  const date = await getDailyDate();
  var encCorrect = CryptoJS.AES.encrypt(
    correct,
    process.env.key,
  ).toString();

  var encIncorrect = encryptIncorrect(incorrect);
  const { error } = await supabase.from("daily").insert([
    {
      date: date,
      question: question,
      correct: encCorrect,
      incorrect: encIncorrect,
    },
  ]);
  if (error) {
    console.log(error);
  }
}

export async function getDaily() {
  const supabase = createClient();
  let today: string = getToday();

  let daily = await supabase
    .from("daily")
    .select("*")
    .eq("date", today)
    .then((response) => (response?.data ? response.data[0] : {}));

  console.log(daily);

  return daily;
}

export async function getUser() {
  const supabase = createClient();

  const { data, error } = await supabase.auth.getSession();
  if (data !== null && data !== undefined && data.session !== null) {
    return data?.session?.user;
  }
  return null;
}

export async function getProfile(id: UUID | string ) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("profile_stats")
    .select("*")
    .eq("id", id);

  if (error) {
    console.log(error);
  }
  if (data) return data[0];
  return null;
}

export async function updateProfileName(updatedName: string) {
  const supabase = createClient();
  const user = await getUser();
  const { error } = await supabase
    .from("profile_stats")
    .update({
      profile_name: updatedName,
    })
    .eq("id", user?.id);

  if (error) {
    console.log(error);
  }
}

export async function updateProfileDailyCorrect(
  user: User,
  profile: ProfileStatsData,
  yesterday: string,
  today: string,
) {
  const supabase = createClient();

  let updatedDailyStreak = 1;
  let updatedLongestStreak = profile.longest_daily_streak;

  if (profile.current_daily_streak > 0 && profile.latest_daily === yesterday) {
    updatedDailyStreak = profile.current_daily_streak + 1;
  }

  if (updatedDailyStreak > updatedLongestStreak) {
    updatedLongestStreak = updatedDailyStreak;
  }

  const { error } = await supabase
    .from("profile_stats")
    .update({
      latest_daily: today,
      longest_daily_streak: updatedLongestStreak,
      current_daily_streak: updatedDailyStreak,
      total_correct_dailys: profile.total_correct_dailys + 1,
      total_daily_plays: profile.total_daily_plays + 1,
    })
    .eq("id", user?.id);

  if (error) {
    console.log(error);
  }
}

export async function updateProfileDailyIncorrect(
  user: User,
  profile: ProfileStatsData,
  today: string,
) {
  const supabase = createClient();
  const { error } = await supabase
    .from("profile_stats")
    .update({
      latest_daily: today,
      current_daily_streak: 0,
      total_daily_plays: profile.total_daily_plays + 1,
    })
    .eq("id", user?.id);

  if (error) {
    console.log(error);
  }
}

export async function updateProfileQuizzesMade(user: User) {
  const supabase = createClient();
  let profile = await getProfile(user.id);
  console.log("HERE");

  const { error } = await supabase
    .from("profile_stats")
    .update({
      quizzes_made: profile.quizzes_made + 1,
    })
    .eq("id", user?.id);

  if (error) {
    console.log(error);
  }
}

export async function updateProfileSolo(
  correct: number,
  total: number,
  user: User,
  profile: ProfileStatsData,
) {
  const supabase = createClient();
  const { error } = await supabase
    .from("profile_stats")
    .update({
      play_solo_correct: profile.play_solo_correct + correct,
      play_solo_total: profile.play_solo_total + total,
    })
    .eq("id", user?.id);

  if (error) {
    console.log(error);
  }
}


export async function updateProfileTogetherWins(id: string) {
  const supabase = createClient();

  const profile = await getProfile(id);

  const { error } = await supabase
    .from("profile_stats")
    .update({
      play_together_wins: profile.play_together_wins + 1,
    })
    .eq("id", id);

    if (error) {
      console.log(error);
    }
}
