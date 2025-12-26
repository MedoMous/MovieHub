import './index.css'
import Search from "./components/Search.jsx";
import {useState} from "react";

const App = () => {
    const [searchTerm , setSearchTerm] = useState('')
    return(
        <main>
            <div className="pattern"/>
            <div className="wrapper">
                <header>
                    <img src ="src/assets/public/hero.png"  alt="assets/public/hero.png"/>
                    <h1>
                        Find <span className="text-gradient"> Movies </span> you'll enjoy without the hassle
                    </h1>
                </header>
                <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} setSeearchTerm={setSearchTerm}/>
                <h1 className="text-white">{searchTerm}</h1>
            </div>
        </main>
    );
}

export default App
