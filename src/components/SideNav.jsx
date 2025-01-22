import { first151Pokemon, getFullPokedexNumber } from "../utils/index"
import { useState } from "react"

export function SideNav(props) {
  const [searchValue, setSearchValue] = useState("")
  const {
    setSelectedPokemon,
    selectedPokemon,
    handleToggleMenu,
    showSideMenu,
    setShowSideMenu,
  } = props

  const filteredPokemon = first151Pokemon.filter((val, index) => {
    if (val.toLowerCase().includes(searchValue.toLowerCase())) return true
    if (getFullPokedexNumber(index).includes(searchValue)) return true
    return false
  })

  return (
    <nav className={`${showSideMenu ? "open" : " "}`}>
      <div className={`header ${showSideMenu ? "open" : " "}`}>
        <button onClick={handleToggleMenu} className='open-nav-button'>
          <i class='fa-solid fa-arrow-left'></i>
        </button>

        <h1>Pokedex</h1>
      </div>

      <input
        placeholder='E.g. 001 or Bulba...'
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
      />

      {filteredPokemon.map((pokemon, index) => {
        const truePokemonIndex = first151Pokemon.indexOf(pokemon)
        return (
          <button
            onClick={() => {
              setSelectedPokemon(truePokemonIndex)
              // setSearchValue("")
              setShowSideMenu(false)
            }}
            className={`${"nav-card"} ${
              truePokemonIndex === selectedPokemon ? "nav-card-selected" : ""
            }`}
            key={index}
          >
            <p>{getFullPokedexNumber(truePokemonIndex)}</p>
            <p>{pokemon}</p>
          </button>
        )
      })}
    </nav>
  )
}
