/*
 * CHECKMATES
 *
 * Ben Postlethwaite
 * 2013
 *
 * License MIT
 */

"use strict";

var EventEmitter = require('events').EventEmitter

module.exports = CheckMates


function CheckMates (groupID) {

  var group = new EventEmitter
    , checked = {}
    , checkmates = []

  function checkbox(value) {
    /*
     * Tie to DOM
     */
    var self = document.createElement('input')
    self.type = "checkbox"
    self.value = value
    self.className = groupID

    self.onclick = function () {
      if (self.checked) {
        checked[self.value] = self
        group.emit('checked', self.value)
      }  else {
        delete checked[self.value]
        group.emit('un-checked', self.value)
      }
      updateState()
    }

    checkmates.push(self)
    return self
  }

  function master(value) {
    var mastercb = checkbox(value)
    mastercb.onclick = function () {
      if (group.master.indeterminate) {
        /*
         * Clicked while indeterminate:
         * Uncheck all boxes
         */
        uncheckAll()
      } else if (group.master.checked) {
        /*
         * Wasn't indeterminate and is now checked:
         * Check all checkboxes
         */
        checkAll()
      } else {
        /*
         * Wasn't indeterminate but is now unchecked:
         * Uncheck all boxes
         */
        Object.keys(checked).forEach( function (key) {
          checked[key].checked = false
          delete checked[key]
        })
      }
      updateState()
    }

    group.master = mastercb
    return mastercb
  }

  function updateState () {
    if (Object.keys(checked).length === checkmates.length) {
      group.master.indeterminate = false
      group.master.checked = true
      group.emit('all-checked', true)
    }
    else if (Object.keys(checked).length === 0) {
      group.master.indeterminate = false
      group.master.checked = false
      group.emit('none-checked', true)
    }
    else {
      group.master.checked = true
      group.master.indeterminate = true
    }
  }

  function checkAll () {
    checkmates.forEach( function (checkbox) {
      checkbox.checked = true
      checked[checkbox.value] = checkbox
    })
  }

  function removeAll () {
    uncheckAll()
    checkmates = []
  }

  function uncheckAll () {
    Object.keys(checked).forEach( function (key) {
      checked[key].checked = false
      delete checked[key]
    })
  }

  group.removeall = removeAll
  group.uncheckall = uncheckAll
  group.checkall = checkAll
  group.checkmates = checkmates
  group.checked = checked
  group.checkbox = checkbox
  group.master = master

  return group

}
