import {
  getCustomProperty,
  incrementCustomProperty,
  setCustomProperty,
} from "./updateCustomProperty.js"

const SPEED = 0.05
const groundElems = document.querySelectorAll("[data-ground]")

export function setupGround() {
  setCustomProperty(groundElems[0], "--left", 0)
  setCustomProperty(groundElems[1], "--left", 300)
}
//Como em updateCustomProperty.js, aqui temos a propriedade "--left" e valor da variável no CSS.
//É daqui que o chão se move para a esquerda, dando a sensação de movimento pelo mundo.
//O valor de um dos groundElemems[1] é 300 porque no CSS ele é 300 tambem. DEESTA FORMA, vamos ter um encaixando no outro.
//Um começa 300 unidades à esquerda do outro, e em loop.

export function updateGround(delta, speedScale) { //Tempo é aumentado, como em script.js. O delta é utilizado para isso. Quanto mais tempo se passou, mais o dinossauro correu, e mais rápido ele corre.
  groundElems.forEach(ground => {
    incrementCustomProperty(ground, "--left", delta * speedScale * SPEED * -1)

    if (getCustomProperty(ground, "--left") <= -300) {    //Nesta linha aqui, -300 é 100% da posição do ground[0].
      incrementCustomProperty(ground, "--left", 600)      //Se acontecer, ele é atualizado como 600, onde ground[1] acabaria.
    }                                                     
  })
}
