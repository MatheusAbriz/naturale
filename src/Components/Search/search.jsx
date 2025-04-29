import '../../assets/css/search.css'

const Search = ({ texto }) =>{
    return(
        <div className="container-pesquisar">
            <input type="text" name="pesquisar" id="pesquisar" placeholder={ texto }/>
            <span className="cursor-pointer"/>
        </div>
    )
}

export default Search;