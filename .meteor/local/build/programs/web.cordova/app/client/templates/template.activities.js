(function(){
Template.__checkName("activity");
Template["activity"] = new Template("Template.activity", (function() {
  var view = this;
  return HTML.DIV({
    style: "margin-top: 20%"
  }, "\n\n  ", HTML.A({
    href: function() {
      return Spacebars.mustache(view.lookup("pathFor"), "castsShow");
    },
    "class": "item-activity"
  }, "\n\n    ", HTML.SPAN({
    "class": "lists-show"
  }, "\n      ", HTML.Raw('<!--<span class="avatar">-->'), "\n         ", HTML.Raw('<!--<img src="{{userAvatar}}" class="image-avatar">-->'), "\n      ", HTML.Raw("<!--</span>-->"), "\n      ", HTML.SPAN({
    "class": "meta"
  }, "\n        ", HTML.SPAN({
    "class": "author icon-user-add"
  }, Blaze.View("lookup:firstName", function() {
    return Spacebars.mustache(view.lookup("firstName"));
  })), " is going to\n            ", HTML.SPAN({
    "class": "recipe "
  }, Blaze.View("lookup:place", function() {
    return Spacebars.mustache(view.lookup("place"));
  }), " and can get ", Blaze.View("lookup:items", function() {
    return Spacebars.mustache(view.lookup("items"));
  }), " item(s)"), "\n            ", HTML.Raw("<br>"), "\n              ", HTML.SPAN("Dropoff : ", Blaze.View("lookup:isDropoff", function() {
    return Spacebars.mustache(view.lookup("isDropoff"));
  })), "\n              ", HTML.Raw("<br>"), "\n            ", HTML.SPAN("  Charge : ", Blaze.View("lookup:charge", function() {
    return Spacebars.mustache(view.lookup("charge"));
  })), "\n           ", HTML.Raw('<!--<span class="location">&mdash;</span>-->'), "\n       "), "\n\n\n    ", HTML.Raw('<!--<div class="bg-image" style="background-image: url(\'{{image}}\');">-->'), "\n      ", HTML.Raw("<!--<span>-->"), "\n        ", HTML.Raw("<!--Dropoff : {{isDropoff}}</span><br>-->"), "\n      ", HTML.Raw("<!--<span>  Charge : {{charge}}</span>-->"), "\n\n    ", HTML.Raw("<!--</div>-->"), "\n        ", HTML.Raw("<!--</span>-->"), "\n        "), "\n\n  "), "\n    ");
}));

}).call(this);
