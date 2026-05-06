import { useState, useEffect } from "react";
 

function App() {
  const [meals, setMeals] = useState([]);
  const [status, setStatus] = useState("idle");

  useEffect(() => {
    const controller = new AbortController();

    async function loadMeals() {
      try {
        setStatus("loading");

        const response = await fetch(
          "https://api.freeapi.app/api/v1/public/meals",
          { signal: controller.signal }
        );

        const data = await response.json();

        setMeals(data.data.data); // ✅ meals data
        setStatus("success");
      } catch (error) {
        if (error.name === "AbortError") {
          console.log("Fetch aborted");
        } else {
          setStatus("error");
        }
      }
    }

    loadMeals();

    return () => {
      controller.abort();
    };
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Meals Listing</h1>

      {status === "loading" && (
        <p className="text-blue-500">Loading meals...</p>
      )}

      {status === "error" && (
        <p className="text-red-500">Something went wrong!</p>
      )}

      {status === "success" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {meals.map((meal) => (
            <div
              key={meal.idMeal}
              className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition"
            >
              <img
                src={meal.strMealThumb}
                alt={meal.strMeal}
                className="w-full h-48 object-cover rounded-lg"
              />

              <h3 className="mt-2 font-semibold text-lg">
                {meal.strMeal}
              </h3>

              <p className="text-gray-600 text-sm">
                {meal.strCategory || "Category N/A"}
              </p>

              <a
                href={meal.strYoutube}
                target="_blank"
                rel="noreferrer"
                className="text-blue-500 text-sm mt-2 inline-block"
              >
                ▶ Watch Recipe
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;