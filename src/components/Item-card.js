import React from "react";
import classNames from "classnames";
import { useSpring, animated } from "react-spring";
import { Draggable } from "react-beautiful-dnd";
//import { createWikimediaImage } from "../lib/image";
import styles from "../styles/item-card.module.scss";

const datePropIdMap = {
  P575: "discovered", // or invented
  P7589: "date of assent",
  P577: "published",
  P1191: "first performed",
  P1619: "officially opened",
  P571: "created",
  P1249: "earliest record",
  P576: "ended",
  P8556: "became extinct",
  P6949: "announced",
  P1319: "earliest",
  P569: "born",
  P570: "died",
  P582: "ended",
  P580: "started",
  P7125: "latest one",
  P7124: "first one",
};



export default function ItemCard(props) {
  const { draggable, flippedId, index, item, setFlippedId } = props;

  const flipped = item.id === flippedId;

  const cardSpring = useSpring({
    opacity: flipped ? 1 : 0,
    transform: `perspective(600px) rotateY(${flipped ? 180 : 0}deg)`,
    config: { mass: 5, tension: 750, friction: 100 },
  });

  const type = React.useMemo(() => {
    

    

  

    return item.suffix
  }, [item]);

  return (
    <Draggable draggableId={String(item.id)} index={index} isDragDisabled={!draggable}>
      {(provided, snapshot) => {
        return (
          <div
            className={classNames(styles.itemCard, {
              [styles.played]: "played" in item,
              [styles.flipped]: flipped,
              [styles.dragging]: snapshot.isDragging,
            })}
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            onClick={() => {
              if ("played" in item && setFlippedId) {
                if (flipped) {
                  setFlippedId(null);
                } else {
                  setFlippedId(item.id);
                }
              }
            }}
          >
            <animated.div
              className={styles.front}
              style={{
                opacity: cardSpring.opacity.to((o) => 1 - o),
                transform: cardSpring.transform,
              }}
            >
              <div className={styles.top}>
                <div className={styles.label}>{item.question} of {item.country}</div>
                <div className={styles.description}>{type}</div>
              </div>
              <div
                className={styles.image}
                
              ><img src={`https://flagcdn.com/w320/${item.code}.png`} alt="..." /></div>
              
              <animated.div
                className={classNames(styles.bottom, {
                  [styles.correct]: "played" in item && item.played.correct,
                  [styles.incorrect]: "played" in item && !item.played.correct,
                })}
              >
                <span>
                  {"played" in item
                    ? item.answer < -10000
                      ? item.answer.toLocaleString()
                      : item.answer.toString()
                    : datePropIdMap[item.created_at]}
                </span>
              </animated.div>
            </animated.div>
            <animated.div
              className={styles.back}
              style={{
                opacity: cardSpring.opacity,
                transform: cardSpring.transform.to(
                  (t) => `${t} rotateX(180deg) rotateZ(180deg)`
                ),
              }}
            >
              <span className={styles.label}>{item.question}</span>
              <span className={styles.date}>
                {datePropIdMap[item.created_at]}: {item.answer}
              </span>
              <span className={styles.description}>{item.suffix}.</span>
              
            </animated.div>
          </div>
        );
      }}
    </Draggable>
  );
}