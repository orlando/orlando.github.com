(function () {
  function Particle(config) {
    this.init(config);
  }

  Particle.prototype = Object.assign({}, Particle.prototype, {
    init: function init(config) {
      Object.keys(config).forEach(function (key) {
        this[key] = config[key];
      }, this);
    },

    tick: function tick() {
      this.x = this.x + this.accelerationX;
      this.y = this.y + this.accelerationY;
    },

    draw: function draw() {
      var context = this.context;

      context.beginPath();
      context.fillStyle = this.color;
      context.arc(this.x, this.y, this.radius, 0, Math.PI*2, true);
      context.closePath();
      context.fill();
    }
  });

  var Background = {
    element: null,
    context: null,
    particles: [],

    init: function init(config) {
      var devicePixelRatio = window.devicePixelRatio || 1;
      this.config = config;
      this.element = document.getElementById('background');
      this.context = this.element.getContext('2d');
      this.context.scale(devicePixelRatio, devicePixelRatio);
      this.resizeCanvas();
      this.drawParticles(config.numberOfparticles);
    },

    drawParticle: function drawParticle(x, y, accelerationX, accelerationY, color, radius) {
      var config = this.config;
      var radius = this.randomNumberBetween(config.minRadius, config.maxRadius);
      var color = config.colors[Math.floor(Math.random() * config.colors.length)];
      var x = this.randomNumberBetween(10, this.element.width);
      var y = this.randomNumberBetween(10, this.element.height);
      var accelerationX = Math.random() * (Math.round(Math.random()) * 2 - 1);
      var accelerationY = Math.random() * (Math.round(Math.random()) * 2 - 1);

      return new Particle({
        accelerationX: accelerationX,
        accelerationY: accelerationY,
        color: color,
        context: this.context,
        radius: radius,
        x: x,
        y: y
      });
    },

    drawParticles: function drawParticles(numberOfParticles) {
      var config = this.config;
      numberOfParticles = numberOfParticles || 0;

      for (var i = 0; i < numberOfParticles; i = i + 1) {
        var particle = this.drawParticle();
        particle.draw();

        this.particles.push(particle);
      }

      this.gameLoop();
    },

    resizeCanvas: function resizeCanvas() {
      this.element.width = window.innerWidth;
      this.element.height = window.innerHeight;
    },

    clearCanvas: function clear() {
      this.context.clearRect(0, 0, this.element.width, this.element.height);
    },

    randomNumberBetween: function randomNumberBetween(min, max) {
      return Math.floor(Math.random() * max) + min;
    },

    gameLoop: function gameLoop() {
      setInterval(this._tick.bind(this), 30);
    },

    _tick: function _tick() {
      this.clearCanvas();

      this.particles.forEach(function (particle) {
        particle.tick();
        particle.draw();
      });
    }
  };

  var day = (new Date).getDate();
  var particles = day * 2;

  if (day < 5) {
    particles = 10;
  }

  Background.init({
    numberOfparticles: particles,
    colors: ["#FF7849", "#FF49DB", "#13CE66", "#1FB6FF"],
    minRadius: 3,
    maxRadius: 6
  });
}());
