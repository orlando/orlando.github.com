---
layout: post
title: Svbtle Jekyll Theme
date: March 10, 2013
category: code
customid: orlando-QZQ93bMzGrJFHfW
---

The other day browsing around my rss feed, i saw that [Steve Klabnik](http://twitter.com/steveklabnik) is using [Svbtle](https://twitter.com/svbtle), i tried to register but is an invitation only magazine, so i didn't even bother to request an invitation.

i really like the design, so i cloned it for my Jekyll based page, you can take a look at [repo](http://github.com/orlando/orlando.github.com). All configurations are located at the `base.html` file header, you can set all your parameters there.

The "Kudos" button uses `localStorage` to track if the user already "kudoed" a post or not, also you can pass an url parameter so after the user "Kudos" a post, it will send an ajax `POST` request with the post id. Those id are grabbed from the post `customid` parameter, i need to look for a better way to handle this.

there's still a lot missing (like grab the kudo number from an external app) but i will clean the code and add the missing functionality later this week. (off course pull requests are so much welcome <3)