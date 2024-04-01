//css
import './App.css';
//react
import { useCallback, useEffect, useState } from "react"

//data
import {wordsList} from './data/words'

//components
import StartScreen from './components/StartScreen';
import Game from './components/Game';
import GameOver from './components/GameOver';

const stages = [
  {id: 1, name: 'start'},
  {id: 2, name: 'game'},
  {id: 3, name: 'end'},
]

const guessesQty = 3

function App() {
  const [gameStage, setGameStage] = useState(stages[0].name);
  const [words] = useState(wordsList);


  const [pickedWord, setPickedWord] = useState('')
  const [pickedCategory, setPickedCategory] = useState('')
  const [letters, setLetters] = useState([])
  const [guessedLetters, setGuessedLetters] = useState([])
  const [wrongLetters, setWrongLetters] = useState([])
  const [guesses, setGuesses] = useState(3)
  const [score, setScore] = useState(0)

  const pickWordAndCategory = useCallback(() => {
    const categories = Object.keys(words)
    const category = categories[Math.floor(Math.random() * Object.keys(categories).length)]
    const word = words[category][Math.floor(Math.random() * words[category].length)]

    return {word, category}
  },[words])

  const startGame = useCallback(() =>{
    //clear all letters 
    clearLetterStates();
    //seleciona categorias, palavras e transforma letras para lowcase e também separa
    const {word, category} = pickWordAndCategory();
    pickWordAndCategory()
    let wordLetters = word.split('')
    wordLetters = wordLetters.map((l) => l.toLowerCase());
    setPickedWord(word)
    setPickedCategory(category)
    setLetters(wordLetters)
    
    //muda estado do jogo    
    setGameStage(stages[1].name)
  }, [pickWordAndCategory])

  const verifyLetter = (letter) =>{
    const normalizedLetter = letter.toLowerCase()

    //check if utilized
    if(
        guessedLetters.includes(normalizedLetter) ||
        wrongLetters.includes(normalizedLetter)
      ){
        return;
      }

      if(letters.includes(normalizedLetter)){
        setGuessedLetters((actualGuessedLetters) => [
          ...actualGuessedLetters,
          normalizedLetter
        ])
      }else{
        setWrongLetters((actualWrongLetters) => [
          ...actualWrongLetters,
          normalizedLetter,
        ])

        setGuesses((actualGuesses) => actualGuesses - 1);
      }

  };

  const clearLetterStates = () =>{
    setGuessedLetters([]);
    setWrongLetters([]);
  }
  //check if guesses ended
  useEffect(() => {
    if(guesses <= 0){
      //reset all stages
      clearLetterStates();
      setGameStage(stages[2].name);
    }
  }, [guesses]);

  //check win condition
  useEffect(() => {
    
    const uniqueLetters = [... new Set(letters)];
    
    //win condition
    if(guessedLetters.length === uniqueLetters.length && gameStage[1].name){
      //add score
      setScore((actualScore) => actualScore += 100)

      //restart game with new word
      startGame(); 
    }

    console.log(uniqueLetters);

  }, [guessedLetters, letters, startGame])

  const retry = () =>{
    setScore(0)
    setGuesses(3)
    setGameStage(stages[0].name)
  }

  return (
    <div className="App">
      {gameStage === "start" && <StartScreen startGame={startGame}/>}
      {gameStage === "game" && <Game 
                                    verifyLetter={verifyLetter} 
                                    pickedWord={pickedWord} 
                                    pickedCategory={pickedCategory} 
                                    letters={letters}
                                    guessedLetters={guessedLetters}
                                    wrongLetters={wrongLetters}
                                    guesses={guesses}
                                    score={score}
                                />}
      {gameStage === "end" && <GameOver retry={retry} score={score}/>}
    </div>
  );
}

export default App;
