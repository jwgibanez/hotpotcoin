(this.webpackJsonpapp=this.webpackJsonpapp||[]).push([[0],{157:function(n,e,t){},159:function(n,e,t){},167:function(n,e){},215:function(n,e){},217:function(n,e){},249:function(n,e){},250:function(n,e){},326:function(n,e,t){"use strict";t.r(e);t(137);var c=t(68),a=t.n(c),r=(t(138),t(20)),s=t.n(r),o=t(69),i=t.n(o),u=(t(157),t(6)),l=t.n(u),d=t(70),b=t(71),f=(t.p,t(159),t(134)),h=t.n(f),p=t(135),g=t.n(p),j=t(136),v=t.n(j),m=t(11);var O=function(){var n=Object(r.useState)(null),e=Object(b.a)(n,2),t=e[0],c=e[1],s=Object(r.useState)("Connect"),o=Object(b.a)(s,2),i=o[0],u=o[1],f=function(){var n=Object(d.a)(l.a.mark((function n(){var e;return l.a.wrap((function(n){for(;;)switch(n.prev=n.next){case 0:console.log("Checking wallet connect..."),(e=new g.a({bridge:"https://bridge.walletconnect.org",qrcodeModal:v.a})).connected||e.createSession(),e.on("connect",(function(n,e){if(n){console.log("No MetaMask or WalletConnect found.")}else{var t=e.params[0],a=t.accounts;t.chainId;if(a){var r=a[0];c(r),u(r.substring(0,5)+"..."+r.substring(r.length-3,r.length))}}})),e.on("session_update",(function(n,e){if(n)throw n;var t=e.params[0];t.accounts,t.chainId})),e.on("disconnect",(function(n,e){if(n)throw n}));case 6:case"end":return n.stop()}}),n)})));return function(){return n.apply(this,arguments)}}(),p=function(){var n=Object(d.a)(l.a.mark((function n(){var e;return l.a.wrap((function(n){for(;;)switch(n.prev=n.next){case 0:return n.next=2,h()();case 2:n.sent?(console.log("Ethereum successfully detected!"),"Metamask detected.",e=window.ethereum.selectedAddress,console.log(e),e?(c(e),u(e.substring(0,5)+"..."+e.substring(e.length-3,e.length))):f()):f();case 4:case"end":return n.stop()}}),n)})));return function(){return n.apply(this,arguments)}}();return a()((function(){p()})),Object(m.jsxs)("div",{className:"App",children:[Object(m.jsx)("nav",{className:"navbar navbar-expand-md navbar-dark bg-dark mb-4",children:Object(m.jsxs)("div",{className:"container-fluid",children:[Object(m.jsx)("a",{className:"navbar-brand",href:"#",children:"HOTPOT COIN"}),Object(m.jsx)("button",{type:"button",className:t?"btn btn-success":"btn btn-warning",children:i})]})}),Object(m.jsx)("div",{className:"alert' + ".concat(t?"alert alert-success":"alert alert-info"),role:"alert",children:t?"Connection established.":"Waiting for connection..."})]})},w=function(n){n&&n instanceof Function&&t.e(3).then(t.bind(null,329)).then((function(e){var t=e.getCLS,c=e.getFID,a=e.getFCP,r=e.getLCP,s=e.getTTFB;t(n),c(n),a(n),r(n),s(n)}))};i.a.render(Object(m.jsx)(s.a.StrictMode,{children:Object(m.jsx)(O,{})}),document.getElementById("root")),w()}},[[326,1,2]]]);
//# sourceMappingURL=main.ea18ad42.chunk.js.map