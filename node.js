const http = require("http");

const fs = require("fs");

const requests = require("requests");

const index_file = fs.readFileSync("index.html","utf-8");

const replaceAll = (tempVal,orgVal) => {
    let num1 = orgVal.main.temp - 273.15;
    let num2 = orgVal.main.temp_min - 273.15;
    let num3 = orgVal.main.temp_max - 273.15;
    let temperature = tempVal.replace("{%tempval%}",num1.toFixed(2));
    temperature = temperature.replace("{%tempmin%}",num2.toFixed(2));
    temperature = temperature.replace("{%tempmax%}",num3.toFixed(2));
    temperature = temperature.replace("{%location%}",orgVal.name);
    temperature = temperature.replace("{%country%}",orgVal.sys.country);
    temperature = temperature.replace("{%tempstatus%}",orgVal.weather[0].main);
    return temperature;
}

const server = http.createServer((req,res)=>{
    if(req.url == "/"){

        requests("http://api.openweathermap.org/data/2.5/weather?q=Rawalpindi&appid=d605fb4c52f9de9c32c7ee01c2a0f932")
        .on("data", (chunks)=>{

            let objArr = JSON.parse(chunks);

            let arrData = [objArr];

            const realTimeData = arrData.map((val) => replaceAll(index_file,val)).join("");

            res.write(realTimeData);
            
            
        })
        .on("end", (err)=>{

            if(err){
                return console.log("error");
            }
            res.end();
            
        });
    }
    
});

server.listen(8000,"127.0.0.1",()=>{

    console.log('runing');

});
