---
layout: post
title: Simple oauth testing with Rspec and Capybara
fecha: 18/12/2011
---

#{{ page.title }}
#####{{ page.fecha }}

Today i was looking into Capybara DSL as a replacement to Cucumber, dont get me wrong, i love Cucumber but i want to try something new..

Using [OmniAuth](https://github.com/intridea/omniauth) + [OmniAuth-Twitter](https://github.com/arunagw/omniauth-twitter) makes oauth with twitter painless. The setup its pretty straight forward, just put this 2 in your Gemfile, bundle install and follow the instructions in the OmniAuth github page, you could check the [RailsApps tutorial](https://github.com/railsapps/rails3-mongoid-omniauth/wiki/Tutorial) if you have any doubt.

[Rspec](https://github.com/rspec/rspec-rails) and [Capybara](https://github.com/jnicklas/capybara) install its a breeze too, just follow the steps in the github page and you will get it running in just a few minutes.

now that you have Rspec and Capybara installed, were ready to start with the code. 
  at this point you should have in your config/routes.rb something like this.
{% highlight ruby %} 
match '/auth/:provider/callback', to: 'sessions#create' 
{% endhighlight %}
That line will tell OmniAuth what controller should receive the data from twitter (in short.. the callback).
With that line in place, we could use the helpers that OmniAuth has for testing.. go to your spec/spec\_helper.rb file and add this.
{% highlight ruby %}  
...
RSpec.configure do |config|
...
  OmniAuth.config.test_mode = true
  OmniAuth.config.mock_auth[:twitter] = {
  'provider' => 'twitter',
  'uid' => '123545',
}
{% endhighlight %}
that tells RSpec that when a test hits 'auth/twitter' OmniAuth will respond with a mockup, this comes really handy because you dont have to use something like FakeWeb to fake the http responses and its a lot easier using the Oauth Build in method.

Since i have some validations in my User model, i have to pass more data in the mock.. do my mock looks something like this
{% highlight ruby %}
...
RSpec.configure do |config|
...
  OmniAuth.config.test_mode = true
  OmniAuth.config.mock_auth[:twitter] = {
  'provider' => 'twitter',
  'uid' => '123545',
  'info' => {'name' => 'Orlando', 'nickname' => 'djlandox'}
}
{% endhighlight %}
my SessionsController and my User model looks something like this
{% highlight ruby %}
class SessionsController < ApplicationController

  def new
    redirect_to '/auth/twitter'
  end

  def create
    auth = request.env["omniauth.auth"]
    user = User.get_user(auth)
    session[:user_id] = user.id
    redirect_to root_url, :notice => "Bienvenido! #{user.name.titleize}"
  end

  def failure
    redirect_to root_url, :alert => 'Error en el Login'
  end

  def destroy
    reset_session
    redirect_to root_url, :notice => 'Vuelve Pronto!'
  end
end
  
class User
  include Mongoid::Document
  field :provider, :type => String
  field :uid, :type => String
  field :name, :type => String
  field :email, :type => String
  field :screen_name, :type => String
  field :image_url, :type => String
  field :user_role, :type => String

  validates_presence_of :name, :uid, :provider

  def self.create_with_omniauth(auth)
    create! do |user|
      user.provider = auth['provider']
      user.uid = auth['uid']
      if auth['info']
        user.name = auth['info']['name'] || ""
        user.email = auth['info']['email'] || ""
        user.screen_name = auth['info']['nickname'] || ""
        user.image_url = auth['info']['image'] || ""
      end
    end
  end
end
{% endhighlight %}
now we are ready to start testing with Capybara DSL. create a folder called acceptance in your spec directory and a file called something like oauth\_spec.rb
{% highlight ruby %}
require 'rspec'
require 'capybara/rspec'

feature "OmniAuth" do

  scenario "should login successfully" do
    visit '/auth/twitter']
    page.should have_content("Bienvenido! Orlando") 
  end

  scenario "should logout successfully" do
    visit '/auth/twitter'
    page.should have_content("Bienvenido! Orlando") 
    click_on 'Log out'
    page.should have_content("Vuelve Pronto!") 
  end
end
{% endhighlight %}

and the tests should pass, when you call visit '/auth/twitter', OmniAuth will respond with a post to the SessionsController#create method, and that methods redirect to root\_url' with a flash message..

and thats how you easily tests OmniAuth with Capybara and RSpec. :)
