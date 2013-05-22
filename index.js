
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
        group.emit('unchecked', self.value)
      }
      updateState()
    }

    checkmates.push(self)
    return self
  }

  function master(value) {
    var self = checkbox(value)
    self.className += ' '+groupID+'-master'
    self.onclick = function () {
      if (group.master.indeterminate) {
        /*
         * Clicked while indeterminate:
         * Uncheck all boxes
         */
        group.emit('unchecked', self.value)
        uncheckAll()
      } else if (group.master.checked) {
        /*
         * Wasn't indeterminate and is now checked:
         * Check all checkboxes
         */
        group.emit('checked', self.value)
        checkAll()
      } else {
        /*
         * Wasn't indeterminate but is now unchecked:
         * Uncheck all boxes
         */
        group.emit('unchecked', self.value)
        uncheckAll()
      }
    }
    group.master = self

    return self
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
      group.emit('all-unchecked', true)
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
    updateState()
  }

  function uncheckAll () {
    Object.keys(checked).forEach( function (key) {
      checked[key].checked = false
      delete checked[key]
    })
    updateState()
  }

  function removeAll () {
    uncheckAll()
    checkmates = []
  }

  group.removeAll = removeAll
  group.uncheckAll = uncheckAll
  group.checkAll = checkAll
  group.checkmates = checkmates
  group.checked = checked
  group.checkbox = checkbox
  group.master = master

  return group

}
