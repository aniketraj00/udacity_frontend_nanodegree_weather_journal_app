
# Weather Journal App (powered by Openweather)

This is a simple weather journal application which uses openweather api to record  
the weather details based on the country and zip code. This application creates a  
local server using express (node.js) and stores all the weather details on the  
server.

# Screenshot

![Home](https://raw.githubusercontent.com/aniketraj00/udacity_frontend_nanodegree_weather_journal_app/69825484ca6219b0cefab1ca490d4709f613856a/public/screenshots/screenshot-1.jpg)

# Table of Contents

- [Project Title](#weather-journal-app-powered-by-openweather)
- [Screenshots](#screenshot)
- [Table of Contents](#table-of-contents)
- [Installation](#installation)
- [Usage](#usage)
- [Development](#development)


# Installation
[(Back to top)](#table-of-contents)

The application uses node.js(express). First download and install node.js using the  
link given below  
[Download Node.js](https://nodejs.org/en/download)

After downloading and installing node.js, make a copy of this project on your local    
machine, you can either download this repository or use the git bash to make a pull    
request. To use git bash make sure git is installed on your machine. Use the following    
link to download the git.    
[Download Git](https://git-scm.com/downloads)

After downloading and installing the git, open git bash and type the following code  
`git init`  
`git clone https://github.com/aniketraj00/udacity_frontend_nanodegree_weather_journal_app.git` 

Open terminal and navigate to the project directory and type the following commands  
`npm install express cors body-parser axios`

Once the installation is finished, type the following code to boot up the server
`node server`

After that you can access the application locally at this address http://localhost:3000

# Usage
[(Back to top)](#table-of-contents)

This is a simple weather journal application created as udacity's frontend nanodegree  
project requirement. You can use it to fetch the weather data based on country and zip  
code. The application fetches the weather data using openweather API, persists the    
fetched data on the application backend and updates the UI accordingly to display the  
weather data to the user. To use the application select the country, enter the zip code,  
enter some text on how are you feeling today and press the generate button to fetch the   
weather data from the openweather API.

# Development
[(Back to top)](#table-of-contents)
  
This project is open to anyone who wants to contribute. If you like this project then   
give it a star.
