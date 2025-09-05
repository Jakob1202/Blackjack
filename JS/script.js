// Oppretter en array for kortstokken og legger inn IMG-elementer og tallverdi til kortene
var orginalKortstokk = [];
for (var i = 1; i <= 13; i++) {
    if (i === 1) {
        orginalKortstokk.push(["Media/hjerter" + i + ".png", 11]);
        orginalKortstokk.push(["Media/klover" + i + ".png", 11]);
        orginalKortstokk.push(["Media/ruter" + i + ".png", 11]);
        orginalKortstokk.push(["Media/spar" + i + ".png", 11]);
    } else if (i <= 10) {
        orginalKortstokk.push(["Media/hjerter" + i + ".png", i]);
        orginalKortstokk.push(["Media/klover" + i + ".png", i]);
        orginalKortstokk.push(["Media/ruter" + i + ".png", i]);
        orginalKortstokk.push(["Media/spar" + i + ".png", i]);
    } else {
        orginalKortstokk.push(["Media/hjerter" + i + ".png", 10]);
        orginalKortstokk.push(["Media/klover" + i + ".png", 10]);
        orginalKortstokk.push(["Media/ruter" + i + ".png", 10]);
        orginalKortstokk.push(["Media/spar" + i + ".png", 10]);
    }
}

// Deklarerer globale variabler
var kortstokk;
var antallEssDealer;
var antallEssSpiller;
var dealerSum;
var spillerSum;
var vinner;
var valg = "start";

// Henter elementer og legger dem i variabler
var h3El = document.querySelector("h3");
var dealerEl = document.querySelector(".dealer");
var spillerEl = document.querySelector(".spiller");
var knapp1El = document.getElementById("knapp1");
var knapp2El = document.getElementById("knapp2");
var spillerSumEl = document.getElementById("spillerSum");
var dealerSumEl = document.getElementById("dealerSum");
var audioEl = document.querySelector("audio");

// Endrer lyttere, innholdet og stil til "knappene" (button)
knapp1El.addEventListener("click", startSpill);
knapp2El.addEventListener("click", stand);
knapp2El.style.visibility = "hidden";

// Funksjon som starter spillet
function startSpill(event) {
    console.log("%cStarter et nytt spill", "background: #222; color: #FFFFFF");
    h3El.innerHTML = "";

    // Endrer lyttere, innholdet og stil til "knappene" (button)
    knapp1El.removeEventListener("click", startSpill);
    knapp1El.addEventListener("click", hit);
    knapp1El.innerHTML = "Hit";
    knapp2El.style.visibility = "visible";
    knapp2El.innerHTML = "Stand";

    // Angir start-verdi til globale variabler
    antallEssDealer = 0;
    antallEssSpiller = 0;
    dealerSum = 0;
    spillerSum = 0;
    vinner = "";

    // Dupliserer den orginalen kortsokken og stokker den 
    kortstokk = orginalKortstokk.slice(0);
    sorterKort();

    // Henter alle kortene ("img") på bordet ("body") og fjerner alle unntatt de tre første (ett dealerKort og to spillerKort)
    var imgAllEl = document.querySelectorAll("img");
    for (var y = 0; y < imgAllEl.length; y++) {
        if (imgAllEl[y].className === "") {
            imgAllEl[y].remove();
        }
    }

    // Henter alle kortene ("img") med class "dealerKort" og legger til et nytt kort 
    var dealerKortEl = document.querySelectorAll(".dealerKort")
    for (var i = 0; i < dealerKortEl.length; i++) {
        dealerKortEl[i].src = kortstokk[i][0];
        dealerSum += kortstokk[i][1];

        if (kortstokk[i][1] === 11) {
            antallEssDealer++;
        }
        kortstokk.splice(i, 1);
    }

    // Henter alle kortene ("img") med class "spillerKort" og legger til to nye kort
    var spillerKortEl = document.querySelectorAll(".spillerKort")
    for (var u = 0; u < spillerKortEl.length; u++) {
        spillerKortEl[u].src = kortstokk[u][0];
        spillerSum += kortstokk[u][1];

        if (kortstokk[u][1] === 11) {
            antallEssSpiller++;
        }
        kortstokk.splice(u, 1);
    }
    sjekkSum();
}

// Funksjon som trekker et nytt kort til spilleren når spilleren velger å "hitte"
function hit(event) {
    audioEl.src = "Media/kort.mp3";
    audioEl.play();

    var imgElSpiller = document.createElement("img");
    imgElSpiller.src = kortstokk[0][0];
    spillerEl.appendChild(imgElSpiller);
    spillerSum += kortstokk[0][1];

    if (kortstokk[0][1] === 11) {
        antallEssSpiller++;
    }

    kortstokk.splice(0, 1);
    valg = "hit";

    sjekkSum();
}

// Funksjon som trekker et eller flere kort til dealeren når spilleren velger å "stande"
function stand(event) {
    audioEl.src = "Media/kort.mp3";
    audioEl.play();

    knapp2El.style.visibility = "hidden";

    var imgElDealer = document.createElement("img");
    imgElDealer.src = kortstokk[0][0];
    dealerEl.appendChild(imgElDealer);
    dealerSum += kortstokk[0][1];

    if (kortstokk[0][1] === 11) {
        antallEssDealer++;
    }

    kortstokk.splice(0, 1);
    valg = "stand";

    sjekkSum();
}

// Funksjon som sjekker summen til spiller og dealer for hvert trekk ("hit" eller "stand")
function sjekkSum(event) {
    console.log("Spiller velger " + valg);
    console.log("Antall kort igjen: " + kortstokk.length);

    // Spillet har akkurat startet
    if (valg === "start") {
        // Sjekker om spiller har fått "blackjack"
        if (spillerSum === 21) {
            console.log("Spiller sum: " + spillerSum + ". Spiller har fått blackjack");
            vinner = "Spiller";
            avsluttSpill();
        }
    }

    // Sjekker om spiller har valgt å "hitte"
    else if (valg === "hit") {
        // Sjekker om spiller har fått 21 poeng
        if (spillerSum === 21) {
            // Sjekker om dealer kan matche spiller sum
            setTimeout(stand, 1000);
        }
        // Sjekker om spiller sum er større enn 21
        else if (spillerSum > 21) {
            sjekkEss("spiller");
        }
    }

    // Sjekker om spiller har valgt å "stande"
    else if (valg === "stand") {
        // Sjekker om dealer sum er større enn 21
        if (dealerSum > 21) {
            sjekkEss("dealer");
        }

        // Sjekker om dealer sum er større enn 16
        else {
            if (dealerSum > 16) {
                console.log("Dealer sum: " + dealerSum + ". Dealer sum er større enn 16. Avslutter stand");

                if (spillerSum > dealerSum) {
                    console.log("Spiller sum: " + spillerSum + ". Dealer sum: " + dealerSum + ". Spiller sum er større enn dealer sum");
                    vinner = "Spiller";
                    avsluttSpill();
                } else if (dealerSum > spillerSum) {
                    console.log("Spiller sum: " + spillerSum + ". Dealer sum: " + dealerSum + ". Dealer sum er større enn spiller sum");
                    vinner = "Dealer";
                    avsluttSpill();
                } else {
                    console.log("Spiller sum: " + spillerSum + ". Dealer sum: " + dealerSum + ". Spiller sum er lik dealer sum");
                    vinner = "Dealer";
                    avsluttSpill();
                }
            } else {
                console.log("Dealer sum: " + dealerSum + ". Dealer sum er mindre eller lik 16. Fortsetter stand");
                setTimeout(stand, 1000);
            }
        }
    }

    dealerSumEl.innerHTML = "<b>Dealer sum: </b>" + dealerSum;
    spillerSumEl.innerHTML = "<b>Spiller sum: </b>" + spillerSum;

}

function sjekkEss(deltaker) {
    // Sjekker om spiller har trukket ess
    if (deltaker === "spiller") {
        console.log("Spiller sum: " + spillerSum + ". Spiller sum er større enn 21");
        console.log("Antall spiller ess: " + antallEssSpiller);

        if (antallEssSpiller > 0) {
            console.log("Spiller har ess. Trekker 10 fra spiller sum");
            spillerSum = spillerSum - 10;
            antallEssSpiller--;
        } else {
            console.log("Spiller har ikke ess. Trekker ikke 10 fra spiller sum");
            vinner = "Dealer";
            avsluttSpill();
        }
    }

    // Sjekker om dealer har trukket ess 
    else {
        console.log("Dealer sum: " + dealerSum + ". Dealer sum er større enn 21");
        console.log("Antall dealer ess: " + antallEssDealer);

        if (antallEssDealer > 0) {
            console.log("Dealer har ess. Trekker 10 fra dealer sum");
            dealerSum = dealerSum - 10;
            antallEssDealer--;

            if (dealerSum <= 16) {
                setTimeout(stand, 1000);
            } else {
                sjekkSum();
            }
        } else {
            console.log("Dealer har ikke ess. Trekker ikke 10 fra dealer sum");
            vinner = "Spiller";
            avsluttSpill();
        }
    }
}

// Funksjon som avslutter spillet 
function avsluttSpill(event) {
    console.log("%cSpillet er ferdig. " + vinner + " vant. Avslutter spill", 'background: #222; color: #FFFFFF');

    valg = "start";
    h3El.innerHTML = vinner + " vant!";

    // Endrer lyttere, innholdet og stil til "knappene" (button)
    knapp1El.removeEventListener("click", hit);
    knapp1El.addEventListener("click", startSpill);
    knapp1El.innerHTML = "Start et nytt spill";
    knapp2El.style.visibility = "hidden";
}

// Funksjon som stokker kortstokken (array)
function sorterKort(event) {
    for (var i = kortstokk.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        [kortstokk[i], kortstokk[j]] = [kortstokk[j], kortstokk[i]];
    }
}