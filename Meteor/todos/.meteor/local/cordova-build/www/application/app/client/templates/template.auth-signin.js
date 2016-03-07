(function(){
Template.__checkName("signin");
Template["signin"] = new Template("Template.signin", (function() {
  var view = this;
  return HTML.DIV({
    "class": "page auth"
  }, HTML.Raw('\n    <nav>\n      <div class="nav-group">\n        <a href="#" class="js-menu nav-item"><span class="icon-list-unordered"></span></a>\n      </div>\n    </nav>\n\n    '), HTML.DIV({
    "class": "content-scrollable"
  }, "\n      ", HTML.DIV({
    "class": "wrapper-auth"
  }, "\n        ", HTML.Raw('<h1 class="title-auth">Sign In.</h1>'), "\n        ", HTML.Raw('<p class="subtitle-auth">Signing in allows you to view private lists</p>'), "\n\n        ", HTML.FORM("\n          ", Blaze.If(function() {
    return Spacebars.call(view.lookup("errorMessages"));
  }, function() {
    return [ "\n            ", HTML.DIV({
      "class": "list-errors"
    }, "\n              ", Blaze.Each(function() {
      return Spacebars.call(view.lookup("errorMessages"));
    }, function() {
      return [ "\n                ", HTML.DIV({
        "class": "list-item"
      }, Blaze.View("lookup:.", function() {
        return Spacebars.mustache(view.lookup("."));
      })), "\n              " ];
    }), "\n            "), "\n          " ];
  }), "\n\n          ", HTML.DIV({
    "class": function() {
      return [ "input-symbol ", Spacebars.mustache(view.lookup("errorClass"), "email") ];
    }
  }, "\n            ", HTML.Raw('<input type="email" name="email" placeholder="Your Email">'), "\n            ", HTML.Raw('<span class="icon-email" title="Your Email"></span>'), "\n          "), "\n\n          ", HTML.DIV({
    "class": function() {
      return [ "input-symbol ", Spacebars.mustache(view.lookup("errorClass"), "password") ];
    }
  }, "\n            ", HTML.Raw('<input type="password" name="password" placeholder="Password">'), "\n            ", HTML.Raw('<span class="icon-lock" title="Password"></span>'), "\n          "), "\n\n          ", HTML.Raw('<button type="submit" class="btn-primary">Sign in</button>'), "\n        "), "\n      "), "\n\n      ", HTML.A({
    href: function() {
      return Spacebars.mustache(view.lookup("pathFor"), "join");
    },
    "class": "link-auth-alt"
  }, "Need an account? Join Now."), "\n    "), "\n  ");
}));

}).call(this);
