var changeTangramVisibility = function (hide){
    var tangramClass = document.getElementsByClassName("tangram");
    for (var i = 0; i < tangramClass.length; i++){
        tangramClass[i].style.display = hide ? 'none' : 'block';
    }
    document.getElementById("generate").style.display = hide ? 'none': 'inline-block';
    document.getElementById("select").style.display = hide ? 'inline-block' :'none';
    document.getElementById("set").style.display = hide ? 'inline-block' :'none';
    document.getElementById("hint").style.display = hide ? 'inline-block' :'none';
    document.getElementById("sol").style.display = hide ? 'inline-block' :'none';
};

var numTangrams = 10;
var currentTan = -1;
var mouseOffset = new Point(new IntAdjoinSqrt2(0,0), new IntAdjoinSqrt2(0,0));
var lastMouse = new Point(new IntAdjoinSqrt2(0,0), new IntAdjoinSqrt2(0,0));
var generated;
var chosen;
var solvedBy = [-1,-1,-1,-1,-1,-1,-1];

var getMouseCoordinates = function (event){
    var svg = document.getElementById("game");
    var pt = svg.createSVGPoint();
    pt.x = event.clientX;
    pt.y = event.clientY;
    var globalPoint = pt.matrixTransform(svg.getScreenCTM().inverse());
    return new Point(new IntAdjoinSqrt2(globalPoint.x,0), new IntAdjoinSqrt2(globalPoint.y,0));
};

var checkSolved = function (tanIndex){
    var solved;
    if (typeof tanIndex === 'undefined'){
        /* If no tanId is given check if all  */
        solved = true;
        for (var tanIndices = 0; tanIndices < 7; tanIndices++){
            checkSolved(tanIndices);
            solved = solved && (solvedBy[tanIndices]!= -1);
        }
        console.log(solvedBy);
        if (!solved){
            var tangramFromPieces = new Tangram(gameOutline);
            /* Probably only works when snapping */
            return arrayEq(generated[chosen].outline, tangramFromPieces.outline, comparePointsFloat, closePoint);
        }
        return true;
    } else {
        solved = false;
        /* WTF */
        var tan = generated[chosen].tans[tanIndex];
        var tangramPoints = tan.getPoints();
        var center = generated[chosen].center();
        for (var pTangramsId = 0; pTangramsId < tangramPoints.length; pTangramsId++){
            tangramPoints[pTangramsId] = tangramPoints[pTangramsId].dup().add(
                new Point(new IntAdjoinSqrt2(center[0], 0), new IntAdjoinSqrt2(center[1], 0)));
        }
        var possibleTans = getTansByID(gameOutline, tan.tanType);
        var tanPoints;
        for (var pTansId = 0; pTansId < possibleTans.length; pTansId++){
            tanPoints = possibleTans[pTansId].getPoints();
            solved = solved || arrayEq(tanPoints, tangramPoints, comparePointsFloat, closePoint);
            if (solved){
                switch (tan.tanType){
                    case 0:
                        solvedBy[tanIndex] = pTansId;
                        break;
                    case 1:
                        solvedBy[tanIndex] = 2;
                        break;
                    case 2:
                        solvedBy[tanIndex] = 3 + pTansId;
                        break;
                    case 3:
                        solvedBy[tanIndex] = 5;
                        break;
                    case 4:
                    case 5:
                        solvedBy[tanIndex] = 6;
                        break;
                    default:
                        return false;
                }
                return true;
            }
        }
        solvedBy[tanIndex] = -1;
        return false;
    }
};

/* Returns index in gameOutline of the tan which has been set to the solution,
 * if no tan can be placed -1 is returned */
var setToSol = function (){
    /* Get the index of the first tan of the tangrams that has no solution yet */
    checkSolved();
    var tanIndex = solvedBy.indexOf(-1);
    if (tanIndex === -1) {
        return tanIndex;
    }
    var tanType = generated[chosen].tans[tanIndex].tanType;
    var gameTans = [];
    switch (tanType) {
        case 0:
            gameTans = [0,1];
            break;
        case 1:
            gameTans = [2];
            break;
        case 2:
            gameTans = [3,4];
            break;
        case 3:
            gameTans = [5];
            break;
        case 4:
            gameTans = [6];
            break;
        case 5:
            gameTans = [6];
            break;
        default:
            return -1;
    }
    for (var tanIndices = 0; tanIndices < 7; tanIndices++){
        if (gameOutline[tanIndices].tanType === tanType){
            gameTans.push(tanIndices);
        }
    }
    if (tanType === 0 || tanType === 2){
        if (solvedBy.indexOf(gameTans[0]) != -1) {
            gameTans[0] = gameTans[1];
        }
    }
    /* Get the game tans with the correct id */
    gameOutline[gameTans[0]] = generated[chosen].tans[tanIndex].dup();
    var center = generated[chosen].center();
    gameOutline[gameTans[0]].anchor = gameOutline[gameTans[0]].anchor.dup().add(
        new Point(new IntAdjoinSqrt2(center[0], 0), new IntAdjoinSqrt2(center[1], 0)));
    return gameTans[0];
};

var updateTanPiece = function (tanIndex){
    if (tanIndex < 0){
        return;
    }
    var tanId = "piece" + tanIndex;
    var tan = document.getElementById(tanId);
    tan.setAttributeNS(null, "points", gameOutline[tanIndex].toSVG());
};

var rotateTan = function (event){
    var target = ((window.event)?(event.srcElement):(event.currentTarget));
    var tanIndex = parseInt(target.id[target.id.length - 1]);
    /* console.log("clicked: " + tanIndex); */
    var mouse = getMouseCoordinates(event);
    var mouseMove = lastMouse.dup().subtract(mouse);
    if (Math.abs(mouseMove.toFloatX()) < 0.05 && Math.abs(mouseMove.toFloatY()) < 0.05) {
        /* console.log("rotated: " + tanIndex); */
        gameOutline[tanIndex].orientation = (gameOutline[tanIndex].orientation + 1) % 8;
        gameOutline[tanIndex].anchor.subtract(mouse).rotate(45).add(mouse) ;
        updateTanPiece(tanIndex);
    }
};

var selectTan = function (event) {
    var target = ((window.event)?(event.srcElement):(event.currentTarget));
    var tanIndex = parseInt(target.id[target.id.length - 1]);
    /* console.log("selected: " + tanIndex); */
    currentTan = tanIndex;
    var mouse = getMouseCoordinates(event);
    lastMouse = mouse.dup();
    mouseOffset = mouse.subtract(gameOutline[tanIndex].anchor);
    /* Bring this piece to the front */
    var piece = document.getElementById("piece"+ tanIndex);
    document.getElementById("game").appendChild(piece);
};

var deselectTan = function (event){
    currentTan = -1;
    mouseOffset = new Point(new IntAdjoinSqrt2(0,0), new IntAdjoinSqrt2(0,0));
    if (checkSolved()){
        var tangramPieces = document.getElementsByClassName("tan");
        for (var tanIndex = 0; tanIndex < tangramPieces.length; tanIndex++) {
            tangramPieces[tanIndex].setAttributeNS(null, "fill", "#17A768");
            tangramPieces[tanIndex].setAttributeNS(null, "opacity", "1.0");
        }
    }
};

var moveTan = function (event){
    /*var target = ((window.event)?(event.srcElement):(event.currentTarget));
    var tanIndex = parseInt(target.id[target.id.length - 1]);*/
    /* console.log("moved: " + tanIndex + ", " + currentTan); */
    var mouse = getMouseCoordinates(event);
    if (currentTan != -1){
        gameOutline[currentTan].anchor = mouse.subtract(mouseOffset);
        updateTanPiece(currentTan);
    }
};

var flipParallelogram = function () {
    gameOutline[6].anchor = gameOutline[6].anchor.add(FlipDirections[5-gameOutline[6].tanType][gameOutline[6].orientation]);
    gameOutline[6].tanType = gameOutline[6].tanType === 4 ? 5:4;
    gameOutline[6].orientation = gameOutline[6].orientation === 0 ? 0 : 8-gameOutline[6].orientation;
    updateTanPiece(6);
    checkSolved();
};

var addTangramPieces = function () {

    for (var tanIndex = 0; tanIndex < gameOutline.length; tanIndex++) {
        var shape = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
        var id = "piece" + tanIndex;
        shape.setAttributeNS(null, "id", id);
        shape.setAttributeNS(null, "class", "tan");
        shape.setAttributeNS(null, "points", gameOutline[tanIndex].toSVG());
        shape.setAttributeNS(null, "fill", '#FF9900');
        shape.setAttributeNS(null, "opacity", "0.8");
        shape.setAttributeNS(null, "stroke", "#E9E9E9");
        shape.setAttributeNS(null, "stroke-width", "0.05");
        document.getElementById("game").appendChild(shape);
    }

    var tangramPieces = document.getElementsByClassName("tan");
    for (var tanIndex = 0; tanIndex < tangramPieces.length; tanIndex++) {
        tangramPieces[tanIndex].addEventListener('click', rotateTan);
        tangramPieces[tanIndex].addEventListener('mousedown', selectTan);
        tangramPieces[tanIndex].addEventListener('mouseup', deselectTan);
        //tangramPieces[tanIndex].addEventListener('mousemove', moveTan);
    }
    document.getElementById("game").addEventListener('mousemove', moveTan);
};

var addFlipButton = function () {
    var button = document.createElementNS("http://www.w3.org/2000/svg", "g");
    button.setAttributeNS(null, "class", "flip");
    button.setAttributeNS(null, "transform", "translate (" + 11.75 +  ", " + 8.75 + ")" + "scale(" + 0.3 + "," + 0.3 + ")");

    var background = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    background.setAttributeNS(null, "x", "1.75");
    background.setAttributeNS(null, "y", "1.75");
    background.setAttributeNS(null, "width", "7.5");
    background.setAttributeNS(null, "height", "1.5");
    background.setAttributeNS(null, "rx", "0.5");
    background.setAttributeNS(null, "ry", "0.5");
    background.setAttributeNS(null, "fill", '#E9E9E9');
    button.appendChild(background);

    var arrow = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    arrow.setAttributeNS(null, "points", "5,2.5 5.25,2.25, 5.25,2.4, 5.75,2.4, " +
        "5.75,2.25, 6,2.5, 5.75,2.75, 5.75,2.6 5.25,2.6 5.25,2.75");
    arrow.setAttributeNS(null, "fill", '#BCBCBC');
    button.appendChild(arrow);

    var anchorL = new Point(new IntAdjoinSqrt2(2,0), new IntAdjoinSqrt2(3, 0));
    var parallelogramL = new Tan(5, anchorL, 0);
    var parallelogramElementL = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    parallelogramElementL.setAttributeNS(null, "points",parallelogramL.toSVG());
    parallelogramElementL.setAttributeNS(null, "fill", '#FF9900');
    parallelogramElementL.setAttributeNS(null, "stroke", "#BCBCBC");
    parallelogramElementL.setAttributeNS(null, "stroke-width", "0.05");
    button.appendChild((parallelogramElementL));

    var anchorR = new Point(new IntAdjoinSqrt2(6,0), new IntAdjoinSqrt2(2, 0));
    var parallelogramR = new Tan(4, anchorR, 0);
    var parallelogramElementR = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    parallelogramElementR.setAttributeNS(null, "points",parallelogramR.toSVG());
    parallelogramElementR.setAttributeNS(null, "fill", '#FF9900');
    parallelogramElementR.setAttributeNS(null, "stroke", "#BCBCBC");
    parallelogramElementR.setAttributeNS(null, "stroke-width", "0.05");
    button.appendChild((parallelogramElementR));

    document.getElementById("game").appendChild(button);
    var flipElements = document.getElementsByClassName("flip")[0].childNodes;
    for (var flipIndex = 0; flipIndex < flipElements.length; flipIndex++) {
        flipElements[flipIndex].addEventListener("click", flipParallelogram);
        flipElements[flipIndex].addEventListener("mouseover", function (){
            console.log("mousein");
            document.getElementsByClassName("flip")[0].firstChild.setAttributeNS(null, "fill", '#3299BB');
        });
        flipElements[flipIndex].addEventListener("mouseout", function (){
            console.log("mouseOut");
            document.getElementsByClassName("flip")[0].firstChild.setAttributeNS(null, "fill", '#E9E9E9');
        });
    }
};

var addTangrams = function () {
    generated[0].toSVGOutline("first0");
    generated[1].toSVGOutline("second1");

    generated[2].toSVGOutline("third2");
    generated[3].toSVGOutline("fourth3");

    generated[4].toSVGOutline("fifth4");
    generated[5].toSVGOutline("sixth5");
};


window.onload = function () {
    generated = generateTangrams(numTangrams);
    chosen = 0;
    resetPieces();
    addTangrams(generated);
    changeTangramVisibility(false);
    /* Show larger version of the chosen tangram */

    var tangramClass = document.getElementsByClassName("tangram");
    for (var i = 0; i < tangramClass.length; i++) {
        tangramClass[i].addEventListener('click', function (event) {
            changeTangramVisibility(true);
            // TODO: add timer
            var sourceId;
            var target = ((window.event)?(event.srcElement):(event.currentTarget.firstElementChild));
            if (target.id.length === 0) {
                sourceId = target.parentNode.parentNode.id;
            } else {
                sourceId = target.id;
            }
            chosen = parseInt(sourceId[sourceId.length - 1]);
            console.log(JSON.stringify(generated[chosen]));
            if (typeof generated[chosen] === 'undefined'){
                console.log(target);
                console.log(event.currentTarget.firstElementChild);
                console.log(target.parentNode.parentNode)
            }
            generated[chosen].toSVGOutline("game");
            document.getElementById("game").style.display = "block";
            addTangramPieces();
            addFlipButton();
        });
    }

    document.getElementById("generate").addEventListener('click', function (){
        changeTangramVisibility(true);
        generated = generateTangrams(numTangrams*1000);
        resetPieces();
        addTangrams(generated);
        changeTangramVisibility(false);
    });

    document.getElementById("select").addEventListener('click', function (){
        document.getElementById("game").style.display = 'none';
        var gameNode = document.getElementById('game');
        while (gameNode.firstChild) {
            gameNode.removeChild(gameNode.firstChild);
        }
        changeTangramVisibility(false);
        resetPieces();
        solvedBy = [-1,-1,-1,-1,-1,-1,-1];
    });

    document.getElementById("set").addEventListener('click', function (){
        resetPieces();
        solvedBy = [-1,-1,-1,-1,-1,-1,-1];
        for (var tanIndex = 0; tanIndex < gameOutline.length; tanIndex++) {
            updateTanPiece(tanIndex);
        }
        var tangramPieces = document.getElementsByClassName("tan");
        for (var tanIndex = 0; tanIndex < tangramPieces.length; tanIndex++) {
            tangramPieces[tanIndex].setAttributeNS(null, "fill", "#FF9900");
            tangramPieces[tanIndex].setAttributeNS(null, "opacity", "0.8");
        }
    });

    document.getElementById("hint").addEventListener('click', function (){
        updateTanPiece(setToSol());
    });

    document.getElementById("sol").addEventListener('click', function (){
        for (var tanIndex = 0; tanIndex < 7; tanIndex++){
            updateTanPiece(setToSol());
        }
        var tangramPieces = document.getElementsByClassName("tan");
        deselectTan();
    });
};

