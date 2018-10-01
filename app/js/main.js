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
    }else{
        ctx.fillStyle = "green";
    }
    ctx.closePath();
    ctx.fill()
}



var canvas = document.getElementById("board");
drawBoard(canvas);
drawchar('hero',0,0)
drawchar('villain',600,400)
drawWalls()
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

walls=[{posX:95, posY:200}]

char= new Character('hero', 0, 0)
charBad = new Character('villain',600,400)


document.addEventListener("keydown", function(event) {
    
    let potentialMove = characterMove(event.which, char)
    let validPos = bordCord.some(cor=> JSON.stringify(cor) == JSON.stringify({posX:potentialMove.posX, posY:potentialMove.posY}))
    console.log(JSON.stringify({posX:potentialMove.posX-5, posY:potentialMove.posY}))
    let noWall = walls.some(cor=> JSON.stringify(cor) != JSON.stringify({posX:potentialMove.posX-5, posY:potentialMove.posY}))
    
    console.log(validPos)
    if(validPos && noWall){
        char = characterMove(event.which, char)
        charBad = villainMove(char.posX,char.posY,charBad.posX,charBad.posY)
        
        drawBoard(canvas);
        drawchar(char.type,char.posX,char.posY)
        drawchar(charBad.type,charBad.posX,charBad.posY)
        drawWalls()
       
        
    }else{
    
    }
    
    
    
})


function characterMove(key, char){
    posX = char.posX
    posY = char.posY
    
    if(key==39){
        posX=posX+100
    }else if(key==37){
        posX=posX-100
    }else if(key==38){
         posY=posY-100;
    }else if(key==40){
        posY=posY+100;
    }
    
    return {type: char.type, posX:posX, posY:posY}
}

function villainMove(hx,hy,vx,vy){
    let xdiff = Math.abs(hx-vx);
    let ydiff = Math.abs(hy-vy);
    console.log(xdiff,ydiff)
    if(xdiff > ydiff){
        if(vx>hx){
            vx=vx-100 
        }else{
            vx=vx+100 
        }
        console.log(vx)
    }else{
        if(vy>hy){
            vy=vy-100
        }else{
            vy=vy+100
        }  
    }
    
    return {type:'villain', posX:parseInt(vx), posY:parseInt(vy)}  
}
