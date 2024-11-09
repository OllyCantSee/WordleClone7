const ANSWER_LENGTH = 5
let inputIsLetter
let currentLetter = 0
let enteredWord = ["", "", "", "", ""]
let todaysWord = ""
let todaysWordArray = "";
let lettersGuessedCorrectly = []
let closeLettersGuesses = []
let incorrectLetters = []
let userAttempts = 0
let gameWon = false
let fiveLetterWords = []
let CurrentKeySelected;


// Commonly used variables are stored at the top of the document so the program doesnt have to find each element every time you want it
let restartButton = document.querySelector(".restart-game")
const keyBoardButtons = document.querySelectorAll(".kletter")
const guessAttemptText = document.querySelector(".congratsh2")
const errorMessage = document.querySelector(".error-message")
const wordReveal = document.querySelector(".word-reveal")
const userWin = document.querySelector(".congrats")



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
    currentLetter--
    enteredWord[currentLetter] = ""
    document.getElementById(currentLetter).innerHTML = ""
   }

   CurrentKeySelected = ""

  })
})

// When the page is loaded it will recieve the word of the day to stop delay on the first word
window.onload = async function() {
  const res = await fetch("https://words.dev-apis.com/word-of-the-day")
  const resObj = await res.json()
  todaysWord = await resObj.word.toUpperCase()
  todaysWordArray = Array.from(todaysWord)
}

// Checks if the keyboards entry is letter and returns a boolean
function isLetter(letter) {
  return /^[a-zA-Z]$/.test(letter)
}


function gameWin() {
  console.log(userAttempts)

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
}

//YOU LOSE FUNCTION
function gameLose() {

  wordReveal.classList.add("visible")
  wordReveal.innerText = todaysWord
}




//COMPARING WORDS
async function compareWords(usersWord) {
  let enteredWordString = usersWord.join('') 

  
  let res = await fetch("https://words.dev-apis.com/validate-word", {
    method: "POST",
    body: JSON.stringify({word: enteredWordString})
  })

  let resObj = await res.json()
  let validWord = resObj.validWord;


  if (validWord === false) {
    errorMessage.innerText = "Invalid Word"
    errorMessage.classList.add("visible")

    
    setTimeout( () => {
      errorMessage.classList.remove("visible")
    }, 2000)
    return

  } else {
    userAttempts++
  }


  todaysWordArray = todaysWordArray.map(letter => letter.toUpperCase())
  usersWord = usersWord.map(letter1 => letter1.toUpperCase())

  const map = MakeMap(todaysWordArray)

  for (i = 0; i < ANSWER_LENGTH; i++) {
    if(todaysWordArray[i] === usersWord[i]) {
      document.getElementById(i).classList.add("correct")
      map[usersWord[i]]--
      lettersGuessedCorrectly.push(usersWord[i])
    }
  }



  for (i = 0; i < ANSWER_LENGTH; i++) {
    if(todaysWordArray[i] === usersWord[i]) {
      // DO NOTHING, WE ALREADY DID IT
    } else if (todaysWordArray.includes(usersWord[i]) && map[usersWord[i]] > 0){
      document.getElementById(i).classList.add("close")
      map[usersWord[i]]--
      closeLettersGuesses.push(usersWord[i].toUpperCase())
    } else {
      document.getElementById(i).classList.add("wrong")
      incorrectLetters.push(usersWord[i])

      incorrectLetters.forEach(element => {
        element = element.toLowerCase()
        document.querySelector(`.${element}`).classList.add("wrong")
      });
    }
  }

  let correctLetter = 0

  for (i = 0; i < ANSWER_LENGTH; i++) {
    if (usersWord[i] === todaysWordArray[i]) {
      correctLetter++
    }
    if (correctLetter === 5) {
      gameWon = true
      gameWin()
    }
  }



  for (i = 0; i < ANSWER_LENGTH; i++) {
    document.getElementById(i).id = "NULL"
  }

  if (userAttempts === 6 && gameWon === false) {
    gameLose()
  }


  console.log(closeLettersGuesses)
  console.log(lettersGuessedCorrectly)

  if (lettersGuessedCorrectly.length != 0) {
    lettersGuessedCorrectly.forEach(element => {
      element = element.toLowerCase()
      document.querySelector(`.${element}`).classList.add("correct")
    });
  } 
  
  if (closeLettersGuesses.length > 0) {
    console.log("INSIDE CLOSE LETTERS")
    for (i = 0; i < closeLettersGuesses.length; i++) {
      if (lettersGuessedCorrectly.includes(closeLettersGuesses[i]) === false)
        closeLettersGuesses.forEach(element => {
          element = element.toLowerCase()
          document.querySelector(`.${element}`).classList.add("close")
    });
  }
  }

  currentLetter = 0
  correctLetter = 0
  errorMessage.classList.remove("visible")
}


document.addEventListener('keydown', async function(event) {
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




