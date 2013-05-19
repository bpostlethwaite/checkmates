# CHECKMATES
Module for sane checkbox handling. Create a bunch of checkbox's linked via node events to their state and value. Get a master checkbox which can check / uncheck all other checkboxes and automatically shows the proper indeterminant states. Usually use with a single group, but you can make several groups (each group is an event emitter instance) each with their own master. All checkboxes produced by a particular `checkmates` instance automatically have their class set to the `groupID` the `checkmate` function was instantiated with.

## Example
```javascript
var CheckMate = require('../.')

var result = document.querySelector('#result')
  , checks = document.querySelector('#checks')
  , checkgroup = []

/*
 * Build 5 checkboxes in a group
 */
var checker = CheckMate("groupA")

var i, check
var checked = true
for (i = 0; i < 5; i++) {
  check = checker.checkbox( 'value-' + i )
  checks.appendChild(check)
}

/*
 * Set Master
 */
var master = checker.master( 'value-master' )

checks.insertBefore(master, checks.childNodes[0])


/*
 * Set some eventhandling
 */
checker.on( 'checked', function (checkValue) {
  result.innerText = "checkbox " + checkValue + " checked"
})

checker.on( 'unchecked', function (checkValue) {
  result.innerText = "checkbox " + checkValue + " unchecked"
})

checker.on( 'all-checked', function () {
  result.innerText = "all checkboxes checked"
})

checker.on( 'none-checked', function () {
  result.innerText = "all checkboxes unchecked"
})
```

## Install
```shell
npm install checkmates
```

### Meant for Browser
So write your code then do
```shell
browserify main.js -o bundle.js
```
and put `bundle.js` in your `index.html`

### Works great with node-webkit
Just include it normally. Good for single-page apps

## License
MIT
