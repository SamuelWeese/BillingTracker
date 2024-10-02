var S=Object.defineProperty;var j=(e,t,n)=>t in e?S(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n;var p=(e,t,n)=>j(e,typeof t!="symbol"?t+"":t,n);import{r as m,n as y,f as w,h as C,i as A,j as B,k as b,l as O,m as I,p as N,q as L,v as P,w as T}from"./scheduler.5u_Fi6NP.js";let $=!1;function D(){$=!0}function q(){$=!1}function H(e,t,n,i){for(;e<t;){const a=e+(t-e>>1);n(a)<=i?e=a+1:t=a}return e}function M(e){if(e.hydrate_init)return;e.hydrate_init=!0;let t=e.childNodes;if(e.nodeName==="HEAD"){const r=[];for(let s=0;s<t.length;s++){const o=t[s];o.claim_order!==void 0&&r.push(o)}t=r}const n=new Int32Array(t.length+1),i=new Int32Array(t.length);n[0]=-1;let a=0;for(let r=0;r<t.length;r++){const s=t[r].claim_order,o=(a>0&&t[n[a]].claim_order<=s?a+1:H(1,a,d=>t[n[d]].claim_order,s))-1;i[r]=n[o]+1;const u=o+1;n[u]=r,a=Math.max(u,a)}const c=[],l=[];let f=t.length-1;for(let r=n[a]+1;r!=0;r=i[r-1]){for(c.push(t[r-1]);f>=r;f--)l.push(t[f]);f--}for(;f>=0;f--)l.push(t[f]);c.reverse(),l.sort((r,s)=>r.claim_order-s.claim_order);for(let r=0,s=0;r<l.length;r++){for(;s<c.length&&l[r].claim_order>=c[s].claim_order;)s++;const o=s<c.length?c[s]:null;e.insertBefore(l[r],o)}}function z(e,t){if($){for(M(e),(e.actual_end_child===void 0||e.actual_end_child!==null&&e.actual_end_child.parentNode!==e)&&(e.actual_end_child=e.firstChild);e.actual_end_child!==null&&e.actual_end_child.claim_order===void 0;)e.actual_end_child=e.actual_end_child.nextSibling;t!==e.actual_end_child?(t.claim_order!==void 0||t.parentNode!==e)&&e.insertBefore(t,e.actual_end_child):e.actual_end_child=t.nextSibling}else(t.parentNode!==e||t.nextSibling!==null)&&e.appendChild(t)}function ne(e,t,n){$&&!n?z(e,t):(t.parentNode!==e||t.nextSibling!=n)&&e.insertBefore(t,n||null)}function F(e){e.parentNode&&e.parentNode.removeChild(e)}function ie(e,t){for(let n=0;n<e.length;n+=1)e[n]&&e[n].d(t)}function R(e){return document.createElement(e)}function x(e){return document.createTextNode(e)}function re(){return x(" ")}function se(){return x("")}function le(e,t,n,i){return e.addEventListener(t,n,i),()=>e.removeEventListener(t,n,i)}function U(e,t,n){n==null?e.removeAttribute(t):e.getAttribute(t)!==n&&e.setAttribute(t,n)}const V=["width","height"];function ae(e,t){const n=Object.getOwnPropertyDescriptors(e.__proto__);for(const i in t)t[i]==null?e.removeAttribute(i):i==="style"?e.style.cssText=t[i]:i==="__value"?e.value=e[i]=t[i]:n[i]&&n[i].set&&V.indexOf(i)===-1?e[i]=t[i]:U(e,i,t[i])}function fe(e){return e.dataset.svelteH}function ce(e){return e===""?null:+e}function W(e){return Array.from(e.childNodes)}function G(e){e.claim_info===void 0&&(e.claim_info={last_index:0,total_claimed:0})}function E(e,t,n,i,a=!1){G(e);const c=(()=>{for(let l=e.claim_info.last_index;l<e.length;l++){const f=e[l];if(t(f)){const r=n(f);return r===void 0?e.splice(l,1):e[l]=r,a||(e.claim_info.last_index=l),f}}for(let l=e.claim_info.last_index-1;l>=0;l--){const f=e[l];if(t(f)){const r=n(f);return r===void 0?e.splice(l,1):e[l]=r,a?r===void 0&&e.claim_info.last_index--:e.claim_info.last_index=l,f}}return i()})();return c.claim_order=e.claim_info.total_claimed,e.claim_info.total_claimed+=1,c}function J(e,t,n,i){return E(e,a=>a.nodeName===t,a=>{const c=[];for(let l=0;l<a.attributes.length;l++){const f=a.attributes[l];n[f.name]||c.push(f.name)}c.forEach(l=>a.removeAttribute(l))},()=>i(t))}function ue(e,t,n){return J(e,t,n,R)}function K(e,t){return E(e,n=>n.nodeType===3,n=>{const i=""+t;if(n.data.startsWith(i)){if(n.data.length!==i.length)return n.splitText(i.length)}else n.data=i},()=>x(t),!0)}function oe(e){return K(e," ")}function _e(e,t){t=""+t,e.data!==t&&(e.data=t)}function de(e,t){e.value=t??""}function he(e,t,n,i){n==null?e.style.removeProperty(t):e.style.setProperty(t,n,"")}function me(e,t,n){e.classList.toggle(t,!!n)}function $e(e,t){return new e(t)}const h=new Set;let _;function pe(){_={r:0,c:[],p:_}}function ye(){_.r||m(_.c),_=_.p}function Q(e,t){e&&e.i&&(h.delete(e),e.i(t))}function xe(e,t,n,i){if(e&&e.o){if(h.has(e))return;h.add(e),_.c.push(()=>{h.delete(e),i&&(n&&e.d(1),i())}),e.o(t)}else i&&i()}function ge(e,t,n){const i=e.$$.props[t];i!==void 0&&(e.$$.bound[i]=n,n(e.$$.ctx[i]))}function ve(e){e&&e.c()}function we(e,t){e&&e.l(t)}function X(e,t,n){const{fragment:i,after_update:a}=e.$$;i&&i.m(t,n),b(()=>{const c=e.$$.on_mount.map(L).filter(A);e.$$.on_destroy?e.$$.on_destroy.push(...c):m(c),e.$$.on_mount=[]}),a.forEach(b)}function Y(e,t){const n=e.$$;n.fragment!==null&&(O(n.after_update),m(n.on_destroy),n.fragment&&n.fragment.d(t),n.on_destroy=n.fragment=null,n.ctx=[])}function Z(e,t){e.$$.dirty[0]===-1&&(P.push(e),T(),e.$$.dirty.fill(0)),e.$$.dirty[t/31|0]|=1<<t%31}function be(e,t,n,i,a,c,l=null,f=[-1]){const r=I;N(e);const s=e.$$={fragment:null,ctx:[],props:c,update:y,not_equal:a,bound:w(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(t.context||(r?r.$$.context:[])),callbacks:w(),dirty:f,skip_bound:!1,root:t.target||r.$$.root};l&&l(s.root);let o=!1;if(s.ctx=n?n(e,t.props||{},(u,d,...g)=>{const v=g.length?g[0]:d;return s.ctx&&a(s.ctx[u],s.ctx[u]=v)&&(!s.skip_bound&&s.bound[u]&&s.bound[u](v),o&&Z(e,u)),d}):[],s.update(),o=!0,m(s.before_update),s.fragment=i?i(s.ctx):!1,t.target){if(t.hydrate){D();const u=W(t.target);s.fragment&&s.fragment.l(u),u.forEach(F)}else s.fragment&&s.fragment.c();t.intro&&Q(e.$$.fragment),X(e,t.target,t.anchor),q(),C()}N(r)}class Ne{constructor(){p(this,"$$");p(this,"$$set")}$destroy(){Y(this,1),this.$destroy=y}$on(t,n){if(!A(n))return y;const i=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return i.push(n),()=>{const a=i.indexOf(n);a!==-1&&i.splice(a,1)}}$set(t){this.$$set&&!B(t)&&(this.$$.skip_bound=!0,this.$$set(t),this.$$.skip_bound=!1)}}const k="4";typeof window<"u"&&(window.__svelte||(window.__svelte={v:new Set})).v.add(k);export{ge as A,fe as B,ie as C,de as D,me as E,ce as F,Ne as S,xe as a,x as b,ue as c,W as d,R as e,K as f,F as g,oe as h,be as i,ne as j,z as k,_e as l,se as m,ye as n,U as o,he as p,pe as q,$e as r,re as s,Q as t,ve as u,we as v,X as w,Y as x,le as y,ae as z};
