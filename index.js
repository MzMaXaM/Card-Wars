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
let bigData
let war = []
let warCount = 0
let playerPile = []
let playerCardCode
let compPile = []
let compCardCode
let roundWinner
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
    if (data=='player'){
        playerCard.style.transform = "translateX(50%)"
        compCard.style.transform = "translateX(50%) translateY(150%)"
    }else if (data=='comp') {
        playerCard.style.transform = "translateX(50%) translateY(-155%)"
        compCard.style.transform = "translateX(50%)"
    }else if (data=='war') {
        playerCard.style.transform = "rotateY(0deg) translateX(140%) translateY(0)"
        compCard.style.transform = "rotateY(0deg) translateX(140%) translateY(0)"
        }
    setTimeout(() => {
        playerCardImg.src = '/img/'+playerCardCode+'.png'
        compCardImg.src = '/img/'+compCardCode+'.png'
        playerCard.style.transform = "rotateY(180deg) translateX(-140%)"
        compCard.style.transform = "rotateY(180deg) translateX(-140%)"
    },400)
}
function arrangeCards() {
    cleanTable(roundWinner)
    roundWinner = checkWhoWin(playerCardCode.charAt(0), compCardCode.charAt(0))
    if (roundWinner == 'war'){
        warCount++
        compPile.length < 2? endGame('comp')
        : playerPile.length < 2? endGame('player')
        : war.push(playerCardCode, compCardCode,playerPile.shift(),compPile.shift())
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
    if (pValue==cValue){return 'war'
    }else if (pValue>cValue) {return 'player'
    }else {return 'comp'}
}
function endGame(who) {
    who=='player'?console.log('Player lost'):console.log('Player Win!')
}