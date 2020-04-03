import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./vendor/bootstrap/css/bootstrap.min.css";
import "./vendor/icofont/icofont.min.css";
import "./vendor/boxicons/css/boxicons.min.css";
import "./css/aos.css";
import "./css/index.css";
import $ from "jquery";
import "bootstrap";
import "jquery.easing";
import AOS from "aos";

/* Interaction between backend and frontend:
axios.get('/api/hello').then(d => {
    console.log(d.data);
});*/

ReactDOM.render(<App />, document.getElementById("website"));

// Toggle .header-scrolled class to #header when page is scrolled
$(window).scroll(function() {
  if ($(this).scrollTop() > 100) {
    $("#header").addClass("header-scrolled");
  } else {
    $("#header").removeClass("header-scrolled");
  }
});

if ($(window).scrollTop() > 100) {
  $("#header").addClass("header-scrolled");
}

// Smooth scroll for the navigation menu and links with .scrollto classes
$(document).on(
  "click",
  ".nav-menu a, .mobile-nav li:lt(3) a, .scrollto",
  function(e) {
    if (
      window.location.pathname.replace(/^\//, "") ===
        this.pathname.replace(/^\//, "") &&
      window.location.hostname === this.hostname
    ) {
      e.preventDefault();
      var target = $(this.hash);
      if (target.length) {
        var scrollto = target.offset().top;
        var scrolled = 20;
        if ($("#header").length) {
          scrollto -= $("#header").outerHeight();
          if (!$("#header").hasClass("header-scrolled")) {
            scrollto += scrolled;
          }
        }
        if ($(this).attr("href") === "/#header") {
          scrollto = 0;
        }
        $("html, body").animate(
          {
            scrollTop: scrollto
          },
          1500,
          "easeInOutExpo"
        );
        if ($(this).parents(".nav-menu, .mobile-nav").length) {
          $(".nav-menu .active, .mobile-nav .active").removeClass("active");
          $(this)
            .closest("a")
            .addClass("active");
        }
        if ($("body").hasClass("mobile-nav-active")) {
          $("body").removeClass("mobile-nav-active");
          $(".mobile-nav-toggle i").toggleClass(
            "icofont-navigation-menu icofont-close"
          );
          $(".mobile-nav-overly").fadeOut();
        }
        return false;
      }
    }
  }
);

// Mobile Navigation
if ($(".nav-menu").length) {
  var $mobile_nav = $(".nav-menu")
    .clone()
    .prop({
      class: "mobile-nav d-lg-none"
    });
  $("body").append($mobile_nav);
  $("body").prepend(
    '<button type="button" class="mobile-nav-toggle d-lg-none"><i class="icofont-navigation-menu"></i></button>'
  );
  $("body").append('<div class="mobile-nav-overly"></div>');
  $(".mobile-nav li:nth-child(4)").remove();

  $(document).on("click", ".mobile-nav-toggle", function(e) {
    $("body").toggleClass("mobile-nav-active");
    $(".mobile-nav-toggle i").toggleClass(
      "icofont-navigation-menu icofont-close"
    );
    $(".mobile-nav-overly").toggle();
  });

  $(document).on("click", ".mobile-nav .drop-down > a", function(e) {
    e.preventDefault();
    $(this)
      .next()
      .slideToggle(300);
    $(this)
      .parent()
      .toggleClass("active");
  });
  $(document).click(function(e) {
    var container = $(".mobile-nav, .mobile-nav-toggle");
    if (!container.is(e.target) && container.has(e.target).length === 0) {
      if ($("body").hasClass("mobile-nav-active")) {
        $("body").removeClass("mobile-nav-active");
        $(".mobile-nav-toggle i").toggleClass(
          "icofont-navigation-menu icofont-close"
        );
        $(".mobile-nav-overly").fadeOut();
      }
    }
  });
} else if ($(".mobile-nav, .mobile-nav-toggle").length) {
  $(".mobile-nav, .mobile-nav-toggle").hide();
}

// Back to top button
$(window).scroll(function() {
  if ($(this).scrollTop() > 100) {
    $(".back-to-top").fadeIn("slow");
  } else {
    $(".back-to-top").fadeOut("slow");
  }
});
$(document).on("click", ".back-to-top", function() {
  $("html, body").animate(
    {
      scrollTop: 0
    },
    1500,
    "easeInOutExpo"
  );
  return false;
});

// Initi AOS
AOS.init({
  duration: 800,
  easing: "ease-in-out"
});
