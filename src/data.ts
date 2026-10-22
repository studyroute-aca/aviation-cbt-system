import type { Exam, Question } from './types'

type QuestionSeed = [string, string, string, string, string[], string, string]
export type MonthlyExam = { exam: Exam; questions: Question[] }

const createQuestions = (exam: Exam, seeds: QuestionSeed[]): Question[] => seeds.map(([id, subject, category, questionText, choices, correctChoiceId, explanation]) => ({
  id: `Q-${exam.period}-${id}`,
  examId: exam.id,
  subject,
  category,
  questionText,
  choices: choices.map((text, i) => ({ id: String.fromCharCode(65 + i), text })),
  correctChoiceId,
  explanation,
  difficulty: 2,
  points: exam.pointsPerQuestion,
  createdYearMonth: exam.period,
  version: 1,
  sourceType: 'original',
  isAiGenerated: false,
  reviewStatus: 'approved',
  status: 'published'
}))

const octoberExam: Exam = { id: 'EXAM-2026-10', name: '航空大学校 CBTテスト模試 2026年10月号', period: '2026-10', subject: '総合基礎テスト', questionCount: 10, durationMinutes: 15, pointsPerQuestion: 10, passingScore: 70 }
const octoberQuestionSeeds: QuestionSeed[] = [
  ['001','数学基礎','一次方程式','3x + 6 = 21 のとき、xはいくつですか？',['3','5','7','9'],'B','両辺から6を引くと3x=15となり、x=5です。'],
  ['002','数学基礎','割合','120の25%はいくつですか？',['20','25','30','40'],'C','120×0.25=30です。'],
  ['003','数学基礎','図形','底辺8、高さ5の三角形の面積はいくつですか？',['13','20','40','80'],'B','三角形の面積は底辺×高さ÷2なので20です。'],
  ['004','物理基礎','運動','時速72kmは秒速何mですか？',['2','12','20','72'],'C','72÷3.6=20m/sです。'],
  ['005','物理基礎','力','質量2kgの物体に3Nの力を加えたときの加速度は？',['1.5m/s²','5m/s²','6m/s²','9.8m/s²'],'A','運動方程式F=maより、a=3÷2=1.5m/s²です。'],
  ['006','物理基礎','波','波の速さが300m/s、周波数が100Hzの波長は？',['0.3m','3m','30m','300m'],'B','波長は速さ÷周波数で、300÷100=3mです。'],
  ['007','英語基礎','語彙','“departure” の意味として正しいものは？',['到着','出発','遅延','予約'],'B','departureは「出発」を意味します。'],
  ['008','英語基礎','文法','She ___ to school every day. に入る語は？',['go','goes','going','gone'],'B','主語が三人称単数なのでgoesです。'],
  ['009','航空・一般常識','航空用語','航空機が滑走路から離れることを表す英語は？',['landing','taxiing','takeoff','cruising'],'C','takeoffは離陸を意味します。'],
  ['010','航空・一般常識','安全','航空機内で安全確認を行う主な目的は？',['燃費向上','緊急時の被害軽減','速度向上','機内食の提供'],'B','安全確認は緊急時に乗員乗客を守るために行います。']
]

export const monthlyExams: MonthlyExam[] = [
  { exam: octoberExam, questions: createQuestions(octoberExam, octoberQuestionSeeds) }
]

// Add the next monthly exam to the end of monthlyExams. The last entry is the active exam.
const activeExam = monthlyExams[monthlyExams.length - 1]
export const exam = activeExam.exam
export const questions = activeExam.questions
