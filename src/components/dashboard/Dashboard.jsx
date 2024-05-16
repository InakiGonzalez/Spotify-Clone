import { useState } from 'react';
import { fetchSpotifyApi } from '../../api/spotifyAPIDemo';

const Dashboard = () => {
  const types = [
    'album',
    'artist',
    'playlist',
    'track',
    'show',
    'episode',
    'audiobook',
  ];

  const [form, setForm] = useState({
    search: '',
    artist: '',
  });
  const [results, setResults] = useState([]);
  const [typeSelected, setTypeSelected] = useState('');

  const handleSearch = async () => {
    const params = new URLSearchParams();
    params.append(
      'q',
      encodeURIComponent(`remaster track:${form.search} artist:${form.artist}`)
    );
    params.append('type', typeSelected);

    const queryString = params.toString();
    const url = 'https://api.spotify.com/v1/search';
    const updateUrl = `${url}?${queryString}`;
    const token = `Bearer ${localStorage.getItem('token')}`;

    const response = await fetchSpotifyApi(
      updateUrl,
      'GET',
      null,
      'application/json',
      token
    );

    console.log(response);
    setResults(response.tracks.items);
  };
  
  const handlePlayMusic = async (song) => {
    const token = `Bearer ${localStorage.getItem('token')}`;
    const data = {
      uris: [song.uri],
    };

    const id_device = "8917a1c87f8564f9fee13cfd8604225f5cb21429";

    const playSong = await fetchSpotifyApi(
      `https://api.spotify.com/v1/me/player/play?device_id=${id_device}`,
      'PUT',
      JSON.stringify(data),
      'application/json',
      token
    );
    console.log(playSong);
  };
  
  const getDeviceId = async () => {
    try {
      const token = `Bearer ${localStorage.getItem('token')}`;
      const response = await fetchSpotifyApi(
        'https://api.spotify.com/v1/me/player/devices',
        'GET',
        null,
        'application/json',
        token
      );
      
      console.log(response); // Log the response to inspect its structure
  
      // Check if response contains devices array and has at least one device
      if (response.devices && response.devices.length > 0) {
        // Return the id of the first device
        return response.devices[0].id;
      } else {
        console.error('No devices found in the response');
        return null;
      }
    } catch (error) {
      console.error('Error fetching device information:', error);
      return null;
    }
  };
  
  const handleChange = (e) => {
    const newValues = {
      ...form,
      [e.target.name]: e.target.value,
    };
    console.log(newValues);
    setForm(newValues);
  };

  const handleSelectChange = (e) => {
    setTypeSelected(e.target.value);
  };
  const handleGetToken = async () => {
    // stored in the previous step
    const urlParams = new URLSearchParams(window.location.search);
    let code = urlParams.get('code');
    let codeVerifier = localStorage.getItem('code_verifier');
    console.log({ codeVerifier });
    const url = 'https://accounts.spotify.com/api/token';
    const clientId = '4a1bcdc443774127b7a42ba5e9a8f7fb';
    const redirectUri = 'http://localhost:5173/';
    const payload = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: clientId,
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
        code_verifier: codeVerifier,
      }),
    };

    const body = await fetch(url, payload);
    const response = await body.json();

    localStorage.setItem('token', response.access_token);
  };

  return (
    <div className="bg-gradient-to-t from-[#030303] to-[#282828] h-screen w-screen flex flex-col justify-center items-center">
      <h1 className="text-white text-3xl mb-4">Dashboard</h1>
      <div className="flex justify-between w-[60%] mb-4">
        <div className="flex flex-col">
          <p className="text-white text-sm mb-1">Track</p>
          <input
            className="rounded-md h-8 w-40 text-white bg-[#121212] border-[#727272] border-solid border-[1px] focus:ring-1 focus:ring-white"
            placeholder="Search"
            type="text"
            name="search"
            value={form.search}
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-col">
          <p className="text-white text-sm mb-1">Types</p>
          <select
            className="rounded-md h-8 w-40 text-white bg-[#121212] border-[#727272] border-solid border-[1px] focus:ring-1 focus:ring-white"
            name="types"
            onChange={handleSelectChange}
          >
            {types.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col">
          <p className="text-white text-sm mb-1">Artist</p>
          <input
            className="rounded-md h-8 w-40 text-white bg-[#121212] border-[#727272] border-solid border-[1px] focus:ring-1 focus:ring-white"
            placeholder="Artist"
            type="text"
            name="artist"
            value={form.artist}
            onChange={handleChange}
          />
        </div>
        <div>
          <button
            onClick={handleSearch}
            className="bg-[#1BD760] w-24 rounded-md text-white text-sm font-bold py-1"
          >
            Search
          </button>
        </div>
        <div>
          <button
            onClick={handleGetToken}
            className="bg-[#1BD760] w-24 rounded-md text-white text-sm font-bold py-1"
          >
            GET TOKEN
          </button>
          <button
            onClick={getDeviceId}
            className="bg-[#1BD760] w-24 rounded-md text-white text-sm font-bold py-1"
          >
            GET DEVICE ID
          </button>
        </div>
      </div>
      {results.length > 0 && (
        <div className="w-[60%]">
          {results.map((item, idx) => (
            <div key={item.id} className="flex items-center text-white mb-2">
              <img
                src={item.album.images[0].url}
                alt="album"
                className="w-16 h-16 mr-4"
              />
              <p className="text-lg">{`${idx + 1}. ${item.name}`}</p>
              <button
                className="bg-[#1BD760] ml-auto w-24 rounded-md text-white text-sm font-bold py-1"
                onClick={() => handlePlayMusic(item)}
              >
                Play
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
  
};

export default Dashboard;
