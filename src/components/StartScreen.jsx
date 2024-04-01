import './StartScreen.css'
import Logo from '../assets/download.png'

const StartScreen = ({startGame}) => {
  return (
    <div className="start">
        <div>
          <img src={Logo}></img>
        </div>
        <button onClick={startGame}>Começar o jogo</button>
    </div>
  )
}

export default StartScreen
