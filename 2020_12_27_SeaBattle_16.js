//	MAIN HTML by JS
var jsHtmlFirst = document.createElement ('div')
jsHtmlFirst.innerHTML = `<div class = "mainArea"></div><div class = "mainMenu">
<div class = "menuLinks continueGame">continue<br><i><span class = 'continueGameDate'>${JSON.parse (localStorage.getItem('lsCurrentDate')) !== null ? JSON.parse(localStorage.getItem('lsCurrentDate')) : 'no saves'}</span></i></div><div class = "menuLinks newGame">new game</div><div class = "menuLinks fullScreenGame">fullscreen</div><div class = "menuLinks quitGame">quit</div></div>`

jsHtmlFirst.classList.add ('main')		// First main block of html
document.body.appendChild(jsHtmlFirst)		// Insert it

var randomEffect = {
	checkGenerateRandomCells: function(_fCache) {		// Left side of main menu effect
		while (true)  {
			if (_fCache % Math.floor(document.body.clientWidth * 0.04) == 0)  {
				return _fCache
			}
			else {
				_fCache += 1
			}
		}
	},
	generateRandomCells: function() {
		var randomBlock = document.createElement ('div'),		// Random block
				_height = document.body.clientHeight,		// Height of browser window
				_width = document.body.clientWidth		// Width of browser window
				
		randomBlock.classList.add ('innerMainArea')		// CSS style of random block
		document.querySelector('.mainArea').appendChild(randomBlock)		// Insert random block
		randomBlock.style.top = randomEffect.checkGenerateRandomCells(Math.floor (Math.random() * (_height * 0.76 - _height * 0.04) + _height * 0.04)) + 'px'
		randomBlock.style.left = randomEffect.checkGenerateRandomCells (Math.floor (Math.random() * (_width * 0.64 - _width * 0.04) + _width * 0.04)) + 'px'
		randomBlock.style.height = (document.body.clientWidth > 900 ? 45 : document.body.clientWidth * 0.04) + 'px'
		randomBlock.style.width = (document.body.clientWidth > 900 ? 45 : document.body.clientWidth * 0.04) + 'px'
		
		if (document.querySelectorAll ('.innerMainArea').length > 40) {	// Amount of random cells in menu effect
			document.querySelector ('.innerMainArea').remove()		// Remove it
		}
		if (!(document.querySelectorAll ('div')[0].classList.contains ('mainGame'))) {		// Generate if player in main menu
			setTimeout (randomEffect.generateRandomCells, 250)		// Delay of generating 
		}
		else {	
			return		// If not - stop generate 
		}
	}
},
		amountCols = 10,		// Size of battle place
		amountRows = 10,		// Size of battle place
		jsHtmlSecond = document.createElement ('div')
		
jsHtmlSecond.classList.add ('mainGame')
jsHtmlSecond.setAttribute ('id', 'forMessages')
jsHtmlSecond.innerHTML = '<div id = "gameTable"><table id = "htmlMainSecond"</table></div>'		// Create block for table and it styles
document.body.appendChild(jsHtmlSecond)

var htmlMainSecond = document.querySelector ('#htmlMainSecond'),		// Create main TABLE and it styles
		createTable = {
			createTableRows: function(_fHtmlMainSecond) {		// Creare ROWS
				for (let i = 0; i < amountRows; _fHtmlMainSecond.innerHTML += `<tr>${this.createTableCols()}</tr>`, i++); 
			},
			createTableCols: function() {
				var fLine = ''
				for (let i = 0; i < amountCols; fLine += '<th></th>', i++);
				return fLine
			}
		}
	
randomEffect.generateRandomCells()		// Call function for generating

createTable.createTableRows (htmlMainSecond)		// Function call 

if (document.body.clientWidth > 950)
	document.querySelectorAll ('th').forEach (function (item) {
		item.style.height = '50px'
		item.style.width = '50px'
	})
else
	document.querySelectorAll ('th').forEach (function (item) {
		item.style.height = document.body.clientWidth / 20 + 'px'
		item.style.width = document.body.clientWidth / 20 + 'px'
	})

jsHtmlSecond.innerHTML += `<div id = "gameMenu"><div class = "menuLinks saveGame ">save</div><div class = "menuLinks newGame">new game</div><div class = "menuLinks backGame">back</div><div class = "menuLinks quitGame">quit</div>`

// MAIN JS
var coordinate = document.querySelectorAll('th')		// Global values
		aCoordinate = [],		// Array of battle field
		nCurrentLengthOfShip = 0,		// Global current length of ship
		nCurrentPosOfShip = 0,		// Global current position of ship
		isHorizontal = null,		// Global orientation of shipp
		nAmountOfShips = 0,		// Amount of ships
		nAmountOfShot = 0,	// Amount of all shots
		nCounterForAccuracy = 0,		// Cells counter for accuracy (statistic)
		aShipMiss = [],	// ls
		aShipHit = []	,	// ls
		aShipDestroy = [],	// ls
		sCurrentDate = ''	// ls
		generatedShips = {	// Object with empty coordinates of ships
			fourSeil: [
				['', '', '', '']
				],
			threeSeil: [
				['', '', ''],
				['', '', '']
			],
			twoSeil: [
				['', ''],
				['', ''],
				['', '']
			],
			oneSeil: [
				[''],
				[''],
				[''],
				['']
			]
		}
		
for (let sValue in coordinate) {		// Copy to new array properties of object
	if(coordinate.hasOwnProperty(sValue)){
		aCoordinate.push (sValue)		// Filling in array of all coordinates
		coordinate[sValue].setAttribute ('id', sValue)		// Counter all elements by ID
		coordinate[sValue].setAttribute ('class', 'classAnim')		// For animation
	}
}
	
var communication = {		// Communicate with player by messages
	createDiv: function(_fInnerDivMessage) {
		document.querySelector('#htmlMainSecond').insertAdjacentHTML ('beforebegin', `<div class = "messageHitMiss main"><span>${_fInnerDivMessage}</span></div>`)		// Create block 100x100
		document.getElementById('forMessages').insertAdjacentHTML ('afterbegin', '<div class = "areaFor"></div>')		// Create block with BG and message
		setTimeout (() => {
			document.querySelector('.messageHitMiss').remove ()		// Remove block
			document.querySelector('.areaFor').remove ()		// Remove block
		} , 2500)
	},
	
	message: function(outsideMessage) {
		if (outsideMessage == 'killed')
			this.createDiv(`Congradulation !!!<br> You destroyed else one ship. Ships left ${nAmountOfShips}`)
		if (outsideMessage == 'hited')
			this.createDiv('Hited')
		if (outsideMessage == 'gameOver')
			this.createDiv(`You destroy all ships. Game over. Accuracy ${Math.floor(nCounterForAccuracy * 100 / nAmountOfShot)} %`)		
		if (outsideMessage == 'saved') {
			this.createDiv(`Saved successfully`)
			document.querySelector ('.continueGame').innerHTML = `continue<br><span class = 'continueGameDate'>${JSON.parse (localStorage.getItem('lsCurrentDate'))}</span>`
		}
		if (outsideMessage == 'generating')
			this.createDiv(`Your game is generating`)
	}
}

var game = {
	shot: function(chosenTarget) {		// For element event - click
		chosenTarget.addEventListener ('click', () => {
			game.checkArraysForValue(chosenTarget)
		})
		chosenTarget.addEventListener ('mouseover', game.onOver) 
		chosenTarget.addEventListener ('mouseout', game.onOut) 
	},
// Check every array and it elements for chosen cell
	checkArraysForValue: function(_fIndexOfArray) {
		if (!(_fIndexOfArray.classList.contains('shipHit') || _fIndexOfArray.classList.contains('shipMiss')))
			nAmountOfShot += 1		// Counter of shots
		
		if (!(_fIndexOfArray.classList.contains('shipHit') || _fIndexOfArray.classList.contains('shipDestroy'))){		//for hited !=> missed
			for (let key in generatedShips)		// Check for hit
				for (let i = 0; i < generatedShips[key].length; i++)
					for (let j = 0; j < generatedShips[key][i].length; j++)
						if (+_fIndexOfArray.getAttribute('id') ==  generatedShips[key][i][j]){
							_fIndexOfArray.classList.add ('shipHit')
							generatedShips[key][i][j] += '+'
							this.checkArrayForNone(generatedShips[key][i])
							return
						}
			_fIndexOfArray.classList.add ('shipMiss')		// Else add missing class of clicked cell
		}
	},
// Check for total collapse/destruction
	checkArrayForNone: function ( _fCurrentArray) {		// If match - add sign '+'
		fCount = 0		// Check for total destroyed
		for (let i = 0; i < _fCurrentArray.length; i++)
			if (_fCurrentArray[i][_fCurrentArray[i].length - 1] == '+') 
				fCount += 1

		if (fCount == _fCurrentArray.length) {		// If total - add destroyed ship class
			for (let i = 0; i < _fCurrentArray.length; i++) {
				document.getElementById (`${_fCurrentArray[i].slice(0, -1)}`).classList.remove ('shipHit')
				document.getElementById (`${_fCurrentArray[i].slice(0, -1)}`).classList.add ('shipDestroy')
			}
			this.checkDestroyed()
		} else
			communication.message('hited')
	},
// Check for remain ships 
	checkDestroyed: function () {
		nAmountOfShips -= 1
		if (nAmountOfShips === 0)
			communication.message('gameOver')
		else
			communication.message('killed')
	},
	addForPopUp: function (_fCache) {
		// var fArr = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']
		var fArr = ['А', 'Б', 'В', 'Г', 'Д', 'Е', 'Ж', 'З', 'И', 'К']
		var fCache = ''
		if (_fCache > 9) {
			fCache += fArr[+_fCache[1]]
			fCache += +_fCache[0] + 1
		} else {
			fCache += fArr[+_fCache[0]]
			fCache += '1'
		}
		return fCache
	},
// :hover )))
	onOver: function() {
		fCache = +event.target.getAttribute('id')
		coordinate[fCache].classList.add ('onOver')
		event.target.setAttribute ('data-tooltip', game.addForPopUp(event.target.getAttribute('id')))		// Pop up message

	},
// :unHover ))
	onOut: function() {
		fCache = +event.target.getAttribute('id')
		coordinate[fCache].classList.remove ('onOver')
	}
}
// Generation 
var shipGenerate = {
// Enumeration of all ships
	currentShip: function () {
		for (let key in generatedShips)
			for (let i = 0; i < generatedShips[key].length; i++){
				nCurrentLengthOfShip = generatedShips[key][i].length
				nAmountOfShips += 1		//Count of ships
				nCounterForAccuracy += generatedShips[key][i].length
				this.getCoordinates(generatedShips[key][i])
			}
	},
// Obtain coordinates
	getCoordinates: function(_fCurrentShipArr) {
		if (this.isHorizontal())
			while (true){
				isHorizontal = true
				nCurrentPosOfShip = this.getCell()
				this.addShip ()
				for (let i = 0; i < nCurrentLengthOfShip; i++){
					_fCurrentShipArr[i] = nCurrentPosOfShip
					nCurrentPosOfShip += 1
				}
				return
			}
		else			
			while (true){
				isHorizontal = false
				nCurrentPosOfShip = +this.getCell()
				this.addShip ()
				for (let i = 0; i < nCurrentLengthOfShip; i++){
					_fCurrentShipArr[i] = nCurrentPosOfShip
						nCurrentPosOfShip += 10
				}
				return
			}	
	},
// Orientation horizontal or vertical
	isHorizontal: function(){
		if (Math.floor(Math.random() * 2) == 1)
			return true
		else
			return false
	},
// Generate ceil
	getCell: function() {
		while (true) {
			nCurrentPosOfShip = Math.trunc(Math.random() * 100)
			if (this.checkNeededPosition() && this.checkCoordinates() && this.checkAllForFree())
				break
		}
		return nCurrentPosOfShip
	},
// Check for free horizontal or vertical cells
	checkNeededPosition: function() {
		if (isHorizontal) {
			if (nCurrentPosOfShip % 10 + nCurrentLengthOfShip - 1 < 10) {
				return true
			}
		} else {
			if (nCurrentPosOfShip + ((nCurrentLengthOfShip - 1) * 10) < 100) {
				return true
			}
		}
		return false
	},
// Check this coordinates for here is/is not ship 
	checkCoordinates: function() { 
		var i = 0
		while (i < nCurrentLengthOfShip) {
			if (isHorizontal) {
				if (coordinate[nCurrentPosOfShip + i].classList.contains('hereIsShip'))  {
					return false
				}
			} else {
				if (coordinate[nCurrentPosOfShip + (i * 10)].classList.contains('hereIsShip')) {
					return false
				}
			}
			i += 1
		}
		return true 		
	},
// Check rest cell for free
	checkAllForFree: function() {
		if (isHorizontal) {
// Check above and below for free 
			for (let i = 0; i < nCurrentLengthOfShip; i++) {
				if ((nCurrentPosOfShip > 9 && coordinate[nCurrentPosOfShip + i - 10].classList.contains('hereIsShip')) || (nCurrentPosOfShip < 90 && coordinate[nCurrentPosOfShip + i + 10].classList.contains('hereIsShip')))
					return false
			}	
// Check left cell and right cell for free
			if (nCurrentPosOfShip % 10 != 0 && coordinate[nCurrentPosOfShip - 1].classList.contains ('hereIsShip'))
				return false
			if ((nCurrentPosOfShip + nCurrentLengthOfShip) % 10 != 0 && coordinate[nCurrentPosOfShip + nCurrentLengthOfShip].classList.contains ('hereIsShip'))
				return false
// Check for empty diagonal cells		
			if (nCurrentPosOfShip > 9 && ((nCurrentPosOfShip + nCurrentLengthOfShip - 1 - 9) % 10 != 0 || ((nCurrentPosOfShip - 9) % 10 != 0)) && coordinate[nCurrentPosOfShip + nCurrentLengthOfShip - 1 - 9].classList.contains ('hereIsShip'))
				return false		// diagonal up-right
			if (nCurrentPosOfShip < 90 && (nCurrentPosOfShip + 9) % 10 != 9 && (coordinate[nCurrentPosOfShip + 9].classList.contains ('hereIsShip')))
				return false		// diagonal down-left
			if (nCurrentPosOfShip + nCurrentLengthOfShip - 1 + 11 < 100 && (nCurrentPosOfShip + nCurrentLengthOfShip - 1 + 11) % 10 != 0 && coordinate[nCurrentPosOfShip + nCurrentLengthOfShip - 1 + 11].classList.contains ('hereIsShip'))
				return false		// diagonal down-right
		} else {
			if (nCurrentPosOfShip % 10 != 0)		//check for free left cell
				for (let i = 0; i < nCurrentLengthOfShip; i++)
					if (coordinate[nCurrentPosOfShip + i * 10 - 1].classList.contains('hereIsShip'))
						return false	
			if (nCurrentPosOfShip % 10 != 9)		//check for free right side
				for (let i = 0; i < nCurrentLengthOfShip; i++)
					if (coordinate[nCurrentPosOfShip + i * 10 + 1].classList.contains('hereIsShip'))
						return false

// Check above cell and below cell for free
			if ((nCurrentPosOfShip > 9 && coordinate[nCurrentPosOfShip - 10].classList.contains ('hereIsShip')) || (nCurrentPosOfShip + nCurrentLengthOfShip * 10 < 100 && coordinate[nCurrentPosOfShip + nCurrentLengthOfShip * 10].classList.contains ('hereIsShip')))
				return false
			if (nCurrentPosOfShip > 9 && (nCurrentPosOfShip - 9) % 10 != 0 && coordinate[nCurrentPosOfShip - 9].classList.contains ('hereIsShip'))
				return false		// diagonal up-right
			if (nCurrentPosOfShip + nCurrentLengthOfShip * 10 - 1 < 100 && (nCurrentPosOfShip + 9) % 10 != 9 && coordinate[nCurrentPosOfShip + nCurrentLengthOfShip * 10 - 1].classList.contains ('hereIsShip')) 
				return false		// diagonal down-left
			if (nCurrentPosOfShip + nCurrentLengthOfShip * 10 + 1 < 100 && (nCurrentPosOfShip + 11) % 10 != 0 && coordinate[nCurrentPosOfShip + nCurrentLengthOfShip * 10 + 1].classList.contains ('hereIsShip'))
				return false		// diagonal down-right
		}
		if (nCurrentPosOfShip > 10 && nCurrentPosOfShip % 10 != 0 && coordinate[nCurrentPosOfShip - 11].classList.contains ('hereIsShip'))
			return false		// diagonal up-left COMMON
		return true
	},
// Addind ships on sea map
	addShip: function() {
		if (isHorizontal)
			for (let i = 0; i < nCurrentLengthOfShip; i++ )
				coordinate[nCurrentPosOfShip + i].classList.add ('hereIsShip')	
		else
			for (let i = 0; i < nCurrentLengthOfShip * 10; ) {
				coordinate[nCurrentPosOfShip + i].classList.add ('hereIsShip')
				i += 10
			}
	}
}
// Beautyfull effect for menu
var menuObject = {	
	addLinkAfter: function (_eventTarget, _fCache) {		// Adding effect
		var i = 0
		_eventTarget.classList.add ('menuLinksAfter')
		
		function addLinkAfterClass () {
			if (document.querySelectorAll('.main')[_fCache].querySelectorAll('.menuLinks')[i] !== _eventTarget) 
				document.querySelectorAll('.main')[_fCache].querySelectorAll('.menuLinks')[i].classList.add (('menuLinkAfterTarget'))
			i += 1
			if (document.querySelectorAll('.main')[_fCache].querySelectorAll('.menuLinks').length > i)
				setTimeout( addLinkAfterClass, 50)		
		}
		setTimeout (addLinkAfterClass, 50)
	},
	
	removeLinkAfter: function (_eventTarget, _fCache) {		// Removing effect
		_eventTarget.classList.remove ('menuLinksAfter')
		for (let i = 0; i < document.querySelectorAll('.main')[_fCache].querySelectorAll('.menuLinks').length; i++) 
			if (document.querySelectorAll('.main')[_fCache].querySelectorAll('.menuLinks')[i] !== _eventTarget)
				document.querySelectorAll('.main')[_fCache].querySelectorAll('.menuLinks')[i].classList.remove (('menuLinkAfterTarget'))
	}
}

document.querySelectorAll ('th').forEach((item) => {game.shot(item)})
// CONTINUE
document.querySelector ('.continueGame').addEventListener ('click', () => {

	if ( !(localStorage.getItem('lsShipMiss') && localStorage.getItem('lsShipHit') && localStorage.getItem('lsShipDestroy') && localStorage.getItem('lsCoordinates') && localStorage.getItem('lsAmountOfShips') &&localStorage.getItem('lsAmountOfShot') && localStorage.getItem('lsCounterForAccuracy') ) )
		return false 		// check for startup capability 

	fCacheTarget = event.target
	menuObject.addLinkAfter(fCacheTarget, 0)
	coordinate = document.querySelectorAll('th')
	
	if (localStorage.getItem('lsCoordinates') !== null)
		generatedShips = JSON.parse (localStorage.getItem('lsCoordinates'))
	
	aShipMiss = JSON.parse (localStorage.getItem ('lsShipMiss'))
	aShipHit = JSON.parse (localStorage.getItem ('lsShipHit'))
	aShipDestroy = JSON.parse (localStorage.getItem ('lsShipDestroy'))
	generatedShips = JSON.parse (localStorage.getItem('lsCoordinates'))
	nAmountOfShips = JSON.parse (localStorage.getItem('lsAmountOfShips'))
	nAmountOfShot = JSON.parse (localStorage.getItem('lsAmountOfShot'))
	nCounterForAccuracy = JSON.parse (localStorage.getItem('lsCounterForAccuracy'))
	
	coordinate = document.querySelectorAll('th')
	for (let sValue of coordinate) {
		if (aShipMiss.indexOf (sValue.getAttribute ('id')) > -1)
			sValue.classList.add ('shipMiss')		
		if (aShipHit.indexOf (sValue.getAttribute ('id')) > -1)
			sValue.classList.add ('shipHit')	
		if (aShipDestroy.indexOf (sValue.getAttribute ('id')) > -1)
			sValue.classList.add ('shipDestroy')
	}

	setTimeout (() => {
		jsHtmlFirst.classList.add ('mainGame')
		jsHtmlSecond.classList.remove ('mainGame')
		jsHtmlSecond.classList.add ('main', 'mainGameOpacity')
	} , 950)
	setTimeout (() => {
		jsHtmlSecond.classList.remove ('mainGameOpacity')
		menuObject.removeLinkAfter(fCacheTarget, 0)
	} , 1000)

	for (let key in generatedShips)		// Check for hit
		for (let i = 0; i < generatedShips[key].length; i++)
			console.log (generatedShips[key][i])
})

// NEW GAME [0]
document.querySelectorAll ('.newGame')[0].addEventListener ('click', () => {
	createTable.createTableRows (htmlMainSecond)		// Function call 
	fCacheTarget = event.target
	menuObject.addLinkAfter(fCacheTarget, 0)
	coordinate = document.querySelectorAll('th')
	nAmountOfShips = 0
	
	for  (let sValue of coordinate) {
		sValue.classList.remove ('hereIsShip')
		sValue.classList.remove ('shipDestroy')
		sValue.classList.remove ('shipHit')
		sValue.classList.remove ('shipMiss')
	}
	
	setTimeout (() => {
		jsHtmlFirst.classList.add ('mainGame')
		jsHtmlSecond.classList.remove ('mainGame')
		jsHtmlSecond.classList.add ('main', 'mainGameOpacity')
		shipGenerate.currentShip()
		for (let key in generatedShips)
			for (let i = 0; i < generatedShips[key].length; i++)
				console.log (generatedShips[key][i]) 
	}, 950)
	
	setTimeout (() => {
		menuObject.removeLinkAfter(fCacheTarget, 0)
		jsHtmlFirst.classList.remove ('mainGameOpacity')
	}, 1000)
})

// FULLSCREEN
document.querySelector ('.fullScreenGame').addEventListener ('click', function (event) {
	fCache = event.target
	if (document.fullscreenElement) {
		document.exitFullscreen()
		console.log ('forMessages')
	} else {
		document.documentElement.requestFullscreen()
		console.log ('yyy')
	}
})

// QUIT GAME[0]
document.querySelectorAll('.quitGame')[0].addEventListener ('click', () => {
	fCacheTarget = event.target
	menuObject.addLinkAfter(fCacheTarget, 0)
	setTimeout (function() {document.body.classList.add ('mainGameOpacityReverse')}, 950)
	setTimeout (function() {window.location.href = "about:home"}, 1700)
})

// SAVE GAME
document.querySelector ('.saveGame').addEventListener ('click', () => {
	
	localStorage.removeItem ('lsCoordinates')
	localStorage.setItem ('lsCoordinates', JSON.stringify(generatedShips))
	localStorage.setItem ('lsCurrentDate', JSON.stringify(new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString()))
	
	for (sValue of coordinate) {
		if (sValue.classList.contains ('shipMiss'))
			aShipMiss.push (sValue.getAttribute ('id'))
		else
		if (sValue.classList.contains ('shipHit'))
			aShipHit.push (sValue.getAttribute ('id'))
		else
		if (sValue.classList.contains ('shipDestroy'))
			aShipDestroy.push (sValue.getAttribute ('id'))
	}
	
	localStorage.setItem ('lsShipMiss', JSON.stringify(aShipMiss))
	localStorage.setItem ('lsShipHit', JSON.stringify(aShipHit))
	localStorage.setItem ('lsShipDestroy', JSON.stringify(aShipDestroy))
	
	localStorage.setItem ('lsAmountOfShips', JSON.stringify(nAmountOfShips))
	localStorage.setItem ('lsAmountOfShot', JSON.stringify(nAmountOfShot))
	localStorage.setItem ('lsCounterForAccuracy', JSON.stringify(nCounterForAccuracy))
	
	communication.message ('saved')
})

// NEW GAME [1]
document.querySelectorAll ('.newGame')[1].addEventListener ('click', () => {
	coordinate = document.querySelectorAll('th')
	nAmountOfShips = 0

	communication.message ('generating')
	for  (let sValue of coordinate) {
		sValue.classList.remove ('hereIsShip')
		sValue.classList.remove ('shipDestroy')
		sValue.classList.remove ('shipHit')
		sValue.classList.remove ('shipMiss')
	}
	
	setTimeout (() => {
		shipGenerate.currentShip()
		for (let key in generatedShips)
			for (let i = 0; i < generatedShips[key].length; i++)
				console.log (generatedShips[key][i]) 
	}, 950)
})

// BACK
document.querySelector ('.backGame').addEventListener ('click', () => {
	fCacheTarget = event.target
	menuObject.addLinkAfter(fCacheTarget, 1)
	coordinate = document.querySelectorAll('th')
	setTimeout (() => {
		jsHtmlFirst.classList.remove ('mainGame')
		jsHtmlSecond.classList.add ('mainGame')
		jsHtmlFirst.classList.add ('main', 'mainGameOpacity')
	}, 950)
	
	setTimeout (()=> {
		randomEffect.generateRandomCells()
		menuObject.removeLinkAfter(fCacheTarget, 1)
		jsHtmlSecond.classList.remove ('mainGameOpacity')
	}, 1000)
})

// QUIT[1]
document.querySelectorAll('.quitGame')[1].addEventListener ('click', () => {
	fCacheTarget = event.target
	menuObject.addLinkAfter(fCacheTarget, 1)
	setTimeout (function () {document.body.classList.add ('mainGameOpacityReverse')}, 950)
	setTimeout (function() {window.location.href = "about:home"}, 1700)
})