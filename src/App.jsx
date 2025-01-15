import { useState } from "react"
import { Header } from "./components/Header"
import { SideNav } from "./components/SideNav"
import { PokeCard } from "./components/PokeCard"

function App() {
  const [selectedPokemon, setSelectedPokemon] = useState(0)

  return (
    <>
      <Header />
      <SideNav setSelectedPokemon={setSelectedPokemon} />
      <PokeCard selectedPokemon={selectedPokemon} />
    </>
  )
}

export default App
