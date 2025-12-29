import './index.css'
import Search from "./components/Search.jsx";
import React, { useState, useEffect } from 'react'
import {useDebounce} from 'react-use'
import Spinner from "./components/Spinner.jsx";
import MovieCard from "./components/MovieCard.jsx";
import {getTrendingMovies, updateSearchCount} from "./appwrite.js";
import TrendingMoviesCard from "./components/TrendingMoviesCard.jsx";

const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_OPTIONS = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${API_KEY}`
    }
}

const App = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [result, setResult] = useState([]); // Array of movies
    const [error, setError] = useState(null);
    const [debounceSearchTerm , setDebouncedSearchTerm] = useState('');
    const [trendingMovies, setTrendingMovies] = useState([]);

    useDebounce(() => setDebouncedSearchTerm(searchTerm)
        , 500 , [searchTerm])

    const fetchMovies = async (query = '') => {
        try{
            const endpoint = query
                ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
                : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`
            setLoading(true);
            setError(null);
            const response = await fetch(endpoint , API_OPTIONS);
            if(!response.ok){
                throw new Error('Failed to fetch movies');
            }
            const data = await response.json();
            setResult(data.results || []);

            if(query && data.results.length > 0) {
                console.log('🚀 Calling updateSearchCount...');
                await updateSearchCount(query, data.results[0]); // ✅ Added await
                console.log('✅ updateSearchCount completed');
            }
        } catch(e){
            setError(e.message);
            setResult([]);
            console.error('Fetch error:', e);
        }finally{
            setLoading(false);
        }
    }
    const loadTrendingMovies = async () => {
        try{
            const movies = await getTrendingMovies();
            setTrendingMovies(movies);
        }catch(e){
            console.error(e);
        }
    }
    useEffect(() => {
        fetchMovies(debounceSearchTerm)
    }, [debounceSearchTerm]);

    useEffect(() => {
        loadTrendingMovies(trendingMovies)
    }, [])

    return (
        <main>
            <div className="pattern" />
            <div className="wrapper">
                <header>
                    <img src="src/public/hero.png" alt="Hero"/>
                    <h1>
                        Find <span className="text-gradient">Movies</span> you'll enjoy without the hassle
                    </h1>
                    <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                </header>
                {trendingMovies.length > 0 && (
                    <section className="trending">
                        <h2>Trending Movies</h2>
                        <ul>
                            {trendingMovies.map((movie , index) => (
                                <li key={movie.$id}>
                                    <p>{index + 1}</p>
                                    <img src={movie.poster_url} alt={movie.title} />
                                </li>
                            ))
                            }
                        </ul>
                    </section>)
                }
                <section className="all-movies">
                    <h2>All Movies</h2>
                    {loading ? (
                        <Spinner/>
                    ) : error ? (
                        <p className="text-red-500">{error}</p>
                    ) : result.length === 0 ? (
                        <p className="text-white">No movies found</p>
                    ) : (
                        <ul>
                            {result.map((movie) => (
                                <li key={movie.id}>
                                    <MovieCard movie={movie}/>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>
            </div>
        </main>
    );
}

export default App