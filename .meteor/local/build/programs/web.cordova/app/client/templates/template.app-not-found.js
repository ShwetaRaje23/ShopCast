(function(){
Template.__checkName("appNotFound");
Template["appNotFound"] = new Template("Template.appNotFound", (function() {
  var view = this;
  return HTML.Raw('<div class="page not-found">\n    <nav>\n      <div class="nav-group">\n        <a href="#" class="js-menu nav-item"><span class="icon-list-unordered"></span></a>\n      </div>\n    </nav>\n\n    <div class="content-scrollable">\n      <div class="wrapper-message">\n        <div class="title-message">Page not found</div>\n      </div>\n    </div>\n  </div>');
}));

}).call(this);
