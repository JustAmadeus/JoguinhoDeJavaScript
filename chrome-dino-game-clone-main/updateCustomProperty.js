export function getCustomProperty(elem, prop) {
  return parseFloat(getComputedStyle(elem).getPropertyValue(prop)) || 0
}//Isso aqui pega os valores para CSS, a propriedade dele, e converte em um número float. Se não houver um, é 0.

export function setCustomProperty(elem, prop, value) {
  elem.style.setProperty(prop, value)
}
//Isto aqui vai configurar o tipo de propriedade. Pega a propriedade, pega um valor.

export function incrementCustomProperty(elem, prop, inc) {
  setCustomProperty(elem, prop, getCustomProperty(elem, prop) + inc)
}
//Isto incrementa os valores passados até então.

//Bem, aqui, é feita a conversão de um valor no JS para um valor no .css
//E é, eu não sabia que funções precisavam ser exportadas para serem usadas no código, mas aqui estamos.