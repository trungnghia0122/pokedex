import { useEffect, useState, useRef } from "react"
import { getFullPokedexNumber, getPokedexNumber } from "../utils"
import { TypeCard } from "./TypeCard"
import { Modal } from "./Modal"

const BASE_URL = "https://pokeapi.co/api/v2/pokemon/"

export function PokeCard(props) {
  const { selectedPokemon } = props
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [skill, setSkill] = useState(null)
  const [skillLoading, setSkillLoading] = useState(false)

  const abortControllerRef = useRef(null)
  const skillAbortControllerRef = useRef(null)

  const { name, height, abilities, stats, types, moves, sprites } = data || {}

  const imgList = Object.keys(sprites || {}).filter((sprite) => {
    return sprites[sprite] !== null && !["versions", "other"].includes(sprite)
  })

  const skillList = moves?.filter((val) =>
    val.version_group_details.some(
      (detail) => detail.version_group.name === "firered-leafgreen"
    )
  )

  const fetchMoveData = async (move, moveURL) => {
    setSkillLoading(true)

    const cache = JSON.parse(localStorage.getItem("pokedex-skills")) || {}
    if (cache[move]) {
      setSkill(cache[move])
      setSkillLoading(false)
      return
    }

    skillAbortControllerRef.current?.abort()
    skillAbortControllerRef.current = new AbortController()
    const signal = skillAbortControllerRef.current.signal

    try {
      const response = await fetch(moveURL, { signal })
      const data = await response.json()
      const skillDescriptionList = data?.flavor_text_entries.filter(
        (val) => val.version_group.name === "firered-leafgreen"
      )
      const skillObj = {
        name: move,
        description: skillDescriptionList[0].flavor_text,
      }
      setSkill(skillObj)
      cache[move] = skillObj
      localStorage.setItem("pokedex-skills", JSON.stringify(cache))
    } catch (e) {
      console.log(e)
    } finally {
      setSkillLoading(false)
    }
  }

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
      {skillLoading && (
        <Modal>
          <p>Skill Loading...</p>
        </Modal>
      )}
      {skill && (
        <Modal
          handleCloseModal={() => {
            setSkill(null)
          }}
        >
          <div>
            <h6>Name</h6>
            <h2 className='skill-name'>{skill.name.replaceAll("-", " ")}</h2>
          </div>
          <div>
            <h6>Description</h6>
            <p>{skill.description}</p>
          </div>
        </Modal>
      )}
      <div>
        <h4>#{getFullPokedexNumber(selectedPokemon)}</h4>
        <h2>{name}</h2>
      </div>

      <div className='type-container'>
        {types.map((typeObj, index) => {
          return <TypeCard key={index} type={typeObj?.type.name} />
        })}
      </div>

      <img
        className='default-img'
        src={"/pokemon/" + getFullPokedexNumber(selectedPokemon) + ".png"}
        alt={`${name}-large-img`}
      />
      <div className='img-container'>
        {imgList.map((spriteKey, index) => {
          const imgUrl = sprites[spriteKey]
          return <img key={index} src={imgUrl} />
        })}
      </div>

      <h3>Stats</h3>

      <div className='stats-card'>
        {stats.map((statObj, index) => {
          const { stat, base_stat } = statObj

          return (
            <div className='stat-item' key={index}>
              <p>{stat?.name.replaceAll("-", " ")}</p>
              <h4>{base_stat}</h4>
            </div>
          )
        })}
      </div>

      <h3>Moves</h3>
      <div className='pokemon-move-grid'>
        {skillList.map((moveObj, index) => {
          return (
            <button
              onClick={() =>
                fetchMoveData(moveObj?.move?.name, moveObj?.move?.url)
              }
              key={index}
              className='button-card pokemon-move'
            >
              <p>{moveObj?.move?.name.replace("-", " ")}</p>
            </button>
          )
        })}
      </div>
    </div>
  )
}
