(function(){
Template.__checkName("ask");
Template["ask"] = new Template("Template.ask", (function() {
  var view = this;
  return HTML.DIV({
    "class": "page lists-show"
  }, "\n    ", Blaze.If(function() {
    return Spacebars.call(view.lookup("currentUser"));
  }, function() {
    return [ "\n    ", HTML.NAV({
      "class": "js-title-nav"
    }, "\n      ", Blaze.If(function() {
      return Spacebars.call(view.lookup("editing"));
    }, function() {
      return [ "\n      ", HTML.FORM({
        "class": "js-edit-form list-edit-form"
      }, "\n        ", HTML.INPUT({
        type: "text",
        name: "name",
        value: function() {
          return Spacebars.mustache(view.lookup("name"));
        }
      }), "\n        ", HTML.DIV({
        "class": "nav-group right"
      }, "\n          ", HTML.A({
        href: "#",
        "class": "js-cancel nav-item"
      }, HTML.SPAN({
        "class": "icon-close js-cancel",
        title: "Cancel"
      })), "\n        "), "\n      "), "\n      " ];
    }, function() {
      return [ "\n      ", HTML.DIV({
        "class": "nav-group"
      }, "\n        ", HTML.A({
        href: "#",
        "class": "js-menu nav-item"
      }, HTML.SPAN({
        "class": "icon-list-unordered",
        title: "Show menu"
      })), "\n      "), "\n      ", HTML.Comment(" <h1>Hello world</h1> "), "\n      ", HTML.H1({
        "class": "js-edit-list title-page"
      }, "\n        ", HTML.SPAN({
        "class": "title-wrapper"
      }, Blaze.View("lookup:castername", function() {
        return Spacebars.mustache(view.lookup("castername"));
      })), "\n        ", HTML.SPAN({
        "class": "count-list"
      }, "is going to"), "\n        ", HTML.SPAN({
        "class": "title-wrapper"
      }, Blaze.View("lookup:place", function() {
        return Spacebars.mustache(view.lookup("place"));
      }))), "\n\n        " ];
    }), "\n\n        ", HTML.FORM({
      "class": "js-todo-new todo-new input-symbol"
    }, "\n          ", HTML.Comment(' <span class="icon-add js-todo-add"></span> '), "\n          ", HTML.Comment(' <input type="text" placeholder="Type to add new tasks"> '), "\n          ", HTML.INPUT({
      type: "text",
      id: "itemname",
      placeholder: "Add an item",
      style: "float: left; width: 200px;"
    }), "\n          ", HTML.INPUT({
      type: "number",
      placeholder: "How many?",
      id: "itemquantity",
      min: "1",
      max: "20",
      style: "float: left; width: 200px;"
    }), "\n          ", HTML.INPUT({
      type: "text",
      placeholder: "Approx cost",
      id: "itemprice",
      style: "float: left; width: 200px;"
    }), "\n          ", HTML.Comment(' <span class="icon-add js-todo-add"></span> '), "\n          ", HTML.INPUT({
      type: "submit",
      value: "Submit",
      style: "visibility: hidden;"
    }), "\n        "), "\n      "), "\n\n\n\n      ", HTML.DIV({
      "class": "content-scrollable list-items"
    }, "\n       ", Blaze.If(function() {
      return Spacebars.call(view.lookup("todosReady"));
    }, function() {
      return [ "\n       ", Spacebars.With(function() {
        return Spacebars.call(view.lookup("_id"));
      }, function() {
        return [ " \n       ", HTML.DIV("\n       ", HTML.DIV({
          style: "float: left; width: 200px;"
        }, "Itemname"), "\n        ", HTML.DIV({
          style: "float: left; width: 200px;"
        }, "Itemquantity"), "\n        ", HTML.DIV({
          style: "float: left; width: 200px;"
        }, "Itemprice"), "\n        ", HTML.Comment(' <br style="clear: left;" /> '), "\n      "), "\n      ", Blaze.Each(function() {
          return Spacebars.dataMustache(view.lookup("todos"), view.lookup("."));
        }, function() {
          return [ "\n      ", Spacebars.include(view.lookupTemplate("todosItem")), "\n      " ];
        }, function() {
          return [ "\n      ", HTML.DIV({
            "class": "wrapper-message"
          }, "\n        ", HTML.DIV({
            "class": "title-message"
          }, "No tasks here"), "\n        ", HTML.DIV({
            "class": "subtitle-msesage"
          }, "Add new tasks using the field above"), "\n      "), "\n      " ];
        }), "\n      " ];
      }), "\n      ", HTML.BUTTON({
        type: "submit",
        "class": "btn-primary send-request"
      }, "Send Request"), "\n      " ];
    }, function() {
      return [ "\n      ", HTML.DIV({
        "class": "wrapper-message"
      }, "\n        ", HTML.DIV({
        "class": "title-message"
      }, "Loading tasks..."), "\n      "), "\n      " ];
    }), "\n    "), "\n    " ];
  }), "\n  ");
}));

}).call(this);
