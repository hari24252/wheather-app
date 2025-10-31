import React, { useEffect, useState } from 'react';
import "./App.css";
import searchIcon from "./assets/search.png";
import clearIcon from "./assets/clearsun.png";
import cloudIcon from "./assets/cloudy.png";
import windIcon from "./assets/wind.png";
import snowIcon from "./assets/snow.png";
import rainIcon from "./assets/rain.png";
import humidityIcon from "./assets/humidity.png";

const WheatherDetails = ({ icon, temp, city, country, lat, log, humidity, wind }) => {
  return (
    <>
      <div className='image'>
        <img src={icon} alt="weather" key={icon} />
      </div>

      <div className='temp'>{temp}°C</div>
      <div className='location'>{city}</div>
      <div className='country'>{country}</div>

      <div className="cord">
        <div>
          <span className='lat'>Latitude: </span>
          <span>{lat}</span>
        </div>
        <div>
          <span className='log'>Longitude: </span>
          <span>{log}</span>
        </div>
      </div>

      <div className="data-container">
        <div className="element">
          <img src={humidityIcon} alt="humidity" className='icon' />
          <div className='data'>
            <div className='humidity-percentage'>{humidity}%</div>
            <div className="text">Humidity</div>
          </div>
        </div>

        <div className="element">
          <img src={windIcon} alt="wind" className='icon' />
          <div className='data'>
            <div className='wind-percentage'>{wind} km/h</div>
            <div className="text">Wind Speed</div>
          </div>
        </div>
      </div>
    </>
  );
};

export const App = () => {
  const [icon, setIcon] = useState(clearIcon);
  const [temp, setTemp] = useState(0);
  const [city, setCity] = useState("Chennai");
  const [country, setCountry] = useState("IN");
  const [lat, setLat] = useState(0);
  const [log, setLog] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [wind, setWind] = useState(0);
  const [text, setText] = useState("Chennai");
  const [loading, setLoading] = useState(false);
  const [cityNotFound, setCityNotFound] = useState(false);

  // WEATHER ICON MAPPING
  const weatherIcon = {
    "01d": clearIcon, "01n": clearIcon,
    "02d": cloudIcon, "02n": cloudIcon,
    "03d": cloudIcon, "03n": cloudIcon,
    "04d": cloudIcon, "04n": cloudIcon,
    "09d": rainIcon,  "09n": rainIcon,
    "10d": rainIcon,  "10n": rainIcon,
    "11d": rainIcon,  "11n": rainIcon,
    "13d": snowIcon,  "13n": snowIcon,
    "50d": cloudIcon, "50n": cloudIcon
  };

  const search = async () => {
    setLoading(true);
    let api_key = "191c3fe29d1c81e128ad9875a9451fc0";
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=${api_key}&units=metric`;

    try {
      let res = await fetch(url);
      let data = await res.json();

      if (data.cod === "404") {
        setCityNotFound(true);
        setLoading(false);
        return;
      }

      setHumidity(data.main.humidity);
      setWind(data.wind.speed);
      setCity(data.name);
      setCountry(data.sys.country);
      setLat(data.coord.lat);
      setLog(data.coord.lon);
      setTemp(Math.floor(data.main.temp));

      const weatherCode = data.weather[0].icon;
      console.log("Weather code:", weatherCode);

      // ✅ Correctly set icon after API response
      setIcon(weatherIcon[weatherCode] || clearIcon);

      setCityNotFound(false);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCity = (e) => setText(e.target.value);
  const handlekeyDown = (e) => { if (e.key === 'Enter') search(); };

  useEffect(() => {
    search();
  }, []);

  // 🔹 TEST BUTTON: Force different icons manually
  // You can uncomment these to see snow/rain icons:
  // useEffect(() => { setIcon(snowIcon); }, []); 

  return (
    <div className='container'>
      <div className="input-container">
        <input
          onChange={handleCity}
          type="text"
          placeholder='Enter Your City'
          className='city-input'
          value={text}
          onKeyDown={handlekeyDown}
        />
        <div className="search-icon" onClick={search}>
          <img src={searchIcon} alt="search" className='search' />
        </div>
      </div>

      <WheatherDetails
        icon={icon}
        temp={temp}
        city={city}
        country={country}
        lat={lat}
        log={log}
        humidity={humidity}
        wind={wind}
      />

      <p className='copyright'>
        Designed By <span>Hariharan CSBS</span>
      </p>
    </div>
  );
};

export default App;
