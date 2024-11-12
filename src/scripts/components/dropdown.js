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
                ${item}
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

    items.forEach((item) => {
      const text = item.textContent.toLowerCase();
      item.style.display = text.includes(searchValue) ? "" : "none";
    });
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
    }
  });
}
