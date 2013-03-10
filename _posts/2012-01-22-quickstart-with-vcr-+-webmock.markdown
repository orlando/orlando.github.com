---
layout: post
title: Quickstart with VCR + WebMock + Rspec
date: January 22, 2012
category: code
---

Right now im working in a gem called Rubytrick, its a wrapper for the[Hattrick's](http://www.hattrick.org) CHPP API. Hattrick is a Web soccer simulation game. its pretty fun actually, and can became quickly part of your daily internet life (like Facebook or Twitter).

since this an API wrapper, its expected to have a lot of HTTP requests, first i was stubbing all this requests by hand using [WebMock](https://github.com/bblimke/webmock), but it was a PITA to write XML data manually just to get my tests pass.. so i start looking for a library that could solve that problem.. and it was [VCR](https://github.com/myronmarston/vcr).

With VCR you make real HTTP requests the first time, then theses requests are saved in a fixture folder, and when a test request the same URL, VCR pass the saved fixture instead of hitting the web once again, its a like magic really, saves a lot of work.

Well, im using RSpec (unless you are [DHH](http://www.rubyinside.com/dhh-offended-by-rspec-debate-4610.html) you should be using it too), so this post will show code that works if you have RSpec too.

now.. first you install you need to istall [RSpec](https://github.com/rspec/rspec) or [RSpec-rails](https://github.com/rspec/rspec-rails) if you are using Rails.

RSpec 2.8 has a command for starting with the default spec skeleton, its really helpful in case youre writing a gem, just install RSpec and then write

{% highlight bash %} 
rspec --init
#or
rspec --init --autotest #if your using autotest
{% endhighlight %}

these two commands generate some files to start with RSpec. for now you are done with RSpec, now lets install [WebMock](https://github.com/bblimke/webmock).

the install its easy too just write **gem install webmock** or write it in your Gemfile and then **bundle install**. 

once you have WebMock installed, go to your spec directory and open your spec\_helper.rb file.

add **require 'webmock/rspec'** on top of the file, and thats all for now. by default, WebMock doesnt allow real http connections, so all external requests have to be stubbed, this is easy since when your code makes a request, WebMock gives you a **WebMock::NetConnectNotAllowedError** with information on how you can stub that request, but since we will be using VCR we dont need to stub anything by ourselfs.

now we need to install [VCR](https://github.com/myronmarston/vcr). just like WebMock, make a **gem install vcr** of put it in your Gemfile then **bundle install**

now that you have VCR installed, we need to configure it. go to your spec\_helper.rb file and add this block

{% highlight ruby %}
require 'vcr'

VCR.config do |c|
  c.cassette_library_dir = 'spec/fixtures/vcr_cassettes' # where VCR should place the stub files.
  c.stub_with :webmock #this tells WebMock to use VCR.
end
{% endhighlight %}

you have to add **config.extend VCR::RSpec::Macros** to your RSpec config block to enable VCR's helpers for RSpec. like this.

{% highlight ruby %}
RSpec.configure do |config|
  ... #other lines
  config.extend VCR::RSpec::Macros
end
{% endhighlight %}

that line enables **use_vcr_cassette** method for RSpec, you can get more info about this method in the VCR's [documentation](https://www.relishapp.com/myronmarston/vcr/v/1-3-2/docs/test-frameworks/usage-with-rspec).

and now we are ready to start recording requests. im going to paste a spec to explain the work flow.

{% highlight ruby %}
require 'spec_helper'

describe Rubytrick::HT, 'Fans' do
  use_vcr_cassette :record => :new_episodes

  before(:all) do
    Rubytrick.oauth_keys = {:consumer_key => 'key', :consumer_secret => 'secret'}
  end 
  
  before(:each) do
    @session = Rubytrick::Session.new('token','secret')
  end

  it 'should have a pull data method' do
    @session.fans.respond_to?(:pull_data).should be_true
  end

  it 'should retrieve data from hattrick already parsed' do
    @session.fans.data.should_not == nil
    @session.fans.data.class.should == Hash
    @session.fans.data[:file_name].should == 'fans.xml'
  end

end

{% endhighlight %}

the important part of this file is the command **use_vcr_cassette**, the **:record => :new_episodes** tells VCR to record new requests, and replay the requests that are already saved. you can ignore the other lines of the spec since these are project specific.

**use_vcr_cassette** also accepts a name, like **use_vcr_cassette 'fixture_name_here'**, if we dont supply a name, then VCR will create one using the describe header of the spec. in this case, the file that VCR creates its called **Rubytrick_HT_Fans.yml** and that file contains the entire HTTP response, including header and everything, pretty cool.

the first time you run your tests, it will take a few seconds to capture the request and save it into the fixture file, but after that, they run really fast.

and thats all for now, VCR + WebMock makes an awesome couple if you want to test with real data. 
