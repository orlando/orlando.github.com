---
layout: post
title: Some useful tricks
date: December 31, 2011
category: code
customid: orlando-yJAt8snjeQCy9YH
---

Today i was looking for a easy way to push to multiple git repos.. a quick look at [stackoverflow](http://stackoverflow.com/a/3195446/536984) answered my question.

once you create your `local` git repo, add some remotes.

{% highlight bash %} 
git remote add hashlabs git@git.hashlabs.com:orlandodelaguila.github.com.git
git remote add origin git@github.com:orlandodelaguila/orlandodelaguila.github.com.git
{% endhighlight %}

then open your .git/config file and look at it.. should look like this one.

```bash
[core]
	repositoryformatversion = 0
	filemode = true
	bare = false
	logallrefupdates = true
[remote "origin"]
	url = git@github.com:orlandodelaguila/orlandodelaguila.github.com.git
	fetch = +refs/heads/*:refs/remotes/origin/*
[remote "hashlabs"]
	url = git@git.hashlabs.com:orlandodelaguila.github.com.git
  fetch = +refs/heads/*:refs/remotes/hashlabs/*
```

fire up vim and add another remote that includes multiple urls.. like this

{% highlight bash %}
[remote "all"]
	url = git@git.hashlabs.com:orlandodelaguila.github.com.git
	url = git@github.com:orlandodelaguila/orlandodelaguila.github.com.git
{% endhighlight %}

when you do **git push all master** it would push to the both url in the same order that you write them, one repo at a time. this tricky comes really handy because im lazy and i dont want to type **git push** multiple times.

another timesaver trick is using **echo** for creating .rvmrc and README files.. 

{% highlight bash %}
#for .rvmrc files
#if you use --create use will create the gemset if it's not present

echo "rvm --create use 1.9.3@orlandodelaguila" >> .rvmrc

#for README.md
#adding -e enables the interpretation of backslash
#so you could write an entire readme in 1 line =P.

echo -e "#README\n Some text here about your readme " >> README.md
{% endhighlight %}

both of these commands will create a new file with the text that you pass with **echo**.
