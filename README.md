xBalance - get your accounts balance from multiple cryptocurency exchanges
====================

**xBalance** is a node.js app for getting your accounts balance from multiple cryptocurency exchanges.

The application code is shared on github at https://github.com/dutu/xBalance/

### Contents
* [How it works](#how-it-works)
	* Why using statistical calculation is more efficient
* [Setting up the application](#setting-up-the-application)
    * Running locally
    * Running on Heroku
* [Updating the application](#updating-the-application)
    * Running locally
    * Running on Heroku
* [FAQ](#faq)
* [License](#license) 


# How it works

xBalance is:

- an **open source** application
- runs on [node.js](http://nodejs.org/)
- can either run locally on your computer or can be hosted on a cloud platform (e.g. [Heroku](http://www.heroku.com "Heroku")).

The application gets the balance of your accounts from multiple cryptocurency exchanges. 

### Example screenshot:

![](http://i.imgur.com/HiX3yz4.jpg)


# Supported exchanges

|Exchange name or wallet | slug <sup>[1]</sup> | Authentication               |
| ---	                 |    ---             |    ---                       |
| Bitfinex               | `"bitfinex"`       | `key`, `secret`              |
| Bitstamp               | `"bitstamp"`       | `key`, `secret`, `username`  |
| BitX                   | `"bitx"`           | `key`, `secret`              |
| Gdax                   | `"gdax"`           | `key`, `secret`, `passphrase`|
| Poloniex               | `"poloniex"`       | `key`, `secret`              |
| BTC wallet             | `"BTC wallet"`     | -                            |

><sup>[1]</sup> values to be used for `exchange` in the `account.js` file (see step 5 below)


# Setting up the application

## Running locally

1. [Download and install node.js](http://nodejs.org/)

2. [Download and install the latest version of Git](http://git-scm.com/downloads "Download and install the latest version of Git")

3. Clone `xBalance` application source code from github:

    ```
    $ git clone https://github.com/dutu/xBalance.git
    $ cd xBalance
    ```
4. Install the dependencies, preparing your system for running the app locally:

    ```
    npm install
    ```

5. Setup accounts name and API keyes for your accounts :
    Rename the file `accounts-template.js` to `accounts.js`, then update the file with your own values
    
6. Start the app locally:

    ```
    npm start
    ```

7. Get your balances by opening http://localhost:4000/ with your internet browser

8. Get your balances raw data by opening http://localhost:4000/api/getBalances with your internet browser

    
## Running on Heroku


1. [Create a Heroku account]([https://signup.heroku.com/dc] "Create a Heroku account") if you don't have one already](http://www.heroku.com)

2. [Download and install the Heroku Toolbelt](https://toolbelt.heroku.com/ "Download and install the Heroku Toolbelt")
Once installed, you'll have access to the heroku command from your command shell.

3. Log into Heroku:

    ```
    $ heroku login
    ```
 
4. Clone `xBalance` application source code from github:

    ```
    $ git clone https://github.com/dutu/xBalance.git
    $ cd xBalance
    ```

5. Setup accounts name and API keyes for your accounts :
    Rename the file `accounts-template.js` to `accounts.js`, then update the file with your own values

6. Create an app on Heroku and deploy the code
    
    ```
    $ heroku create
    $ git push heroku master
    $ heroku ps:scale web=0 xBalance=0
    ```
    
7. Provision the [papertrail](https://devcenter.heroku.com/articles/papertrail) logging add-on
    ```
    $ heroku addons:create papertrail
    ```
    
    Note: To help with abuse prevention, Heroku requires account verification for provisioning an add-on . If your account has not been verified, you will be directed to visit the verification site.


7. Open the papertrail console to see the log messages. 
    ```
    $ heroku addons:open papertrail
    ```
> Note: Keep the papertrail console open to monitor progress
    
8. Start the application
    ```
    heroku ps:scale xBalance=1
    ```

10. [Upgrade your application to Hobby](https://dashboard.heroku.com/) (optional)
> **Note**: By default the Heroku applications run on Free dyno. See: https://www.heroku.com/pricing 


# Updating the application

Updating the application when xBalance code is updated on github

## Running locally

1. Stop the xBalance application with `CTRL+C` 

3. Update the local clone from github
    ```
    $ cd xBalance
    $ git pull origin master
    ```

4. Update dependencies:

    ```
    npm update
    ```

5. Start the app locally:

    ```
    npm start
    ```

> **Note**: If you are requested to update node.js version, please do so by downloading and installing the applicable version. Go to [https://nodejs.org](https://nodejs.org/).


## Running on Heroku

1. Update the local clone from github
    ```
    $ cd xBalance
    $ git pull origin master
    ```

2. Open the papertrail console to see the log messages 
    ```
    $ heroku addons:open papertrail
    ```

3. Deploy updated code to heroku 
    ```
    $ git push heroku master
    ```
The application will restart automatically with the newly deployed code 

     
# FAQ

**Q1: Can you add support for new exchnges**

**A1:** Yes, please contact me by e-mail or [raise an issue on github](https://github.com/dutu/xBalance/issues).


# License #

[MIT](LICENSE)