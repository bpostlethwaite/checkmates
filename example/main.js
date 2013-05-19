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

checker.on( 'all-unchecked', function () {
  result.innerText = "all checkboxes unchecked"
})