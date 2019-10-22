
const fs = require('fs');

const AppHelper = {
    grabParameter: function(string){
        return string.split('=');
    },
    
    pathBuild: function (pathFacade = require('path'), folder = '', file = ''){
        
        return pathFacade.join(
            pathFacade.dirname(process.mainModule.filename),
            folder,
            file
        );

    }, //end pathConstruction

    randomNumber: function(startfrom = 0, max = Number){
        return Math.floor( Math.random() * max ) + startfrom;
    },

    deleteFile: (filePath) => {
        fs.unlinkSync(filePath, (err) => {
            if (err) throw (err);

        })
    },

    currentDateAndTime: () => {
        // get a new date (locale machine date time)
        let date = new Date();
        // get the date as a string
        let n = date.toDateString();
        // get the time as a string
        let time = date.toLocaleTimeString();

        return `${n} ${time}`;
    },

    beautyTime: (time) => {
        return time.split(' ').slice(0,5).join(' ');
    },

    back(){
        return req.header('Referer') || '/';
    }
    
}

module.exports = AppHelper;