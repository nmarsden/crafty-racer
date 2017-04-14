this["JST"] = this["JST"] || {};

this["JST"]["templates/bodyTemplate.hbs"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  
  return escapeExpression(helpers.toolbarItems.call(depth0, {hash:{},data:data}));
  }

  buffer += "<div id=\"container\">\n    <div id=\"options\">\n        <div class=\"option sfx\"></div>\n        <div class=\"option music\"></div>\n    </div>\n    <div id=\"game\">\n        <div id=\"editorToolbar\">\n            <div class=\"leftButtons\">\n              ";
  stack1 = helpers.each.call(depth0, depth0.leftToolbarItems, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n            </div>\n            <div class=\"rightButtons\">\n              ";
  stack1 = helpers.each.call(depth0, depth0.rightToolbarItems, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n            </div>\n        </div>\n        <div id=\"cr-stage\"></div>\n    </div>\n</div>";
  return buffer;
  });