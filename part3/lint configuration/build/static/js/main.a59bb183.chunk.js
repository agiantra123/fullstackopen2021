(this.webpackJsonppart1=this.webpackJsonppart1||[]).push([[0],{38:function(e,n,t){},39:function(e,n,t){"use strict";t.r(n);var c=t(14),a=t.n(c),r=t(3),u=t(2),s=t(4),i=t.n(s),o="/api/persons",l={getAll:function(){return i.a.get(o).then((function(e){return e.data}))},create:function(e){return i.a.post(o,e).then((function(e){return e.data}))},remove:function(e){return i.a.delete("".concat(o,"/").concat(e)).then((function(e){return e.data}))},update:function(e,n){return i.a.put("".concat(o,"/").concat(e),n).then((function(e){return e.data}))}},d=t(0),j=function(e){var n=e.message,t=e.className;return null===n?null:Object(d.jsx)("div",{className:"".concat(t),children:Object(d.jsx)("p",{children:n})})},m=function(e){var n=e._value,t=e._onChange;return Object(d.jsx)("form",{children:Object(d.jsxs)("div",{children:["filter shown with: ",Object(d.jsx)("input",{value:n,onChange:t})]})})},b=function(e){var n=e._valueName,t=e._onChangeName,c=e._valueNumber,a=e._onChangeNumber,r=e._submit;return Object(d.jsxs)("form",{children:[Object(d.jsxs)("div",{children:["name: ",Object(d.jsx)("input",{value:n,onChange:t})]}),Object(d.jsxs)("div",{children:["number: ",Object(d.jsx)("input",{value:c,onChange:a})]}),Object(d.jsx)("div",{children:Object(d.jsx)("button",{type:"submit",onClick:r,children:"add"})})]})},f=function(e){var n=e._filteredPersons,t=e._onClick;return Object(d.jsx)("div",{children:n.map((function(e){return Object(d.jsxs)("div",{children:[Object(d.jsxs)("p",{children:[e.name," - ",e.number]}),Object(d.jsx)("button",{onClick:function(){return t(e.id,e.name)},children:"Delete"})]},e.number)}))})},h=function(){var e=Object(u.useState)([]),n=Object(r.a)(e,2),t=n[0],c=n[1],a=Object(u.useState)(""),s=Object(r.a)(a,2),i=s[0],o=s[1],h=Object(u.useState)(""),O=Object(r.a)(h,2),v=O[0],g=O[1],p=Object(u.useState)(""),x=Object(r.a)(p,2),_=x[0],C=x[1],w=Object(u.useState)({message:null,class:null}),N=Object(r.a)(w,2),k=N[0],S=N[1];Object(u.useEffect)((function(){l.getAll().then((function(e){c(e)}))}),[]);var y=function(e,n,a){window.confirm("".concat(a," is already added to phonebook, replace the old number with a new one?"))&&l.update(e,n).then((function(n){c(t.map((function(t){return t.id!==e?t:n}))),S({message:"updated ".concat(n.name),class:"success"}),setTimeout((function(){return S({message:null,class:null})}),5e3)})).catch((function(e){S({message:"Information of ".concat(n.name," has already been removed from server"),class:"error"})}))};return Object(d.jsxs)("div",{children:[Object(d.jsx)("h2",{children:"Phonebook"}),Object(d.jsx)(j,{message:k.message,className:k.class}),Object(d.jsx)(m,{_value:_,_onChange:function(e){C(e.target.value)}}),Object(d.jsx)("h2",{children:"Add a new"}),Object(d.jsx)(b,{_valueName:i,_onChangeName:function(e){o(e.target.value)},_valueNumber:v,_onChangeNumber:function(e){g(e.target.value)},_submit:function(e){e.preventDefault();var n={name:i.trim(),number:v.trim()};if(t.find((function(e){return e.name===i.trim()}))){var a=t.find((function(e){return e.name===i.trim()}));y(a.id,n,a.name)}else l.create(n).then((function(e){c(t.concat(e)),S({message:"added ".concat(e.name),class:"success"}),setTimeout((function(){return S({message:null,class:null})}),5e3),o(""),g("")}))}}),Object(d.jsx)("h2",{children:"Numbers"}),Object(d.jsx)(f,{_filteredPersons:t.filter((function(e){return e.name.toLowerCase().includes(_.toLowerCase())})),_onClick:function(e,n){window.confirm("Delete ".concat(n,"?"))&&l.remove(e).then((function(n){c(t.filter((function(n){return n.id!==e})))}))}})]})};t(38);a.a.render(Object(d.jsx)(h,{}),document.getElementById("root"))}},[[39,1,2]]]);
//# sourceMappingURL=main.a59bb183.chunk.js.map