window.onload = async function() {
  const res = await fetch("https://words.dev-apis.com/word-of-the-day")
  const resObj = await res.json()
  todaysWord = await resObj.word.toUpperCase()
  todaysWordArray = Array.from(todaysWord)

  initializeGameFromSession()
}


const ANSWER_LENGTH = 5;
let inputIsLetter;
let currentLetter = 0;
let enteredWord = ["", "", "", "", ""];
let todaysWord = ""
let todaysWordArray = [];
let lettersGuessedCorrectly = [];
let closeLettersGuesses = [];
let incorrectLetters = [];
let userAttempts = 0;
let gameWon = false;
let fiveLetterWords = [];
let CurrentKeySelected;
let flag = true;

//Cookie Variables

let wordsGuessed = [];
let closeLettersCookies = closeLettersGuesses;
let lettersGuessedCookies = lettersGuessedCorrectly;

function clearAllCookies() {
  // Get all cookies
  const cookies = document.cookie.split(";");

  // Loop through each cookie and clear it
  for (let cookie of cookies) {
    const eqPos = cookie.indexOf("=");
    const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;

    // Set each cookie's expiration date to a past date
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
  }

  lettersGuessedCorrectly = [];
  closeLettersGuesses = [];
  incorrectLetters = [];
  wordsGuessed = [];
  userAttempts = 0;
}


function getSessionCookie(name) {
  const cookies = document.cookie.split(';');
  for (let i = 0; i < cookies.length; i++) {
    const [key, value] = cookies[i].trim().split('=');
    if (key === name) {
      return JSON.parse(value);
    }
  }
  return null;
}

function setSessionCookie(name, value) {
  // Clean up any duplicate words (e.g., case insensitive)
  if (name === "WordsGuessed") {
    value = [...new Set(value.map(word => word.toUpperCase()))];
  }
  
  document.cookie = `${name}=${JSON.stringify(value)}; path=/;`;
}


function initializeGameFromSession() {
  const CorrectLetters = getSessionCookie("CorrectLettersCOOKIE")
  const CloseLetters = getSessionCookie("CloseLettersCOOKIE")
  const IncorrectLetters = getSessionCookie("IncorrectLettersCOOKIE")
  const CurrentAttempt = getSessionCookie("CurrentWord")
  let WordsGuessed = getSessionCookie("WordsGuessed")

  // Remove any duplicate entries (case-insensitive)
  WordsGuessed = [...new Set(WordsGuessed.map(word => word.toUpperCase()))];
  
  lettersGuessedCorrectly = [...new Set([...lettersGuessedCorrectly, ...CorrectLetters])];
  closeLettersGuesses = [...new Set([...closeLettersGuesses, ...CloseLetters])];
  incorrectLetters = [...new Set([...incorrectLetters, ...IncorrectLetters])];
  wordsGuessed = WordsGuessed;  // Now it's cleaned up

  CorrectLetters.forEach(element => {
    element = element.toLowerCase()
    document.querySelector(`.${element}`).classList.add("correct")
  });

  CloseLetters.forEach(element => {
    element = element.toLowerCase()
    document.querySelector(`.${element}`).classList.add("close")
  });

  IncorrectLetters.forEach(element => {
    element = element.toLowerCase()
    document.querySelector(`.${element}`).classList.add("wrong")
  });


  for (let i = 0; i < wordsGuessed.length; i++) {

    let currentArray = WordsGuessed[i].split("")
    currentArray = currentArray.map(letter => letter.toUpperCase())
    todaysWordArray = todaysWordArray.map(letter => letter.toUpperCase())
    const map = MakeMap(todaysWordArray)

    for (let x = 0; x < ANSWER_LENGTH; x++) {
        document.getElementById(x).innerText = currentArray[x]
      
        if (todaysWordArray[x] === currentArray[x]) {
          document.getElementById(x).classList.add("correct")
          map[currentArray[x]]--;
        }
        if (todaysWordArray[x] !== currentArray[x] && todaysWordArray.includes(currentArray[x]) && map[currentArray[x]] > 0) {
          document.getElementById(x).classList.add("close")
          map[currentArray[x]]--;
        }
        if (todaysWordArray[x] !== currentArray[x] && !todaysWordArray.includes(currentArray[x])) {
          document.getElementById(x).classList.add("wrong")
        }
        if (todaysWordArray[x] !== currentArray[x] && (map[currentArray[x]] === 0)) {
          document.getElementById(x).classList.add("wrong")
        }
  
        document.getElementById(x).id = "NULL"
    }
    
  }

  userAttempts = CurrentAttempt;
} 
  



// Commonly used variables are stored at the top of the document so the program doesnt have to find each element every time you want it
let restartButton = document.querySelector(".restart-game");
const keyBoardButtons = document.querySelectorAll(".kletter");
const guessAttemptText = document.querySelector(".congratsh2");
const errorMessage = document.querySelector(".error-message");
const wordReveal = document.querySelector(".word-reveal");
const userWin = document.querySelector(".congrats");

document.addEventListener('touchstart', function(e) {
  if (e.touches.length > 1) {
      e.preventDefault();
  }
}, { passive: false });

document.addEventListener('dblclick', function(e) {
  e.preventDefault();
})

// When the keyboard is clicked, this is what handles the key presses
keyBoardButtons.forEach(button => {
  button.addEventListener('click', function() {
    let keyboardInputIsLetter = isLetter(button.textContent)

    if (keyboardInputIsLetter === true && currentLetter != ANSWER_LENGTH){
      enteredWord[currentLetter] = button.textContent
      document.getElementById(currentLetter).innerText = button.textContent
      currentLetter += 1
   } else if (button.textContent === "Enter" && currentLetter === ANSWER_LENGTH && CurrentKeySelected != "Enter") {
      compareWords(enteredWord)
   } else if (button.textContent === "Back") {
    if (currentLetter === 0) {
    } else {
      currentLetter--
    }
    enteredWord[currentLetter] = ""
    document.getElementById(currentLetter).innerHTML = ""
   }

   CurrentKeySelected = ""

  })
})

// When the page is loaded it will recieve the word of the day to stop delay on the first word
// Checks if the keyboards entry is letter and returns a boolean
function isLetter(letter) {
  return /^[a-zA-Z]$/.test(letter)
}


function gameWin() {
  userWin.classList.add("visible")

  enteredWord = ["", "", "", "", ""]
  todaysWordArray = ""
  lettersGuessedCorrectly = []
  incorrectLetters = []
  userAttempts = 0

  const letters = document.querySelectorAll(".letter")

  for (let i = 0; i < letters.length; i++) {
    letters[i].id = "NULL";
  }
  
  clearAllCookies() 
}

//YOU LOSE FUNCTION
function gameLose() {

  wordReveal.classList.add("visible")
  wordReveal.innerText = todaysWord
}




//COMPARING WORDS
async function compareWords(usersWord) {
  let enteredWordString = usersWord.join('');
  let res = await fetch("https://words.dev-apis.com/validate-word", {
    method: "POST",
    body: JSON.stringify({ word: enteredWordString })
  });

  let resObj = await res.json();
  let validWord = resObj.validWord;

  if (validWord === false) {
    errorMessage.innerText = "Invalid Word";
    errorMessage.classList.add("visible");

    setTimeout(() => {
      errorMessage.classList.remove("visible");
    }, 2000);
    return;
  } else {
    wordsGuessed.push(enteredWord.join(''))
    setSessionCookie("WordsGuessed", wordsGuessed);
    userAttempts++;
  }

  todaysWordArray = todaysWordArray.map(letter => letter.toUpperCase());
  usersWord = usersWord.map(letter => letter.toUpperCase());

  const map = MakeMap(todaysWordArray);

  // Handle Correct letters
  for (let i = 0; i < ANSWER_LENGTH; i++) {
    if (todaysWordArray[i] === usersWord[i]) {
      document.getElementById(i).classList.add("correct");
      map[usersWord[i]]--; // Decrement only after correctly marking
      lettersGuessedCorrectly.push(usersWord[i]);
    }
  }

  // Handle Close letters
  for (let i = 0; i < ANSWER_LENGTH; i++) {
    if (todaysWordArray[i] !== usersWord[i] && todaysWordArray.includes(usersWord[i]) && map[usersWord[i]] > 0) {
      document.getElementById(i).classList.add("close");
      map[usersWord[i]]--;
      closeLettersGuesses.push(usersWord[i].toUpperCase());
    }
  }

  // Handle Incorrect letters
  for (let i = 0; i < ANSWER_LENGTH; i++) {
    if (todaysWordArray[i] !== usersWord[i] && !todaysWordArray.includes(usersWord[i])) {
      document.getElementById(i).classList.add("wrong");
      incorrectLetters.push(usersWord[i]);
    }
  }

  // Check if the word is fully guessed
  let correctLetter = 0;
  for (let i = 0; i < ANSWER_LENGTH; i++) {
    if (usersWord[i] === todaysWordArray[i]) {
      correctLetter++;
    }
    if (correctLetter === 5) {
      gameWon = true;
      gameWin();
    }
  }

  // After finishing the word comparison, reset the ids to prevent unwanted interactions
  for (let i = 0; i < ANSWER_LENGTH; i++) {
    document.getElementById(i).id = "NULL";
  }

  // Check if the user has lost after 6 attempts
  if (userAttempts === 6 && gameWon === false) {
    gameLose();
  }


  setSessionCookie("CloseLettersCOOKIE", [...new Set(closeLettersGuesses)]);
  setSessionCookie("CorrectLettersCOOKIE", [...new Set(lettersGuessedCorrectly)]);
  setSessionCookie("IncorrectLettersCOOKIE", [...new Set(incorrectLetters)]);
  setSessionCookie("CurrentWord", userAttempts);


  // Add any extra logic for guessed letters color updates (if needed)
  if (lettersGuessedCorrectly.length != 0) {
    lettersGuessedCorrectly.forEach(element => {
      element = element.toLowerCase();
      document.querySelector(`.${element}`).classList.add("correct");
    });
  }

  if (closeLettersGuesses.length > 0) {
    closeLettersGuesses.forEach(element => {
      if (!lettersGuessedCorrectly.includes(element)) {
        element = element.toLowerCase();
        document.querySelector(`.${element}`).classList.add("close");
      }
    });
  }

  // Reset the current letter index for the next round
  currentLetter = 0;
  correctLetter = 0;
  errorMessage.classList.remove("visible");

  return 1;
}



document.addEventListener('keydown', async function(event) {
  if (flag) {
    flag = false;
  }

  inputIsLetter = isLetter(event.key)
  CurrentKeySelected = event.key

  if (inputIsLetter === true && currentLetter != ANSWER_LENGTH) {
    enteredWord[currentLetter] = event.key
    document.getElementById(currentLetter).innerText = event.key
    currentLetter += 1

  } else if (event.key === "Backspace" && currentLetter != 0) {
    document.querySelector(".back").click()
    
  } else if (event.key === "Enter" && currentLetter === ANSWER_LENGTH) {
    compareWords(enteredWord)

  } else if (event.key === "Enter" && currentLetter < ANSWER_LENGTH) {
    errorMessage.innerText = "Word too short"
    errorMessage.classList.add("visible")

    setTimeout( () => {
      errorMessage.classList.remove("visible")
    }, 2000)
  }
})


function MakeMap (array) {
  const obj = {};
  for (let i = 0; i < array.length; i++) {
    const letter = array[i]
    if (obj[letter]) {
      obj[letter]++;
    } else {
      obj[letter] = 1
    }
  }
  
  return obj
}


