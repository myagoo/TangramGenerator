/* Moved here for order */
var changeTangramVisibility = function (hide) {
    var tangramClass = document.getElementsByClassName("tangram");
    for (var i = 0; i < tangramClass.length; i++) {
        tangramClass[i].style.display = hide ? 'none' : 'block';
    }
    document.getElementById("generate").style.display = hide ? 'none' : 'inline-block';
    document.getElementById("select").style.display = hide ? 'inline-block' : 'none';
    document.getElementById("set").style.display = hide ? 'inline-block' : 'none';
    document.getElementById("hint").style.display = hide ? 'inline-block' : 'none';
    document.getElementById("sol").style.display = hide ? 'inline-block' : 'none';
};

var stopLoading = function (){
    if (!generating){
        var loadingSvg = document.getElementById("loading");
        loadingSvg.style.display = 'none';
        /* Remove children if there are any */
        while (loadingSvg.firstChild) {
            loadingSvg.removeChild(loadingSvg.firstChild);
        }
        changeTangramVisibility(false);
    }
};

var addLoading = function (){
    /* Hide Buttons */
    document.getElementById("generate").style.display = 'none';
    document.getElementById("select").style.display = 'none';
    document.getElementById("set").style.display = 'none';
    document.getElementById("hint").style.display = 'none';
    document.getElementById("sol").style.display = 'none';
    var loadingSvg = document.getElementById("loading");
    var t = document.createElementNS("http://www.w3.org/2000/svg", "g");
    var an = document.createElementNS("http://www.w3.org/2000/svg", "g");
    var en = document.createElementNS("http://www.w3.org/2000/svg", "g");
    var g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g.setAttributeNS(null, "transform", "translate(12)");
    var arrow = document.createElementNS("http://www.w3.org/2000/svg", "g");
    arrow.setAttributeNS(null, "transform", "translate(27.5,1) scale(0.75)");
    loadingSvg.appendChild(t);
    loadingSvg.appendChild(an);
    loadingSvg.appendChild(en);
    loadingSvg.appendChild(g);
    loadingSvg.appendChild(arrow);
    var tTans = [];
    var gTans = [];
    var arrowTans = [];
    for (var index = 0; index < 7; index++){
        tTans.push(document.createElementNS("http://www.w3.org/2000/svg", "polygon"));
        t.appendChild(tTans[index]);
        gTans.push(document.createElementNS("http://www.w3.org/2000/svg", "polygon"));
        g.appendChild(gTans[index]);
        arrowTans.push(document.createElementNS("http://www.w3.org/2000/svg", "polygon"));
        arrowTans[index].addEventListener('click', stopLoading);
        arrow.appendChild(arrowTans[index]);
    }
    tTans[0].setAttributeNS(null, "points",
        "4.707106781186548, 1.8786796564403572 4.707106781186548, 4.707106781186548 1.8786796564403572, 1.8786796564403572 ");
    tTans[0].setAttributeNS(null, "fill", "#FF9900");
    tTans[1].setAttributeNS(null, "points",
        "6.121320343559643, 6.121320343559643 4.121320343559643, 8.121320343559642 4.121320343559643, 4.121320343559643 ");
    tTans[1].setAttributeNS(null, "fill", "#BCBCBC");
    tTans[2].setAttributeNS(null, "points",
        "6.121320343559643, 1.8786796564403572 8.121320343559642, 1.8786796564403572 6.121320343559643, 3.878679656440357 ");
    tTans[2].setAttributeNS(null, "fill", "#3299BB");
    tTans[3].setAttributeNS(null, "points",
        "1.8786796564403572, 3.2928932188134525 1.8786796564403572, 1.8786796564403572 3.2928932188134525, 3.2928932188134525");
    tTans[3].setAttributeNS(null, "fill", "#3299BB");
    tTans[4].setAttributeNS(null, "points",
        "6.121320343559643, 3.2928932188134525 6.121320343559643, 4.707106781186548 4.707106781186548, 3.2928932188134525");
    tTans[4].setAttributeNS(null, "fill", "#FF9900");
    tTans[5].setAttributeNS(null, "points",
        "4.707106781186548, 1.8786796564403572 6.121320343559643, 1.8786796564403572 6.121320343559643, 3.2928932188134525 4.707106781186548, 3.2928932188134525 ");
    tTans[5].setAttributeNS(null, "fill", "#BCBCBC");
    tTans[6].setAttributeNS(null, "points",
        "4.707106781186548, 3.2928932188134525 6.121320343559643, 4.707106781186548 6.121320343559643, 6.121320343559643 4.707106781186548, 4.707106781186548 ");
    tTans[6].setAttributeNS(null, "fill", "#3299BB");
    gTans[0].setAttributeNS(null, "points",
        "2.6715728752538097, 4.085786437626905 4.67157287525381, 2.085786437626905 4.67157287525381, 6.085786437626905 ");
    gTans[0].setAttributeNS(null, "fill", "#3299BB");
    gTans[1].setAttributeNS(null, "points",
        "2.6715728752538097, 6.914213562373095 2.6715728752538097, 4.085786437626905 5.5, 6.914213562373095 ");
    gTans[1].setAttributeNS(null, "fill", "#FF9900");
    gTans[2].setAttributeNS(null, "points",
        "4.67157287525381, 2.085786437626905 6.67157287525381, 2.085786437626905 4.67157287525381, 4.085786437626905 ");
    gTans[2].setAttributeNS(null, "fill", "#BCBCBC");
    gTans[3].setAttributeNS(null, "points",
        "4.5, 7.914213562373095 3.5, 6.914213562373095 5.5, 6.914213562373095 ");
    gTans[3].setAttributeNS(null, "fill", "#BCBCBC");
    gTans[4].setAttributeNS(null, "points",
        "6.32842712474619, 4.085786437626905 7.32842712474619, 5.085786437626905 5.32842712474619, 5.085786437626905 ");
    gTans[4].setAttributeNS(null, "fill", "#3299BB");
    gTans[5].setAttributeNS(null, "points",
        "5.914213562373095, 6.5 5.914213562373095, 5.085786437626905 7.32842712474619, 5.085786437626905 7.32842712474619, 6.5 ");
    gTans[5].setAttributeNS(null, "fill", "#FF9900");
    gTans[6].setAttributeNS(null, "points",
        "4.5, 7.914213562373095 5.914213562373095, 6.5 7.32842712474619, 6.5 5.914213562373095, 7.914213562373095 ");
    gTans[6].setAttributeNS(null, "fill", "#3299BB");

    var anA = document.createElementNS("http://www.w3.org/2000/svg", "path");
    anA.setAttributeNS(null, "fill", "#3299BB");
    anA.setAttributeNS(null, "d","m 8.1253633,6.1616282 q -0.328125,0 -0.4951171,0.1113282 -0.1640625,0.1113281 -0.1640625,0.328125 0,0.1992187 0.1318359,0.3134765 0.1347656,0.1113282 0.3720703,0.1113282 0.2958984,0 0.4980469,-0.2109375 0.2021484,-0.2138672 0.2021484,-0.5332032 l 0,-0.1201172 -0.5449219,0 z m 1.6025391,-0.3955078 0,1.8720703 -1.0576172,0 0,-0.4863281 Q 8.4593477,7.4506907 8.1956758,7.5883861 7.932004,7.7231517 7.5540743,7.7231517 q -0.5097656,0 -0.8291016,-0.2958985 -0.3164062,-0.2988281 -0.3164062,-0.7734375 0,-0.5771484 0.3955078,-0.8466796 0.3984375,-0.2695313 1.2480469,-0.2695313 l 0.618164,0 0,-0.082031 q 0,-0.2490235 -0.196289,-0.3632813 Q 8.2777071,4.975105 7.8616915,4.975105 q -0.3369141,0 -0.6269532,0.067383 -0.290039,0.067383 -0.5390625,0.2021485 l 0,-0.7998047 q 0.3369141,-0.082031 0.6767579,-0.1230469 0.3398437,-0.043945 0.6796875,-0.043945 0.8876953,0 1.2802734,0.3515625 0.3955078,0.3486328 0.3955078,1.1367187 z");
    an.appendChild(anA);
    var anN = document.createElementNS("http://www.w3.org/2000/svg", "path");
    anN.setAttributeNS(null, "fill", "#3299BB");
    anN.setAttributeNS(null, "d","m 13.996457,5.6401439 0,1.9980468 -1.054687,0 0,-0.3251953 0,-1.2041015 q 0,-0.4248047 -0.02051,-0.5859375 -0.01758,-0.1611328 -0.06445,-0.2373047 -0.06152,-0.1025391 -0.166993,-0.1582031 -0.105468,-0.058594 -0.240234,-0.058594 -0.328125,0 -0.515625,0.2548828 -0.1875,0.2519531 -0.1875,0.7001953 l 0,1.6142578 -1.048828,0 0,-3.28125 1.048828,0 0,0.4804688 q 0.237305,-0.2871094 0.503906,-0.421875 0.266602,-0.1376953 0.588868,-0.1376953 0.568359,0 0.861328,0.3486328 0.295898,0.3486328 0.295898,1.0136719 z");
    an.appendChild(anN);
    var enE = document.createElementNS("http://www.w3.org/2000/svg", "path");
    enE.setAttributeNS(null, "fill", "#3299BB");
    enE.setAttributeNS(null, "d","m 23.134626,6.1513472 0,0.2988281 -2.452148,0 q 0.03809,0.3691406 0.266602,0.5537109 0.228515,0.1845703 0.638671,0.1845703 0.331055,0 0.676758,-0.09668 0.348633,-0.099609 0.714844,-0.2988281 l 0,0.8085938 q -0.37207,0.140625 -0.744141,0.2109375 -0.37207,0.073242 -0.74414,0.073242 -0.890625,0 -1.385742,-0.4511719 -0.492188,-0.4541016 -0.492188,-1.2714844 0,-0.8027344 0.483398,-1.2626953 0.486329,-0.4599609 1.335938,-0.4599609 0.773437,0 1.236328,0.4658203 0.46582,0.4658203 0.46582,1.2451172 z M 22.056501,5.8027143 q 0,-0.2988281 -0.175781,-0.4804687 -0.172851,-0.1845703 -0.454101,-0.1845703 -0.304688,0 -0.495118,0.1728515 -0.190429,0.1699219 -0.237304,0.4921875 l 1.362304,0 z");
    en.appendChild(enE);
    var enN = document.createElementNS("http://www.w3.org/2000/svg", "path");
    enN.setAttributeNS(null, "fill", "#3299BB");
    enN.setAttributeNS(null, "d","m 27.236189,5.8027143 0,1.9980469 -1.054688,0 0,-0.3251953 0,-1.2041016 q 0,-0.4248046 -0.02051,-0.5859375 Q 26.143415,5.524394 26.09654,5.4482222 26.035017,5.3456831 25.929548,5.290019 25.82408,5.2314253 25.689314,5.2314253 q -0.328125,0 -0.515625,0.2548828 -0.1875,0.2519531 -0.1875,0.7001953 l 0,1.6142578 -1.048828,0 0,-3.28125 1.048828,0 0,0.4804688 q 0.237305,-0.2871094 0.503906,-0.421875 0.266602,-0.1376953 0.588867,-0.1376953 0.56836,0 0.861328,0.3486328 0.295899,0.3486328 0.295899,1.0136718 z");
    en.appendChild(enN);

    var arrowCircle = document.createElementNS("http://www.w3.org/2000/svg", "ellipse");
    arrowCircle.setAttributeNS(null, "rx","4.25");
    arrowCircle.setAttributeNS(null, "ry","4.25");
    arrowCircle.setAttributeNS(null, "cy","5");
    arrowCircle.setAttributeNS(null, "cx","4.5");
    arrowCircle.setAttributeNS(null, "fill","#BCBCBC");
    arrowCircle.setAttributeNS(null, "id","arrow");
    arrowCircle.addEventListener('click', stopLoading);
    arrow.appendChild(arrowCircle);
    var arrowOutline = document.createElementNS("http://www.w3.org/2000/svg", "path");
    arrowOutline.setAttributeNS(null, "stroke", "#3299BB");
    arrowOutline.setAttributeNS(null, "fill","none");
    arrowOutline.setAttributeNS(null, "stroke-width","0.05");
    arrowOutline.setAttributeNS(null, "d","M 2.1715728752538097, 2.1715728752538097 L 5, 5 L 2.1715728752538097, 7.82842712474619 L 5, 7.82842712474619 L 7.82842712474619, 5 L 5, 2.1715728752538097 Z ");
    arrowOutline.setAttributeNS(null, "id","arrow");
    arrowOutline.addEventListener('click', stopLoading);
    arrow.appendChild(arrowOutline);

    loadingSvg.style.display = 'block';
};

var updateLoading = function (percentage) {

};

