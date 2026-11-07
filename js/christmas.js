export async function initChristmas() {
    await loadFull(tsParticles);

    await tsParticles.load({
        id: "tsparticles",
        options: {
            fullScreen: {
                enable: false
            },
            particles: {
                number: {
                    value: 60,
                    density: {
                        enable: true
                    }
                },
                color: {
                    value: "#ffffff"
                },
                opacity: {
                    value: {
                        min: 0.3,
                        max: 0.8
                    }
                },
                shape: {
                    type: "image",
                    options: {
                        image: {
                            src: "/assets/deco/snowflake.png",
                            width: 32,
                            height: 32
                        }
                    }
                },
                size: {
                    value: {
                        min: 10,
                        max: 20
                    }
                },
                move: {
                    enable: true,
                    direction: "bottom",
                    speed: {
                        min: 1,
                        max: 3
                    },
                    random: true,
                    straight: false
                }
            },
            detectRetina: true
        }
    });
}