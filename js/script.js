document.addEventListener('DOMContentLoaded', () => {
  // Initialize menu items with animations
  const items = document.querySelectorAll('.item');
  items.forEach((item, index) => {
    item.style.animationDelay = `${index * 0.05}s`;
  });

  // Main navigation functionality
  const navButtons = document.querySelectorAll('.nav-btn');
  navButtons.forEach(button => {
    button.addEventListener('click', function() {
      const sectionId = this.getAttribute('data-section');
      showSection(sectionId, this);
    });
  });

  // Food sub-navigation functionality
  const foodNavButtons = document.querySelectorAll('.food-nav-btn');
  foodNavButtons.forEach(button => {
    button.addEventListener('click', function() {
      const subsectionId = this.getAttribute('data-subsection');
      showFoodSubSection(subsectionId, this);
    });
  });
});

/* Beverages Navigation */
.beverages-nav {
  display: flex;
  overflow-x: auto;
  gap: 8px;
  padding: 10px 5px;
  margin: 0 -5px 15px -5px;
  scrollbar-width: none;
  background-color: var(--content-bg);
  backdrop-filter: blur(2px);
  position: sticky;
  top: 0;
  z-index: 10;
}

.beverages-nav::-webkit-scrollbar {
  display: none;
}

.beverages-nav-btn {
  flex: 0 0 auto;
  padding: 8px 15px;
  border: none;
  border-radius: 20px;
  background-color: #f0f0f0;
  color: #555;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.beverages-nav-btn.active {
  background-color: var(--secondary); /* Using secondary color for beverages */
  color: white;
}

/* Beverage Sub-Sections */
.beverage-sub-section {
  display: none;
  animation: fadeIn 0.3s ease-in-out;
}

.beverage-sub-section.active {
  display: block;
}

/* Specific beverage category styling */
#alcoholic h3 {
  color: #B76E79; /* Different color for alcoholic section */
}

#smoothie h3 {
  color: #FF6B6B; /* Different color for smoothies */
}

function showSection(sectionId, activeButton) {
  // Hide all sections
  document.querySelectorAll('.section').forEach(section => {
    section.classList.remove('active');
  });
  
  // Show selected section
  document.getElementById(sectionId).classList.add('active');
  
  // Update nav buttons
  document.querySelectorAll('.nav-btn').forEach(button => {
    button.classList.remove('active');
  });
  
  if (activeButton) {
    activeButton.classList.add('active');
  }
}

function showFoodSubSection(subsectionId, activeButton) {
  // Hide all food sub-sections
  document.querySelectorAll('.food-sub-section').forEach(section => {
    section.classList.remove('active');
  });
  
  // Show selected sub-section
  document.getElementById(subsectionId).classList.add('active');
  
  // Update food nav buttons
  document.querySelectorAll('.food-nav-btn').forEach(button => {
    button.classList.remove('active');
  });
  
  if (activeButton) {
    activeButton.classList.add('active');
  }
}
