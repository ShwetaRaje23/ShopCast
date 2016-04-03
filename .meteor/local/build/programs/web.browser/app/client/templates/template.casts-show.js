(function(){
Template.__checkName("castsShow");
Template["castsShow"] = new Template("Template.castsShow", (function() {
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
      return [ "\n        ", HTML.FORM({
        "class": "js-edit-form list-edit-form"
      }, "\n          ", HTML.INPUT({
        type: "text",
        name: "name",
        value: function() {
          return Spacebars.mustache(view.lookup("name"));
        }
      }), "\n          ", HTML.DIV({
        "class": "nav-group right"
      }, "\n            ", HTML.A({
        href: "#",
        "class": "js-cancel nav-item"
      }, HTML.SPAN({
        "class": "icon-close js-cancel",
        title: "Cancel"
      })), "\n          "), "\n        "), "\n      " ];
    }, function() {
      return [ "\n        ", HTML.DIV({
        "class": "nav-group"
      }, "\n          ", HTML.A({
        href: "#",
        "class": "js-menu nav-item"
      }, HTML.SPAN({
        "class": "icon-list-unordered",
        title: "Show menu"
      })), "\n        "), "\n        ", HTML.Comment(" <h1>Hello world</h1> "), "\n        ", HTML.H1({
        "class": "js-edit-list title-page"
      }, "\n        ", HTML.SPAN({
        "class": "title-wrapper"
      }, Blaze.View("lookup:castername", function() {
        return Spacebars.mustache(view.lookup("castername"));
      })), "\n        ", HTML.Comment('<span class="count-list">is going to</span>'), "\n        ", HTML.SPAN({
        "class": "title-wrapper"
      }, " is going to ", Blaze.View("lookup:place", function() {
        return Spacebars.mustache(view.lookup("place"));
      }))), "\n\n      " ];
    }), "\n", HTML.Comment('\n      <form class="js-todo-new todo-new input-symbol">\n        <input type="text" placeholder="Type to add new tasks">\n        <span class="icon-add js-todo-add"></span>\n      </form> '), "\n    "), "\n    ", HTML.DIV({
      "class": "content-scrollable list-items",
      style: "text-align: center;"
    }, "\n      ", HTML.DIV({
      "class": "list-item"
    }, "\n        ", HTML.CharRef({
      html: "&nbsp;",
      str: " "
    }), "\n        Willing to get: ", Blaze.View("lookup:items", function() {
      return Spacebars.mustache(view.lookup("items"));
    }), " items\n      "), "\n      ", HTML.DIV({
      "class": "list-item"
    }, "\n        ", HTML.CharRef({
      html: "&nbsp;",
      str: " "
    }), " at ", Blaze.View("lookup:time", function() {
      return Spacebars.mustache(view.lookup("time"));
    }), " hours\n      "), "\n      ", HTML.DIV({
      "class": "list-item"
    }, "\n        ", HTML.CharRef({
      html: "&nbsp;",
      str: " "
    }), " will charge $", Blaze.View("lookup:charge", function() {
      return Spacebars.mustache(view.lookup("charge"));
    }), " for the service\n      "), "\n      ", HTML.DIV({
      "class": "list-item"
    }, "\n        ", HTML.CharRef({
      html: "&nbsp;",
      str: " "
    }), " Dropoff: ", Blaze.View("lookup:isDropoff", function() {
      return Spacebars.mustache(view.lookup("isDropoff"));
    }), "\n      "), "\n      ", HTML.BUTTON({
      type: "submit",
      "class": "btn-primary"
    }, "Request"), "\n    "), "\n    " ];
  }), "\n  ");
}));

}).call(this);
