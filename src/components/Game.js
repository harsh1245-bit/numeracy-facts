import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
//import { GameState } from "../types/game";
//import { Item } from "../types/item";
import createState from "../lib/create-state";
import Board from "./Board";
import Loading from "./Loading";
import Instructions from "./Instructions";
//import badCards from "../lib/bad-cards";
import supabase from "./config/supabaseClient"
import DropDown from "./DropDown";

export default function Game() {
  const [state, setState] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [started, setStarted] = useState(false);
  const [items, setItems] = useState(null);
  const [questions, setQuestions] = useState(null);
  const [countries, setCountries] = useState(new Set(['United States', 'China', 'United Kingdom', 'Germany', 'Canada', 'India', 'Japan', 'France', 'Russia', 'Italy', 'Switzerland', 'Spain', 'Sweden', 'Netherlands', 'Israel', 'United Arab Emirates', 'Saudi Arabia', 'Belgium', 'Thailand', 'Pakistan', 'Iran', 'Portugal', 'South Korea']));
  //const suffList = ['%','Billion gallons','Fahrenheit','GW.h','Gigawatt-hours','MW','Megawatt-hours','Million units','Terawatt-hours','billion tons','cm','cycles','degree celcius','degree celsius','degree fahrenheit','females','houses','inches','kilo metres','km square','metres','micrograms per cubic metre','million litres','million terajoules','mm','people','thousand tons','tons','years']
  useEffect(() => {
    const fetchQuestion= async ()=>{
      const suffs = ['people', '%', 'US $', 'tonnes', 'years','kWh/person']
      const tag = suffs[Math.floor(Math.random()*suffs.length)]
      console.log(tag);
      const {data, error} = await supabase
      .from('ourWorld')
      .select('*').eq('suffix',tag);
  
      if(error){
          console.log("error")
          
      }
      
      if(data){
        const x =data;
        /*const quesArray = [];
        const  num = Math.floor(Math.random()*suffList.length);
        const reqTag = suffList[num];
        for(let i=0; i<x.length; i++){
          if(x[i].suffix===reqTag){
            quesArray.push(x[i]);
          }
        }*/
        setQuestions(x);
        //console.log(data);
      }
    }
    const fetchGameData = async () => {
      const res = await axios.get(
        "https://wikitrivia-data.tomjwatson.com/items.json"
      );
      const items = res.data
        .trim()
        .split("\n")
        .map((line) => {
          return JSON.parse(line);
        })
        // Filter out questions which give away their answers
        .filter((item) => !item.label.includes(String(item.year)))
        .filter((item) => !item.description.includes(String(item.year)))
        .filter((item) => !item.description.includes(String("st century" || "nd century" || "th century")))
        // Filter cards which have bad data as submitted in https://github.com/tom-james-watson/wikitrivia/discussions/2
        ;
      setItems(items);
    };

    fetchGameData();
    fetchQuestion();
  }, []);

  useEffect(() => {
    const createStateAsync = async () => {
      if (items !== null) {
        setState(await createState(questions));
        setLoaded(true);
      }
    };

    createStateAsync();
    // eslint-disable-next-line
  }, [questions]);
  const startGame = ()=>{
    const arr = []
    const countryArr = Array.from(countries);
    for(let i=0; i<countryArr.length; i++){
      const countr = countryArr[i];
      for(let j=0; j<questions.length; j++){
        if(questions[j].country===countr){
          arr.push(questions[j]);
        }
      }
      setQuestions(arr);
    }
    setStarted(true);
  }
  const resetGame = useCallback(() => {
    const resetGameAsync = async () => {
      if (items !== null) {
        setState(await createState(questions));
      }
      window.location.reload();
    };

    resetGameAsync();
    // eslint-disable-next-line
  }, [questions]);

  const [highscore, setHighscore] = useState(
    Number(localStorage.getItem("highscore") ?? "0")
  );
  
  const updateCountries = useCallback((countrySet)=>{
    setCountries(countrySet);
    console.log(countries)
    // eslint-disable-next-line
  },[])
  const updateHighscore = useCallback((score) => {
    localStorage.setItem("highscore", String(score));
    setHighscore(score);
  }, []);

  if (!loaded || state === null) {
    return <Loading />;
  }

  if (!started) {
    return (
      <>
      <Instructions highscore={highscore} start={startGame} />
      <DropDown countries={countries} updateCountries={updateCountries}/>
      </>
    );
  }

  return (
    <Board
      highscore={highscore}
      state={state}
      setState={setState}
      resetGame={resetGame}
      updateHighscore={updateHighscore}
    />
  );
}
