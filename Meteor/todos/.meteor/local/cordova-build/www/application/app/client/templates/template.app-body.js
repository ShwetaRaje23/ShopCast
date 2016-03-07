(function(){
Template.__checkName("appBody");
Template["appBody"] = new Template("Template.appBody", (function() {
  var view = this;
  return HTML.DIV({
    id: "container",
    "class": function() {
      return [ Spacebars.mustache(view.lookup("menuOpen")), " ", Spacebars.mustache(view.lookup("cordova")) ];
    }
  }, "\n\n    ", HTML.SECTION({
    id: "menu"
  }, "\n      ", Blaze.If(function() {
    return Spacebars.call(view.lookup("currentUser"));
  }, function() {
    return [ "\n        ", HTML.DIV({
      "class": "btns-group-vertical"
    }, "\n          ", HTML.A({
      href: "#",
      "class": "js-user-menu btn-secondary"
    }, "\n            ", Blaze.If(function() {
      return Spacebars.call(view.lookup("userMenuOpen"));
    }, function() {
      return [ "\n              ", HTML.SPAN({
        "class": "icon-arrow-up"
      }), "\n              " ];
    }, function() {
      return [ "\n              ", HTML.SPAN({
        "class": "icon-arrow-down"
      }), "\n            " ];
    }), "\n            ", Blaze.View("lookup:emailLocalPart", function() {
      return Spacebars.mustache(view.lookup("emailLocalPart"));
    }), "\n          "), "\n          ", Blaze.If(function() {
      return Spacebars.call(view.lookup("userMenuOpen"));
    }, function() {
      return [ "\n            ", HTML.A({
        "class": "js-logout btn-secondary"
      }, "Logout"), "\n          " ];
    }), "\n        "), "\n      " ];
  }, function() {
    return [ "\n        ", HTML.DIV({
      "class": "btns-group"
    }, "\n          ", HTML.A({
      href: function() {
        return Spacebars.mustache(view.lookup("pathFor"), "signin");
      },
      "class": "btn-secondary"
    }, "Sign In"), "\n          ", HTML.A({
      href: function() {
        return Spacebars.mustache(view.lookup("pathFor"), "join");
      },
      "class": "btn-secondary"
    }, "Join"), "\n        "), "\n      " ];
  }), "\n\n      ", HTML.DIV({
    "class": "list-todos"
  }, "\n        ", HTML.Raw('<a class="js-new-list link-list-new"><span class="icon-plus"></span>New List</a>'), "\n\n        ", Blaze.Each(function() {
    return Spacebars.call(view.lookup("lists"));
  }, function() {
    return [ "\n          ", HTML.A({
      href: function() {
        return Spacebars.mustache(view.lookup("pathFor"), "listsShow");
      },
      "class": function() {
        return [ "list-todo ", Spacebars.mustache(view.lookup("activeListClass")) ];
      },
      title: function() {
        return Spacebars.mustache(view.lookup("name"));
      }
    }, "\n            ", Blaze.If(function() {
      return Spacebars.call(view.lookup("userId"));
    }, function() {
      return [ "\n              ", HTML.SPAN({
        "class": "icon-lock"
      }), "\n            " ];
    }), "\n            ", Blaze.If(function() {
      return Spacebars.call(view.lookup("incompleteCount"));
    }, function() {
      return [ "\n              ", HTML.SPAN({
        "class": "count-list"
      }, Blaze.View("lookup:incompleteCount", function() {
        return Spacebars.mustache(view.lookup("incompleteCount"));
      })), "\n            " ];
    }), "\n            ", Blaze.View("lookup:name", function() {
      return Spacebars.mustache(view.lookup("name"));
    }), "\n          "), "\n        " ];
  }), "\n\n      "), "\n    "), "\n\n    ", Blaze.Unless(function() {
    return Spacebars.call(view.lookup("connected"));
  }, function() {
    return [ "\n      ", HTML.DIV({
      "class": "notifications"
    }, "\n        ", HTML.DIV({
      "class": "notification"
    }, "\n          ", HTML.SPAN({
      "class": "icon-sync"
    }), "\n          ", HTML.DIV({
      "class": "meta"
    }, "\n            ", HTML.DIV({
      "class": "title-notification"
    }, "Trying to connect"), "\n            ", HTML.DIV({
      "class": "description"
    }, "There seems to be a connection issue"), "\n          "), "\n        "), "\n      "), "\n    " ];
  }), HTML.Raw('\n\n    <div class="content-overlay"></div>\n\n    '), HTML.DIV({
    id: "content-container"
  }, "\n      ", Blaze.Each(function() {
    return Spacebars.call(view.lookup("thisArray"));
  }, function() {
    return [ "\n        ", Spacebars.include(view.lookupTemplate("yield")), "\n      " ];
  }), "\n    "), "\n  ");
}));

}).call(this);
