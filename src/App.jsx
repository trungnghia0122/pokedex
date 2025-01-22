import { useState } from "react"
import { Header } from "./components/Header"
import { SideNav } from "./components/SideNav"
import { PokeCard } from "./components/PokeCard"

function App() {
  const [selectedPokemon, setSelectedPokemon] = useState(0)
  const [showSideMenu, setShowSideMenu] = useState(false)

  const handleToggleMenu = () => {
    setShowSideMenu(!showSideMenu)
  }

  return (
    <>
      <Header handleToggleMenu={handleToggleMenu} />
      <SideNav
        setSelectedPokemon={setSelectedPokemon}
        selectedPokemon={selectedPokemon}
        handleToggleMenu={handleToggleMenu}
        showSideMenu={showSideMenu}
        setShowSideMenu={setShowSideMenu}
      />
      <PokeCard selectedPokemon={selectedPokemon} />
    </>
  )
}

export default App
