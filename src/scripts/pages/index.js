import recipes from "../../data/recipes.js";
import { createDropdown, initializeDropdown } from "../components/dropdown.js";
import { recipeCard } from "../components/recipeCard.js";

const ingredientsDropdown = document.getElementById("ingredients-button");
const recipesContainer = document.getElementById("recipes-container");
const searchInput = document.querySelector("input[type='text']");

let activeTags = [];

// Filtrer les recettes en fonction du texte de recherche et des tags
function filterRecipes(searchText, activeTags = []) {
  let filteredRecipes = recipes;

  // Filtre par texte si plus de 3 caractères
  if (searchText.length >= 3) {
    const searchLower = searchText.toLowerCase();
    filteredRecipes = filteredRecipes.filter((recipe) => {
      return (
        recipe.name.toLowerCase().includes(searchLower) ||
        recipe.ingredients.some((ing) =>
          ing.ingredient.toLowerCase().includes(searchLower)
        ) ||
        recipe.description.toLowerCase().includes(searchLower)
      );
    });
  }

  // Filtre par tags (intersection des résultats)
  if (activeTags.length > 0) {
    filteredRecipes = filteredRecipes.filter((recipe) => {
      return activeTags.every((tag) => {
        const tagLower = tag.text.toLowerCase();
        switch (tag.type) {
          case "ingredient":
            return recipe.ingredients.some((ing) =>
              ing.ingredient.toLowerCase().includes(tagLower)
            );
          case "ustensil":
            return recipe.ustensils.some((ust) =>
              ust.toLowerCase().includes(tagLower)
            );
          case "appliance":
            return recipe.appliance.toLowerCase().includes(tagLower);
          default:
            return false;
        }
      });
    });
  }

  return filteredRecipes;
}

// Afficher les recettes filtrées ou un message si aucun résultat
function displayRecipes(recipesToDisplay = recipes) {
  if (recipesToDisplay.length === 0) {
    const searchText = searchInput.value.trim();
    recipesContainer.innerHTML = `
      <div class="text-center p-4">
        <p>Aucune recette ne contient "${searchText}", vous pouvez chercher 
        "tarte aux pommes", "poisson", etc.</p>
      </div>
    `;
  } else {
    recipesContainer.innerHTML = recipesToDisplay
      .map((recipe) => recipeCard(recipe))
      .join("");
  }
}

// Gérer les tags actifs

function addTag(text, type) {
  activeTags.push({ text, type });
  updateSearch();
}

function removeTag(text) {
  activeTags = activeTags.filter((tag) => tag.text !== text);
  updateSearch();
}

// Mettre à jour la recherche
function updateSearch() {
  const searchText = searchInput.value.trim();
  const filteredRecipes = filterRecipes(searchText, activeTags);
  displayRecipes(filteredRecipes);
  updateDropdownLists(filteredRecipes);
}

// Mettre à jour les listes des dropdowns en fonction des recettes filtrées
function updateDropdownLists(filteredRecipes) {
  // Extraire les données
  const ingredients = new Set();
  const ustensils = new Set();
  const appliances = new Set();

  filteredRecipes.forEach((recipe) => {
    recipe.ingredients.forEach((ing) =>
      ingredients.add(ing.ingredient.toLowerCase())
    );
    recipe.ustensils.forEach((ust) => ustensils.add(ust.toLowerCase()));
    appliances.add(recipe.appliance.toLowerCase());
  });

  // Correction du sélecteur pour cibler le bon conteneur
  const filtersContainer = document.getElementById("filters-container");
  if (!filtersContainer) {
    console.error("Container des filtres non trouvé");
    return;
  }

  filtersContainer.innerHTML = `
    ${createDropdown("ingredients", "Ingrédients", Array.from(ingredients))}
    ${createDropdown("appliances", "Appareils", Array.from(appliances))}
    ${createDropdown("utensils", "Ustensiles", Array.from(ustensils))}
  `;

  // Initialiser les comportements
  initializeDropdown("ingredients", (selected) =>
    addTag(selected, "ingredient")
  );
  initializeDropdown("appliances", (selected) => addTag(selected, "appliance"));
  initializeDropdown("utensils", (selected) => addTag(selected, "utensil"));
}

// Initialiser l'affichage
displayRecipes();

// Écouteur d'événement pour la recherche principale
searchInput.addEventListener("input", (e) => {
  updateSearch();
});

// Appeler updateDropdownLists au chargement initial
updateDropdownLists(recipes);
