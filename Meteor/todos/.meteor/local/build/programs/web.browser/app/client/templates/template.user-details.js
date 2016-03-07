(function(){
Template.__checkName("detail");
Template["detail"] = new Template("Template.detail", (function() {
  var view = this;
  return HTML.Raw('<div class="page auth">\n    <nav>\n      <div class="nav-group">\n        <a href="#" class="js-menu nav-item"><span class="icon-list-unordered"></span></a>\n      </div>\n    </nav>\n\n    <div class="content-scrollable">\n      <div class="wrapper-auth">\n        <h1 class="title-auth">Account Details</h1>\n\n        <form>\n          <!-- {{#if errorMessages}}\n            <div class="list-errors">\n              {{#each errorMessages}}\n                <div class="list-item">{{this}}</div>\n              {{/each}}\n            </div>\n          {{/if}} -->\n\n          <div class="input-symbol" style="border-bottom: 20px">\n            <input type="text" name="username" placeholder="Username">\n            <span class="icon-user-add" title="Your Email"></span>\n          </div>\n\n          <div class="input-symbol ">\n            <input type="text" name="location" placeholder="Location">\n            <!-- <span class="icon-lock" title="Password"></span> -->\n          </div>\n\n          <div class="input-symbol ">\n            <input type="text" name="credit" placeholder="Credit">\n            <!-- <span class="icon-lock" title="Confirm Password"></span> -->\n          </div>\n\n          <button type="submit" class="btn-primary">Update</button>\n        </form>\n      </div>\n    </div>\n  </div>');
}));

}).call(this);
