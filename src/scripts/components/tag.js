/**
 * Crée le HTML pour un tag
 * @param {Object} tag - L'objet tag
 * @param {string} tag.text - Le texte du tag
 * @param {string} tag.type - Le type du tag (ingredient, appliance, ustensil)
 * @returns {string} Le HTML du tag
 */
export function createTag(tag) {
  return `
    <div class="relative bg-yellow rounded-[0.625rem]">
      <button 
        class="tag-close-button flex items-center gap-[3.75rem] size-full text-[0.875rem] text-[#000000] px-[1.12rem] py-[1.06rem] justify-center"
        data-tag-text="${tag.text}"
      >
        ${tag.text.charAt(0).toUpperCase() + tag.text.slice(1)}
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="14" 
          height="13" 
          viewBox="0 0 14 13" 
          fill="none"
        >
          <path 
            d="M12 11.5L7 6.5M7 6.5L2 1.5M7 6.5L12 1.5M7 6.5L2 11.5" 
            stroke="#1B1B1B" 
            stroke-width="2.16667" 
            stroke-linecap="round" 
            stroke-linejoin="round"
          />
        </svg>
      </button>
    </div>
  `;
}
