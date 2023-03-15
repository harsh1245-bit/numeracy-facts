//import { Item, PlayedItem } from "../types/item";
import { createWikimediaImage } from "./image";

export function getRandomItem(deck, played) {
  
  //const periods = [[-100000, 1000],[1000, 1800],[1800, 2020], ];
  //const [fromanswer, toanswer] =periods[Math.floor(Math.random() * periods.length)];
  //const avoidPeople = Math.random() > 0.5;
  console.log(deck, "deck");
  const candidates = deck;
  

  if (candidates.length > 0) {
    return candidates[Math.floor(Math.random() * candidates.length)];
  }
  
  return deck[Math.floor(Math.random() * deck.length)];
}

/*function tooClose(item, played) {
  let distance = played.length < 40 ? 5 : 1;
  if (played.length < 11) distance = 110 - 10 * played.length;

  return played.some((p) => Math.abs(item.answer - p.answer) < distance);
}*/

export function checkCorrect(played, item, index) {
  
  const sorted = [...played, item].sort((a, b) => a.answer - b.answer);
  console.log("sorted", sorted);
  const correctIndex = sorted.findIndex((i) => {
    return i.id === item.id;
  });
  /*console.log(index,correctIndex);
  if(index===correctIndex){
    return{ correct: true, delta:0};
  }
  console.log("played",played);
  if(correctIndex!==0){
    if(item.answer===played[index].answer){
      return{ correct: true, delta:0};
    }
  }*/
  //console.log("core",played[correctIndex-1]);
  if (index !== correctIndex) {
    return { correct: false, delta: correctIndex - index };
  }

  return { correct: true, delta: 0 };
}

export function preloadImage(url) {
  const img = new Image();
  img.src = createWikimediaImage(url);
  return img;
}
