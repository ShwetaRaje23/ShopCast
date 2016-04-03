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
  }, "\n        ", HTML.Raw('<h1 class="title-auth">ShopCast</h1>'), "\n        ", HTML.Raw('<p class="subtitle-auth">Sign in to connect with other ShopCasters.</p>'), "\n\n        ", HTML.FORM("\n          ", Blaze.If(function() {
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
  }, "\n            ", HTML.Raw('<input type="password" name="password" placeholder="Password">'), "\n            ", HTML.Raw('<span class="icon-lock" title="Password"></span>'), "\n          "), "\n\n          ", HTML.Raw('<button type="submit" class="btn-primary">Sign in</button>'), "\n        "), "\n        ", HTML.Raw("<br>"), "\n        ", HTML.DIV("\n          ", Blaze.If(function() {
    return Spacebars.call(view.lookup("currentUser"));
  }, function() {
    return [ "\n              ", Blaze.View("lookup:currentUser.services.facebook.name", function() {
      return Spacebars.mustache(Spacebars.dot(view.lookup("currentUser"), "services", "facebook", "name"));
    }), "\n              ", Blaze.View("lookup:currentUser.services.facebook.gender", function() {
      return Spacebars.mustache(Spacebars.dot(view.lookup("currentUser"), "services", "facebook", "gender"));
    }), "\n              ", HTML.BUTTON({
      id: "logout",
      "class": "btn btn-default"
    }, "Logout"), "\n          " ];
  }, function() {
    return [ "\n              ", HTML.BUTTON({
      id: "facebook-login",
      "class": "btn btn-default"
    }, " Login with Facebook"), "\n          " ];
  }), "\n        "), "\n      "), "\n\n      ", HTML.A({
    href: function() {
      return Spacebars.mustache(view.lookup("pathFor"), "join");
    },
    "class": "link-auth-alt"
  }, "Need an account? Join Now."), "\n    "), "\n  ");
}));

}).call(this);
