package grouptrivia.services;

import grouptrivia.doas.AnswerDao;
import grouptrivia.doas.LobbyDao;
import grouptrivia.doas.PlayerDao;
import grouptrivia.doas.QuestionDao;
import grouptrivia.exceptions.LobbyDoesNotExistException;
import grouptrivia.models.Answer;
import grouptrivia.models.Lobby;
import grouptrivia.models.Player;
import grouptrivia.models.Question;
import grouptrivia.models.requests.AnswerQuestionRequest;
import grouptrivia.models.requests.NewQuestionRequest;
import grouptrivia.utilities.LobbyCodeUtility;
import grouptrivia.validators.LobbyValidator;
import grouptrivia.validators.QuestionValidator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
public class GroupTriviaService {

    private static final Logger logger = LoggerFactory.getLogger(GroupTriviaService.class);

    private final SimpMessagingTemplate messagingTemplate;
    private final PlayerDao playerDao;
    private final LobbyDao lobbyDao;
    private final QuestionDao questionDao;
    private final AnswerDao answerDao;

    public GroupTriviaService(SimpMessagingTemplate messagingTemplate, PlayerDao playerDao,
                              LobbyDao lobbyDao, QuestionDao questionDao, AnswerDao answerDao) {
        this.messagingTemplate = messagingTemplate;
        this.playerDao = playerDao;
        this.lobbyDao = lobbyDao;
        this.questionDao = questionDao;
        this.answerDao = answerDao;
    }

    public Lobby createNewLobby(String startingPlayersDisplayName) {
        LobbyValidator.validatePlayerName(startingPlayersDisplayName);

        String lobbyCode = LobbyCodeUtility.generateLobbyCode();
        lobbyDao.createLobby(lobbyCode);
        logger.info("{} is attempting to create new lobby with code: {}", startingPlayersDisplayName, lobbyCode);
        int userId = playerDao.insertPlayer(startingPlayersDisplayName, lobbyCode);

        Player player = new Player();
        player.setDisplayName(startingPlayersDisplayName);
        player.setLobbyCode(lobbyCode);
        player.setUserId(userId);

        Lobby lobby = new Lobby();
        lobby.setPlayerList(Collections.singletonList(player));
        lobby.setCode(lobbyCode);
        lobby.setQuestionList(Collections.emptyList());

        return lobby;
    }

    public int joinLobby(String lobbyCode, String displayName) {
        logger.info("{} is attempting to join the game of {}", displayName, lobbyCode);
        LobbyValidator.validatePlayerName(displayName);

        int newId = playerDao.insertPlayer(displayName, lobbyCode);
        Player playerToAdd = new Player();
        playerToAdd.setDisplayName(displayName);
        playerToAdd.setLobbyCode(lobbyCode);
        playerToAdd.setUserId(newId);
        messagingTemplate.convertAndSend("/topic/" + lobbyCode + "/player-joined", playerToAdd);
        return newId;
    }

    public Lobby findLobbyByCode(String lobbyCode) {
        Lobby lobby = new Lobby();

        //Validate lobby is real
        if(!lobbyDao.doesLobbyExist(lobbyCode))
            throw new LobbyDoesNotExistException("Lobby does not exist", lobbyCode);

        List<Player> playerList = playerDao.findPlayersByLobbyCode(lobbyCode);
        List<Question> questionList = questionDao.findAllQuestionsInLobby(lobbyCode);
        questionList.forEach(question -> populateAnswersToQuestion(question, playerList.size()));

        lobby.setCode(lobbyCode);
        lobby.setPlayerList(playerList);
        lobby.setQuestionList(questionList);

        return lobby;
    }

    public Lobby createNewQuestion(NewQuestionRequest newQuestionRequest) {

        QuestionValidator.validateQuestion(newQuestionRequest.getText());

        logger.info("Creating new question [code: {}, text: {}]", newQuestionRequest.getLobbyCode(), newQuestionRequest.getText());
        int id = questionDao.createNewQuestion(newQuestionRequest.getLobbyCode(), newQuestionRequest.getText(), newQuestionRequest.getPlayerIdWhoCreated());

        Question question = new Question();
        question.setId(id);
        question.setQuestionText(newQuestionRequest.getText());
        question.setLobbyCode(newQuestionRequest.getLobbyCode());
        question.setAnswersGivenList(Collections.emptyList());
        question.setPlayerIdCreated(newQuestionRequest.getPlayerIdWhoCreated());

        messagingTemplate.convertAndSend("/topic/" + newQuestionRequest.getLobbyCode() + "/question-added", question);

        return findLobbyByCode(newQuestionRequest.getLobbyCode());
    }

    private void populateAnswersToQuestion(Question question, int size) {
        List<Answer> answers = answerDao.findAnswersByQuestionId(question.getId());
        question.setAnswersGivenList(answers);
        question.setShowAnswers(answers.size() == size);
    }

    public Lobby answerQuestion(AnswerQuestionRequest answerQuestionRequest) {
        logger.info("User: {} is attempting to answer a question: {}", answerQuestionRequest.getUserId(), answerQuestionRequest.getAnswerText());
        int answerId = answerDao.insertAnswer(answerQuestionRequest.getQuestionId(), answerQuestionRequest.getAnswerText(), answerQuestionRequest.getUserId());

        Answer newAnswer = new Answer();
        newAnswer.setAnswerText(answerQuestionRequest.getAnswerText());
        newAnswer.setId(answerId);
        newAnswer.setQuestionId(answerQuestionRequest.getQuestionId());
        newAnswer.setUserId(answerQuestionRequest.getUserId());

        messagingTemplate.convertAndSend("/topic/" + answerQuestionRequest.getLobbyCode() + "/question-answered", newAnswer);

        if(lobbyDao.areAllPlayersAnswered(answerQuestionRequest.getLobbyCode(), answerQuestionRequest.getQuestionId()))
            messagingTemplate.convertAndSend("/topic/" + answerQuestionRequest.getLobbyCode() + "/show-answer", answerQuestionRequest.getQuestionId());


        return findLobbyByCode(answerQuestionRequest.getLobbyCode());
    }

    public void deleteQuestion(int questionId, String lobbyCode) {
        logger.info("Deleting question with ID: {} from lobby: {}", questionId, lobbyCode);
        answerDao.deleteAnswersToQuestion(questionId);
        questionDao.deleteQuestionByIdAndLobbyCode(questionId, lobbyCode);
        messagingTemplate.convertAndSend("/topic/" + lobbyCode + "/question-deleted", questionId);
    }


    public void updatePlayerLastActivity(String lobbyCode, String userId) {
        playerDao.updatePlayerLastActivity(lobbyCode, userId);
    }

    public void findUsersInactiveForSecondsAndRemove() {
        List<Player> playersToRemove = playerDao.findUsersInactiveForSeconds(10);
        playersToRemove.forEach(player -> deletePlayerAndCleanup(player.getLobbyCode(), String.valueOf(player.getUserId())));
    }

    public void deletePlayerAndCleanup(String lobbyCode, String userId) {
        logger.info("Deleting player with user ID: {} from lobby: {}", userId, lobbyCode);
        List<Question> userQuestions = questionDao.findQuestionsByUserIdAndLobbyCode(userId, lobbyCode);
        for (Question question : userQuestions) {
            deleteQuestion(question.getId(), lobbyCode);
        }
        playerDao.deletePlayerByIdAndLobbyCode(userId, lobbyCode);
        messagingTemplate.convertAndSend("/topic/" + lobbyCode + "/player-deleted", userId);
    }


}