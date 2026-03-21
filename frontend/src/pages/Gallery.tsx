import { useEffect, useState} from "react";
import api from '../api/axios';
import type { NailArt } from '../types';

const Gallery = () => {
  //initial state
  const [nailArts, setNailarts] = useState<NailArt[]>([]);
  const [selectedNail, setSelectedNail] = useState<NailArt | null>(null);

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
          onClick={() => setSelectedNail(art)}
          className="bg-white p-8 rounded-xl shadow-md border border-gray-100 w-full max-w-lg cursor-pointer hover:shadow-lg transition">
          <img src={art.image_url} 
               alt={art.title}
               className="w-full h-64 object-cover" 
          />
          <h3 className="text-lg font-semibold">{art.title}</h3>
          <p className="text-sm text-gray-500">{art.category}</p>
          </div>
        ))}
      </div>

      {selectedNail && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          {/* Modal Box */}
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full relative">
            {/* Close Button */}
            <button
              onClick={() => setSelectedNail(null)}
              className="absolute top-3 right-3 text-gray-400 hover:text-black"
            >
              ✕
            </button>
            {/* Image */}
            <img
              src={selectedNail.image_url}
              alt={selectedNail.title}
              className="w-full h-72 object-cover rounded-lg mb-4"
            />

            {/* Details */}
            <h2 className="text-xl font-semibold mb-1">
              {selectedNail.title}
            </h2>

            <p className="text-sm text-gray-500 mb-2">
              {selectedNail.category}
            </p>

            <p className="text-sm text-gray-600 mb-4">
              {selectedNail.description}
            </p>

            {/* Future booking button */}
            <button className="w-full bg-brand-primary text-white py-2 rounded-lg hover:bg-black transition">
              Book an Appointment
            </button>


          </div>

        </div>
      )}
    </div>
  );

};


export default Gallery;