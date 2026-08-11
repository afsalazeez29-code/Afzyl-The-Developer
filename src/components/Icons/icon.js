gsap.registerPlugin(ScrollTrigger);


document.addEventListener("DOMContentLoaded", () => {

  const section = document.querySelector(
    "[data-agent-first-section]"
  );

  if (!section) return;


  const list = section.querySelector(
    "[data-bouncer-list]"
  );

  const items = list.querySelectorAll(
    "[data-bouncer]"
  );


  if (!list || items.length === 0) return;


  /*
    Store each icon's horizontal position.
    This is used to create the wave movement.
  */

  const positions = [];

  items.forEach((item) => {

    const itemRect = item.getBoundingClientRect();
    const listRect = list.getBoundingClientRect();

    positions.push(
      itemRect.left -
      listRect.left +
      itemRect.width / 2
    );

  });


  const screenWidth = window.innerWidth;


  /*
    GSAP quick setters
    Faster than repeatedly using gsap.to()
  */

  const setters = Array.from(items).map((item) =>
    gsap.quickSetter(item, "y", "px")
  );


  /*
    Floating wave state
  */

  const state = {
    phase: 0
  };


  function updateWave() {

    const phase = state.phase;


    items.forEach((item, index) => {


      const angle =
        ((positions[index] + phase) /
        screenWidth) *
        Math.PI *
        2;


      const y =
        Math.sin(angle) * 35;


      setters[index](y);


    });

  }



  let floatingAnimation = null;



  function startFloatingAnimation() {


    floatingAnimation = gsap.to(state, {

      phase: screenWidth,

      duration: 7,

      ease: "none",

      repeat: -1,

      onUpdate: updateWave

    });


  }



  /*
    Initial icon positions
  */

  items.forEach((item, index) => {


    const initialY =
      Math.sin(
        (positions[index] /
        screenWidth) *
        Math.PI *
        2
      ) * 35;



    gsap.set(item, {

      x: 0,

      y: initialY,

      opacity: 1,

      force3D: true

    });


  });



  /*
    Start animation when section enters viewport
  */

  ScrollTrigger.create({

    trigger: section,

    start: "top 55%",


    onEnter: () => {


      if (floatingAnimation) {

        floatingAnimation.play();

      } else {

        startFloatingAnimation();

      }

    }

  });



  /*
    Pause / Resume for performance
  */

  ScrollTrigger.create({

    trigger: section,

    start: "top bottom",

    end: "bottom top",


    onEnter: () => {

      floatingAnimation?.play();

    },


    onLeave: () => {

      floatingAnimation?.pause();

    },


    onEnterBack: () => {

      floatingAnimation?.play();

    },


    onLeaveBack: () => {

      floatingAnimation?.pause();

    }

  });
  
});