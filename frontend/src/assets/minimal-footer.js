(function (d, w) {
  var state = {
    dom: {
      popularCitiesContainer: d.querySelector(".ha--footer_cities"),
      togglePopularCitiesHeader: d.querySelector(".ha--footer_cities-header"),
      togglePopularCitiesHeaderSvg: d.querySelector(
        ".ha--footer_cities-header span svg"
      ),
      togglePopularCitiesText: d.querySelector(
        ".ha--footer_cities-header span"
      ),
      togglePopularCitiesPlusIcon: d.querySelector(
        ".ha--footer_cities-header svg.ha-ui-plus"
      ),
      togglePopularCitiesMinusIcon: d.querySelector(
        ".ha--footer_cities-header svg.ha-ui-minus"
      ),
      additionalCitiesContainer: d.querySelector(
        ".ha--footer_additional-cities"
      ),
      toggleAdditionalCitiesBtn: d.querySelector(
        ".ha--footer_toggle-additional-cities"
      ),
      toggleAdditionalCitiesPlusIcon: d.querySelector(
        ".ha--footer_toggle-additional-cities svg.ha-ui-plus"
      ),
      toggleAdditionalCitiesMinusIcon: d.querySelector(
        ".ha--footer_toggle-additional-cities svg.ha-ui-minus"
      ),
    },
  };
  var init = function () {
    if (d.querySelector(".ha--footer_cities-header")) {
      d.querySelector(".ha--footer_cities-header").addEventListener(
        "click",
        toggleMobilePopularCities
      );
    }
    if (d.querySelector(".ha--footer_toggle-additional-cities")) {
      d.querySelector(".ha--footer_toggle-additional-cities").addEventListener(
        "click",
        toggleAdditionalCities
      );
    }
    if (d.querySelectorAll(".ha--footer_links-header").length > 0) {
      d.querySelectorAll(".ha--footer_links-header").forEach(function (header) {
        header.addEventListener("click", toggleAccordian);
      });
    }
  };
  var toggleMobilePopularCities = function (event) {
    if (state.dom.togglePopularCitiesHeader && w.innerWidth <= 1023) {
      state.dom.popularCitiesContainer.classList.toggle("active");
      state.dom.togglePopularCitiesHeader.classList.toggle("open");
    } else {
      return;
    }
    if (
      state.dom.togglePopularCitiesPlusIcon &&
      state.dom.togglePopularCitiesMinusIcon
    ) {
      state.dom.togglePopularCitiesPlusIcon.classList.toggle("hide-icon");
      state.dom.togglePopularCitiesPlusIcon.classList.toggle("show-icon");
      state.dom.togglePopularCitiesMinusIcon.classList.toggle("show-icon");
      state.dom.togglePopularCitiesMinusIcon.classList.toggle("hide-icon");
    }
    if (state.dom.additionalCitiesContainer.classList.contains("active")) {
      toggleAdditionalCities();
    }
  };
  var toggleAdditionalCities = function () {
    if (state.dom.additionalCitiesContainer) {
      state.dom.additionalCitiesContainer.classList.toggle("active");
      state.dom.toggleAdditionalCitiesBtn.classList.toggle("open");
    }
    if (
      state.dom.toggleAdditionalCitiesBtn &&
      state.dom.toggleAdditionalCitiesPlusIcon.style.display === "none"
    ) {
      state.dom.toggleAdditionalCitiesPlusIcon.style.display = "inline";
      state.dom.toggleAdditionalCitiesMinusIcon.style.display = "none";
    } else {
      state.dom.toggleAdditionalCitiesPlusIcon.style.display = "none";
      state.dom.toggleAdditionalCitiesMinusIcon.style.display = "inline";
    }
  };
  var toggleAccordian = function (event) {
    if (w.innerWidth >= 1024) {
      return;
    }
    if (
      !(
        event.target.matches("h3") ||
        event.target.matches("svg") ||
        event.target.matches("path")
      )
    ) {
      return;
    }
    var footerLinksHeader = event.target.parentNode;
    var closestUl = footerLinksHeader.nextElementSibling;
    closestUl.classList.toggle("active");
    var i = [].filter.call(footerLinksHeader.children, function (childElement) {
      return childElement.nodeName === "svg";
    });
    if (i.length < 1) {
      return;
    }
    if (i[0].style.display === "none") {
      i[0].style.display = "inline-block";
      i[1].style.display = "none";
    } else {
      i[1].style.display = "inline-block";
      i[0].style.display = "none";
    }
  };
  d.addEventListener("DOMContentLoaded", function () {
    init();
  });
})(document, window);
