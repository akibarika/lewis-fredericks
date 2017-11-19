# README

Lewis Fredericks

### Setting Up a Local Environment

#### Download Shoptify Theme Kit  

[Theme Kit](#) is a cross-platform tool for building Shopify Themes created by Shopify employees. Theme Kit is a single binary that has no dependencies. Once you download Theme Kit, and with a tiny bit of setup, you’re off to the theme-creation races. Some of Theme Kit’s notable features include:

- Upload themes to multiple environments
- Fast uploads and downloads
- The ability to watch for local changes and upload automatically to Shopify
- Works on Windows, Linux, and OS X

Run

	curl -s https://raw.githubusercontent.com/Shopify/themekit/master/scripts/install | sudo python

Or brew install

	brew tap shopify/shopify
	brew install themekit

#### Set up API access  

To develop themes with Theme Kit, you will need to authorize Theme Kit to access your store. Head to https://[your-store-name].myshopify.com/admin/apps/private 

Click on the Create private apps button.  Fill out the information at the top and set the permissions of Theme templates and theme assets to read and write access. Press Save and you will be presented with the next screen. In it you will see your access credentials. Please make note of the password. You will need it later.

#### Configure an existing theme.  

If you already have a theme on Shopify and want to start using it you will need to view it in your browser and grab the theme ID from the URL. It should be: **12345678**

Then once you have noted your theme ID, run the following commands:

	# create configuration
	 theme configure --password [your-password] --store lewis-fredericks-wholesale.myshopify.com --themeid 12345678
	# download and setup project in the current directory
	 theme download
	

### Development 

Assuming libraries are properly installed, here's a list of terminal commands to get going:

	bundle install
	npm install
	grunt watch

