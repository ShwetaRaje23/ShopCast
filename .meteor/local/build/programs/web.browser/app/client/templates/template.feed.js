(function(){
Template.__checkName("feed");
Template["feed"] = new Template("Template.feed", (function() {
  var view = this;
  return HTML.DIV({
    "class": "page whats-cooking"
  }, HTML.Raw('\n\n    <!-- {{>nav title="What\'s Cooking"}} -->\n      <nav class="js-title-nav">\n          <div class="nav-group">\n              <a href="#" class="js-menu nav-item"></a>\n              </div>\n\n          <h1 class="js-edit-list title-page">\n              <span class="title-wrapper">Broadcasts</span></h1>\n          </nav>\n\n    '), HTML.DIV({
    "class": "content-scrollable list-items"
  }, "\n        ", HTML.DIV({
    "class": "list-item"
  }, "\n      ", HTML.DIV({
    "class": function() {
      return [ "list-activities ", Blaze.Unless(function() {
        return Spacebars.call(view.lookup("ready"));
      }, function() {
        return "loading";
      }) ];
    }
  }, "\n        ", HTML.Raw("<!--{{#if place}}-->"), "\n          ", Blaze.Each(function() {
    return Spacebars.call(view.lookup("broadcasts"));
  }, function() {
    return [ "\n              ", Blaze.If(function() {
      return Spacebars.call(view.lookup("place"));
    }, function() {
      return [ "\n                  ", Blaze.If(function() {
        return Spacebars.call(view.lookup("items"));
      }, function() {
        return [ "\n            ", Spacebars.include(view.lookupTemplate("activity")), "\n\n              " ];
      }), "\n              " ];
    }), "\n          " ];
  }, function() {
    return [ "\n            ", HTML.DIV({
      "class": "wrapper-message"
    }, "\n              ", HTML.DIV({
      "class": "title-message"
    }, " No broadcasts in your area "), "\n              ", HTML.DIV({
      "class": "subtitle-message"
    }, "Start your first broadcast!"), "\n            "), "\n\n          " ];
  }), "\n        ", HTML.Raw('<!-- {{else}}\n          <div class="wrapper-message">\n            <div class="icon-sync"></div>\n            <div class="title-message">Loading</div>\n          </div>-->'), "\n        ", HTML.Raw("<!--{{/if}} -->"), "\n      "), "\n        "), "\n    "), "\n  ");
}));

}).call(this);
