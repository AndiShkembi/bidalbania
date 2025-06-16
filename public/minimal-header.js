if (window.NodeList && !NodeList.prototype.forEach) {
  NodeList.prototype.forEach = Array.prototype.forEach;
}
if (!Element.prototype.matches) {
  Element.prototype.matches =
    Element.prototype.msMatchesSelector ||
    Element.prototype.webkitMatchesSelector;
}
if (!Element.prototype.closest) {
  Element.prototype.closest = function (s) {
    var el = this;
    do {
      if (el.matches(s)) return el;
      el = el.parentElement || el.parentNode;
    } while (el !== null && el.nodeType === 1);
    return null;
  };
}
function goToStorefront() {
  window.location.href =
    "#" + window.location.search;
}
(function (d, w) {
  var state = {
    dom: {
      navDropdownContainers: d.querySelectorAll(".ha--nav_dropdown_container"),
      navDropdownContainersExclHover: d.querySelectorAll(
        ".ha--nav_dropdown_container:not(.hover)"
      ),
      openSiteSearchButton: d.querySelectorAll("#site-search .ha--hss_open")[0],
      closeSiteSearchButton: d.querySelectorAll(
        "#site-search .ha--hss_close"
      )[0],
      siteSearchForm: document.getElementById("site-search"),
      extMenuButton: d.querySelectorAll("button.ha--ext_menu_button")[0],
      extMenu: d.querySelectorAll(".ha--ext_menu")[0],
      extMenuNavLinks: d.querySelectorAll(
        ".ha--ext_menu .ha--sidebar li > button"
      ),
    },
    startAProjectMenuIsOpen: false,
    extMenuIsOpen: false,
    menuTimer: null,
    navDropdownIsOpen: function () {
      return d.querySelectorAll(".ha--nav_dropdown_container.hover").length > 0;
    },
    initState: null,
    headerInResponsiveMode: function () {
      return (
        d.querySelectorAll('header[data-responsive-mode="true"]').length > 0
      );
    },
  };
  var openNavHover = function (navDropdownContainer) {
    navDropdownContainer.classList.add("hover");
  };
  var handleNavHover = function (event) {
    var link = event.target;
    if (state.dom.extMenu && !state.dom.extMenu.classList.contains("open")) {
      state.menuTimer = setTimeout(function () {
        openNavHover(link);
        state.menuTimer = null;
      }, 150);
    }
  };
  var closeNavHover = function () {
    if (!state.navDropdownIsOpen() && state.menuTimer === null) {
      return;
    }
    clearTimeout(state.menuTimer);
    state.menuTimer = null;
    var openDropdowmContainer = d.querySelector(
      ".ha--nav_dropdown_container.hover"
    );
    if (openDropdowmContainer) {
      openDropdowmContainer.classList.remove("hover");
    }
  };
  var openSiteSearch = function () {
    if (state.dom.extMenu && state.dom.extMenu.classList.contains("open")) {
      toggleExtMenu();
    }
    if (state.dom.siteSearchForm) {
      state.dom.siteSearchForm.classList.add("open");
    }
    if (state.dom.openSiteSearchButton) {
      state.dom.openSiteSearchButton.setAttribute("disabled", "");
    }
  };
  var closeSiteSearch = function () {
    if (
      state.dom.closeSiteSearchButton !== null &&
      typeof state.dom.closeSiteSearchButton !== "undefined"
    ) {
      state.dom.siteSearchForm.classList.remove("open");
      state.dom.openSiteSearchButton.removeAttribute("disabled");
    }
  };
  var toggleExtMenu = function () {
    if (state.dom.siteSearchForm.classList.contains("open")) {
      closeSiteSearch();
    }
    if (state.navDropdownIsOpen()) {
      closeNavHover();
    }
    state.dom.extMenuButton.classList.toggle("active");
    state.dom.extMenu.classList.toggle("open");
  };
  var toggleExtMenuContent = function () {
    var curActiveLink = d.querySelectorAll(
        ".ha--ext_menu button[data-content-target].active"
      )[0],
      curActiveContent = d.querySelectorAll(
        ".ha--ext_menu .ha--ext_menu_content > div.active"
      )[0],
      targetContent = this.getAttribute("data-content-target");
    curActiveLink.classList.toggle("active");
    curActiveContent.classList.toggle("active");
    this.classList.toggle("active");
    d.getElementById(targetContent).classList.toggle("active");
  };
  var resetNavigation = function () {
    closeNavHover();
    if (state.dom.extMenu && state.dom.extMenu.classList.contains("open")) {
      toggleExtMenu();
    }
    if (
      d.getElementById("searchInput") &&
      d.getElementById("searchInput").value !== ""
    ) {
      d.getElementById("searchInput").value = "";
    }
  };
  var init = function () {
    state.initState = "desktop";
    resetNavigation();
    if (state.dom.openSiteSearchButton) {
      state.dom.openSiteSearchButton.addEventListener("click", openSiteSearch);
    }
    if (
      state.dom.closeSiteSearchButton !== null &&
      typeof state.dom.closeSiteSearchButton !== "undefined"
    ) {
      state.dom.closeSiteSearchButton.addEventListener(
        "click",
        closeSiteSearch
      );
    }
    if (state.dom.extMenuButton) {
      state.dom.extMenuButton.addEventListener("click", toggleExtMenu);
    }
    state.dom.extMenuNavLinks.forEach(function (link) {
      link.addEventListener("mouseenter", toggleExtMenuContent);
    });
    state.dom.navDropdownContainers.forEach(function (link) {
      link.addEventListener("mouseenter", handleNavHover);
      link.addEventListener("mouseleave", closeNavHover);
    });
    state.dom.navDropdownContainersExclHover.forEach(function () {
      if (state.menuTimer !== null) {
        clearTimeout(state.menuTimer);
        state.menuTimer = null;
      }
    });
  };
  var uninit = function () {
    state.initState = null;
    resetNavigation();
    if (state.dom.openSiteSearchButton) {
      state.dom.openSiteSearchButton.removeEventListener(
        "click",
        openSiteSearch
      );
    }
    if (
      state.dom.closeSiteSearchButton !== null &&
      typeof state.dom.closeSiteSearchButton !== "undefined"
    ) {
      state.dom.closeSiteSearchButton.removeEventListener(
        "click",
        closeSiteSearch
      );
    }
    if (state.dom.extMenuButton) {
      state.dom.extMenuButton.removeEventListener("click", toggleExtMenu);
    }
    state.dom.extMenuNavLinks.forEach(function (link) {
      link.removeEventListener("mouseenter", toggleExtMenuContent);
    });
    state.dom.navDropdownContainers.forEach(function (link) {
      link.removeEventListener("mouseenter", handleNavHover);
      link.removeEventListener("mouseleave", closeNavHover);
    });
    if (mobileMenuButton) {
      mobileMenuButton.removeEventListener("click", toggleMobileMenu);
    }
  };
  var mobileMenuButton = d.querySelector(
    "button.ha--menu_button.ha--mobile_nav"
  );
  var mobileMenuButtonIcon = d.querySelector(
    "button.ha--menu_button.ha--mobile_nav i.icon"
  );
  var mobileMenu = d.querySelector("nav.ha--header_right");
  var switchPaneButton = d.querySelectorAll(
    ".ha--mobile_nav_button.nav--category"
  );
  var mobileBackButton = d.querySelectorAll(".ha--mobile_nav_button.nav--back");
  var mobileMenuOpenClass = "expanded";
  var menuIconClass = "icon_menu-icon-alt";
  var closeIconClass = "icon_x-thin";
  var desktopRightArrowClass = "icon_arrow";
  var mobileRightArrowClass = "icon_arrow_right_thin";
  var parentClass = "nav--parent_category";
  var activeClass = "nav--active_pane";
  var toggleArrowIcons = function () {
    d.querySelectorAll(".ha--sidebar button i.icon").forEach(function (icon) {
      icon.classList.toggle(desktopRightArrowClass);
      icon.classList.toggle(mobileRightArrowClass);
    });
  };
  var bounceLink = function (event) {
    event.preventDefault();
  };
  var mobileInit = function () {
    state.initState = "mobile";
    toggleArrowIcons();
    if (mobileMenuButton) {
      mobileMenuButton.addEventListener("click", toggleMobileMenu);
    }
    switchPaneButton.forEach(function (link) {
      link.addEventListener("click", slideInPane);
    });
    mobileBackButton.forEach(function (link) {
      link.addEventListener("click", slideOutPane);
    });
    var myAccountLink = d.querySelector(
      '#my-account > a[data-target-pane="my-account"]'
    );
    if (myAccountLink) {
      myAccountLink.addEventListener("click", bounceLink);
    }
  };
  var mobileUninit = function () {
    state.initState = null;
    toggleArrowIcons();
    if (mobileMenuButton) {
      mobileMenuButton.removeEventListener("click", toggleMobileMenu);
    }
    var myAccountLink = d.querySelector(
      '#my-account > a[data-target-pane="my-account"]'
    );
    if (myAccountLink) {
      myAccountLink.removeEventListener("click", bounceLink);
    }
  };
  var toggleMobileMenu = function () {
    mobileMenu.classList.toggle(mobileMenuOpenClass);
    mobileMenuButtonIcon.classList.toggle(menuIconClass);
    mobileMenuButtonIcon.classList.toggle(closeIconClass);
    d.querySelector("body").classList.toggle("scroll-lock");
    if (d.querySelector("div.site-wrapper")) {
      d.querySelector("div.site-wrapper").classList.toggle("scroll-lock");
    }
    resetMobileNav();
  };
  var slideInPane = function (event) {
    var button = event.target.closest("[data-target-pane]");
    var newParentPane = event.target.closest(".ha--mobile_nav_pane");
    var targetPane = d.querySelector(
      '[data-pane-name="' + button.getAttribute("data-target-pane") + '"]'
    );
    targetPane.classList.add(activeClass);
    button.setAttribute("aria-expanded", true);
    newParentPane.classList.add(parentClass);
  };
  var slideOutPane = function (event) {
    var oldActivePane = event.target.closest(".ha--mobile_nav_pane");
    var oldParentPane = oldActivePane.closest("." + parentClass);
    if (
      !oldParentPane ||
      oldParentPane == oldActivePane ||
      oldParentPane == mobileMenu
    ) {
      var paneLink = d.querySelector(
        '[data-target-pane="' +
          oldActivePane.getAttribute("data-pane-name") +
          '"]'
      );
      oldParentPane = paneLink.closest("." + parentClass);
      paneLink.setAttribute("aria-expanded", false);
    }
    oldActivePane.classList.remove(activeClass);
    oldParentPane.classList.remove(parentClass);
  };
  var resetMobileNav = function () {
    var activePanes = d.querySelectorAll("." + activeClass);
    var parentPanes = d.querySelectorAll("." + parentClass);
    if (!activePanes.length && !parentPanes.length) {
      return;
    }
    activePanes.forEach(function (pane) {
      pane.classList.remove(activeClass);
    });
    parentPanes.forEach(function (pane) {
      pane.classList.remove(parentClass);
    });
  };
  if (state.headerInResponsiveMode()) {
    w.addEventListener("resize", function () {
      if (w.innerWidth <= 1024 && state.initState !== "mobile") {
        uninit();
        mobileInit();
      } else if (w.innerWidth > 1024 && state.initState !== "desktop") {
        mobileUninit();
        init();
      }
    });
  }
  d.addEventListener("DOMContentLoaded", function () {
    if (state.headerInResponsiveMode() && w.innerWidth <= 1024) {
      mobileInit();
    } else {
      init();
    }
  });
})(document, window);
