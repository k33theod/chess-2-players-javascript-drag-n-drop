var Tetragona = document.querySelector("tbody").querySelectorAll("td");

var chessboard=[];
for (var i=0; i<8; i++){
    var line=[];
	for (var j=0;j<8; j++)
        line.push(Tetragona[i*8+j]);
    chessboard.push(line);    
}

var piece=document.querySelector("tbody").querySelectorAll("div");

for (var i=0;i<32;i++){
    if (i>7 && i<24)
        piece[i].pown="Pawn";
    if (i==0 || i==7 || i==24 || i==31)
        piece[i].pown="Rook";
    if (i==1 || i==6 || i== 25 || i==30)
        piece[i].pown="Knight";
    if (i==2 || i==5 || i== 26 || i==29)
        piece[i].pown="Bishop";
    if (i==3 || i== 27)
        piece[i].pown="Queen";
    if (i==4 || i==28)
        piece[i].pown="King";
    if (i <16)
        piece[i].color="black";
    else
        piece[i].color="white";
}

Tetragona = Array.from(Tetragona);
piece=Array.from(piece);
var current_player = "white";
var next_player = "black";

function move(x1,y1,x2,y2,ev){
    var pos1b=chessboard[x1][y1];
    var pos2b=chessboard[x2][y2];
    //elegxos gia king
    if (pos1b.firstChild.pown=="King"){
        if (!control_king_move(x1,y1,x2,y2)) 
            return;
    }
    //elegxos gia queen
    if (pos1b.firstChild.pown=="Queen"){
        if (!control_queen_move(x1,y1,x2,y2)) 
            return;
    }
    //elegxos gia rook
    if (pos1b.firstChild.pown=="Rook"){
        if (!control_rook_move(x1,y1,x2,y2)) 
            return;
    }
    //elegxos gia bishop
    if (pos1b.firstChild.pown=="Bishop"){
        if (!control_bishop_move(x1,y1,x2,y2)) 
            return;
    }
    // elegxos gia knight
    if (pos1b.firstChild.pown=="Knight"){
        if (!control_knight_move(x1,y1,x2,y2))
            return;
    }
    //elegxos gia black pawn
    if(pos1b.firstChild.pown=="Pawn" && pos1b.firstChild.color=="black"){
        if (!control_black_pawn(x1,y1,x2,y2))
            return;
    }
    //elegxos gia white pawn
    if(pos1b.firstChild.pown=="Pawn" && pos1b.firstChild.color=="white"){
        if (!control_white_pawn(x1,y1,x2,y2))
            return;
    }
    //ektelesi
    if (!pos2b.hasChildNodes()){
        ev.target.appendChild(pos1b.firstChild);
        do_after_valid_move();
    }
    else if (pos2b.firstChild.color == pos1b.firstChild.color)
        return;
    else {
        ev.neu_target.appendChild(pos1b.firstChild);
        ev.neu_target.removeChild(pos2b.firstChild);
        do_after_valid_move();
    }
}

function do_after_valid_move(){
    var temp = current_player;
    current_player = next_player;
    next_player = temp;
}

//Drag n drop
Tetragona.forEach(accept_drag);
piece.forEach(make_dragable);

function accept_drag(item, index){
    item.setAttribute("ondrop", "drop(event)");
    item.setAttribute("ondragover", "allowDrop(event)");
}

function make_dragable(item, index){
    item.setAttribute("draggable", "true");
    item.setAttribute("ondragstart", "drag(event)");
    item.setAttribute("id", index);
}

function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
    ev.preventDefault();
   
    var data = ev.dataTransfer.getData("text");
    var attacker = document.getElementById(data);
    if (piece.includes(ev.target)){
        ev.neu_target = ev.target.parentNode;
    }
    var x1 = parseInt(Tetragona.indexOf(attacker.parentNode)/8);
    var y1 = Tetragona.indexOf(attacker.parentNode)%8;
    var x2= parseInt(Tetragona.indexOf(ev.target)/8);
    var y2 =Tetragona.indexOf(ev.target)%8;
    if (ev.neu_target){
        x2= parseInt(Tetragona.indexOf(ev.neu_target)/8);
        y2 =Tetragona.indexOf(ev.neu_target)%8;
    }
    if (attacker.color==current_player)
        move(x1,y1,x2,y2,ev);
}

function control_diagonal(x1,y1,x2,y2){
    if (Math.abs(x2-x1)==Math.abs(y2-y1) && Math.abs(x2-x1)==1)
        return true;
    if (Math.abs(x2-x1)==Math.abs(y2-y1) && Math.abs(x2-x1)>1){
        if (x2>x1 && y2>y1){
            var i = x1+1;
            var j = y1+1;
            while (i<x2){
                if (chessboard[i][j].hasChildNodes())
                    return false;
                i++;
                j++;
            }
        }
        else if (x2>x1 && y2<y1){
            var i = x1+1;
            var j = y1-1
            while (i<x2){
                if (chessboard[i][j].hasChildNodes())
                    return false;
                i++;
                j--;    
            }
        }
        else if (x2<x1 && y2>y1){
            var i = x1-1;
            var j = y1+1
            while (j<y2){
                if (chessboard[i][j].hasChildNodes())
                    return false;
                i--;
                j++;    
            }
        }
        else if (x2<x1 && y2<y1){
            var i = x1-1;
            var j = y1-1
            while (i>x2){
                if (chessboard[i][j].hasChildNodes())
                    return false;
                i--;
                j--;    
            }
        }
        return true;
    }
    return false;
}

function control_black_pawn(x1,y1,x2,y2){
    if (x2-x1==1 && Math.abs(y2-y1)==1 && chessboard[x2][y2].hasChildNodes()){
        return true;
    }
    if (x2-x1==2 && x1!=1){
        return false;
    }
    if (x2-x1==2 && y2==y1 && !chessboard[x2][y2].hasChildNodes() && !chessboard[x1+1][y2].hasChildNodes()){
        return true;
    }
    if (x2-x1==1 && y2==y1 && !chessboard[x2][y2].hasChildNodes()){
        return true;
    }
    return false;
}

function control_white_pawn(x1,y1,x2,y2){
    if (x2-x1==-1 && Math.abs(y2-y1)==1 && chessboard[x2][y2].hasChildNodes()){
        return true;
    }
    if (x2-x1==-2 && x1!=6){
        return false;
    }
    if (x2-x1==-2 && y2==y1 && !chessboard[x2][y2].hasChildNodes() && !chessboard[x1-1][y2].hasChildNodes()){
        return true;
    }
    if (x2-x1==-1 && y2==y1 && !chessboard[x2][y2].hasChildNodes()){
        return true;
    }
    return false;
}

function control_horizontal(x1,y1,x2,y2){
    if (x2!=x1)
        return false;
    if (y2==y1)
        return false;
    if (Math.abs(y2-y1)==1)
        return true;
    if (y2>y1)
        var i =y1+1;
        while (i<y2){
            if (chessboard[x1][i].hasChildNodes())
                return false;
            i++;
        }
    if (y2<y1)
        var i=y1-1;
        while (i>y2){
            if (chessboard[x1][i].hasChildNodes())
                return false;
            i--;
        }
    return true;
}

function control_vertical(x1,y1,x2,y2){
    if (y2!=y1)
        return false;
    if (x2==x1)
        return false;
    if (Math.abs(x2-x1)==1)
        return true;
    if (x2-x1>1)
        var i =x1+1;
        while (i<x2){
            if (chessboard[i][y2].hasChildNodes())
                return false;
            i++;
        }
    if (x2-x1<-1)
        var i=x1-1;
        while (i>x2){
            if (chessboard[i][y2].hasChildNodes())
                return false;
            i--;
        }
    return true;
}

function control_king_move(x1,y1,x2,y2){
    if (Math.abs(x2-x1)==1 && Math.abs(y2-y1)==1)
        return true;
    if (Math.abs(x2-x1)==1 && y2==y1)
        return true;
    if (x2==x1 && Math.abs(y2-y1)==1)
        return true;
    return false;
}

function control_bishop_move(x1,y1,x2,y2){
    return control_diagonal(x1,y1,x2,y2);
}

function control_rook_move(x1,y1,x2,y2){
    if (x1==x2 && y1!=y2)
        if (control_horizontal(x1,y1,x2,y2))
            return true;
    if (y1==y2 && x1!=x2)
        if (control_vertical(x1,y1,x2,y2))
            return true;    
    return false;
}

function control_queen_move(x1,y1,x2,y2){
    if (x1==x2 && y1!=y2)
        return control_horizontal(x1,y1,x2,y2);
    if (y1==y2 && x1!=x2)
        return control_vertical(x1,y1,x2,y2);
    if (Math.abs(x2-x1)==Math.abs(y2-y1))  
        return control_diagonal(x1,y1,x2,y2); 
    return false;
}

function control_knight_move(x1,y1,x2,y2){
    if (Math.abs(x2-x1)==2 && Math.abs(y2-y1)==1 || Math.abs(x2-x1)==1 && Math.abs(y2-y1)==2)
        return true;
    return false;
}




