/**
 * Creates an HTML recipe card from a recipe object
 * @param {Object} recipe - The recipe object containing:
 * @param {string} recipe.image - Path to recipe image
 * @param {string} recipe.name - Recipe name
 * @param {number} recipe.time - Cooking time in minutes
 * @param {string} recipe.description - Recipe description
 * @param {Array<Object>} recipe.ingredients - Array of ingredients objects containing:
 * @param {string} recipe.ingredients[].ingredient - Ingredient name
 * @param {number} [recipe.ingredients[].quantity] - Optional ingredient quantity
 * @param {string} [recipe.ingredients[].unit] - Optional ingredient unit
 * @returns {string} HTML string for the recipe card
 */
export function recipeCard(recipe) {
  return `
    <article class="overflow-hidden bg-white rounded-[1.3125rem] shadow w-full max-w-[23.75rem] mx-auto">
      <div class="relative h-[15.8125rem]">
        <img
          src="/src/assets/images/recettes/${recipe.image}"
          alt="${recipe.name}"
          loading="lazy"
          class="object-cover w-full h-full"
        />
        <span class="absolute px-[0.94rem] py-[0.31rem] text-[0.75rem] rounded-full bg-yellow top-[1.31rem] right-[1.25rem]">${
          recipe.time
        } min</span>
      </div>
      <div class="px-[1.563rem] pt-8 pb-[3.81rem] flex flex-col gap-[1.81rem]">
        <h2 class="text-lg font-normal font-anton">${recipe.name}</h2>
        <div class="flex flex-col gap-[0.94rem]">
          <h3 class="text-[0.75rem] font-bold text-gray-300 tracking-[0.0675rem] uppercase">Recipe</h3>
          <p class="text-sm font-normal text-black line-clamp-4">${
            recipe.description
          }</p>
        </div>
        <div>
          <h3 class="mb-2 text-sm text-gray-500 uppercase">Ingredients</h3>
          <div class="grid grid-cols-2 gap-4">
            ${recipe.ingredients
              .map(
                (ing) => `
              <div class="text-sm">
                <p class="font-medium text-black">${ing.ingredient}</p>
                <p class="text-gray-300 text-[0.875rem]">${
                  ing.quantity
                    ? `${ing.quantity}${ing.unit ? ing.unit : ""}`
                    : ""
                }</p>
              </div>
            `
              )
              .join("")}
          </div>
        </div>
      </div>
    </article>
  `;
}
