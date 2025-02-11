export function createDropdown(id, label, items = [], type) {
  return `
    <div class="relative">
      <div 
        id="${id}-container"
        class="bg-white rounded-[0.6875rem]"
        style="transition: box-shadow 300ms"
      >
        <button
          id="${id}-button"
          class="flex items-center justify-between w-full text-[1rem] text-black px-4 pt-[1.06rem] pb-[0.88rem] gap-[3.94rem]"
        >
          <span>${label}</span>
          <svg
            class="w-4 h-4 transition-transform duration-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        <div
          id="${id}-dropdown"
          class="absolute w-full transition-all duration-300 max-h-0 overflow-hidden bg-white z-10 rounded-b-[0.6875rem]"
        >
          <div class="relative flex px-4">
            <input
              type="text"
              placeholder=""
              class="w-full p-2 text-black placeholder-gray-400 rounded-[0.125rem] border-solid border-gray-400 border-[1px]"
            />
            <button
              class="absolute right-[2.68rem] top-1/2 -translate-y-1/2 p-2 hidden"
            >
              <svg width="0.4375rem" height="0.4375rem" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M1.23405 1.23397C1.65712 0.810905 2.34305 0.810905 2.76611 1.23397L8.50008 6.96794L14.234 1.23397C14.6571 0.810905 15.343 0.810905 15.7661 1.23397C16.1892 1.65704 16.1892 2.34297 15.7661 2.76604L10.0321 8.50001L15.7661 14.234C16.1892 14.657 16.1892 15.343 15.7661 15.766C15.343 16.1891 14.6571 16.1891 14.234 15.766L8.50008 10.0321L2.76611 15.766C2.34305 16.1891 1.65712 16.1891 1.23405 15.766C0.810981 15.343 0.810981 14.657 1.23405 14.234L6.96802 8.50001L1.23405 2.76604C0.810981 2.34297 0.810981 1.65704 1.23405 1.23397Z" fill="#7A7A7A"/>
              </svg>
            </button>

            <svg
              class="absolute w-4 h-4 transform -translate-y-1/2 right-[1.72rem] top-1/2"
              fill="none"
              stroke="#7A7A7A"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          <ul class="pt-[0.94rem] text-black gap-[0.25rem] flex flex-col max-h-[200px] overflow-y-auto scrollbar-hide">
            ${items
              .map(
                (item) => `
              <li class="px-4 py-[0.56rem] transition-bg duration-300 hover:bg-yellow cursor-pointer">
                ${item.charAt(0).toUpperCase() + item.slice(1)}
              </li>
            `
              )
              .join("")}
          </ul>
        </div>
      </div>
    </div>
  `;
}

export function initializeDropdown(id, onSelect) {
  const button = document.getElementById(`${id}-button`);
  const dropdown = document.getElementById(`${id}-dropdown`);
  const container = document.getElementById(`${id}-container`);
  const input = dropdown.querySelector("input");
  const list = dropdown.querySelector("ul");

  button.addEventListener("click", () => {
    const isOpen =
      dropdown.style.maxHeight !== "0px" && dropdown.style.maxHeight !== "";
    const arrow = button.querySelector("svg");

    // Fermer tous les autres dropdowns
    document.querySelectorAll('[id*="-dropdown"]').forEach((otherDropdown) => {
      if (otherDropdown !== dropdown) {
        const otherContainer = otherDropdown.closest('[id*="-container"]');
        const otherArrow = otherContainer.querySelector("svg");

        otherContainer.style.boxShadow = "none";
        otherDropdown.style.maxHeight = "0px";
        otherArrow.style.transform = "rotate(0deg)";
      }
    });

    if (!isOpen) {
      // Ouverture
      dropdown.style.maxHeight = dropdown.scrollHeight + "px";
      container.style.boxShadow =
        "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)";
      arrow.style.transform = "rotate(180deg)";
      container.style.borderBottomLeftRadius = "0";
      container.style.borderBottomRightRadius = "0";
      input.value = "";
      setTimeout(() => {
        input.focus();
      }, 300);
    } else {
      // Fermeture
      dropdown.style.maxHeight = "0px";
      container.style.boxShadow = "none";
      arrow.style.transform = "rotate(0deg)";

      // Attendre que le dropdown soit complètement caché
      dropdown.addEventListener("transitionend", function handler() {
        container.style.borderBottomLeftRadius = "0.6875rem";
        container.style.borderBottomRightRadius = "0.6875rem";
        dropdown.removeEventListener("transitionend", handler);
      });
    }
  });

  // Gérer la recherche
  input.addEventListener("input", (e) => {
    const searchValue = e.target.value.toLowerCase();
    const items = Array.from(list.children);
    const clearButton = input.parentElement.querySelector("button");

    // Afficher/masquer le bouton de croix
    clearButton.style.display = searchValue ? "block" : "none";

    items.forEach((item) => {
      const text = item.textContent.toLowerCase();
      item.style.display = text.includes(searchValue) ? "" : "none";
    });
  });

  // Gérer le clic sur le bouton de croix dans le dropdown
  const clearButton = input.parentElement.querySelector("button");
  clearButton.addEventListener("click", () => {
    input.value = "";
    input.dispatchEvent(new Event("input"));
    input.focus();
  });

  // Gérer la sélection d'un item
  list.addEventListener("click", (e) => {
    if (e.target.tagName === "LI") {
      onSelect(e.target.textContent.trim());
      dropdown.style.maxHeight = "0px";
      container.style.boxShadow = "none";
      button.querySelector("svg").style.transform = "rotate(0deg)";
    }
  });

  // Fermer le dropdown si on clique en dehors
  document.addEventListener("click", (e) => {
    if (!e.target.closest(`#${id}-container`)) {
      dropdown.style.maxHeight = "0px";
      container.style.boxShadow = "none";
      button.querySelector("svg").style.transform = "rotate(0deg)";

      // Attendre que l'animation de fermeture soit terminée avant de restaurer les coins arrondis
      dropdown.addEventListener("transitionend", function handler() {
        container.style.borderBottomLeftRadius = "0.6875rem";
        container.style.borderBottomRightRadius = "0.6875rem";
        dropdown.removeEventListener("transitionend", handler);
      });
    }
  });
}
