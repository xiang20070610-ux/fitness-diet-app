import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Settings from './pages/Settings'
import Result from './pages/Result'
import RecipeDetail from './pages/RecipeDetail'
import Mine from './pages/Mine'
import Favorites from './pages/Favorites'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="settings" element={<Settings />} />
        <Route path="result" element={<Result />} />
        <Route path="mine" element={<Mine />} />
      </Route>
      <Route path="recipe/:id" element={<RecipeDetail />} />
      <Route path="favorites" element={<Favorites />} />
    </Routes>
  )
}
