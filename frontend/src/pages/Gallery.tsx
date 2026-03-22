import { useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import api from '../api/axios';
import type { NailArt, Service } from '../types';

const Gallery = () => {
  //initial state
  const [nailArts, setNailarts] = useState<NailArt[]>([]);
  const [selectedNail, setSelectedNail] = useState<NailArt | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  
  const navigate = useNavigate();

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

  useEffect(() => {
  const fetchServices = async () => {
    try {
      const res = await api.get("/services");
      setServices(res.data);
    } catch (err) {
      console.error("Failed to fetch services", err);
    }
  };

    fetchServices();
  }, []);

  //helper function
  const getServiceName = (id: number) => {
    return services.find((s) => s.id === id)?.name || "Unknown";
  };

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
               className="w-full aspect-square object-cover rounded-lg" 
          />
          <h3 className="text-lg font-semibold">{art.title}</h3>
          <p className="text-sm text-gray-500">{getServiceName(art.service_id)}</p>
          </div>
        ))}
      </div>

      {selectedNail && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
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
              className="max-w-full max-h-[80vh] object-contain rounded-lg"
            />

            {/* Details */}
            <h2 className="text-xl font-semibold mb-1">
              {selectedNail.title}
            </h2>

            <p className="text-sm text-gray-500 mb-2">
              {getServiceName(selectedNail.service_id)}
            </p>

            <p className="text-sm text-gray-600 mb-4">
              {selectedNail.description}
            </p>

            {/* Future booking button */}
            <button
              onClick ={() => 
                navigate("/book", {
                  state: {
                    selectedServiceId: selectedNail.service_id,
                    selectedNail:selectedNail,
                  }
                })
              } className="w-full bg-brand-primary text-white py-2 rounded-lg hover:bg-black transition">
              Book an Appointment
            </button>


          </div>

        </div>
      )}
    </div>
  );

};


export default Gallery;