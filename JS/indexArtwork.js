/*
“The structure 'world,' with its double movement of sedimentation and spontaneity, is at the center of consciousness.”
Maurice Merleau-Ponty
*/

let river = [];
let facet = true;
let bouncers = [];
let mouseBouncer;
//let distance = 210;
let distance = [];
let sensitivity = 120;


function setup() {
    var canvasDiv = document.getElementById('hero-artwork');
    var width = windowWidth;
    var height = windowHeight;
    var sketchCanvas = createCanvas(windowWidth, windowHeight);
    sketchCanvas.parent("hero-artwork");

    // Create apexes that will form the facets
    for (let i = 0; i < 90; i++) {
        river.push(new Apex());
    }

    // Create three bouncing particles to interact with particles and create facets
    for (let i = 0; i < 3; i++) {
        bouncers.push(new Bouncer());
    }

    // Create a mouse-following bouncer
    mouseBouncer = new MouseBouncer();

    if (windowWidth < 600) {
        distance = 90;
      } else if (windowWidth < 900) {
        distance = 140;
    } else if (windowWidth < 1500) {
        distance = 210;
      } else {
        distance = 240;
      }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);

    // Reposition elements if needed
    for (let pn1 of river) {
        if (pn1.x < windowWidth) pn1.x = random(windowWidth);
        if (pn1.y < windowHeight) pn1.y = random(windowHeight);
    }

    for (let bouncer of bouncers) {
        if (bouncer.x < windowWidth) bouncer.x = random(windowWidth);
        if (bouncer.y < windowHeight) bouncer.y = random(windowHeight);
    }

    if (windowWidth < 600) {
        distance = 90;
      } else if (windowWidth < 900) {
        distance = 140;
    } else if (windowWidth < 1500) {
        distance = 210;
      } else {
        distance = 240;
      }

    // Call draw once to update the sketch immediately after resizing
    draw();

}



function draw() {
    background("#eeeeee");

    // Update and display river particles
    for (let pn1 of river) {
        pn1.update();
        pn1.display();
    }

    // Create facets
    createFacets();

    // Display and update the bouncers
    for (let bouncer of bouncers) {
        bouncer.update();
        bouncer.display();
    }

    // Update and display the mouse bouncer
    mouseBouncer.update();
    mouseBouncer.display();
}


function createFacets() {
    for (let i = 0; i < river.length - 2; i++) {
        let pn1 = river[i];
        for (let j = i + 1; j < river.length - 1; j++) {
            let pn2 = river[j];
            if (dist(pn1.x, pn1.y, pn2.x, pn2.y) < distance) {
                for (let k = j + 1; k < river.length; k++) {
                    let pn3 = river[k];
                    if (isValidFacet(pn1, pn2, pn3)) {
                        drawFacet(pn1, pn2, pn3);
                    }
                }
            }
        }
    }
}

function isValidFacet(pn1, pn2, pn3) {
    return (
        dist(pn3.x, pn3.y, pn2.x, pn2.y) < distance &&
        (bouncers.some(bouncer =>
            dist(pn3.x, pn3.y, bouncer.x + sensitivity, bouncer.y) < sensitivity &&
            dist(pn1.x, pn1.y, bouncer.x, bouncer.y) < 100
        ) ||
            dist(pn3.x, pn3.y, mouseBouncer.x + sensitivity, mouseBouncer.y) < sensitivity &&
            dist(pn1.x, pn1.y, mouseBouncer.x, mouseBouncer.y) < 100)
    );
}

function drawFacet(pn1, pn2, pn3) {
    if (facet) {
        stroke(255, 1);
        fill(pn3.c.levels[0], pn3.c.levels[1], pn3.c.levels[2], 97);
    } else {
        noFill();
        strokeWeight(1);
        stroke(0, 20);
    }

    // facets are simple triangles
    beginShape();
    vertex(pn1.x, pn1.y);
    vertex(pn2.x, pn2.y);
    vertex(pn3.x, pn3.y);
    endShape(CLOSE);
}


class Apex {
    constructor() {
        this.x = random(windowWidth);
        this.y = random(windowHeight);
        this.r = random(2, 5);
        this.speed = random(0.04, 0.8);
        this.c = this.randomColor();
    }

    randomColor() {
        const colors = ["#FF2E82", "#FF2E82", "#2AF5F8", "#00E1FF", "#E2E269", "#E2E269", "#FF9580"];
        return color(random(colors));
    }

    display() {
        push();
        noStroke();
        fill(this.c);
        ellipse(this.x, this.y, this.r, this.r);
        pop();
    }

    update() {
        this.x += this.speed;
        this.y += 0.001;

        if (this.x > windowWidth) this.x = random(-1, -20);
        if (this.y > windowHeight) this.y = -1;
    }
}

class Bouncer {
    constructor() {
        this.x = random(windowWidth);
        this.y = random(windowHeight);
        this.r = 2;
        this.xspeed = 1;
        this.yspeed = 0.6;
    }

    display() {
        push();
        fill(255, 70);
        noStroke();
        circle(this.x, this.y, this.r);
        pop();
    }

    update() {
        this.x += this.xspeed;
        this.y += this.yspeed;

        if (this.x > width - this.r / 2 || this.x < this.r / 2) {
            this.xspeed = -this.xspeed;
        }

        if (this.y > height - this.r / 2 || this.y < this.r / 2) {
            this.yspeed = -this.yspeed;
        }
    }

}

class MouseBouncer {
    constructor() {
        this.x = mouseX;
        this.y = mouseY;
        this.r = 1;
    }

    display() {
        push();
        fill(255, 0, 0, 100);
        noStroke();
        circle(this.x, this.y, this.r);
        pop();
    }

    update() {
        this.x = mouseX;
        this.y = mouseY;
    }
}

