function drawBoard(board, row, col){
    var ctx = board.getContext("2d");
    var w = board.width;
    var h = board.height;
    
   row = row || 5;    // default number of rows
    col = col || 10; 
    
     w /= col;            // width of a block
    h /= row;  
    
    for (var i = 0; i < row; ++i) {
        for (var j = 0, cols = col / 2; j < col; ++j) {
            ctx.rect(2 * j * w + (i % 2 ? 0 : w), i * h, w, h);
        }
    }
    ctx.fill();
}

var canvas = document.getElementById("board");
//drawBoard(canvas);


function Character(type, positionX, positionY){
    this.type = type;
    this.positionX = positionX;
    this.positionY = positionY;
}


function virtualBoard(height, width, posGood, posBad){
    height = 500;
    width=1000;
    
    var grid=[]
    
    
    for(var i=0; i<height; i=i+100){
        for(var j=0; j<width; j=j+100){
            grid.push({posX:j, posY:i})
        }
    } 
    
    console.log(grid)
}
virtualBoard()



document.addEventListener("keydown", function(event) {
    characterMove(event.which)
})


function characterMove(key){
    if(key==39){
        posX=posX+100
    }else if(key==37){
        posX=posX-100
    }else if(key==38){
         posY=posY+100;
    }else if(key==40){
        posY=posY-100;
    }
    
}
