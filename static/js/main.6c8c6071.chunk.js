(window.webpackJsonpminicolors=window.webpackJsonpminicolors||[]).push([[0],{199:function(e,t,a){e.exports=a(364)},205:function(e,t,a){},364:function(e,t,a){"use strict";a.r(t);var n=a(0),r=a.n(n),o=a(38),c=a.n(o),l=a(48),i=a.n(l),s=a(78),u=a(58),d=a(46),h=a(79),m=a(86),f=a(80),p=a(88),v=function(e){return r.a.createElement("section",{className:"current-color",style:{backgroundColor:e.color.hex}},r.a.createElement("div",null,r.a.createElement("h4",null,"".concat(e.color.brand," ").concat(e.color.productline))),r.a.createElement("div",null,r.a.createElement("h1",null,e.color.name)),r.a.createElement("div",null,r.a.createElement("h4",null,e.color.hex.toUpperCase())))},E=function(e){var t=e.similarColors.map(function(t,a){return r.a.createElement("div",{key:a,className:"similar-color",style:{backgroundColor:t.hex}},r.a.createElement("div",null,r.a.createElement("h4",null,"".concat(t.brand," ").concat(t.productline)),r.a.createElement("h2",null,t.name.charAt(0).toUpperCase()+t.name.slice(1))),r.a.createElement("div",null,r.a.createElement("h4",{className:"delta",onClick:e.onClick},"\u0394=".concat(parseFloat(Math.round(100*t.delta)/100).toFixed(2)))))});return r.a.createElement("section",{className:"similar-colors-wrapper"},t)},g=(a(205),a(81)),b=a.n(g),C=a(17),S=a.n(C),y=a(87),k=a(373),w=a(113),O=a.n(w),j=a(228),x=function e(){var t=this,a=!(arguments.length>0&&void 0!==arguments[0])||arguments[0];Object(d.a)(this,e),this.getDeltaE=function(e,t){var a={L:(e=O.a.hex.lab.raw(e))[0],A:e[1],B:e[2]},n={L:(t=O.a.hex.lab.raw(t))[0],A:t[1],B:t[2]};return j.getDeltaE00(a,n)},this.startCalculation=function(){var e=Object(s.a)(i.a.mark(function e(a){var n,r;return i.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:n=S.a.uniqBy(a,"productline"),r=a.map(function(e){var r=[];return a.forEach(function(a){if(a.id!==e.id){var n=t.getDeltaE(e.hex,a.hex);r.push({id:a.id,deltaE:n})}}),r=S.a.sortBy(r,["deltaE"]),e.matches=[],n.forEach(function(t){var n=S.a.filter(r,function(e){return S.a.find(a,["id",e.id]).productline===t.productline});n=n.slice(0,5),e.matches=[].concat(Object(u.a)(e.matches),Object(u.a)(n))}),e.matches=S.a.sortBy(e.matches,["deltaE"]),e}),console.log(r),t.downloadObjectAsJson(r,"colorsMatched");case 4:case"end":return e.stop()}},e)}));return function(t){return e.apply(this,arguments)}}(),this.downloadObjectAsJson=function(e,t){var a="data:text/json;charset=utf-8,"+encodeURIComponent(JSON.stringify(e)),n=document.createElement("a");n.setAttribute("href",a),n.setAttribute("download",t+".json"),document.body.appendChild(n),n.click(),setTimeout(function(){},1e4)},a&&b.a.get("./colors.json").then(function(e){t.startCalculation(e.data)}).catch(function(e){console.log(e)})},F=function(e){var t=e.brand;return r.a.createElement(y.a,{as:"span",content:t})},N=function(e){var t=e.name;return r.a.createElement(y.a,{id:t,content:t})},L=null,M=function(e){function t(){var e,a;Object(d.a)(this,t);for(var n=arguments.length,r=new Array(n),o=0;o<n;o++)r[o]=arguments[o];return(a=Object(m.a)(this,(e=Object(f.a)(t)).call.apply(e,[this].concat(r)))).initialState={isLoading:!1,results:[],value:"",colors:a.props.colors},a.state=a.initialState,a.calculateDeltas=function(){new x},a.setSource=function(e){L={},e.forEach(function(e){var t=[],a="".concat(e.brand," ").concat(e.productline);a in L&&(t=L[a].results),t.push(e),L[a]={brand:a,results:t}})},a.handleResultSelect=function(e,t){var n=t.result;a.setState({value:""}),a.props.onSubmit(n)},a.handleSearchChange=function(e,t){var n=t.value;a.setState({isLoading:!0,value:n}),setTimeout(function(){if(a.state.value.length<1)return a.setState(a.initialState);var e={},t=a.state.value.trim().split(" ");for(var n in L){var r=L[n].brand,o=L[n].results,c=S.a.filter(o,function(e){var a=e.name.split(" ").concat(e.brand.split(" "));return t.every(function(e){var t=new RegExp(S.a.escapeRegExp(e),"i");return a.some(function(e,n){return!!t.test(e)&&(a.splice(n,1),!0)})})});c.length&&(e[n]={brand:r,results:c})}a.setState({isLoading:!1,results:e})},300)},a}return Object(p.a)(t,e),Object(h.a)(t,[{key:"componentDidUpdate",value:function(){null===L&this.props.colors.length>0&&(this.initialState.colors=this.props.colors,this.setState({colors:this.props.colors}),this.setSource(this.props.colors))}},{key:"render",value:function(){var e=this.state,t=e.isLoading,a=e.value,n=e.results;return r.a.createElement(k.a,Object.assign({input:{icon:"search",iconPosition:"left"},id:"searchInput",fluid:!0,category:!0,placeholder:"Find a color",categoryRenderer:F,loading:t,onResultSelect:this.handleResultSelect,onSearchChange:S.a.debounce(this.handleSearchChange,500,{leading:!0}),resultRenderer:N,results:n,value:a},this.props))}}]),t}(n.Component),R=a(49),A=a(374),B=a(375),D=a(372),I=a(50),J={currentColor:null,similarColors:null,colors:[],filters:[]},U=1,q=new x(!1),T=function(e){function t(){var e,a;Object(d.a)(this,t);for(var n=arguments.length,r=new Array(n),o=0;o<n;o++)r[o]=arguments[o];return(a=Object(m.a)(this,(e=Object(f.a)(t)).call.apply(e,[this].concat(r)))).state=localStorage.getItem("appState".concat(U))?JSON.parse(localStorage.getItem("appState".concat(U))):J,a.onSearchSubmit=function(e){I.a.event({category:"Search",action:"Search Submit"}),a.setState({currentColor:e,similarColors:a.getSimilarColors(e)})},a.dimmerOpen=function(){var e=document.getElementById("snackbar");e.className="show",setTimeout(function(){e.className=e.className.replace("show","")},3e3)},a.setRandomColor=function(){I.a.event({category:"Button",action:"Random Color Button Click"});var e=a.state.colors[Math.floor(Math.random()*a.state.colors.length)];a.setState({currentColor:e},function(){a.setState({similarColors:a.getSimilarColors(e)})})},a.onFilterClick=function(e,t){var n=t.text;e.stopPropagation();var r=Object(u.a)(a.state.filters),o=S.a.findIndex(r,function(e){return"".concat(e.brand," ").concat(e.productline).indexOf(n)>-1});r[o].active=!r[o].active,a.setState({filters:r,similarColors:a.getSimilarColors(a.state.currentColor)})},a}return Object(p.a)(t,e),Object(h.a)(t,[{key:"componentDidMount",value:function(){var e=Object(s.a)(i.a.mark(function e(){var t=this;return i.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:I.a.initialize("UA-149514108-1"),I.a.pageview("/homepage"),0===this.state.colors.length&&(I.a.event({category:"Load Colors",action:"Load Colors Version ".concat(U)}),b.a.get("./colorsMatched.json").then(function(e){t.setState({colors:e.data},function(){t.getFilters(),t.setRandomColor()})}).catch(function(e){console.log(e)}));case 3:case"end":return e.stop()}},e,this)}));return function(){return e.apply(this,arguments)}}()},{key:"componentDidUpdate",value:function(){localStorage.clear(),localStorage.setItem("appState".concat(U),JSON.stringify(this.state))}},{key:"getFilters",value:function(){var e=S.a.uniqBy(this.state.colors,"productline");e=e.map(function(e){return{productline:"".concat(e.brand," ").concat(e.productline),active:!0}}),this.setState({filters:e})}},{key:"getSimilarColors",value:function(e){var t=this;if(e.matches){var a=[];S.a.forEach(this.state.filters,function(e){e.active&&a.push(e.productline)});var n=[];return S.a.forEach(e.matches,function(e){var r=S.a.find(t.state.colors,function(t){return t.id===e.id&&S.a.includes(a,"".concat(t.brand," ").concat(t.productline))});r&&(r.delta=e.deltaE,n.push(r))}),n.length>=5?n.slice(0,5):n.slice(0,n.length)}return null}},{key:"renderHeader",value:function(){return r.a.createElement("header",null,r.a.createElement("nav",null,r.a.createElement("button",{onClick:this.setRandomColor},r.a.createElement(R.a,{name:"random"})),r.a.createElement("div",{className:"search-wrapper"},r.a.createElement(M,{onSubmit:this.onSearchSubmit,colors:this.state.colors}),";"),r.a.createElement("div",{className:"filter-button"},r.a.createElement(A.a,{multiple:!0,icon:"filter"},r.a.createElement(A.a.Menu,null,r.a.createElement(A.a.Header,{icon:"tags",content:"Filter by Product Line"}),r.a.createElement(A.a.Menu,{scrolling:!0},this.renderFilterList()))))))}},{key:"renderFilterList",value:function(){var e=this;return this.state.filters.map(function(t,a){return r.a.createElement(A.a.Item,{key:a,icon:t.active?"check square outline":"square outline",text:t.productline,onClick:e.onFilterClick})})}},{key:"renderMain",value:function(){var e=this.state.currentColor?q.getDeltaE(this.state.currentColor.hex,"#FFFFFF"):100;return null!==this.state.currentColor&&null!==this.state.similarColors?r.a.createElement("main",{className:e<33?"dark":""},r.a.createElement(v,{color:this.state.currentColor}),r.a.createElement(E,{similarColors:this.state.similarColors,onClick:this.dimmerOpen})):r.a.createElement("main",null,r.a.createElement(B.a,{active:!0,inverted:!0},r.a.createElement(D.a,{inverted:!0},"Loading")))}},{key:"renderFooter",value:function(){return r.a.createElement("footer",null,r.a.createElement("div",null,r.a.createElement("h4",null,"Best Match")),r.a.createElement("div",{id:"footerline"}),r.a.createElement("div",null,r.a.createElement("h4",null,"Good Match")))}},{key:"render",value:function(){return r.a.createElement("div",{className:"wrapper"},this.renderHeader(),this.renderMain(),this.renderFooter(),r.a.createElement("div",{id:"snackbar"},"The Delta (\u0394) value indicates the difference between two colors. The lower the number, the better the match!"))}}]),t}(r.a.Component);c.a.render(r.a.createElement(T,null),document.querySelector("#root"))}},[[199,1,2]]]);
//# sourceMappingURL=main.6c8c6071.chunk.js.map