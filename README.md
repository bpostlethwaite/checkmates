# CHECKMATES
Module for sane checkbox handling. Create a bunch of html checkbox's and manage with EventEmitter events using checkbox state and value. Get a master checkbox which can check / uncheck all other checkboxes. The master checkbox automatically shows the proper indeterminant states. Can use with a single group, or multiple, each with their own master (each group is an event emitter instance). All checkboxes produced by a particular `checkmates` instance automatically have their class set to the `groupID` the `checkmate` function was instantiated with.

[Try Them!](http://bpostlethwaite.github.io/checkmates/)

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

## API
#### Create new group
`group = Checkmate("groupname")`

#### Create new checkbox
Create a checkbox part of group `groupname`
`checkbox = group.checkbox(value)`
where `value` is a `String` and is set to the html checkbox's value attribute.
Also checkbox html class is set to `groupname`

#### Create new master
Create a master checkbox for group `groupname`
`master = group.master(value)`
Master behaves as a checkbox but also if any checkboxes are set, the master is put into an indeterminate state. Clicking master in the indeterminate state will uncheck all checkboxes part of group `groupname`. Clicking master when nothing is checked will check all checkboxes part of group `groupname` including master.
Creating a new master just overwrites the old master - and is as of yet, untested.

#### Checked Checkboxes
Often you want to know what checkboxes are checked, so you use the `group.checked` object. The keys are the `value` parameter and the values are the checkmate checkbox elements.

#### Checkmates
`group.checkmates` is an array of all the checkmate checkboxes part of group `groupname`.

#### checkAll
`group.checkall()` does what it says. It checks all non-master checkmate checkboxes.

#### uncheckAll
`group.uncheckAll()` unchecks all checked checkmate checkboxes. (say that five time quickly)

#### Remove all
`group.removeAll()` removes all checkboxes associated with group `groupname` properly. That is, it unchecks them first, removing them from `group.checked` before performing the remove on `group.checkmates`.


## Install
```shell
npm install checkmates
```

### Browser
Write your code then do
```shell
browserify main.js -o bundle.js
```
and put `bundle.js` in your `index.html`
see [browserify](https://github.com/substack/node-browserify)

### Works great with [node-webkit](https://github.com/rogerwang/node-webkit)
Just include it normally. Good for single-page apps

## License
MIT
