import { first151Pokemon, getFullPokedexNumber } from "../utils/index"

export function SideNav(props) {
  const { setSelectedPokemon } = props

  return (
    <nav>
      <div className={`header`}>
        <h1 className='text-gradient'>Pokedex</h1>
      </div>

      <input />

      {first151Pokemon.map((pokemon, index) => {
        return (
          <button
            onClick={() => setSelectedPokemon(pokemon)}
            className={`${"nav-card"}`}
            key={index}
          >
            <p>{getFullPokedexNumber(index)}</p>
            <p>{pokemon}</p>
          </button>
        )
      })}
    </nav>
  )
}
