import { useEffect, useState} from "react";
import api from '../api/axios';
import type { NailArt } from '../types';

const Gallery = () => {
  //initial state
  const [nailArts, setNailarts] = useState<NailArt[]>([]);

  //runs side effects  after a component render
  useEffect(() => {
    const fetchNailArts = async () => {
      try{
        const response = await api.get<NailArt[]>("/nail-arts/");
        setNailarts(response.data);
      }
      catch(error){
        console.error("Failed to fetch nails", error);
      }
    };
    fetchNailArts();
  },[]);

  return (
    //for every nail art in the array, render a card..
    <div>
      <h1>Nail Art Portfolio</h1>
      <div style= {{display:'flex', flexWrap:'wrap', gap:'20px'}}>
        {nailArts.map((art) => (
          <div
          key={art.id}
          style={{
            border: "1px solid #ddd",
              padding: "10px",
              width: "250px",
          }}>
            <img src={art.image_url} 
            alt={art.title}
            style={{ width: "100%", height: "200px", objectFit: "cover" }} 
            />
            <h3>{art.title}</h3>
            <p>{art.category}</p>
          </div>
        ))}
      </div>
    </div>
  );

};


export default Gallery;