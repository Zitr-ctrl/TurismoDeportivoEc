import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Home = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="p-8">
      {/* Título principal */}
      <h1 className="text-3xl font-bold mb-6 text-center">
        Bienvenido a Turismo Deportivo
      </h1>

      {/* Imagen de Ecuador y el deporte */}
      <div className="mb-6">
        <img
          src="https://www.euronix.es/wp-content/uploads/2022/09/euronix-catalogo-banner.jpg" 
          alt="Ecuador y el deporte"
          className="w-full h-[350px] object-cover rounded-md shadow-lg"
        />
      </div>

      {/* Descripción del proyecto */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold mb-4">
          Explora los mejores eventos deportivos en Ecuador
        </h2>
        <p className="text-lg text-gray-700">
          Con nuestra plataforma de Turismo Deportivo, puedes descubrir los eventos deportivos más importantes en Ecuador. 
          Ya sea que busques torneos, campeonatos o actividades recreativas, ofrecemos una variedad de opciones para todos los gustos. 
          ¡No te pierdas la oportunidad de disfrutar de la cultura y el deporte ecuatoriano!
        </p>
      </div>

      
    </div>
  );
};

export default Home;
