document.addEventListener('DOMContentLoaded', () => {
  // Existing nav buttons code
  const navButtons = document.querySelectorAll('.nav-btn');
  navButtons.forEach(button => {
    button.addEventListener('click', function () {
      const sectionId = this.getAttribute('data-section');
      showSection(sectionId, this);
    });
  });

  // Food sub-navigation buttons
  const foodNavButtons = document.querySelectorAll('.food-nav-btn');
  foodNavButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-subsection');

      // Hide all sub-sections under food
      document.querySelectorAll('#food .sub-section').forEach(sec => {
        sec.classList.remove('active');
      });

      // Show the selected sub-section
      document.getElementById(target).classList.add('active');

      // Update active button styles
      foodNavButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // Animate items on load
  const items = document.querySelectorAll('.item');
  items.forEach((item, index) => {
    item.style.animationDelay = `${index * 0.05}s`;
  });
});

function showSection(sectionId, activeButton) {
  document.querySelectorAll('.section').forEach(section => {
    section.classList.remove('active');
  });
  document.getElementById(sectionId).classList.add('active');

  document.querySelectorAll('.nav-btn').forEach(button => {
    button.classList.remove('active');
  });

  if (activeButton) {
    activeButton.classList.add('active');
  }
}
