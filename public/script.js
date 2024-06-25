(function () {
  var controller = new ScrollMagic.Controller({
    globalSceneOptions: {
      triggerHook: "onLeave",
      duration: "100%", // Adjust the duration as needed
    },
  });

  var slides = document.querySelectorAll("section.panel");

  slides.forEach(function (slide) {
    new ScrollMagic.Scene({
      triggerElement: slide,
    })

      .setPin(slide, { pushFollowers: false })
      .addTo(controller);
  });
})();
