import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Search = ({ _value, _onChange }) => {
  return (
    <form>
      find countries <input value={_value} onChange={_onChange} />
    </form>
  );
};

const Country = ({ _country }) => {
  const [weather, setWeather] = useState([]);

  useEffect(() => {
    axios
      .get(
        `http://api.weatherstack.com/current?access_key=${process.env.REACT_APP_NOT_SECRET_CODE}&query=${_country.capital}`
      )
      .then((response) => {
        const data = response.data;
        setWeather(data.current);
      });
  }, []);

  return (
    <div>
      <h1>{_country.name}</h1>
      <p>capital {_country.capital}</p>
      <p>population {_country.population}</p>
      <h2>Spoken languages</h2>
      <ul>
        {_country.languages.map((language, i) => {
          return <li key={i}>{language.nativeName}</li>;
        })}
      </ul>
      <img src={_country.flag} alt='flag' style={{ width: '100px' }} />
      <h2>Weather in {_country.capital}</h2>
      <p>
        <strong>temperature:</strong> {weather.temperature} Celcius
      </p>
      <img
        src={weather.weather_icons}
        alt='weather'
        style={{ width: '100px' }}
      />
      <p>
        <strong>wind:</strong>{' '}
        {`${weather.wind_degree} mph direction ${weather.wind_dir}`}
      </p>
    </div>
  );
};

const CountryButton = ({ _country }) => {
  const [isShow, setIsShow] = useState(false);

  return (
    <div>
      {_country.name}

      {isShow ? (
        <div>
          <button
            onClick={() => {
              setIsShow(!isShow);
            }}
          >
            hide
          </button>
          <Country _country={_country} />
        </div>
      ) : (
        <div>
          <button
            onClick={() => {
              setIsShow(!isShow);
            }}
          >
            show
          </button>
        </div>
      )}
    </div>
  );
};

const Countries = ({ _countries }) => {
  const result = _countries.length;
  if (result > 10) {
    return (
      <div>
        <p>Too many matches, specify another filter</p>
      </div>
    );
  } else if (result > 1) {
    return (
      <div>
        {_countries.map((country) => {
          return (
            <div key={country.numericCode}>
              <CountryButton _country={country} />
            </div>
          );
        })}
      </div>
    );
  } else if (result > 0) {
    return <Country _country={_countries[0]} />;
  }
  return (
    <div>
      <p>No matches</p>
    </div>
  );
};

const App = () => {
  const [countries, setCountries] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    axios.get('https://restcountries.eu/rest/v2/all').then((response) => {
      const data = response.data;
      setCountries(data);
    });
  }, []);

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const filteredCountries = () => {
    return countries.filter((country) =>
      country.name.toLowerCase().includes(search.trim().toLowerCase())
    );
  };

  return (
    <div>
      <Search _value={search} _onChange={handleSearchChange} />
      <Countries _countries={filteredCountries()} />
    </div>
  );
};

export default App;
