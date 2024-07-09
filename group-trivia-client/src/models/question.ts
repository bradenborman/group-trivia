import Answer from "./answer";

export interface Question {
    id: number;
    questionText: string;
    usersAnswered: string[];
    answersGivenList: Answer[];
    showAnswers: boolean;
}