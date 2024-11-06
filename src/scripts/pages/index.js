import { toggleDropdown } from "../components/selector.js";

const ingredientsDropdown = document.getElementById("ingredients-button");

ingredientsDropdown.addEventListener("click", () => {
  console.log("ingredientsDropdown");
  toggleDropdown("ingredients-dropdown");
});
