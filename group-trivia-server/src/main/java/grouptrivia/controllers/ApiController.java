package grouptrivia.controllers;

import grouptrivia.models.Lobby;
import grouptrivia.models.requests.AnswerQuestionRequest;
import grouptrivia.models.requests.CreateNewLobbyRequest;
import grouptrivia.models.requests.JoinLobbyRequest;
import grouptrivia.models.requests.NewQuestionRequest;
import grouptrivia.services.GroupTriviaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class ApiController {

    private final GroupTriviaService groupTriviaService;

    public ApiController(GroupTriviaService groupTriviaService) {
        this.groupTriviaService = groupTriviaService;
    }

    @PostMapping("/lobby")
    public ResponseEntity<Lobby> createNewLobby(@RequestBody CreateNewLobbyRequest createNewLobbyRequest) {
        return ResponseEntity.ok(groupTriviaService.createNewLobby(createNewLobbyRequest.getPlayerName()));
    }

    @PutMapping("/lobby")
    public ResponseEntity<Integer> joinLobby(@RequestBody JoinLobbyRequest joinLobbyRequest) {
        return ResponseEntity.ok(groupTriviaService.joinLobby(joinLobbyRequest.getLobbyCode(), joinLobbyRequest.getDisplayName()));
    }

    @GetMapping("/lobby/{lobbyCode}")
    public ResponseEntity<Lobby> findLobby(@PathVariable String lobbyCode) {
        return ResponseEntity.ok(groupTriviaService.findLobbyByCode(lobbyCode));
    }

    @PostMapping("/question")
    public ResponseEntity<Lobby> createNewQuestion(@RequestBody NewQuestionRequest newQuestionRequest) {
        return ResponseEntity.ok(groupTriviaService.createNewQuestion(newQuestionRequest));
    }

    @PostMapping("/answer")
    public ResponseEntity<Lobby> answerQuestion(@RequestBody AnswerQuestionRequest answerQuestionRequest){
        return ResponseEntity.ok(groupTriviaService.answerQuestion(answerQuestionRequest));
    }

    @DeleteMapping("/question/{questionId}")
    public ResponseEntity<Void> deleteQuestion(@PathVariable int questionId, @RequestParam String lobbyCode) {
        groupTriviaService.deleteQuestion(questionId, lobbyCode);
        return ResponseEntity.ok().build();
    }

}