//  
// http://deckofcardsapi.com/
//
const deckOfCards = ['2','3','4','5','6','7','8','9','0','J','Q','K','A']
const playerCard = document.getElementById('playerCard')
const compCard = document.getElementById('compCard')
const playerWarCard = document.getElementById('playerWarCard')
const compWarCard = document.getElementById('compWarCard')
const playerCardImg = document.getElementById("playerCardImg")
const compCardImg = document.getElementById("compCardImg")
const key = 'fgb5419igfhc'
let roundWinner = ''
let lastRound
let bigData
let war = []
let warCount = 0
let playerPile = []
let playerCardCode
let compPile = []
let compCardCode
let hitCount = 0

const getCards = async (count) => {
    const res = await fetch('https://deckofcardsapi.com/api/deck/'+key+'/draw/?count='+count)
    const data = await res.json()
    if (data.success != true){generateCards()}
    return data
}

shuffleCards()

function shuffleCards(){
    fetch('https://deckofcardsapi.com/api/deck/'+key+'/shuffle/')
        .then(res => res.json())
        .then(data => console.log(data))
        .then(generateCards())
}
function setPoints() {
    document.getElementById("compCount").innerHTML = compPile.length
    document.getElementById("playerCount").innerHTML = playerPile.length
    if (compPile.length < 1){endGame('comp')}
    if (playerPile.length < 1){endGame('player')}
}
function autoBattle() {
    let i = 0
    for (i=0; i<10000; i++){
        if ((compPile.length < 1)||(compPile.length < 1)){break}
        getCardsFn()
    }
    console.log('autoCount: '+ i)
}
function generateCards() {
    getCards(52)
    .then((data) => setPiles(data))
    .catch(err => console.log("didn't work:",err))
}
function setPiles(data) {
    bigData=data
    const tempArray=data.cards
    let tArray = []
    tempArray.forEach(element=>{
        tArray.push(element.code)
    })
    playerPile = tArray.slice(0,26)
    compPile = tArray.slice(26,53)
    setPoints()
    getCardsFn()
}
function getCardsFn() {
    hitCount++
    if(hitCount%1000==0){
        console.log('hit 1k','had '+warCount+'wars')
        warCount=0
    }
    playerCardCode = playerPile.shift()
    compCardCode = compPile.shift()
    arrangeCards()
}
function cleanTable (data) {
    if (data == 'war') {
        // setTimeout(() => {
        //     playerCard.classList.add("warAnim")
        //     compCard.classList.add("warAnim")
        // },500)
        //     playerCard.classList.remove("warAnim")
        //     compCard.classList.remove("warAnim")
        playerWarCard.classList.add("bringThemFaceDown")
        compWarCard.classList.add("bringThemFaceDown")
        // setTimeout(() => {
            playerWarCard.classList.remove("bringThemFaceDown")
            compWarCard.classList.remove("bringThemFaceDown")
        // },500)
    }
    if (data =='player'){
        setTimeout(() => {
            playerCard.classList.add("shortMoveCardRight")
            compCard.classList.add("longMoveCardRight")
        },500)
            playerCard.classList.remove("shortMoveCardRight")
            compCard.classList.remove("longMoveCardRight")
    }
    if (data =='comp') {
        setTimeout(() => {
            playerCard.classList.add("longMoveCardLeft")
            compCard.classList.add("shortMoveCardLeft")
        },500)
            playerCard.classList.remove("longMoveCardLeft")
            compCard.classList.remove("shortMoveCardLeft")
    }
    if (lastRound=='war') {
        playerWarCard.style.visibility = "hidden"
        compWarCard.style.visibility = "hidden"
    }
    
}
function bringTheNewCards(){
    setTimeout(() => {
        playerCardImg.src = './img/'+playerCardCode+'.png'
        compCardImg.src = './img/'+compCardCode+'.png'
    },500)
    setTimeout(() => {
        playerCard.classList.add("bringThemIn")
        compCard.classList.add("bringThemIn")
    },500)
        playerCard.classList.remove("bringThemIn")
        compCard.classList.remove("bringThemIn")
}
function arrangeCards() {
    cleanTable(roundWinner)
    lastRound=roundWinner
    roundWinner = checkWhoWin(playerCardCode.charAt(0), compCardCode.charAt(0))
    bringTheNewCards()
    if (roundWinner == 'war'){
        warCount++
        if (compPile.length < 2){endGame('comp')}
        if (playerPile.length < 2) {endGame('player')}
        war.push(playerCardCode, compCardCode, playerPile.shift(), compPile.shift())
    } else {
        roundWinner == 'player'? addToPile(playerPile): addToPile(compPile)
    }
}
function addToPile(which) {
    if (war.length>0){
        setPoints()
        which.push(compCardCode,playerCardCode)
        war.forEach(element => which.push(element))
        war=[]
    }else{
        setPoints()
        which.push(compCardCode,playerCardCode)
    }
}
function checkWhoWin(player, comp) {
    const pValue = deckOfCards.indexOf(player)
    const cValue = deckOfCards.indexOf(comp)
    // return 'war'
    if (pValue==cValue){return 'war'
    }else if (pValue>cValue) {return 'player'
    }else {return 'comp'}
}
function endGame(who) {
    who=='player'?console.log('Player lost'):console.log('Player Win!')
}