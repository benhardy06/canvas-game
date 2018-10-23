function drawBoard(board, row, col){
    var ctx = board.getContext("2d");
    var w = board.width;
    var h = board.height;
    
    ctx.beginPath()
    ctx.rect(0, 0, w, h)
    ctx.fillStyle = "white";
    ctx.fill();
    
   row = row || 5;    // default number of rows
    col = col || 10; 
    
     w /= col;            // width of a block
    h /= row;  
    
    ctx.beginPath();
    
    for (var i = 0; i < row; ++i) {
        for (var j = 0, cols = col / 2; j < col; ++j) {
            ctx.rect(2 * j * w + (i % 2 ? 0 : w), i * h, w, h);
        }
    }
    ctx.fillStyle = "black";
    ctx.fill();
}


function drawWalls(){
    var ctx = board.getContext("2d");
    var w = 10;
    var h = 100;
    ctx.beginPath()
    ctx.rect(95, 200, w, h)
    ctx.fillStyle = "brown";
    ctx.fill();
}

function drawchar(char, posX, posY, row, col){
    var ctx = board.getContext("2d");
    var w = board.width;
    var h = board.height;
    
   row = row || 5;    // default number of rows
    col = col || 10; 
    
    w /= col;            // width of a block
    h /= row; 
    
    ctx.beginPath();
    ctx.rect(posX, posY, w, h)
    if(char== 'hero'){
        ctx.fillStyle = "red";
    }else if(char== 'trapped') {
        ctx.fillStyle = "yellow";
    }else{
        ctx.fillStyle = "green";
    }
    ctx.closePath();
    ctx.fill()
}



//var canvas = document.getElementById("board");
//drawBoard(canvas);
//drawchar('hero',0,0)
//drawchar('villain',600,400)
//drawWalls()
function Character(type, posX, posY){
    this.type = type;
    this.posX = posX;
    this.posY = posY;
}




function virtualBoard(height, width, posGood, posBad){
    height = 500;
    width=1000;
    var walls =[]
    var grid=[]
    for(var i=0; i<height; i=i+100){
        for(var j=0; j<width; j=j+100){
            grid.push({posX:j, posY:i})
        }
    }
    return grid
}
bordCord = virtualBoard()

//walls=[{posX:100, posY:200, where:'l'}, {posX:0, posY:200, where:'r'}]


function wallFoundation(posX, posY, position){
    this.posX =posX;
    this.posY =posY;
    this.position =position;  
}


wallFoundation.prototype.buildWall = function(){
    var vertical = (this.position == 'l'|| this.position == 'r') ? true : false;
    if(vertical){
        this.wallSupport = (this.position == 'l') ? 'r' : 'l';
        this.supportX = (this.wallSupport=='l')? this.posX + 100 : this.posX - 100;
        return [{posX:this.posX, posY:this.posY, where:this.position}, {posX:this.supportX, posY:this.posY, where:this.wallSupport}]
    }else{
        this.wallSupport = (this.position == 'u') ? 'd' : 'u';
        this.supportY = (this.wallSupport=='u')? this.posY + 100 : this.posY - 100;
        return [{posX:this.posX, posY:this.posY, where:this.position}, {posX:this.posX, posY:this.supportY, where:this.wallSupport}]
    }
    
}
wallFoundation.prototype.paintWall = function(){
    var vertical = (this.position == 'l'|| this.position =='r') ? true : false;
    var canvas = document.getElementById("board");
    var ctx = board.getContext("2d");
    var w = 10;
    var h = 100;
    var x = this.posX;
    var y = this.posY;
    if(vertical){
        x = (this.position == 'l'||this.position == 'r')? this.posX-5 : this.posX;
        
        
    }else{
        y = (this.position == 'u'||this.position =='d')? this.posY-5 : this.posY;
        w=100; h=10
    }
    ctx.beginPath()
    ctx.rect(x, y, w, h)
    ctx.fillStyle = "brown";
    ctx.fill();
}

var foundations=[]
var walls=[]

//var wall1 = new wallFoundation(100,200,'l')
//var wall2 = new wallFoundation(100,300,'u')
//wall1.buildWall().map(wall=> walls.push(wall))
//wall1.paintWall()
//wall2.buildWall().map(wall=> walls.push(wall))
//wall2.paintWall()


function checkWall(char, potentialMove){
    let wall = walls.filter(cor=> JSON.stringify({posX:cor.posX, posY:cor.posY}) == JSON.stringify({posX:char.posX, posY:char.posY}))
    if(char.type=='villain'){
            return wall
        }else if(wall.length>0){
        if(wall.some(w=> w.where==potentialMove.movement) && char.type=='hero'){
            return false;
        }else{
            return true
        }
    }else{
        return true
    }
    
}






document.addEventListener("keydown", function(event) {
    let coords = movement(event.which, char, charBad, solution)
    char = coords.char;
    charBad = coords.charBad;
    solution = coords.trapped
    drawBoard(canvas);
    drawchar(char.type,char.posX,char.posY)
    drawchar(charBad.type,charBad.posX,charBad.posY)
    drawchar(solution.type, solution.posX,solution.posY)
    foundations.map(built=>built.paintWall())  
})


function movement(key, char, charBad,trapped){
   let potentialMove = characterMove(key, char)
    let validPos = bordCord.some(cor=> JSON.stringify(cor) == JSON.stringify({posX:potentialMove.posX, posY:potentialMove.posY}))
    let noWall = checkWall(char, potentialMove)
    if(validPos && noWall){
        char = characterMove(key, char)
        let villPotenialMove = villainMove(potentialMove.posX,potentialMove.posY,charBad.posX,charBad.posY,[{}],false,false)
        let villainWall = checkWall(charBad, villPotenialMove);
        charBad = villainMove(char.posX,char.posY,charBad.posX,charBad.posY,villainWall,false,false)
        
    } 
    return{char:char, charBad:charBad, trapped:trapped}
}

function characterMove(key, char){
    posX = char.posX
    posY = char.posY
    var mov='';
    if(key==39){
        posX=posX+100;
         mov='r';
    }else if(key==37){
        posX=posX-100
         mov='l';
    }else if(key==38){
         posY=posY-100;
        mov='u'
    }else if(key==40){
        posY=posY+100;
        mov='d'
    }
    
    return {type: char.type, posX:posX, posY:posY, movement:mov}
}

function villainMove(hx,hy,vx,vy, walls, altY, altX){
    
    if(walls.length==0) walls=[{}]
    let xdiff = Math.abs(hx-vx);
    let ydiff = Math.abs(hy-vy);
    let yaxis = (xdiff < ydiff) ? true :false
    let position = {}
    var mov = '';
    if((!yaxis && !altX) || altX){
        position = villainXMove(hx,hy,vx,vy, walls)
    }else if((yaxis && !altY) || altY){
        position = villainYMove(hx,hy,vx,vy, walls)
    }
    return position    
}

function villainXMove(hx,hy,vx,vy, walls, altRoute){
    var mov = '';
    if(vx>hx && !walls.some(w=>w.where == 'l')){
        vx=vx-100 
         mov='l';
        return {type:'villain', posX:vx, posY:vy, movement:mov}  
    }else if(vx<hx && !walls.some(w=>w.where == 'r')){
            vx=vx+100 
             mov='r';
        return {type:'villain', posX:vx, posY:vy, movement:mov}  
    }else if(altRoute){
        return {type:'villain', posX:vx, posY:vy, movement:mov} 
       
    }else{
        return villainYMove(hx,hy,vx,vy, walls, true) 
    }
    
}

function villainYMove(hx,hy,vx,vy, walls, altRoute){
    var mov = '';
    if(vy>hy && !walls.some(w=>w.where == 'u')){
            vy=vy-100;
            mov='u';
            return {type:'villain', posX:vx, posY:vy, movement:mov} 
    }else if(vy<hy && !walls.some(w=>w.where == 'd')){
            vy=vy+100
            mov='d';
            return {type:'villain', posX:vx, posY:vy, movement:mov} 
    }else if(altRoute){
        return {type:'villain', posX:vx, posY:vy, movement:mov} 
    }else{
        return villainXMove(hx,hy,vx,vy, walls, true) 
    }
}


//level generation


function levelGenertaion(mapHero, mapVillain, trapped, difficulty){
    var car=0
    var correctPath=[]
    var statringValue=[JSON.stringify(mapHero), JSON.stringify(mapVillain)];
    while(car<8){
    var keys=[37,39,38,40];
    var bestMove = false;
    var moves =[];
    var bestMoveIndex = 0;
    
    keys.map((key, index)=>{
       let coords = movement(key,mapHero,mapVillain, trapped)
       moves.push(coords)
       let distance = (Math.pow((coords.charBad.posX-trapped.posX),2)) + (Math.pow((coords.charBad.posY-trapped.posY),2))
       distance = Math.sqrt(distance)
       if(!bestMove || (distance < bestMove)){
          bestMove = distance;
           if((moves[index].char.posX != moves[index].charBad.posX) && (moves[index].char.posY != moves[index].charBad.posY)){
               bestMoveIndex = index
           }
           
       }
        
            
    })
    mapHero=moves[bestMoveIndex].char
    mapVillain=moves[bestMoveIndex].charBad
    correctPath.push(mapHero,mapVillain)
    console.log(mapHero)
    if((trapped.posX == mapVillain.posX) && (trapped.posY == mapVillain.posY) && car == 7){
        canvas = document.getElementById("board");
        char= JSON.parse(statringValue[0])
        charBad = JSON.parse(statringValue[1])
        solution = trapped
        drawBoard(canvas);
        drawchar(char.type, char.posX,char.posY)
        drawchar(charBad.type, charBad.posX,charBad.posY)
        drawchar(trapped.type, trapped.posX,trapped.posY)
        return correctPath
    }
        
    car++
    }
        
}


function randomPieces(){
    var pieces = [];
    var board = bordCord.slice()
    while(pieces.length < 3){
        let addPiece = board[Math.floor(Math.random()*board.length)];
        pieces.push(addPiece);
        board  = board.filter(coord=> JSON.stringify(coord) != JSON.stringify(addPiece))
    }
    var mapHero = new Character('hero',pieces[0].posX,pieces[0].posY)
    var mapVillain = new Character('villain',pieces[1].posX,pieces[1].posY)
    
    var trapped = new Character('trapped',pieces[2].posX,pieces[2].posY)
    
    
    
      return levelGenertaion(mapHero,mapVillain,trapped)
       
}


var car=0
while(car<1000){
    console.log('loop')
   var path = randomPieces()
   if(typeof path != "undefined") car=1000; console.log(path)
   car++
}
randomWalls()


function randomWalls(correctPath){
var board = bordCord.slice();
var potentialPositions=['u','l']
foundations=[];
    var car=0
    while(car<15){
        var wall = board[Math.floor(Math.random()*board.length)];
            wall.where = potentialPositions[Math.floor(Math.random()*potentialPositions.length)];
            foundations.push(new wallFoundation(wall.posX,wall.posY,wall.where));
        car++
    }

   
    walls=[]
    foundations.map(w=> {
        var found = w.buildWall()
        console.log(found)
            found.map(b=>walls.push(b))
    })
     console.log(walls)
     console.log(walls)
//    var wall1 = new wallFoundation(100,200,'l')
//    var wall2 = new wallFoundation(100,300,'u')
//    wall1.buildWall().map(wall=> walls.push(wall))
    foundations.map(built=>built.paintWall())
}