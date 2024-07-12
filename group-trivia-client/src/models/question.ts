import Answer from "./answer";

export interface Question {
    id: number;
    questionText: string;
    answersGivenList: Answer[];
    showAnswers: boolean;
    playerIdCreated: number;
}