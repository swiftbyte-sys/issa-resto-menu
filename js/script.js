document.addEventListener('DOMContentLoaded', () => {
  // ... existing code ...

  // Food sub-navigation functionality
  const foodNavButtons = document.querySelectorAll('.food-nav-btn');
  foodNavButtons.forEach(button => {
    button.addEventListener('click', function() {
      const subsectionId = this.getAttribute('data-subsection');
      showFoodSubSection(subsectionId, this);
    });
  });
});

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
