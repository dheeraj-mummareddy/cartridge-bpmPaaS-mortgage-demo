(function(){function a(){this.Diff_Timeout=1;
this.Diff_EditCost=4;
this.Match_Threshold=0.5;
this.Match_Distance=1000;
this.Patch_DeleteThreshold=0.5;
this.Patch_Margin=4;
this.Match_MaxBits=32
}a.prototype.diff_main=function(i,h,n,m){"undefined"==typeof m&&(m=0>=this.Diff_Timeout?Number.MAX_VALUE:(new Date).getTime()+1000*this.Diff_Timeout);
if(null==i||null==h){throw Error("Null input. (diff_main)")
}if(i==h){return i?[[0,i]]:[]
}"undefined"==typeof n&&(n=!0);
var l=n,k=this.diff_commonPrefix(i,h),n=i.substring(0,k),i=i.substring(k),h=h.substring(k),k=this.diff_commonSuffix(i,h),j=i.substring(i.length-k),i=i.substring(0,i.length-k),h=h.substring(0,h.length-k),i=this.diff_compute_(i,h,l,m);
n&&i.unshift([0,n]);
j&&i.push([0,j]);
this.diff_cleanupMerge(i);
return i
};
a.prototype.diff_compute_=function(i,h,n,m){if(!i){return[[1,h]]
}if(!h){return[[-1,i]]
}var l=i.length>h.length?i:h,k=i.length>h.length?h:i,j=l.indexOf(k);
if(-1!=j){return n=[[1,l.substring(0,j)],[0,k],[1,l.substring(j+k.length)]],i.length>h.length&&(n[0][0]=n[2][0]=-1),n
}if(1==k.length){return[[-1,i],[1,h]]
}return(l=this.diff_halfMatch_(i,h))?(k=l[0],i=l[1],j=l[2],h=l[3],l=l[4],k=this.diff_main(k,j,n,m),n=this.diff_main(i,h,n,m),k.concat([[0,l]],n)):n&&100<i.length&&100<h.length?this.diff_lineMode_(i,h,m):this.diff_bisect_(i,h,m)
};
a.prototype.diff_lineMode_=function(i,h,n){var m=this.diff_linesToChars_(i,h),i=m.chars1,h=m.chars2,m=m.lineArray,i=this.diff_main(i,h,!1,n);
this.diff_charsToLines_(i,m);
this.diff_cleanupSemantic(i);
i.push([0,""]);
for(var l=m=h=0,k="",j="";
h<i.length;
){switch(i[h][0]){case 1:l++;
j+=i[h][1];
break;
case -1:m++;
k+=i[h][1];
break;
case 0:if(1<=m&&1<=l){i.splice(h-m-l,m+l);
h=h-m-l;
m=this.diff_main(k,j,!1,n);
for(l=m.length-1;
0<=l;
l--){i.splice(h,0,m[l])
}h+=m.length
}m=l=0;
j=k=""
}h++
}i.pop();
return i
};
a.prototype.diff_bisect_=function(R,Q,P){for(var O=R.length,N=Q.length,M=Math.ceil((O+N)/2),L=M,K=2*M,I=Array(K),J=Array(K),H=0;
H<K;
H++){I[H]=-1,J[H]=-1
}I[L+1]=0;
J[L+1]=0;
for(var H=O-N,C=0!=H%2,B=0,z=0,D=0,w=0,x=0;
x<M&&!((new Date).getTime()>P);
x++){for(var E=-x+B;
E<=x-z;
E+=2){var G=L+E,F;
F=E==-x||E!=x&&I[G-1]<I[G+1]?I[G+1]:I[G-1]+1;
for(var A=F-E;
F<O&&A<N&&R.charAt(F)==Q.charAt(A);
){F++,A++
}I[G]=F;
if(F>O){z+=2
}else{if(A>N){B+=2
}else{if(C&&(G=L+H-E,0<=G&&G<K&&-1!=J[G])){var y=O-J[G];
if(F>=y){return this.diff_bisectSplit_(R,Q,F,A,P)
}}}}}for(E=-x+D;
E<=x-w;
E+=2){G=L+E;
y=E==-x||E!=x&&J[G-1]<J[G+1]?J[G+1]:J[G-1]+1;
for(F=y-E;
y<O&&F<N&&R.charAt(O-y-1)==Q.charAt(N-F-1);
){y++,F++
}J[G]=y;
if(y>O){w+=2
}else{if(F>N){D+=2
}else{if(!C&&(G=L+H-E,0<=G&&G<K&&-1!=I[G]&&(F=I[G],A=L+F-G,y=O-y,F>=y))){return this.diff_bisectSplit_(R,Q,F,A,P)
}}}}}return[[-1,R],[1,Q]]
};
a.prototype.diff_bisectSplit_=function(i,h,n,m,l){var k=i.substring(0,n),j=h.substring(0,m),i=i.substring(n),h=h.substring(m),k=this.diff_main(k,j,!1,l),l=this.diff_main(i,h,!1,l);
return k.concat(l)
};
a.prototype.diff_linesToChars_=function(i,h){function n(e){for(var d="",s=0,r=-1,o=m.length;
r<e.length-1;
){r=e.indexOf("\n",s);
-1==r&&(r=e.length-1);
var p=e.substring(s,r+1),s=r+1;
(l.hasOwnProperty?l.hasOwnProperty(p):void 0!==l[p])?d+=String.fromCharCode(l[p]):(d+=String.fromCharCode(o),l[p]=o,m[o++]=p)
}return d
}var m=[],l={};
m[0]="";
var k=n(i),j=n(h);
return{chars1:k,chars2:j,lineArray:m}
};
a.prototype.diff_charsToLines_=function(h,g){for(var l=0;
l<h.length;
l++){for(var k=h[l][1],j=[],i=0;
i<k.length;
i++){j[i]=g[k.charCodeAt(i)]
}h[l][1]=j.join("")
}};
a.prototype.diff_commonPrefix=function(h,g){if(!h||!g||h.charAt(0)!=g.charAt(0)){return 0
}for(var l=0,k=Math.min(h.length,g.length),j=k,i=0;
l<j;
){h.substring(i,j)==g.substring(i,j)?i=l=j:k=j,j=Math.floor((k-l)/2+l)
}return j
};
a.prototype.diff_commonSuffix=function(h,g){if(!h||!g||h.charAt(h.length-1)!=g.charAt(g.length-1)){return 0
}for(var l=0,k=Math.min(h.length,g.length),j=k,i=0;
l<j;
){h.substring(h.length-j,h.length-i)==g.substring(g.length-j,g.length-i)?i=l=j:k=j,j=Math.floor((k-l)/2+l)
}return j
};
a.prototype.diff_commonOverlap_=function(h,g){var l=h.length,k=g.length;
if(0==l||0==k){return 0
}l>k?h=h.substring(l-k):l<k&&(g=g.substring(0,l));
l=Math.min(l,k);
if(h==g){return l
}for(var k=0,j=1;
;
){var i=h.substring(l-j),i=g.indexOf(i);
if(-1==i){return k
}j+=i;
if(0==i||h.substring(l-j)==g.substring(0,j)){k=j,j++
}}};
a.prototype.diff_halfMatch_=function(r,q){function p(C,B,A){for(var z=C.substring(A,A+Math.floor(C.length/4)),y=-1,x="",w,v,s,u;
-1!=(y=B.indexOf(z,y+1));
){var t=m.diff_commonPrefix(C.substring(A),B.substring(y)),f=m.diff_commonSuffix(C.substring(0,A),B.substring(0,y));
x.length<f+t&&(x=B.substring(y-f,y)+B.substring(y,y+t),w=C.substring(0,A-f),v=C.substring(A+t),s=B.substring(0,y-f),u=B.substring(y+t))
}return 2*x.length>=C.length?[w,v,s,u,x]:null
}if(0>=this.Diff_Timeout){return null
}var o=r.length>q.length?r:q,n=r.length>q.length?q:r;
if(4>o.length||2*n.length<o.length){return null
}var m=this,l=p(o,n,Math.ceil(o.length/4)),o=p(o,n,Math.ceil(o.length/2)),k;
if(!l&&!o){return null
}k=o?l?l[4].length>o[4].length?l:o:o:l;
var i;
r.length>q.length?(l=k[0],o=k[1],n=k[2],i=k[3]):(n=k[0],i=k[1],l=k[2],o=k[3]);
k=k[4];
return[l,o,n,i,k]
};
a.prototype.diff_cleanupSemantic=function(t){for(var s=!1,r=[],q=0,p=null,o=0,n=0,m=0,k=0,l=0;
o<t.length;
){0==t[o][0]?(r[q++]=o,n=k,m=l,l=k=0,p=t[o][1]):(1==t[o][0]?k+=t[o][1].length:l+=t[o][1].length,p&&p.length<=Math.max(n,m)&&p.length<=Math.max(k,l)&&(t.splice(r[q-1],0,[-1,p]),t[r[q-1]+1][0]=1,q--,q--,o=0<q?r[q-1]:-1,l=k=m=n=0,p=null,s=!0)),o++
}s&&this.diff_cleanupMerge(t);
this.diff_cleanupSemanticLossless(t);
for(o=1;
o<t.length;
){if(-1==t[o-1][0]&&1==t[o][0]){s=t[o-1][1];
r=t[o][1];
q=this.diff_commonOverlap_(s,r);
p=this.diff_commonOverlap_(r,s);
if(q>=p){if(q>=s.length/2||q>=r.length/2){t.splice(o,0,[0,r.substring(0,q)]),t[o-1][1]=s.substring(0,s.length-q),t[o+1][1]=r.substring(q),o++
}}else{if(p>=s.length/2||p>=r.length/2){t.splice(o,0,[0,s.substring(0,p)]),t[o-1][0]=1,t[o-1][1]=r.substring(0,r.length-p),t[o+1][0]=-1,t[o+1][1]=s.substring(p),o++
}}o++
}o++
}};
a.prototype.diff_cleanupSemanticLossless=function(v){function u(E,D){if(!E||!D){return 6
}var C=E.charAt(E.length-1),B=D.charAt(0),A=C.match(a.nonAlphaNumericRegex_),z=B.match(a.nonAlphaNumericRegex_),y=A&&C.match(a.whitespaceRegex_),x=z&&B.match(a.whitespaceRegex_),C=y&&C.match(a.linebreakRegex_),B=x&&B.match(a.linebreakRegex_),w=C&&E.match(a.blanklineEndRegex_),k=B&&D.match(a.blanklineStartRegex_);
return w||k?5:C||B?4:A&&!y&&x?3:y||x?2:A||z?1:0
}for(var t=1;
t<v.length-1;
){if(0==v[t-1][0]&&0==v[t+1][0]){var s=v[t-1][1],r=v[t][1],q=v[t+1][1],p=this.diff_commonSuffix(s,r);
if(p){var o=r.substring(r.length-p),s=s.substring(0,s.length-p),r=o+r.substring(0,r.length-p),q=o+q
}for(var p=s,o=r,m=q,n=u(s,r)+u(r,q);
r.charAt(0)===q.charAt(0);
){var s=s+r.charAt(0),r=r.substring(1)+q.charAt(0),q=q.substring(1),l=u(s,r)+u(r,q);
l>=n&&(n=l,p=s,o=r,m=q)
}v[t-1][1]!=p&&(p?v[t-1][1]=p:(v.splice(t-1,1),t--),v[t][1]=o,m?v[t+1][1]=m:(v.splice(t+1,1),t--))
}t++
}};
a.nonAlphaNumericRegex_=/[^a-zA-Z0-9]/;
a.whitespaceRegex_=/\s/;
a.linebreakRegex_=/[\r\n]/;
a.blanklineEndRegex_=/\n\r?\n$/;
a.blanklineStartRegex_=/^\r?\n\r?\n/;
a.prototype.diff_cleanupEfficiency=function(t){for(var s=!1,r=[],q=0,p=null,o=0,n=!1,m=!1,k=!1,l=!1;
o<t.length;
){if(0==t[o][0]){t[o][1].length<this.Diff_EditCost&&(k||l)?(r[q++]=o,n=k,m=l,p=t[o][1]):(q=0,p=null),k=l=!1
}else{if(-1==t[o][0]?l=!0:k=!0,p&&(n&&m&&k&&l||p.length<this.Diff_EditCost/2&&3==n+m+k+l)){t.splice(r[q-1],0,[-1,p]),t[r[q-1]+1][0]=1,q--,p=null,n&&m?(k=l=!0,q=0):(q--,o=0<q?r[q-1]:-1,k=l=!1),s=!0
}}o++
}s&&this.diff_cleanupMerge(t)
};
a.prototype.diff_cleanupMerge=function(i){i.push([0,""]);
for(var h=0,n=0,m=0,l="",k="",j;
h<i.length;
){switch(i[h][0]){case 1:m++;
k+=i[h][1];
h++;
break;
case -1:n++;
l+=i[h][1];
h++;
break;
case 0:1<n+m?(0!==n&&0!==m&&(j=this.diff_commonPrefix(k,l),0!==j&&(0<h-n-m&&0==i[h-n-m-1][0]?i[h-n-m-1][1]+=k.substring(0,j):(i.splice(0,0,[0,k.substring(0,j)]),h++),k=k.substring(j),l=l.substring(j)),j=this.diff_commonSuffix(k,l),0!==j&&(i[h][1]=k.substring(k.length-j)+i[h][1],k=k.substring(0,k.length-j),l=l.substring(0,l.length-j))),0===n?i.splice(h-m,n+m,[1,k]):0===m?i.splice(h-n,n+m,[-1,l]):i.splice(h-n-m,n+m,[-1,l],[1,k]),h=h-n-m+(n?1:0)+(m?1:0)+1):0!==h&&0==i[h-1][0]?(i[h-1][1]+=i[h][1],i.splice(h,1)):h++,n=m=0,k=l=""
}}""===i[i.length-1][1]&&i.pop();
n=!1;
for(h=1;
h<i.length-1;
){0==i[h-1][0]&&0==i[h+1][0]&&(i[h][1].substring(i[h][1].length-i[h-1][1].length)==i[h-1][1]?(i[h][1]=i[h-1][1]+i[h][1].substring(0,i[h][1].length-i[h-1][1].length),i[h+1][1]=i[h-1][1]+i[h+1][1],i.splice(h-1,1),n=!0):i[h][1].substring(0,i[h+1][1].length)==i[h+1][1]&&(i[h-1][1]+=i[h+1][1],i[h][1]=i[h][1].substring(i[h+1][1].length)+i[h+1][1],i.splice(h+1,1),n=!0)),h++
}n&&this.diff_cleanupMerge(i)
};
a.prototype.diff_xIndex=function(i,h){var n=0,m=0,l=0,k=0,j;
for(j=0;
j<i.length;
j++){1!==i[j][0]&&(n+=i[j][1].length);
-1!==i[j][0]&&(m+=i[j][1].length);
if(n>h){break
}l=n;
k=m
}return i.length!=j&&-1===i[j][0]?k:k+(h-l)
};
a.prototype.diff_prettyHtml=function(r){for(var q=[],p=/&/g,o=/</g,n=/>/g,m=/\n/g,l=0;
l<r.length;
l++){var k=r[l][0],i=r[l][1],i=i.replace(p,"&amp;").replace(o,"&lt;").replace(n,"&gt;").replace(m,"&para;<br>");
switch(k){case 1:q[l]='<ins style="background:#e6ffe6;">'+i+"</ins>";
break;
case -1:q[l]='<del style="background:#ffe6e6;">'+i+"</del>";
break;
case 0:q[l]="<span>"+i+"</span>"
}}return q.join("")
};
a.prototype.diff_text1=function(e){for(var d=[],f=0;
f<e.length;
f++){1!==e[f][0]&&(d[f]=e[f][1])
}return d.join("")
};
a.prototype.diff_text2=function(e){for(var d=[],f=0;
f<e.length;
f++){-1!==e[f][0]&&(d[f]=e[f][1])
}return d.join("")
};
a.prototype.diff_levenshtein=function(i){for(var h=0,n=0,m=0,l=0;
l<i.length;
l++){var k=i[l][0],j=i[l][1];
switch(k){case 1:n+=j.length;
break;
case -1:m+=j.length;
break;
case 0:h+=Math.max(n,m),m=n=0
}}return h+=Math.max(n,m)
};
a.prototype.diff_toDelta=function(e){for(var d=[],f=0;
f<e.length;
f++){switch(e[f][0]){case 1:d[f]="+"+encodeURI(e[f][1]);
break;
case -1:d[f]="-"+e[f][1].length;
break;
case 0:d[f]="="+e[f][1].length
}}return d.join("\t").replace(/%20/g," ")
};
a.prototype.diff_fromDelta=function(t,s){for(var r=[],q=0,p=0,o=s.split(/\t/g),n=0;
n<o.length;
n++){var m=o[n].substring(1);
switch(o[n].charAt(0)){case"+":try{r[q++]=[1,decodeURI(m)]
}catch(k){throw Error("Illegal escape in diff_fromDelta: "+m)
}break;
case"-":case"=":var l=parseInt(m,10);
if(isNaN(l)||0>l){throw Error("Invalid number in diff_fromDelta: "+m)
}m=t.substring(p,p+=l);
"="==o[n].charAt(0)?r[q++]=[0,m]:r[q++]=[-1,m];
break;
default:if(o[n]){throw Error("Invalid diff operation in diff_fromDelta: "+o[n])
}}}if(p!=t.length){throw Error("Delta length ("+p+") does not equal source text length ("+t.length+").")
}return r
};
a.prototype.match_main=function(e,d,f){if(null==e||null==d||null==f){throw Error("Null input. (match_main)")
}f=Math.max(0,Math.min(f,e.length));
return e==d?0:e.length?e.substring(f,f+d.length)==d?f:this.match_bitap_(e,d,f):-1
};
a.prototype.match_bitap_=function(D,C,B){function A(b,h){var f=b/C.length,c=Math.abs(B-h);
return !y.Match_Distance?c?1:f:f+c/y.Match_Distance
}if(C.length>this.Match_MaxBits){throw Error("Pattern too long for this browser.")
}var z=this.match_alphabet_(C),y=this,x=this.Match_Threshold,w=D.indexOf(C,B);
-1!=w&&(x=Math.min(A(0,w),x),w=D.lastIndexOf(C,B+C.length),-1!=w&&(x=Math.min(A(0,w),x)));
for(var t=1<<C.length-1,w=-1,u,r,m=C.length+D.length,l,F=0;
F<C.length;
F++){u=0;
for(r=m;
u<r;
){A(F,B+r)<=x?u=r:m=r,r=Math.floor((m-u)/2+u)
}m=r;
u=Math.max(1,B-r+1);
var n=Math.min(B+r,D.length)+C.length;
r=Array(n+2);
for(r[n+1]=(1<<F)-1;
n>=u;
n--){var E=z[D.charAt(n-1)];
r[n]=0===F?(r[n+1]<<1|1)&E:(r[n+1]<<1|1)&E|(l[n+1]|l[n])<<1|1|l[n+1];
if(r[n]&t&&(E=A(F,n-1),E<=x)){if(x=E,w=n-1,w>B){u=Math.max(1,2*B-w)
}else{break
}}}if(A(F+1,B)>x){break
}l=r
}return w
};
a.prototype.match_alphabet_=function(e){for(var d={},f=0;
f<e.length;
f++){d[e.charAt(f)]=0
}for(f=0;
f<e.length;
f++){d[e.charAt(f)]|=1<<e.length-f-1
}return d
};
a.prototype.patch_addContext_=function(f,e){if(0!=e.length){for(var h=e.substring(f.start2,f.start2+f.length1),g=0;
e.indexOf(h)!=e.lastIndexOf(h)&&h.length<this.Match_MaxBits-this.Patch_Margin-this.Patch_Margin;
){g+=this.Patch_Margin,h=e.substring(f.start2-g,f.start2+f.length1+g)
}g+=this.Patch_Margin;
(h=e.substring(f.start2-g,f.start2))&&f.diffs.unshift([0,h]);
(g=e.substring(f.start2+f.length1,f.start2+f.length1+g))&&f.diffs.push([0,g]);
f.start1-=h.length;
f.start2-=h.length;
f.length1+=h.length+g.length;
f.length2+=h.length+g.length
}};
a.prototype.patch_make=function(v,u,t){var s;
if("string"==typeof v&&"string"==typeof u&&"undefined"==typeof t){s=v,u=this.diff_main(s,u,!0),2<u.length&&(this.diff_cleanupSemantic(u),this.diff_cleanupEfficiency(u))
}else{if(v&&"object"==typeof v&&"undefined"==typeof u&&"undefined"==typeof t){u=v,s=this.diff_text1(u)
}else{if("string"==typeof v&&u&&"object"==typeof u&&"undefined"==typeof t){s=v
}else{if("string"==typeof v&&"string"==typeof u&&t&&"object"==typeof t){s=v,u=t
}else{throw Error("Unknown call format to patch_make.")
}}}}if(0===u.length){return[]
}for(var t=[],v=new a.patch_obj,r=0,q=0,p=0,o=s,m=0;
m<u.length;
m++){var n=u[m][0],l=u[m][1];
if(!r&&0!==n){v.start1=q,v.start2=p
}switch(n){case 1:v.diffs[r++]=u[m];
v.length2+=l.length;
s=s.substring(0,p)+l+s.substring(p);
break;
case -1:v.length1+=l.length;
v.diffs[r++]=u[m];
s=s.substring(0,p)+s.substring(p+l.length);
break;
case 0:l.length<=2*this.Patch_Margin&&r&&u.length!=m+1?(v.diffs[r++]=u[m],v.length1+=l.length,v.length2+=l.length):l.length>=2*this.Patch_Margin&&r&&(this.patch_addContext_(v,o),t.push(v),v=new a.patch_obj,r=0,o=s,q=p)
}1!==n&&(q+=l.length);
-1!==n&&(p+=l.length)
}r&&(this.patch_addContext_(v,o),t.push(v));
return t
};
a.prototype.patch_deepCopy=function(h){for(var g=[],l=0;
l<h.length;
l++){var k=h[l],j=new a.patch_obj;
j.diffs=[];
for(var i=0;
i<k.diffs.length;
i++){j.diffs[i]=k.diffs[i].slice()
}j.start1=k.start1;
j.start2=k.start2;
j.length1=k.length1;
j.length2=k.length2;
g[l]=j
}return g
};
a.prototype.patch_apply=function(x,w){if(0==x.length){return[w,[]]
}var x=this.patch_deepCopy(x),v=this.patch_addPadding(x),w=v+w+v;
this.patch_splitMax(x);
for(var u=0,t=[],s=0;
s<x.length;
s++){var r=x[s].start2+u,q=this.diff_text1(x[s].diffs),n,o=-1;
if(q.length>this.Match_MaxBits){if(n=this.match_main(w,q.substring(0,this.Match_MaxBits),r),-1!=n&&(o=this.match_main(w,q.substring(q.length-this.Match_MaxBits),r+q.length-this.Match_MaxBits),-1==o||n>=o)){n=-1
}}else{n=this.match_main(w,q,r)
}if(-1==n){t[s]=!1,u-=x[s].length2-x[s].length1
}else{if(t[s]=!0,u=n-r,r=-1==o?w.substring(n,n+q.length):w.substring(n,o+this.Match_MaxBits),q==r){w=w.substring(0,n)+this.diff_text2(x[s].diffs)+w.substring(n+q.length)
}else{if(r=this.diff_main(q,r,!1),q.length>this.Match_MaxBits&&this.diff_levenshtein(r)/q.length>this.Patch_DeleteThreshold){t[s]=!1
}else{this.diff_cleanupSemanticLossless(r);
for(var q=0,m,o=0;
o<x[s].diffs.length;
o++){var l=x[s].diffs[o];
0!==l[0]&&(m=this.diff_xIndex(r,q));
1===l[0]?w=w.substring(0,n+m)+l[1]+w.substring(n+m):-1===l[0]&&(w=w.substring(0,n+m)+w.substring(n+this.diff_xIndex(r,q+l[1].length)));
-1!==l[0]&&(q+=l[1].length)
}}}}}w=w.substring(v.length,w.length-v.length);
return[w,t]
};
a.prototype.patch_addPadding=function(h){for(var g=this.Patch_Margin,l="",k=1;
k<=g;
k++){l+=String.fromCharCode(k)
}for(k=0;
k<h.length;
k++){h[k].start1+=g,h[k].start2+=g
}var k=h[0],j=k.diffs;
if(0==j.length||0!=j[0][0]){j.unshift([0,l]),k.start1-=g,k.start2-=g,k.length1+=g,k.length2+=g
}else{if(g>j[0][1].length){var i=g-j[0][1].length;
j[0][1]=l.substring(j[0][1].length)+j[0][1];
k.start1-=i;
k.start2-=i;
k.length1+=i;
k.length2+=i
}}k=h[h.length-1];
j=k.diffs;
0==j.length||0!=j[j.length-1][0]?(j.push([0,l]),k.length1+=g,k.length2+=g):g>j[j.length-1][1].length&&(i=g-j[j.length-1][1].length,j[j.length-1][1]+=l.substring(0,i),k.length1+=i,k.length2+=i);
return l
};
a.prototype.patch_splitMax=function(t){for(var s=this.Match_MaxBits,r=0;
r<t.length;
r++){if(!(t[r].length1<=s)){var q=t[r];
t.splice(r--,1);
for(var p=q.start1,o=q.start2,n="";
0!==q.diffs.length;
){var m=new a.patch_obj,k=!0;
m.start1=p-n.length;
m.start2=o-n.length;
if(""!==n){m.length1=m.length2=n.length,m.diffs.push([0,n])
}for(;
0!==q.diffs.length&&m.length1<s-this.Patch_Margin;
){var n=q.diffs[0][0],l=q.diffs[0][1];
1===n?(m.length2+=l.length,o+=l.length,m.diffs.push(q.diffs.shift()),k=!1):-1===n&&1==m.diffs.length&&0==m.diffs[0][0]&&l.length>2*s?(m.length1+=l.length,p+=l.length,k=!1,m.diffs.push([n,l]),q.diffs.shift()):(l=l.substring(0,s-m.length1-this.Patch_Margin),m.length1+=l.length,p+=l.length,0===n?(m.length2+=l.length,o+=l.length):k=!1,m.diffs.push([n,l]),l==q.diffs[0][1]?q.diffs.shift():q.diffs[0][1]=q.diffs[0][1].substring(l.length))
}n=this.diff_text2(m.diffs);
n=n.substring(n.length-this.Patch_Margin);
l=this.diff_text1(q.diffs).substring(0,this.Patch_Margin);
""!==l&&(m.length1+=l.length,m.length2+=l.length,0!==m.diffs.length&&0===m.diffs[m.diffs.length-1][0]?m.diffs[m.diffs.length-1][1]+=l:m.diffs.push([0,l]));
k||t.splice(++r,0,m)
}}}};
a.prototype.patch_toText=function(e){for(var d=[],f=0;
f<e.length;
f++){d[f]=e[f]
}return d.join("")
};
a.prototype.patch_fromText=function(j){var i=[];
if(!j){return i
}for(var j=j.split("\n"),p=0,o=/^@@ -(\d+),?(\d*) \+(\d+),?(\d*) @@$/;
p<j.length;
){var n=j[p].match(o);
if(!n){throw Error("Invalid patch string: "+j[p])
}var m=new a.patch_obj;
i.push(m);
m.start1=parseInt(n[1],10);
""===n[2]?(m.start1--,m.length1=1):"0"==n[2]?m.length1=0:(m.start1--,m.length1=parseInt(n[2],10));
m.start2=parseInt(n[3],10);
""===n[4]?(m.start2--,m.length2=1):"0"==n[4]?m.length2=0:(m.start2--,m.length2=parseInt(n[4],10));
for(p++;
p<j.length;
){n=j[p].charAt(0);
try{var l=decodeURI(j[p].substring(1))
}catch(k){throw Error("Illegal escape in patch_fromText: "+l)
}if("-"==n){m.diffs.push([-1,l])
}else{if("+"==n){m.diffs.push([1,l])
}else{if(" "==n){m.diffs.push([0,l])
}else{if("@"==n){break
}else{if(""!==n){throw Error('Invalid patch mode "'+n+'" in: '+l)
}}}}}p++
}}return i
};
a.patch_obj=function(){this.diffs=[];
this.start2=this.start1=null;
this.length2=this.length1=0
};
a.patch_obj.prototype.toString=function(){var e,d;
e=0===this.length1?this.start1+",0":1==this.length1?this.start1+1:this.start1+1+","+this.length1;
d=0===this.length2?this.start2+",0":1==this.length2?this.start2+1:this.start2+1+","+this.length2;
e=["@@ -"+e+" +"+d+" @@\n"];
var f;
for(d=0;
d<this.diffs.length;
d++){switch(this.diffs[d][0]){case 1:f="+";
break;
case -1:f="-";
break;
case 0:f=" "
}e[d+1]=f+encodeURI(this.diffs[d][1])+"\n"
}return e.join("").replace(/%20/g," ")
};
this.diff_match_patch=a;
this.DIFF_DELETE=-1;
this.DIFF_INSERT=1;
this.DIFF_EQUAL=0
})();