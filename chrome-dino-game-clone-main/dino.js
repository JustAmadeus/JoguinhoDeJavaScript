import {
  incrementCustomProperty,
  setCustomProperty,
  getCustomProperty,
} from "./updateCustomProperty.js"

const dinoElem = document.querySelector("[data-dino]")
const JUMP_SPEED = 0.45 //Velocidade com o qual o dinossauro muda sua posição para cima,
const GRAVITY = 0.0015 //para baixo,
const DINO_FRAME_COUNT = 2 //Temos dois sprites, dois frames para o dinossauro.
const FRAME_TIME = 100 //100ms é o quanto cada frame do dinossauro dura. Ele alterna, para ele mover as pernas, dando impressão de movimento.
//Estas constantes foram todas supostas "de olho" para deixar o jogo o mais suave possível. Existem diversos clones do jogo onde a velocidade
//do dinossauro muda ao pular, ele pula rápido demais, ou cai rápido demais... 

let isJumping //Ele está pulando?
let dinoFrame //Em qual frame o dinossauro se encontra agora?
let currentFrameTime //Isso aqui faz com que a velocidade que ele "move as perninhas" combine com a velocidade atual do jogo.
let yVelocity //Isto vai impedir que o dinossauro atravesse o chão depois de pular, basicamente.
//a função abaixo seta e reseta o dinossauro. É isto que é chamado quando se inicia o jogo.
export function setupDino() {
  isJumping = false
  dinoFrame = 0
  currentFrameTime = 0
  yVelocity = 0
  setCustomProperty(dinoElem, "--bottom", 0)
  document.removeEventListener("keydown", onJump)
  document.addEventListener("keydown", onJump)
}
//isto atualiza o dinossauro. Função chamada no script.js durante os loops baseados em tempo para atualização.
export function updateDino(delta, speedScale) {
  handleRun(delta, speedScale)
  handleJump(delta)
}

export function getDinoRect() {
  return dinoElem.getBoundingClientRect()
}

export function setDinoLose() {
  dinoElem.src = "imgs/dino-lose.png"
}

function handleRun(delta, speedScale) {
  if (isJumping) {
    dinoElem.src = `imgs/dino-stationary.png`
    return
  }

  if (currentFrameTime >= FRAME_TIME) {
    dinoFrame = (dinoFrame + 1) % DINO_FRAME_COUNT
    dinoElem.src = `imgs/dino-run-${dinoFrame}.png`
    currentFrameTime -= FRAME_TIME
  }
  currentFrameTime += delta * speedScale
}

function handleJump(delta) {
  if (!isJumping) return

  incrementCustomProperty(dinoElem, "--bottom", yVelocity * delta)

  if (getCustomProperty(dinoElem, "--bottom") <= 0) {
    setCustomProperty(dinoElem, "--bottom", 0)
    isJumping = false
  }

  yVelocity -= GRAVITY * delta
}

function onJump(e) {
  if (e.code !== "Space" || isJumping) return

  yVelocity = JUMP_SPEED
  isJumping = true
}
