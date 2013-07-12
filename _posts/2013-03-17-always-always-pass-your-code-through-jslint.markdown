---
layout: post
title: always, ALWAYS!!, pass your code through JSLint
date: March 17, 2013
category: code
customid: orlando-tBhRr5WaPaYPvuB
---

the other day i was coding with JavaScript, everything was good until i deployed my code.. we use jammit for our assets compression, after the compile the files came up empty (0 bytes), that's a sign that some is wrong (obviously right?)

well the problem is that when YUI compressor finds an error, then it just stop the whole package compression and says nothing about it (no error message, no file where to check, no nothing..), so i started looking for posible missing `;` or stuff like that.

i found maybe 10 of those missing `;`. i fixed them and try to recompile... still not working..

then some of my friends asked me why i didn't use [JSLint](jslint.com) before all this problem, i realize that they were true, it was a little irresponsible on my part to no validate the coding style using a lint..

since my editor is `vim` then i start looking for a jslint pugling for it (i dont want to be pasting code all the time to JSLint.com), the one i use is [jslint.vim](https://github.com/hallettj/jslint.vim) the installation was a breeze, just clone the repo and do a `rake install` (off course if you are in OS X, if not then check the repo and follow the instructions there).

you can set the options for JSLint in `~/.jslintrc`, the config file looks something like this

	/*jslint browser: true, regexp: true */
	/*global jQuery, $ */

	/* vim: set ft=javascript: */

there you set all your global variables, libraries etc. also you can set all the options that JSLint has in this file, check [http://www.jslint.com/lint.html](http://www.jslint.com/lint.html) for the list of options.

well after pasing my files through JSLint i found a one error that i totally overlooked.

__You shall not use reserved words for object properties (here is a [list](https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Reserved_Words) of JavaScript reserved words).__

actually you can use those, but is not a good practice, also YUI Compressor fails if you use reserved words in your code.. things like `foo.class`, `foo.delete` `var float = 2.2` will fail to compile.

so i learned a lesson that day, "always, ALWAYS!!, pass your code through JSLint"
