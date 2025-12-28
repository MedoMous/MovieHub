
const Search = ({searchTerm , setSearchTerm} ) => {

    return(
        <div className = "search">
            <div>
                <img src="src/assets/public/search.svg" alt="search"/>
                <input
                    type="text"
                    placeholder="Search for a movie"
                    onChange={(event) =>
                        setSearchTerm(event.target.value)}
                />
            </div>
        </div>
    );
}
export default Search;