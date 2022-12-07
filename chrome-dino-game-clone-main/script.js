import { updateGround, setupGround } from "./ground.js"
import { updateDino, setupDino, getDinoRect, setDinoLose } from "./dino.js"
import { updateCactus, setupCactus, getCactusRects } from "./cactus.js"

const WORLD_WIDTH = 200 //Temos as medidas do mundo. Largura,
const WORLD_HEIGHT = 30  //e altura.
const SPEED_SCALE_INCREASE = 0.00001 //Isso aqui é o scaling da velocidade com a qual o dinossauro se move.
                                    //Que na verdade é o mundo à sua frente passando pela tela, quando pensamos em como actually foi feito.

const worldElem = document.querySelector("[data-world]")
const scoreElem = document.querySelector("[data-score]")
const startScreenElem = document.querySelector("[data-start-screen]")

setPixelToWorldScale()
window.addEventListener("resize", setPixelToWorldScale)
document.addEventListener("keydown", handleStart, { once: true })//Vai rodar uma vez só ao press de uma key, para iniciar o jogo, com ONCE sendo true. Isso evita que a função que coloca o texto de início continue sendo chamada e texto fique na tela.

let lastTime
let speedScale
let score
//Uma criação de um loop de update. Isto vai atualizar a posição de cada elemento na tela.
//Esta request ativa toda vez que conteúdo na tela tiver alguma mudança para ser atualizado.
//Maaaas... Se fosse só a request, atualizaria conforme a tela carrega ou é refreshed.
//Então para tornar um loop, em window.requestAnimationFrame(update), update é chamado novamente.
function update(time) {              
  //Sobre o tempo... Geralmente demorariam 10ms entre updates... 
  //E um seguido por outro demora 5 vezes mais. Mas aqui, vamos dar um jeito de funcionar mais rápido.
  //Atualizar posição por pixels ao longo do tempo não é suficiente... O tempo entre cada frame pode ser diferente.
  //Então mesmo se movento em velocidade constante, de um frame para outro, quantidades diferentes de pixels seriam andadas pelo dinossáuro.
  if (lastTime == null) {
    //Bem, no fim, é porra aí. Mas vamos fazer o movimento ser baseado no quanto demorou entre um frame e outro. Daí as variáveis
    //"lastTime, para representar "o tempo passado entre o último frame", e o tempo, que será usado como parâmetro para dar segmento no loop.
    //Repare que lastTime começa nulo, porque não deve haver um último tempo no ciclo inicial.
    lastTime = time
    //Ótimo. Assim o dinossauro não "lagga" e não se mexe diferente dependo nem do navegador nem do próprio computador.
    window.requestAnimationFrame(update) 
    return
  }
 

  const delta = time - lastTime
  updateGround(delta, speedScale)
  updateDino(delta, speedScale)
  updateCactus(delta, speedScale)
  updateSpeedScale(delta)
  updateScore(delta)
  //Aqui, são as instruções dadas nas atualizações. Delta é a diferença entre o tempo atual e o último tempo de update. Com isso,
  //cada elemento desde o chão, placar e cactus, atualiza a posição e valor.
  if (checkLose()) return handleLose()
  //
  lastTime = time
  window.requestAnimationFrame(update)
  console.log(delta)
  console(time)
  console.log(lastTime)
  //Os console.log nos tempos permitem ver os mili segundos que levaram para atualizar frame, e o tempo utilizado para atualizar o movimento.
  //Dá para notar, o dinossáuro se movendo com o output do console log.
}

function checkLose() {
  const dinoRect = getDinoRect()
  return getCactusRects().some(rect => isCollision(rect, dinoRect))
}

//Colisão. Hitbox.
function isCollision(rect1, rect2) {
  return (
    rect1.left < rect2.right &&
    rect1.top < rect2.bottom &&
    rect1.right > rect2.left &&
    rect1.bottom > rect2.top
  )
}
//Atualiza velocidade com base na diferença de tempo.
function updateSpeedScale(delta) {
  speedScale += delta * SPEED_SCALE_INCREASE
}
//Atualiza pontuação com base na diferença de tempo.
function updateScore(delta) {
  score += delta * 0.01           //fórmula da pontuação.
  scoreElem.textContent = Math.floor(score) //Aqui é interessante ver mágica de CSS.
}

//A função para iniciar aqui.
function handleStart() {
  lastTime = null     //No início do jogo, lastTime precisa ser null,
  speedScale = 1      //A proporção da velocidade do jogo deve ser retornada a 1.
  score = 0           //Pontuação zerada.
  //Quando o jogo começa, as funções a seguir, nos JS dos respectivos elementos, são chamadas, iniciando as instruções.
  setupGround()
  setupDino()         
  setupCactus()
  startScreenElem.classList.add("hide")
  window.requestAnimationFrame(update)
}

//Se perder,
function handleLose() {
  setDinoLose()
  setTimeout(() => {      //setTimeOut 
    document.addEventListener("keydown", handleStart, { once: true })//ele chama a instrução de início de jogo.
    startScreenElem.classList.remove("hide") //Isto vai esconder o conteúdo da tag desta classe startScreen.
  }, 100)
}


//Isso tudo só para tornar cada elemento responsivo dentro do mundo. O cálculo é simples:
function setPixelToWorldScale() {
  let worldToPixelScale
  //Se a largura da janela dividida pela altura da janela for menor que a largura do mundo dividida pela altura do mundo,
  if (window.innerWidth / window.innerHeight < WORLD_WIDTH / WORLD_HEIGHT) {
    worldToPixelScale = window.innerWidth / WORLD_WIDTH
    //A variável então calcula o valor da largura da tela dividido pela largura do mundo.
  } else {
    worldToPixelScale = window.innerHeight / WORLD_HEIGHT //Senão, fica deste jeito aqui. Para manter proporção.
  }
  //Enfim, de cálculo, não tem algo interessante. O que interessa está aqui:
  worldElem.style.width = `${WORLD_WIDTH * worldToPixelScale}px`
  worldElem.style.height = `${WORLD_HEIGHT * worldToPixelScale}px`
  //Aqui, temos uma atribuição de valores de medida do mundo (largura e altura) sendo passado para pixel com uma string.
  //Isto é passado para a counterpart apropriada em styles.css.
}

//Programação assíncrona aqui é interessante... O principal, inclusive.
//Porque temos diversos trechos do script já "ativados", mas que não resolveram seus efeitos,
//já que estes, dependem de gatilhos.