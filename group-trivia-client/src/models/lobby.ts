import { Player } from "./player";
import { Question } from "./question";

export default interface Lobby {
    code: string;
    creationDatetime: string;
    playerList: Player[];
    questionList: Question[];
}