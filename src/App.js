import React, { useEffect, useState } from "react";
import "./App.css";
import FeatureMovie from "./components/FeatureMovie";
import Header from "./components/Header";
import MovieRow from "./components/MovieRow";
import Tmdb from "./Tmdb";

export default () => {
  const [movieList, setMovieList] = useState([]);
  const [featureData, setFeatureData] = useState(null);
  const [blackHeader, setBlackHeader] = useState(false);

  useEffect(() => {
    const loadAll = async () => {
      //pegando a lista
      let list = await Tmdb.getHomeList();
      setMovieList(list);

      //pegando o destaque(feature)
      let originals = list.filter((i) => i.slug === "originals");
      let randomChosen = Math.floor(
        Math.random() * originals[0].items.results.length
      );
      let chosen = originals[0].items.results[randomChosen];
      let chosenInfo = await Tmdb.getMovieInfo(chosen.id, "tv");
      setFeatureData(chosenInfo);
    };

    loadAll();
  }, []);
  
  useEffect(()=>{
    const scrollListener = () => {
      if(window.scrollY > 20){
        setBlackHeader(true);
      }else{
        setBlackHeader(false)
      }
    }
    window.addEventListener('scroll', scrollListener);

    return () => {
      window.removeEventListener('scroll', scrollListener);
    }

  });

  return (
    <div className="page">
      <Header black={blackHeader}/>

      {featureData && <FeatureMovie item={featureData} />}

      <section className="lists">
        {movieList.map((item, key) => (
          <MovieRow key={key} title={item.title} items={item.items} />
        ))}
      </section>
      <footer>
        Feito por <span>Felipe Sousa</span> <br />
        agradecimentos a B7Web (Bonieky Lacerda) pelos ensinamentos<br />
        direitos de imagem à Netflix.com<br />
        dados API Tmdb.org <br />
      </footer>

      {movieList.length <= 0 &&    
      <div className="loading">
        <img src="https://cdn.lowgif.com/small/0534e2a412eeb281-the-counterintuitive-tech-behind-netflix-s-worldwide.gif" alt="loading"></img>
      </div>
      }
    </div>
  );
};
