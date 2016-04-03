(function(){
Template.__checkName("todosItem");
Template["todosItem"] = new Template("Template.todosItem", (function() {
  var view = this;
  return HTML.DIV({
    "class": function() {
      return [ "list-item ", Spacebars.mustache(view.lookup("checkedClass")), " ", Spacebars.mustache(view.lookup("editingClass")) ];
    }
  }, HTML.Raw('\n   <!--  <label class="checkbox">\n      <input type="checkbox" checked="{{checked}}" name="checked">\n      <span class="checkbox-custom"></span>\n  </label> -->\n\n  '), HTML.DIV("\n  	", HTML.DIV({
    style: "float: left; width: 200px;"
  }, Blaze.View("lookup:itemname", function() {
    return Spacebars.mustache(view.lookup("itemname"));
  })), "\n  	", HTML.DIV({
    style: "float: left; width: 200px;"
  }, Blaze.View("lookup:itemquantity", function() {
    return Spacebars.mustache(view.lookup("itemquantity"));
  })), "\n  	", HTML.DIV({
    style: "float: left; width: 200px;"
  }, Blaze.View("lookup:itemprice", function() {
    return Spacebars.mustache(view.lookup("itemprice"));
  })), "\n  	", HTML.Raw('<!-- <br style="clear: left;" /> -->'), "\n  "), HTML.Raw('\n  <!-- <span type="text" value="{{text}}" placeholder="Task name"> -->\n  	<!-- <a class="js-delete-item delete-item" href="#"><span class="icon-trash"></span></a> -->\n  '));
}));

}).call(this);
