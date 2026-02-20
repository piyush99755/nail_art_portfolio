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
    <div >
      <h1 className="text-3xl font-bold text-center mb-8">
        Nail Art Portfolio
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {nailArts.map((art) => (
          <div
          key={art.id}
          className="bg-white p-8 rounded-xl shadow-md border border-gray-100 w-full max-w-lg">
          <img src={art.image_url} 
               alt={art.title}
               className="w-full h-64 object-cover" 
          />
          <h3 className="text-lg font-semibold">{art.title}</h3>
          <p className="text-sm text-gray-500">{art.category}</p>
          </div>
        ))}
      </div>
    </div>
  );

};


export default Gallery;