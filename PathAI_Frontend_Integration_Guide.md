 
PathAI Frontend Integration Guide 
Hey Team, 
 
This document is the definitive guide for integrating the PathAI backend into our frontend 
application. 
 
The backend is built on a real-time, event-driven architecture using Socket.IO. This is not a 
traditional REST API. This architecture allows the AI to be proactive, to "think" in the 
background without blocking the user, and to stream responses for a fluid, human-like 
experience. 
 
Understanding this event-driven flow is key to building a great UI. 
1. Setup & Connection 
First, you'll need the Socket.IO client library in your project. 
Establishing a Connection 
The connection is authenticated using a JWT token. The client MUST provide this token 
upon connection. 
 
import { io } from "socket.io-client"; 
 
const SERVER_URL = "http://127.0.0.1:8000"; // Or the production URL 
 
const authToken = "your_user_jwt_token_here"; // The JWT for the 
logged-in user 
 
const socket = io(SERVER_URL, { 
 
    // The `auth` object is used for authentication 
 
    auth: { 
 
        token: authToken 
 
    }, 
 
    // This path is mandatory and must match the server configuration 
 
    path: "/socket.io"  
 
}); 
Core Connection Events 
You should listen for these basic events to manage the UI's connection state. 
 
socket.on('connect', () => { 
 
    console.log("✅ Successfully connected to PathAI!"); 
 
    // e.g., Set a "connected" status in the UI 
 
}); 
 
socket.on('connect_error', (err) => { 
 
    console.error("❗ Connection Failed:", err.message); 
 
    // e.g., Display a "Connection Failed" error to the user 
 
}); 
 
socket.on('disconnect', () => { 
 
    console.log("🔌 Disconnected from PathAI."); 
 
    // e.g., Show a "Disconnected" status 
 
}); 
2. The Chat Lifecycle 
A. Joining a Chat Room 
After a successful connection, the client must join a room specific to the conversation. This 
ensures all events are correctly scoped. 
 
const chatId = "a_unique_identifier_for_the_conversation"; 
 
// Do this immediately after the 'connect' event fires 
 
socket.emit('join_room', { 
 
    chat_id: chatId 
 
}); 
B. Sending a User Message 
When the user sends a message, you emit a user_message event. 
 
Event: user_message Payload (ChatMessage): 
 
socket.emit('user_message', { 
 
    content: "Teach me about Python decorators", 
 
    conversation_id: chatId, 
 
    category: 'chat',  
 
    agentName: 'PathAI', // Optional: for different personas 
 
    attachments: [] // For future file uploads 
 
}); 
 
UI Action: When this is emitted, you should immediately disable the input field and show 
some kind of "AI is responding..." indicator (like a typing animation). 
C. Receiving the AI's Response 
The AI's response is streamed in chunks. This makes the UI feel fast and responsive. 
 
Event: pathai_chunk Payload: { "chunk": "a piece of the AI's text 
response" } 
 
UI Action: 
 
1. On the first pathai_chunk for a new message, create a new message bubble for 
the AI. 
2. For every pathai_chunk received, append the chunk text to the content of that 
message bubble. 
3. It's recommended to re-render the content as Markdown with each chunk to handle 
things like code blocks progressively. 
D. Knowing When the AI is Done 
At the end of every "speech act," the server sends a generation_complete event. This is 
your signal to finalize the message and allow the user to speak again. 
 
Event: generation_complete Payload: None 
 
UI Action: 
 
1. Finalize the last AI message bubble (e.g., stop any blinking cursors). 
2. Re-enable the user's input field. 
3. Handling Advanced Agentic States 
This is what makes PathAI special. The UI must be able to reflect the AI's internal state. 
A. The "Thinking" Flow 
The AI can perform long-running tasks in the background. The UI must show this without 
blocking the user. 
 
Event: thinking_start Payload: None 
 
UI Action: 
 
● Display a persistent "PathAI is thinking..." status indicator (e.g., a status bar, a 
glowing icon). 
● Crucially, the user's chat input should remain enabled. They should be able to 
send messages while the AI is thinking. 
 
Event: thinking_end Payload: None 
 
UI Action: 
 
● Hide the "Thinking..." indicator. 
● It's a good practice to show a "typing..." indicator immediately after this, as you know 
the AI is about to proactively start speaking. 
B. The "Quiz Artifact" Flow 
When the AI generates a quiz, it sends a special event containing all the necessary data. 
 
Event: quiz_artifact_generated Payload: 
 
{ 
 
    "intro_text": "Of course! I've prepared a quiz for you...", 
 
    "quiz_id": "unique-quiz-identifier-123", 
 
    "topic": "Python Decorators", 
 
    "quiz_data": { 
 
        "questions": [ 
 
            { 
 
                "question": "The question text.", 
 
                "options": ["Option A", "Option B", "Option C", "Option 
D"], 
 
                "correct_answer": "The string of the correct option.", 
 
                "explanation": "A brief explanation of why the answer is 
correct." 
 
            }, 
 
            // ... more questions 
 
        ] 
 
    } 
 
} 
 
UI Action: 
 
1. Create a new AI message bubble and display the intro_text. 
2. Append a "Start Quiz" button to this same message bubble. This is the "artifact." 
3. Store the quiz_data and quiz_id in your component's state, associated with the 
button. 
4. When the user clicks the "Start Quiz" button, use the stored data to render the 
interactive quiz modal. 
4. The Interactive Quiz Lifecycle 
A. Submitting the Quiz 
When the user submits the quiz form, you emit a submit_quiz event. 
 
Event: submit_quiz Payload: 
 
socket.emit('submit_quiz', { 
 
    conversation_id: chatId, 
 
    quiz_id: "the_id_from_the_artifact", 
 
    user_answers: [ 
 
        { "question": "What is 2+2?", "answer": "4" }, 
 
        { "question": "What is the capital of France?", "answer": 
"London" } 
 
        // etc. 
 
    ] 
 
}); 
 
UI Action: 
 
● Show a "Grading your answers..." message inside the modal. 
● After a short delay, close the quiz modal. 
B. Receiving Feedback 
After submission, the backend will trigger a new AI turn. The feedback will arrive as a 
standard conversational response via pathai_chunk and generation_complete 
events. No special frontend handler is needed. The AI's response will contain the 
formatted Markdown table and explanations. 
5. User Control & Error Handling 
● stop_generation event: If the user needs to interrupt the AI, emit this event. The 
backend will stop the stream and send a generation_complete. 
 
socket.emit('stop_generation', { chat_id: chatId }); 
 
● error event: Listen for this event to handle any server-side problems gracefully. 
Payload: { "message": "A user-friendly error message." } 
6. REST API for History 
To load the list of chats and the content of old conversations, use standard fetch requests 
to these REST endpoints. 

Remember to include the JWT token in the Authorization header for these 
requests. 
A. List All Chats 
● Endpoint: GET /api/v1/chats 
● Response (ChatListResponse): 
 
{ 
 
    "chats": [ 
 
        { 
 
            "chat_id": "session-123", 
 
            "title": "Learning about Python", 
 
            "last_updated": "2025-08-01T12:00:00Z" 
 
        }, 
 
        // ... more chats 
 
    ] 
 
} 
 
● Use Case: To populate the chat history sidebar when the app loads. 
B. Get a Specific Chat's History 
● Endpoint: GET /api/v1/chats/{chat_id} 
● Response (ConversationHistoryResponse): A full dump of the conversation 
file, which you can then iterate through to render the messages. 
 
{ 
 
    "metadata": { /* ... */ }, 
 
    "conversations": [ /* ... array of turn objects ... */ ] 
 
} 
 
● Use Case: To load and display a past conversation when a user clicks on it in the 
sidebar. 
7. Handling Interactive Artifacts: The Quiz Flow 
PathAI can generate interactive "artifacts" like quizzes. These are not just text; they are 
functional components within the chat. Here’s how to handle the full lifecycle. 
A. Receiving a New Quiz Artifact 
When the AI decides to generate a quiz, the backend will send a single, unified 
quiz_artifact_generated event. This is your cue to create the interactive message. 
 
Event: quiz_artifact_generated Payload: 
 
{ 
 
    "intro_text": "Of course! I've prepared a quiz for you on that 
topic.", 
 
    "quiz_id": "unique-quiz-identifier-123", 
 
    "topic": "Python Decorators", 
 
    "quiz_data": { /* ... full quiz JSON ... */ } 
 
} 
 
UI Action: 
 
● Store the Quiz Data: The most important step is to store the quiz_data in a 
client-side state variable, indexed by the quiz_id. 
 
// Example state management 
 
let quizzesData = {};  
 
socket.on('quiz_artifact_generated', (data) => { 
 
    // Store the full quiz object 
 
    quizzesData[data.quiz_id] = data;  
 
     
 
    // Now, render the message with the button 
 
    // ... 
 
}); 
 
● Render the Message: Create a new AI message bubble in the UI that displays the 
intro_text. 
● Create the Artifact Button: Inside that same message bubble, create a "Start Quiz" 
button. This button must have a data-quiz-id attribute containing the quiz_id 
from the payload. 
 
<button class="start-quiz-btn" 
data-quiz-id="unique-quiz-identifier-123"> 
 
    🚀 Start Quiz on Python Decorators 
 
</button> 
 
● Attach Event Listener: The "Start Quiz" button's onclick handler should call your 
function to open the quiz modal, passing the quiz_id from its data-quiz-id 
attribute. 
B. Re-Rendering Quiz Artifacts from Loaded History 
This is the critical part to ensure old chats are fully functional. When you fetch a chat's 
history from GET /api/v1/chats/{chat_id}, you need to look for quiz events as you 
render the conversation. 
 
Logic for renderFullHistory function: 
 
function renderFullHistory(conversations) { 
 
    // Before rendering, clear any old quiz data for this chat 
 
    quizzesData = {};  
 
    conversations.forEach(turn => { 
 
        // ... render user message ... 
 
        let aiMessageText = ""; 
 
        let quizArtifactData = null; 
 
        // Iterate through the AI's events for this turn 
 
        turn.turn_events.forEach(event => { 
 
            if (event.type === 'pathai_segment') { 
 
                aiMessageText += event.chunk; 
 
            } 
 
             
 
            // **THIS IS THE KEY LOGIC** 
 
            // If you find a quiz event, extract its data 
 
            if (event.type === 'quiz_generated') { 
 
                quizArtifactData = { 
 
                    quiz_id: event.quiz_id, 
 
                    quiz_data: event.quiz_data, 
 
                    topic: "Quiz" // You can get this from the 
user_prompt of a previous turn if needed 
 
                }; 
 
            } 
 
        }); 
 
        if (aiMessageText) { 
 
            // If a quiz was found in this turn, add the button HTML to 
the message text 
 
            if (quizArtifactData) { 
 
                // **CRITICAL STEP:** Store the quiz data from history, 
just like with a new quiz 
 
                quizzesData[quizArtifactData.quiz_id] = 
quizArtifactData; 
 
                // Append the button HTML directly to the message 
content 
 
                aiMessageText += ` 
 
                    <button class="start-quiz-btn" 
data-quiz-id="${quizArtifactData.quiz_id}"> 
 
                        🚀 Start Quiz 
 
                    </button> 
 
                `; 
 
            } 
 
             
 
            // Render the full message bubble. Your markdown renderer 
should handle 
 
            // the button HTML and your event listeners will make it 
interactive. 
 
            addMessage(aiMessageText, 'ai'); 
 
        } 
 
    }); 
 
} 
 
C. Launching the Quiz Modal 
 
Whether the "Start Quiz" button was just created or loaded from history, its function is the 
same. 
 
 
 
// This function is called by the button's onclick event 
 
function startQuiz(quizId) { 
 
    // 1. Retrieve the quiz data from your local store using the ID 
 
    const quiz = quizzesData[quizId]; 
 
    if (!quiz) { 
 
        console.error("Quiz data not found for ID:", quizId); 
 
        // Show an error to the user 
 
        return; 
 
    } 
 
    // 2. Now you have the quiz data, you can build and display 
 
    //    your interactive quiz modal. 
 
    renderQuizModal(quiz);  
 
} 
 
By following this pattern, you ensure that there is no difference in functionality between a 
quiz that was just generated and one that is being loaded from a conversation a week old. 
The quizzesData object acts as the single source of truth for all interactive artifacts in the 
current chat session. 
 
 
This guide covers the complete communication protocol. Let me know if you have any 
questions! 
 
Best, Fahad 
 
