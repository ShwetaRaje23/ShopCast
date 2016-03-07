(function(){
Template.__checkName("listsShow");
Template["listsShow"] = new Template("Template.listsShow", (function() {
  var view = this;
  return HTML.DIV({
    "class": "page lists-show"
  }, "\n    ", HTML.NAV({
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
    })), "\n        "), "\n\n        ", HTML.H1({
      "class": "js-edit-list title-page"
    }, HTML.SPAN({
      "class": "title-wrapper"
    }, Blaze.View("lookup:name", function() {
      return Spacebars.mustache(view.lookup("name"));
    })), " ", HTML.SPAN({
      "class": "count-list"
    }, Blaze.View("lookup:incompleteCount", function() {
      return Spacebars.mustache(view.lookup("incompleteCount"));
    }))), "\n\n        ", HTML.DIV({
      "class": "nav-group right"
    }, "\n          ", HTML.DIV({
      "class": "nav-item options-mobile"
    }, "\n            ", HTML.SELECT({
      "class": "list-edit"
    }, "\n              ", HTML.OPTION({
      disabled: "",
      selected: ""
    }, "Select an action"), "\n              ", Blaze.If(function() {
      return Spacebars.call(view.lookup("userId"));
    }, function() {
      return [ "\n                ", HTML.OPTION({
        value: "public"
      }, "Make Public"), "\n              " ];
    }, function() {
      return [ "\n                ", HTML.OPTION({
        value: "private"
      }, "Make Private"), "\n              " ];
    }), "\n              ", HTML.OPTION({
      value: "delete"
    }, "Delete"), "\n            "), "\n            ", HTML.SPAN({
      "class": "icon-cog"
    }), "\n          "), "\n          ", HTML.DIV({
      "class": "options-web"
    }, "\n            ", HTML.A({
      "class": "js-toggle-list-privacy nav-item"
    }, "\n              ", Blaze.If(function() {
      return Spacebars.call(view.lookup("userId"));
    }, function() {
      return [ "\n                ", HTML.SPAN({
        "class": "icon-lock",
        title: "Make list public"
      }), "\n              " ];
    }, function() {
      return [ "\n                ", HTML.SPAN({
        "class": "icon-unlock",
        title: "Make list private"
      }), "\n              " ];
    }), "\n            "), "\n\n            ", HTML.A({
      "class": "js-delete-list nav-item"
    }, "\n              ", HTML.SPAN({
      "class": "icon-trash",
      title: "Delete list"
    }), "\n            "), "\n          "), "\n        "), "\n      " ];
  }), "\n\n      ", HTML.Raw('<form class="js-todo-new todo-new input-symbol">\n        <input type="text" placeholder="Type to add new tasks">\n        <span class="icon-add js-todo-add"></span>\n      </form>'), "\n    "), "\n\n\n    ", HTML.DIV({
    "class": "content-scrollable list-items"
  }, "\n      ", Blaze.If(function() {
    return Spacebars.call(view.lookup("todosReady"));
  }, function() {
    return [ "\n        ", Spacebars.With(function() {
      return Spacebars.call(view.lookup("_id"));
    }, function() {
      return [ " \n          ", Blaze.Each(function() {
        return Spacebars.dataMustache(view.lookup("todos"), view.lookup("."));
      }, function() {
        return [ "\n            ", Spacebars.include(view.lookupTemplate("todosItem")), "\n          " ];
      }, function() {
        return [ "\n            ", HTML.DIV({
          "class": "wrapper-message"
        }, "\n              ", HTML.DIV({
          "class": "title-message"
        }, "No tasks here"), "\n              ", HTML.DIV({
          "class": "subtitle-message"
        }, "Add new tasks using the field above"), "\n            "), "\n          " ];
      }), "\n        " ];
    }), "\n      " ];
  }, function() {
    return [ "\n          ", HTML.DIV({
      "class": "wrapper-message"
    }, "\n            ", HTML.DIV({
      "class": "title-message"
    }, "Loading tasks..."), "\n          "), "\n      " ];
  }), "\n    "), "\n  ");
}));

}).call(this);
