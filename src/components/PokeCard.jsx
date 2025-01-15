import { useEffect, useState, useRef } from "react"
import { getFullPokedexNumber, getPokedexNumber } from "../utils"
import { TypeCard } from "./TypeCard"

const BASE_URL = "https://pokeapi.co/api/v2/pokemon/"

export function PokeCard(props) {
  const { selectedPokemon } = props
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)

  const abortControllerRef = useRef(null)

  const { name, height, abilities, stats, types, moves, sprites } = data || {}

  useEffect(() => {
    const cache = JSON.parse(localStorage.getItem("pokedex")) || {}
    if (selectedPokemon in cache) {
      setData(cache[selectedPokemon])
      return
    }

    const fetchPokedex = async () => {
      setLoading(true)
      abortControllerRef.current?.abort()
      abortControllerRef.current = new AbortController()
      const signal = abortControllerRef.current.signal

      try {
        const response = await fetch(
          BASE_URL + getPokedexNumber(selectedPokemon),
          signal
        )
        const pokemonData = await response.json()
        setData(pokemonData)
        console.log(pokemonData)
        cache[selectedPokemon] = pokemonData
        localStorage.setItem("pokedex", JSON.stringify(cache))
      } catch (e) {
        console.log(e)
      } finally {
        setLoading(false)
      }
    }

    fetchPokedex()
  }, [selectedPokemon])

  if (loading || !data) {
    return (
      <div>
        <h4>Loading...</h4>
      </div>
    )
  }

  return (
    <div className='poke-card'>
      <div>
        <h4>#{getFullPokedexNumber(selectedPokemon)}</h4>
        <h2>{name}</h2>
      </div>

      <div className='type-container'>
        {types.map((typeObj, index) => {
          return <TypeCard key={index} type={typeObj?.type.name} />
        })}
      </div>
    </div>
  )
}
