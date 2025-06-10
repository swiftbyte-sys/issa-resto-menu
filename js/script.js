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

// Add this to your existing DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', () => {
  // ... existing code ...

  // Beverages sub-navigation functionality
  const beveragesNavButtons = document.querySelectorAll('.beverages-nav-btn');
  beveragesNavButtons.forEach(button => {
    button.addEventListener('click', function() {
      const subsectionId = this.getAttribute('data-subsection');
      showBeverageSubSection(subsectionId, this);
    });
  });
});

// Add this new function
function showBeverageSubSection(subsectionId, activeButton) {
  // Hide all beverage sub-sections
  document.querySelectorAll('.beverage-sub-section').forEach(section => {
    section.classList.remove('active');
  });
  
  // Show selected sub-section
  document.getElementById(subsectionId).classList.add('active');
  
  // Update beverages nav buttons
  document.querySelectorAll('.beverages-nav-btn').forEach(button => {
    button.classList.remove('active');
  });
  
  if (activeButton) {
    activeButton.classList.add('active');
  }
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
