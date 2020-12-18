const canvas = document.querySelector('canvas')

const ctx = canvas.getContext('2d')

canvas.width = window.innerWidth
canvas.height = window.innerHeight






const playerScore = document.querySelector('#playerScore')

const startTheGame = document.querySelector('#startGameButton')

const gameMenu = document.querySelector('#endMenu')

const bigScore = document.querySelector('#bigScore')








class Player {
    constructor(x, y, radius, colour) {
        this.x = x
        this.y = y
        this.radius = radius
        this.colour = colour
    }

    draw() {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2, true)
        ctx.fillStyle = this.colour
        ctx.fill()
    }
}



class Projectile {
    constructor(x, y, radius, colour, velocity) {
        this.x = x
        this.y = y
        this.radius = radius
        this.colour = colour
        this.velocity = velocity
    }

    draw() {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2, true)
        ctx.fillStyle = this.colour
        ctx.fill()
    }

    update() {
        this.draw()
        this.x = this.x + this.velocity.x
        this.y = this.y + this.velocity.y
    }
}



class Enemy {
    constructor(x, y, radius, colour, velocity) {
        this.x = x
        this.y = y
        this.radius = radius
        this.colour = colour
        this.velocity = velocity
    }

    draw() {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2, true)
        ctx.fillStyle = this.colour
        ctx.fill()
    }

    update() {
        this.draw()
        this.x = this.x + this.velocity.x
        this.y = this.y + this.velocity.y
    }
}





class Particle {
    constructor(x, y, radius, colour, velocity) {
        this.x = x
        this.y = y
        this.radius = radius
        this.colour = colour
        this.velocity = velocity
        this.alpha = 1
    }

    draw() {
        ctx.save()
        ctx.globalAlpha = this.alpha
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2, true)
        ctx.fillStyle = this.colour
        ctx.fill()
        ctx.restore()
    }

    update() {
        this.draw()
        this.x = this.x + this.velocity.x
        this.y = this.y + this.velocity.y
        this.alpha -= 0.03
    }
}
















const xHalf = canvas.width/2
const yHalf = canvas.height/2

let player = new Player(xHalf, yHalf, 20, 'white')

let projectiles = []
let enemies = []
let particles = []


function init() {
    player = new Player(xHalf, yHalf, 20, 'white')
    projectiles = []
    enemies = []
    particles = []
    score = 0
    playerScore.innerHTML = score
    bigScore.innerHTML = score
}












var spawnEnemies = 
    setInterval (
        function() {
            const radius = (Math.random() * (30 - 5)) + 5

            let x
            let y

            if (Math.random() < 0.5) {
                x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius
                
                y = Math.random() * canvas.height
            } else {
                x = Math.random() * canvas.width
                
                y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius
            }

            const angle = Math.atan2(yHalf - y, xHalf - x) 

            const colour = `hsl(${Math.random() * 360}, 50%, 50%)`

            const speedMult = Math.floor(Math.random() * 4)

            const velocity = {
            x: Math.cos(angle) * speedMult,
            y: Math.sin(angle) * speedMult
            }

            enemies.push(
                new Enemy(
                    x,
                    y,
                    radius,
                    colour,
                    velocity
                )
            )
        },
        500 // This number controls how many enemies appear in a second
    )
    








let animationID

let score = 0



// Everything to do with projectiles
function animate() {


    // Recalls this function, so this basically creates an endless loop
    animationID = requestAnimationFrame(animate)


    // Removes 'drawn' projectiles and enemies
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)


    // Creates the player
    player.draw()

    particles.forEach(
        function(particle, particleIndex) {

            if (particle.alpha <= 0) {
                particles.splice(particleIndex, 1)
            } else {
                particle.update()
            }
        }
        
    )


    // Looping through all projectiles
    projectiles.forEach(
        function(projectile, index) {


            // Creates the projectile
            projectile.update()

            // Removes a projectile which goes off-screen
            if ((projectile.x + projectile.radius < 0) || (projectile.x - projectile.radius > canvas.width) || (projectile.y + projectile.radius < 0) || (projectile.y - projectile.radius > canvas.height)) {
                setTimeout(
                    function() {
                        projectiles.splice(index, 1)
                    },
                    0
                )
            }
        }
    )

    // Looping through all enemies in the enemy array
    enemies.forEach(
        function(enemy, enemyIndex) {


            // Creates the enemy
            enemy.update()


            // Distance between the player and an enemy
            const distPlayer = Math.hypot(player.x - enemy.x, player.y - enemy.y)


            // Ends the game once an enemy hits the player
            if ((distPlayer - enemy.radius - player.radius) < 1) {
                cancelAnimationFrame(animationID)
                gameMenu.style.display = 'flex'
                bigScore.innerHTML = score
                startTheGame.innerHTML = 'Restart'
                clearInterval(spawnEnemies())
            }


            // Looping through all projectiles
            projectiles.forEach(
                function(projectile, projectilesIndex) {


                    // Distance between the projectile and an enemy
                    const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y)


                    // This is what happens when a projectile hits an enemy
                    if (dist - enemy.radius - projectile.radius < 1) {

                        

                        for (let i = 0; i < enemy.radius * 2; i++) {
                            particles.push(
                                new Particle(
                                    projectile.x,
                                    projectile.y,
                                    Math.random() * 2,
                                    enemy.colour,
                                    {
                                        x: (Math.random() - 0.5) * (Math.random() * 6),
                                        y: (Math.random() - 0.5) * (Math.random() * 6)
                                    }
                                )
                            )
                        }

                        if (enemy.radius - 8 > 8) {

                            gsap.to(enemy, {
                                radius: enemy.radius - 8
                            })

                            setTimeout(
                                function() {
                                    projectiles.splice(projectilesIndex, 1)
                                },
                                0
                            )

                        } else {

                            score += 1
                            playerScore.innerHTML = score

                            setTimeout(
                                function() {
                                    enemies.splice(enemyIndex, 1)
                                    projectiles.splice(projectilesIndex, 1)
                                },
                                0
                            )

                        }
                    }
                }
            )
        }
    )
}










['click', 'touchstart', 'touchend'].forEach(
    function (type) {
        window.addEventListener (type,
            function(event) {
                
                const angle = Math.atan2(event.clientY - yHalf, event.clientX - xHalf)

                const velocity = {
                x: Math.cos(angle) * 5,
                y: Math.sin(angle) * 5
                }

                projectiles.push(
                    new Projectile(
                        xHalf,
                        yHalf,
                        5,
                        'white',
                        velocity
                    )
                )
            }
        )
    }
)


startTheGame.addEventListener('click',
    function() {
        init ()
        animate()
        spawnEnemies
        gameMenu.style.display = 'none'
    }
)
























