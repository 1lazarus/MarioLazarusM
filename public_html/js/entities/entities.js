// TODO

game.PlayerEntity = me.Entity.extend({
    init: function(x, y, settings) {
        this._super(me.Entity, 'init', [x, y, {
                image: "mario",
                spritewidth: "128",
                spiteheight: "128",
                width: 128,
                height: 128,
                getShape: function() {
                    return (new me.Rect(0, 0, 128, 128)).toPolygon();
                }
            }]);

        this.renderable.addAnimation("idle", [4]);
        //create animation called smallwalk using pictures of tye image defined above(mario)
        //sets the animation to run through 8-13
        ///the last number says we switch between pictures every 80 milliseconds
        
        this.renderable.addAnimation("smallWalk", [8,9,10,11,12,13],80); 

        this.renderable.setCurrentAnimation("idle");
        //sets the speed we go on the x axis(first number) and y axis(second number)
        this.body.setVelocity(5, 20);
        //sets the camera(viewport) to follow maroi's position(pos) on both the x and y axis//
        me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);
        
    },
    update: function(delta) {
       //checks if the right key is pressed and if it is, executes the following statement

        if (me.input.isKeyPressed("right")) {
            //sets the positiion of mario on the x axis by adding the x value from the setVelocity times the timer.tick
            //me.timer.tick usesnthe time since last animation to make the distance traveled smooth
            this.body.vel.x += this.body.accel.x * me.timer.tick;
        }
        else if (me.input.isKeyPressed("left")) {
            this.body.vel.x -= this.body.accel.x * me.timer.tick;
        } else {
            this.body.vel.x = 0;
        }
                this.body.update(delta);
                me.collision.check(this, true, this.collideHandler.bind(this), true);


        if (me.input.isKeyPressed("up")) {
            this.body.vel.y -= this.body.accel.y * me.timer.tick;
        }

       
        me.collision.check(this, true, this.collideHandler.bind(this), true);

        if (this.body.vel.x !== 0) {
            if (!this.renderable.isCurrentAnimation("smallWalk")) {
                this.renderable.setCurrentAnimation("smallWalk");
                this.renderable.setAnimationFrame();
            }
        } else {
            this.renderable.setCurrentAnimation("idle");
        }
        
        

        this._super(me.Entity, "update", [delta]);
        return true;
    },
    collideHandler: function(response) {

    }

});


game.LevelTrigger = me.Entity.extend({
    init: function(x, y, settings) {
        console.log("trigger");
        this._super(me.Entity, 'init', [x, y, settings]);
        //if something collides with this object then we will call the onCollision function and pass it
        // a hidden parameter of this object
        this.body.onCollision = this.onCollision.bind(this);
        this.level = settings.level;
        this.xSpawn = settings.xSpawn;
        this.ySpawn = settings.ySpawn;
        
    },
    onCollision: function() {
        console.log("collision");
        this.body.setCollisionMask(me.collision.types.NO_OBJECT);
        me.levelDirector.loadLevel(this.level);
        me.state.current().resetPlayer(this.xSpawn, this.ySpawn);

    }

});