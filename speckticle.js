canvas = document.createElement("canvas");
canvas.id = "game";
canvas.height=window.innerHeight-28;
canvas.width=window.innerWidth-28;
c = canvas.getContext("2d");
document.body.appendChild(canvas);
document.title = "Speckticle Particle Emitter System Test Page"


/*
				Mouse Interaction
		Creates a global mouse object for 
		handling viewer's mouse interaction.
*/
mouse = function(){
	this.x= -100;
	this.y= -100;
	this.lClick= false;
	this.rClick= false;
	this.mClick = false;
	this.lrClick = false;
	this.mouseMove = function(e){
		var env = canvas.getBoundingClientRect();
		mouse.x=e.clientX-env.left;
		mouse.y=e.clientY-env.top;		
	}
	canvas.addEventListener('mousemove',this.mouseMove)
	this.mouseDown = function(e){
		if (e.buttons==1){mouse.lClick=true;}
		if (e.buttons==2){mouse.rClick=true;}
		if (e.buttons==3){mouse.lrClick=true;}
		if (e.buttons==4){mouse.mClick=true;}
	};
	canvas.addEventListener('mousedown',this.mouseDown);
	this.mouseUp = function(e){
		if (e.buttons==0){
			mouse.lClick=false;
			mouse.rClick=false;
			mouse.lrClick=false;
			mouse.mClick=false;
		}
	};
	canvas.addEventListener('mouseup',this.mouseUp);
}
mouse();


var fps = {
	startTime:0,
	frameNumber:0,
	get:function(){
		this.frameNumber++; 
		var d = new Date().getTime(), 
		curTime = ( d - this.startTime ) / 1000,
		result = Math.floor(( this.frameNumber/curTime));
		if(curTime>1){
			this.startTime=new Date().getTime();
			this.frameNumber = 0;
		}
		return result;
	}
};


/*
		Particle emitter object.
	Creates an entity that spews out cute
	lil particles. xpos, ypos, amount of
	particles to emit, rate of fade (ms/tick)
*/
emitter = function(x,y,amount,decay,imgURL){
	if (imgURL){
		this.img = document.createElement('img')
		this.img.src = "speck.png"
	}
	this.particles = []
	this.x=x; this.y=y;
	this.emitting = true;
	this.r = 200; this.g = 20; this.b = 20;
	var self = this;
	//Creates a particle and adds itself to list.
	this.particle = function(x,y,decay){
		this.decay = 1/decay; 		 	//Fade rate
		this.x=x; this.y=y; 		 	//Coords
		this.alpha= Math.random(); 		//Current alpha
		this.a = this.alpha				//initial alpha
		this.vel = 2					//particle velocity
		this.vx=(Math.random()-0.5)*this.vel; this.vy=(Math.random()-0.5)*this.vel;
		//Update & draw the particle
		this.update = function(){
			if(this.alpha>0){
				this.alpha -= this.decay;
				this.x+=this.vx; this.y-=this.vy;
			}
			else{
				if (self.emitting==true){
					this.alpha=Math.random(); }
					this.x = self.x; this.y = self.y;
					this.vx=(Math.random()-0.5)*this.vel; this.vy=(Math.random()-0.5)*this.vel;
				}
				//Draw particle:
				if(this.alpha>0){
					if (self.img){
						c.globalAlpha = this.alpha;
						c.drawImage(self.img,this.x,this.y)
						c.globalAlpha= 1
					}else{
						c.fillStyle = "rgba("+self.r+","+self.g+","+self.b+","+this.alpha+")";
						c.fillRect(this.x,this.y-3,1,7);
						c.fillRect(this.x-3,this.y,7,1);
					}
				}

			}
		self.particles.push(this); //Send particle to particle pool
	};
	this.update = function(){ 	//Update the Emitter
		for (var i = 0; i < this.particles.length; i++) {this.particles[i].update();};
	}
	for (var i = 0; i < amount; i++) {new this.particle(x,y,decay);}; //Init particles
};


testmitter = new emitter(canvas.width/2,canvas.height/2,200,150,'speck.png');


//Draw background
bG = function(){
    c.fillStyle= "rgba(10,10,20,1)";
    c.fillRect(0,0,canvas.width,canvas.height);
};

//Update display
update = function(){
	bG();
	testmitter.update();
	testmitter.x = mouse.x; testmitter.y = mouse.y;
	
	if (mouse.lClick){ testmitter.emitting = false }
		else{ testmitter.emitting = true }
	//Draw FPS
	var f = fps.get();
	c.font = "11px Lucida Sans Unicode";
	if (f<=25){c.fillStyle = "rgb(255,0,0)"}
		else{c.fillStyle = "rgb(0,255,0)"}
	c.fillText("FPS: "+f,0,11)
};


setInterval(update,20);