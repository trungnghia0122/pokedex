import { useEffect, useState, useRef } from "react"

export function PokeCard(props) {
  const { selectedPokemon } = props
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)

  const abortControllerRef = useRef(null)

  useEffect(() => {
    const fetchPokedex = async () => {
      setLoading(true)

      abortControllerRef.current?.abort()
      abortControllerRef = new AbortController()
      const signal = abortControllerRef.current.signal

      try {
        const url = "https://pokeapi.co/api/v2/"
        const suffix = "pokemon/" + selectedPokemon
        const finalUrl = url + suffix

        const response = await fetch(finalUrl, signal)
        const pokemonData = await response.json()
        setData(pokemonData)
      } catch (e) {
        console.log(e)
      } finally {
        setLoading(false)
      }

      fetchPokedex()
    }
  }, [selectedPokemon])

  return (
    <>
      <h1>{selectedPokemon}</h1>
    </>
  )
}
