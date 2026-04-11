# New Component Plan

## Selected Component

Hierarchical Data & Nested Routes

### Implementation Plan

## API Endpoints

### Deck Endpoints

Create new deck:  
**POST** `/api/v1/user/:userId/decks`  

List user's decks:  
**GET** `/api/v1/user/:userId/decks`  

Get deck + nested flashcards:  
**GET** `/api/v1/user/:userId/decks/:deckId`    

Update deck:  
**PUT** `/api/v1/user/:userId/decks/:deckId`  

Delete deck:  
**DELETE** `/api/v1/user/:userId/decks/:deckId`  

### Flashcard Endpoints

Create flashcard in deck:  
**POST** `/api/v1/user/:userId/decks/:deckId/flashcards`  

List flashcards in deck:  
**GET** `/api/v1/user/:userId/decks/:deckId/flashcards`  

Get single flashcard:  
**GET** `/api/v1/user/:userId/decks/:deckId/flashcards/:cardId`  

Update flashcard:  
**PUT** `/api/v1/user/:userId/decks/:deckId/flashcards/:cardId`  

Delete flashcard:  
**DELETE** `/api/v1/user/:userId/decks/:deckId/flashcards/:cardId`  

## Express Nested Router Architecture

### Parameter Inheritance

By default, path parameters from parent routes aren't accessible in sub-routes. To enable parameter inheritance, the mergeParams: true option must be passed to the router constructor.

`const deckRouter = express.Router({ mergeParams: true })`

### Router Mounting

Mount the flashcardRouter router on the deck path to attach flashcard endpoints to deck endpoints. This creates nested routes while keeping different endpoint categories organized.

`deckRouter.use('/:deckId/flashcards', flashcardRouter)`

### Firebase Transactions for Nested Data

To access flashcard documents, access the main resource's subcollection, using `get()` and `set()` functions to retrieve and post data.  

`const doc = await db.collection('decks').doc(deckId) .collection('flashcards').doc(cardId).get()`

## Sources

- https://expressjs.com/en/guide/routing.html
- https://firebase.google.com/docs/firestore/data-model#node.js_3
