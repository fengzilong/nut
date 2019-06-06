(window.webpackJsonp=window.webpackJsonp||[]).push([[3],{111:function(n,t,a){"use strict";a.r(t);var s=a(97);t.default=Object(s.a)('<p>nut \u7684\u914d\u7f6e\u6587\u4ef6\u4f4d\u4e8e <code>nut.config.js</code>\uff0c\u4f60\u53ef\u4ee5\u5728\u8fd9\u91cc\u81ea\u5b9a\u4e49 nut \u914d\u7f6e</p>\n<h2 id="\u914d\u7f6e">\u914d\u7f6e</h2>\n<table>\n<thead>\n<tr>\n<th>\u5b57\u6bb5</th>\n<th align="right">\u8bf4\u660e</th>\n<th align="center">\u9ed8\u8ba4\u503c</th>\n</tr>\n</thead>\n<tbody><tr>\n<td>host</td>\n<td align="right">\u76d1\u542c\u7684host</td>\n<td align="center">127.0.0.1</td>\n</tr>\n<tr>\n<td>port</td>\n<td align="right">\u76d1\u542c\u7684\u7aef\u53e3</td>\n<td align="center">9000</td>\n</tr>\n<tr>\n<td>zh</td>\n<td align="right">\u5e94\u7528\u4e2d\u6587\u540d</td>\n<td align="center">-</td>\n</tr>\n<tr>\n<td>en</td>\n<td align="right">\u5e94\u7528\u82f1\u6587\u540d</td>\n<td align="center">-</td>\n</tr>\n<tr>\n<td>logo</td>\n<td align="right">\u5e94\u7528 logo</td>\n<td align="center">-</td>\n</tr>\n<tr>\n<td>html.title</td>\n<td align="right">\u6587\u6863\u6807\u9898</td>\n<td align="center"><code>zh</code></td>\n</tr>\n<tr>\n<td>html.favicon</td>\n<td align="right">favicon</td>\n<td align="center">nut logo</td>\n</tr>\n<tr>\n<td>markdown.theme</td>\n<td align="right">markdown \u4ee3\u7801\u9ad8\u4eae\u4e3b\u9898</td>\n<td align="center">prism-tomorrow</td>\n</tr>\n<tr>\n<td>layout</td>\n<td align="right">\u5e03\u5c40\uff0c\u53ef\u9009\u503c\uff1adefault / saber / now / none</td>\n<td align="center">default</td>\n</tr>\n<tr>\n<td>theme</td>\n<td align="right">\u914d\u8272\u65b9\u6848\uff0c\u53ef\u9009\u503c\uff1aocean / sakura</td>\n<td align="center">ocean</td>\n</tr>\n<tr>\n<td>plugins</td>\n<td align="right">\u63d2\u4ef6</td>\n<td align="center">[]</td>\n</tr>\n<tr>\n<td>sidebar</td>\n<td align="right">\u83dc\u5355\u7ba1\u7406</td>\n<td align="center">[]</td>\n</tr>\n<tr>\n<td>devServer</td>\n<td align="right">webpack dev server \u914d\u7f6e</td>\n<td align="center">-</td>\n</tr>\n<tr>\n<td>configureWebpack</td>\n<td align="right">\u914d\u7f6e webpack\uff0c\u5185\u90e8\u4f7f\u7528 <a href="https://github.com/survivejs/webpack-merge">webpack-merge</a> \u5408\u5e76</td>\n<td align="center">-</td>\n</tr>\n<tr>\n<td>chainWebpack</td>\n<td align="right">\u7cbe\u7ec6\u914d\u7f6e webpack\uff0c\u8bed\u6cd5\u53c2\u8003 <a href="https://github.com/neutrinojs/webpack-chain">webpack-chain</a></td>\n<td align="center">-</td>\n</tr>\n<tr>\n<td>babel.transpileModules</td>\n<td align="right">node_modules \u4e2d\u9700\u8981\u88ab babel \u7f16\u8bd1\u7684\u6a21\u5757</td>\n<td align="center">[]</td>\n</tr>\n<tr>\n<td>router.mode</td>\n<td align="right">\u8def\u7531\u6a21\u5f0f\uff0c\u53ef\u9009\u503c\uff1ahash / history</td>\n<td align="center">hash</td>\n</tr>\n<tr>\n<td>router.alias</td>\n<td align="right">\u683c\u5f0f\uff1a{ &#39;pages/foo/bar&#39;: &#39;new-alias&#39; }</td>\n<td align="center">-</td>\n</tr>\n<tr>\n<td>router.cacheable</td>\n<td align="right">\u63a7\u5236\u9875\u9762\u5b9e\u4f8b\u662f\u5426\u7f13\u5b58</td>\n<td align="center">\u683c\u5f0f\uff1a{ &#39;pages/foo/bar&#39;: false }</td>\n</tr>\n<tr>\n<td>homepage</td>\n<td align="right">\u6307\u5b9a\u9996\u9875\uff0c\u6bd4\u5982&#39;pages/foo/bar&#39;\uff0c\u7b49\u4ef7\u4e8ectx.api.homepage.set(  )</td>\n<td align="center">-</td>\n</tr>\n</tbody></table>\n<h2 id="\u793a\u4f8b">\u793a\u4f8b</h2>\n<pre class="language-js" data-lang="js"><code class="language-js">module<span class="token punctuation">.</span>exports <span class="token operator">=</span> <span class="token punctuation">{</span>\n  zh<span class="token punctuation">:</span> <span class="token string">\'NUT \u9879\u76ee\'</span><span class="token punctuation">,</span>\n  en<span class="token punctuation">:</span> <span class="token string">\'NUT PROJECT\'</span><span class="token punctuation">,</span>\n  html<span class="token punctuation">:</span> <span class="token punctuation">{</span>\n    title<span class="token punctuation">:</span> <span class="token string">\'NUT \u6587\u6863\'</span><span class="token punctuation">,</span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n  logo<span class="token punctuation">:</span> <span class="token string">\'./logo.png\'</span><span class="token punctuation">,</span>\n  theme<span class="token punctuation">:</span> <span class="token string">\'ocean\'</span><span class="token punctuation">,</span>\n  layout<span class="token punctuation">:</span> <span class="token string">\'now\'</span><span class="token punctuation">,</span>\n  plugins<span class="token punctuation">:</span> <span class="token punctuation">{</span>\n    foo<span class="token punctuation">:</span> <span class="token punctuation">{</span>\n      path<span class="token punctuation">:</span> require<span class="token punctuation">.</span><span class="token function">resolve</span><span class="token punctuation">(</span> <span class="token string">\'path/to/plugin\'</span> <span class="token punctuation">)</span><span class="token punctuation">,</span>\n      enable<span class="token punctuation">:</span> <span class="token boolean">false</span><span class="token punctuation">,</span>\n      env<span class="token punctuation">:</span> <span class="token punctuation">[</span> <span class="token string">\'development\'</span> <span class="token punctuation">]</span><span class="token punctuation">,</span>\n    <span class="token punctuation">}</span><span class="token punctuation">,</span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n  markdown<span class="token punctuation">:</span> <span class="token punctuation">{</span>\n    theme<span class="token punctuation">:</span> <span class="token string">\'prism-tomorrow\'</span><span class="token punctuation">,</span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n  sidebar<span class="token punctuation">:</span> <span class="token punctuation">[</span>\n    <span class="token punctuation">{</span>\n      icon<span class="token punctuation">:</span> <span class="token string">\'\'</span><span class="token punctuation">,</span>\n      title<span class="token punctuation">:</span> <span class="token string">\'\u6307\u5357\'</span><span class="token punctuation">,</span>\n      children<span class="token punctuation">:</span> <span class="token punctuation">[</span>\n        <span class="token string">\'pages/guide/introduction\'</span><span class="token punctuation">,</span>\n        <span class="token string">\'pages/guide/installation\'</span><span class="token punctuation">,</span>\n      <span class="token punctuation">]</span>\n    <span class="token punctuation">}</span><span class="token punctuation">,</span>\n\n    <span class="token punctuation">{</span>\n      icon<span class="token punctuation">:</span> <span class="token string">\'\'</span><span class="token punctuation">,</span>\n      title<span class="token punctuation">:</span> <span class="token string">\'GitHub\'</span><span class="token punctuation">,</span>\n      link<span class="token punctuation">:</span> <span class="token string">\'https://github.com/fengzilong/nut\'</span>\n    <span class="token punctuation">}</span><span class="token punctuation">,</span>\n  <span class="token punctuation">]</span><span class="token punctuation">,</span>\n  configureWebpack<span class="token punctuation">:</span> <span class="token punctuation">{</span>\n    resolve<span class="token punctuation">:</span> <span class="token punctuation">{</span>\n      alias<span class="token punctuation">:</span> <span class="token punctuation">{</span>\n        key<span class="token punctuation">:</span> <span class="token string">\'value\'</span>\n      <span class="token punctuation">}</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n  <span class="token function">chainWebpack</span><span class="token punctuation">(</span> <span class="token parameter">config</span> <span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token comment">// https://github.com/neutrinojs/webpack-chain</span>\n    config<span class="token punctuation">.</span>resolve<span class="token punctuation">.</span>alias<span class="token punctuation">.</span><span class="token function">set</span><span class="token punctuation">(</span> <span class="token string">\'key\'</span><span class="token punctuation">,</span> <span class="token string">\'value\'</span> <span class="token punctuation">)</span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n  babel<span class="token punctuation">:</span> <span class="token punctuation">{</span>\n    transpileModules<span class="token punctuation">:</span> <span class="token punctuation">[</span> <span class="token string">\'vue-echarts\'</span><span class="token punctuation">,</span> <span class="token string">\'resize-detector\'</span> <span class="token punctuation">]</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span></code></pre>\n')},97:function(n,t,a){"use strict";t.a=function(n){return{$$nut:function(t){return{mount:function(t){t.innerHTML=n},unmount:function(n){n.innerHTML=""}}}}}}}]);