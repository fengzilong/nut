(window.webpackJsonp=window.webpackJsonp||[]).push([[3],{102:function(n,t,a){"use strict";t.a=function(n){return{$$nut:function(t){return{mount:function(t){t.innerHTML=n},unmount:function(n){n.innerHTML=""}}}}}},114:function(n,t,a){"use strict";a.r(t);var s=a(102);t.default=Object(s.a)('<p>nut 的配置文件位于 <code>nut.config.js</code>，你可以在这里自定义 nut 配置</p>\n<h2 id="配置">配置</h2>\n<table>\n<thead>\n<tr>\n<th>字段</th>\n<th align="right">说明</th>\n<th align="center">默认值</th>\n</tr>\n</thead>\n<tbody><tr>\n<td>host</td>\n<td align="right">监听的host</td>\n<td align="center">127.0.0.1</td>\n</tr>\n<tr>\n<td>port</td>\n<td align="right">监听的端口</td>\n<td align="center">9000</td>\n</tr>\n<tr>\n<td>zh</td>\n<td align="right">应用中文名</td>\n<td align="center">-</td>\n</tr>\n<tr>\n<td>en</td>\n<td align="right">应用英文名</td>\n<td align="center">-</td>\n</tr>\n<tr>\n<td>logo</td>\n<td align="right">应用 logo</td>\n<td align="center">-</td>\n</tr>\n<tr>\n<td>html.title</td>\n<td align="right">文档标题</td>\n<td align="center"><code>zh</code></td>\n</tr>\n<tr>\n<td>html.favicon</td>\n<td align="right">favicon</td>\n<td align="center">nut logo</td>\n</tr>\n<tr>\n<td>markdown.theme</td>\n<td align="right">markdown 代码高亮主题</td>\n<td align="center">prism-tomorrow</td>\n</tr>\n<tr>\n<td>layout</td>\n<td align="right">布局，可选值：default / saber / now / none</td>\n<td align="center">default</td>\n</tr>\n<tr>\n<td>theme</td>\n<td align="right">配色方案，可选值：ocean / sakura</td>\n<td align="center">ocean</td>\n</tr>\n<tr>\n<td>plugins</td>\n<td align="right">插件</td>\n<td align="center">[]</td>\n</tr>\n<tr>\n<td>sidebar</td>\n<td align="right">菜单管理</td>\n<td align="center">[]</td>\n</tr>\n<tr>\n<td>devServer</td>\n<td align="right">webpack dev server 配置</td>\n<td align="center">-</td>\n</tr>\n</tbody></table>\n<h2 id="示例">示例</h2>\n<pre class="language-js" data-lang="js"><code class="language-js">module<span class="token punctuation">.</span>exports <span class="token operator">=</span> <span class="token punctuation">{</span>\n  zh<span class="token punctuation">:</span> <span class="token string">\'NUT 项目\'</span><span class="token punctuation">,</span>\n  en<span class="token punctuation">:</span> <span class="token string">\'NUT PROJECT\'</span><span class="token punctuation">,</span>\n  html<span class="token punctuation">:</span> <span class="token punctuation">{</span>\n    title<span class="token punctuation">:</span> <span class="token string">\'NUT 文档\'</span><span class="token punctuation">,</span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n  logo<span class="token punctuation">:</span> <span class="token string">\'./logo.png\'</span><span class="token punctuation">,</span>\n  theme<span class="token punctuation">:</span> <span class="token string">\'ocean\'</span><span class="token punctuation">,</span>\n  layout<span class="token punctuation">:</span> <span class="token string">\'now\'</span><span class="token punctuation">,</span>\n  plugins<span class="token punctuation">:</span> <span class="token punctuation">{</span>\n    foo<span class="token punctuation">:</span> <span class="token punctuation">{</span>\n      path<span class="token punctuation">:</span> require<span class="token punctuation">.</span><span class="token function">resolve</span><span class="token punctuation">(</span> <span class="token string">\'path/to/plugin\'</span> <span class="token punctuation">)</span><span class="token punctuation">,</span>\n      enable<span class="token punctuation">:</span> <span class="token boolean">false</span><span class="token punctuation">,</span>\n      env<span class="token punctuation">:</span> <span class="token punctuation">[</span> <span class="token string">\'development\'</span> <span class="token punctuation">]</span><span class="token punctuation">,</span>\n    <span class="token punctuation">}</span><span class="token punctuation">,</span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n  markdown<span class="token punctuation">:</span> <span class="token punctuation">{</span>\n    theme<span class="token punctuation">:</span> <span class="token string">\'prism-tomorrow\'</span><span class="token punctuation">,</span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n  sidebar<span class="token punctuation">:</span> <span class="token punctuation">[</span>\n    <span class="token punctuation">{</span>\n      icon<span class="token punctuation">:</span> <span class="token string">\'\'</span><span class="token punctuation">,</span>\n      title<span class="token punctuation">:</span> <span class="token string">\'指南\'</span><span class="token punctuation">,</span>\n      children<span class="token punctuation">:</span> <span class="token punctuation">[</span>\n        <span class="token string">\'pages/guide/introduction\'</span><span class="token punctuation">,</span>\n        <span class="token string">\'pages/guide/installation\'</span><span class="token punctuation">,</span>\n      <span class="token punctuation">]</span>\n    <span class="token punctuation">}</span><span class="token punctuation">,</span>\n\n    <span class="token punctuation">{</span>\n      icon<span class="token punctuation">:</span> <span class="token string">\'\'</span><span class="token punctuation">,</span>\n      title<span class="token punctuation">:</span> <span class="token string">\'GitHub\'</span><span class="token punctuation">,</span>\n      link<span class="token punctuation">:</span> <span class="token string">\'https://github.com/fengzilong/nut\'</span>\n    <span class="token punctuation">}</span><span class="token punctuation">,</span>\n  <span class="token punctuation">]</span><span class="token punctuation">,</span>\n<span class="token punctuation">}</span></code></pre>\n')}}]);