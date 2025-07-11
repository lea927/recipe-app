import './App.css'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'

const fetchRecipes = async (searchTerm) => {
  if (!searchTerm) return { meals: [] }
  
  const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`)
  if (!response.ok) {
    throw new Error('Failed to fetch recipes')
  }
  return response.json()
}

const fetchRandomRecipe = async () => {
  const response = await fetch('https://www.themealdb.com/api/json/v1/1/random.php')
  if (!response.ok) {
    throw new Error('Failed to fetch random recipe')
  }
  return response.json()
}

function App() {
  const [search, setSearch] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [shouldFetchRandom, setShouldFetchRandom] = useState(false)

  const { data, isLoading, error } = useQuery({
    queryKey: ['recipes', searchQuery],
    queryFn: () => fetchRecipes(searchQuery),
    enabled: searchQuery.length > 0,
  })

  const { 
    data: randomData, 
    isLoading: randomIsLoading, 
    error: randomError 
  } = useQuery({
    queryKey: ['randomRecipe', shouldFetchRandom],
    queryFn: fetchRandomRecipe,
    enabled: shouldFetchRandom,
  })

  const handleSearchChange = (e) => {
    setSearch(e.target.value)
  }

  const handleSearchClick = () => {
    setSearchQuery(search.trim())
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearchClick()
    }
  }

  const handleRandomRecipeClick = () => {
    setSearchQuery('')
    setShouldFetchRandom(true)
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="mb-6 flex gap-2">
        <input
          type="text"
          value={search}
          onChange={handleSearchChange}
          onKeyPress={handleKeyPress}
          placeholder="Search recipe..."
          className="border rounded px-3 py-2 flex-1 border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSearchClick}
          disabled={!search.trim() || isLoading}
          className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white px-6 py-2 rounded font-medium transition-colors"
        >
          {isLoading ? 'Searching...' : 'Search'}
        </button>
      </div>
      
      <div className="mb-6 text-center">
        <button
          onClick={handleRandomRecipeClick}
          disabled={randomIsLoading}
          className="bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white px-6 py-2 rounded font-medium transition-colors"
        >
          {randomIsLoading ? 'Getting Random Recipe...' : 'Get Random Recipe'}
        </button>
      </div>

      {/* Display loading state */}
      {isLoading && searchQuery && (
        <div className="text-center py-4">
          <p>Searching for recipes...</p>
        </div>
      )}

      {/* Display error states */}
      {error && (
        <div className="text-center py-4 text-red-500">
          <p>Error fetching recipes: {error.message}</p>
        </div>
      )}

      {randomError && (
        <div className="text-center py-4 text-red-500">
          <p>Error fetching random recipe: {randomError.message}</p>
        </div>
      )}

      {/* Display search results */}
      {data && data.meals && (
        <>
          <h2 className="text-2xl font-bold mb-4">Search Results</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {data.meals.map((meal) => (
              <div key={meal.idMeal} className="border rounded-lg p-4 shadow-sm">
                <img 
                  src={meal.strMealThumb} 
                  alt={meal.strMeal}
                  className="w-full h-48 object-cover rounded-md mb-3"
                />
                <h3 className="font-semibold text-lg mb-2">{meal.strMeal}</h3>
                <p className="text-gray-600 text-sm mb-2">Category: {meal.strCategory}</p>
                <p className="text-gray-600 text-sm">Area: {meal.strArea}</p>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Display random recipe */}
      {randomData && randomData.meals && (
        <>
          <h2 className="text-2xl font-bold mb-4">Random Recipe</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {randomData.meals.map((meal) => (
              <div key={meal.idMeal} className="border rounded-lg p-4 shadow-sm">
                <img 
                  src={meal.strMealThumb} 
                  alt={meal.strMeal}
                  className="w-full h-48 object-cover rounded-md mb-3"
                />
                <h3 className="font-semibold text-lg mb-2">{meal.strMeal}</h3>
                <p className="text-gray-600 text-sm mb-2">Category: {meal.strCategory}</p>
                <p className="text-gray-600 text-sm">Area: {meal.strArea}</p>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Display no results message */}
      {data && !data.meals && searchQuery && (
        <div className="text-center py-4 text-gray-500">
          <p>No recipes found for "{searchQuery}"</p>
        </div>
      )}
    </div>
  )
}

export default App
