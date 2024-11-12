import recipes from "../../data/recipes.js";
import { createDropdown, initializeDropdown } from "../components/dropdown.js";
import { recipeCard } from "../components/recipeCard.js";
import { createTag } from "../components/tag.js";

const ingredientsDropdown = document.getElementById("ingredients-button");
const recipesContainer = document.getElementById("recipes-container");
const searchInput = document.querySelector("input[type='text']");

let activeTags = [];

// Ajout d'une variable pour suivre l'état
let wasAboveThreeChars = false;

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
  // Mettre à jour le nombre de recettes
  const recipeCount = document.querySelector(".font-anton");
  recipeCount.textContent = `${recipesToDisplay.length} recettes`;

  if (recipesToDisplay.length === 0) {
    const searchText = searchInput.value.trim();
    recipesContainer.innerHTML = `
      <div></div>
      <div class="text-center p-4 w-full">
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

// Mettre à jour l'affichage des tags
function updateTagsDisplay() {
  const tagsContainer = document.getElementById("active-tags");
  tagsContainer.innerHTML = activeTags.map((tag) => createTag(tag)).join("");

  // Ajouter les écouteurs d'événements pour les boutons de fermeture
  tagsContainer.querySelectorAll(".tag-close-button").forEach((button) => {
    button.addEventListener("click", () => {
      removeTag(button.dataset.tagText);
    });
  });
}

// Gérer les tags actifs

function addTag(text, type) {
  // Vérifier si le tag existe déjà
  if (!activeTags.some((tag) => tag.text === text)) {
    activeTags.push({ text, type });
    updateTagsDisplay();
    updateSearch();
  }
}

function removeTag(text) {
  activeTags = activeTags.filter((tag) => tag.text !== text);
  updateTagsDisplay();
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

  // Filtrer les éléments déjà sélectionnés
  const activeIngredients = new Set(
    activeTags
      .filter((tag) => tag.type === "ingredient")
      .map((tag) => tag.text.toLowerCase())
  );
  const activeUstensils = new Set(
    activeTags
      .filter((tag) => tag.type === "ustensil")
      .map((tag) => tag.text.toLowerCase())
  );
  const activeAppliances = new Set(
    activeTags
      .filter((tag) => tag.type === "appliance")
      .map((tag) => tag.text.toLowerCase())
  );

  const filteredIngredients = Array.from(ingredients).filter(
    (ing) => !activeIngredients.has(ing)
  );
  const filteredUstensils = Array.from(ustensils).filter(
    (ust) => !activeUstensils.has(ust)
  );
  const filteredAppliances = Array.from(appliances).filter(
    (app) => !activeAppliances.has(app)
  );

  // Correction du sélecteur pour cibler le bon conteneur
  const filtersContainer = document.getElementById("filters-container");
  if (!filtersContainer) {
    console.error("Container des filtres non trouvé");
    return;
  }

  filtersContainer.innerHTML = `
    ${createDropdown("ingredients", "Ingrédients", filteredIngredients)}
    ${createDropdown("appliances", "Appareils", filteredAppliances)}
    ${createDropdown("ustensil", "Ustensiles", filteredUstensils)}
  `;

  // Initialiser les comportements
  initializeDropdown("ingredients", (selected) =>
    addTag(selected, "ingredient")
  );
  initializeDropdown("appliances", (selected) => addTag(selected, "appliance"));
  initializeDropdown("ustensil", (selected) => addTag(selected, "ustensil"));
}

// Initialiser l'affichage
displayRecipes();

// Écouteur d'événement pour la recherche principale
searchInput.addEventListener("input", (e) => {
  const searchText = e.target.value.trim();

  if (searchText.length >= 3) {
    wasAboveThreeChars = true;
    updateSearch();
  } else if (wasAboveThreeChars) {
    // Réinitialisation uniquement quand on repasse sous les 3 caractères
    wasAboveThreeChars = false;
    displayRecipes(recipes);
    updateDropdownLists(recipes);
  }
});

// Appeler updateDropdownLists au chargement initial
updateDropdownLists(recipes);
