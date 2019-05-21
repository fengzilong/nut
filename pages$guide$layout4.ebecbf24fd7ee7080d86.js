(window.webpackJsonp=window.webpackJsonp||[]).push([[11],{93:function(n,o,i){"use strict";o.a=function(n){return{$$nut:function(o){return{mount:function(o){o.innerHTML=n},unmount:function(n){n.innerHTML=""}}}}}},98:function(n,o,i){"use strict";i.r(o);var t=i(93);o.default=Object(t.a)('<h2 id="内置布局">内置布局</h2>\n<p>nut 内置了以下几套布局</p>\n<ul>\n<li>default</li>\n<li>saber</li>\n<li>now</li>\n<li>none</li>\n</ul>\n<h2 id="页面布局">页面布局</h2>\n<p>如何定制某个页面的布局呢？</p>\n<p>很简单，在页面文件中</p>\n<pre class="language-unknown"><code>---\ntitle: 页面名称\nlayout: now\n---</code></pre><p>这样该页面就会使用 <code>now</code> 布局了</p>\n<p>每个页面的布局都可以不同，当然大部分情况下你不想这么花里胡哨</p>\n<p class="tip">\n  比较常用的是 none 这个特殊布局，none 布局几乎没有任何内容，相当于一个“空的画板”，你可以在这个基础上定制你的页面内容\n</p>\n\n<h2 id="全局布局">全局布局</h2>\n<p>你可以在 <code>nut.config.js</code> 中声明全局布局，如果页面未声明自己的 layout，就会降级到 该全局主题</p>\n<p class="tip">\n  后面会允许用户配置自己的布局，敬请期待 💙\n</p>\n')}}]);