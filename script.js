document.addEventListener("DOMContentLoaded", function () {
  const mainContentElements = document.querySelectorAll(".main-content");

  function checkElementsVisibility() {
      mainContentElements.forEach((element) => {
          const elementPosition = element.getBoundingClientRect().top;
          const windowHeight = window.innerHeight;
          if (elementPosition < windowHeight - 100) {
              element.classList.add("show");
          }
      });
  }

  window.addEventListener("scroll", checkElementsVisibility);
});