let stockContainer = document.querySelector("#display-stocks");
let historyContainer = document.querySelector("history-container");
let displayCharts = document.querySelector("display-charts");
let input = document.querySelector("#input")
let modalBtn= document.querySelector("#modalButton");
let stockCounter=0;
let xValues = ["","",""];
let currentPriceValues = ["","",""];
let dayOpenValues=["","",""];
let dayHighValues=["","",""];
let searchHistory=[];
let searchField = document.getElementById("inpKey")
let submitBtn = document.getElementById ("submitBtn")
const ul = document.getElementById("dynamic-list");

//If enter is pressed, activate the search button click function
searchField.addEventListener("keypress",function(event){
    if (event.key === "Enter"){
        event.preventDefault()
        document.getElementById("submitBtn").click();
    }
})

//Search button click function
submitBtn.addEventListener("click",function(){
    let search = searchField.value
    if(search.length > 0 ){
        //Create button, change text content, append to search container

        //ADD button CLick events

        let btn = document.createElement("button");
        btn.classList.add("btn-dark","btn","searchbutton");
        btn.textContent=search
        ul.appendChild(btn);
        searchField.value = ""

        console.log("search:"+search)
        setHistory(search);

        //Call make/replaceStock with search params
        if (stockCounter<3){
            makeStock(search);
        }
        else{
            replaceStock(search);
        }
    }
})

function getHistory(){
    searchHistory = JSON.parse(localStorage.getItem("Stonks"));
    if (searchHistory===null){
        localStorage.setItem("Stonks","[]")
    }
    else{
        for (let i=0;i<searchHistory.length;i++){
            let btn = document.createElement("button");
            btn.classList.add("btn-dark","btn", "searchbutton");
            btn.textContent=searchHistory[i];
            ul.appendChild(btn);
            btn.addEventListener("click",function(){
                if (stockCounter<3){
                    makeStock(btn.textContent);
                }
                else{
                    replaceStock(btn.textContent);
                }
            })
        }
    }
}

function setHistory(word){
    console.log(word);
    searchHistory.push(word);
    localStorage.setItem("Stonks",JSON.stringify(searchHistory));
}

//Creates stock and stock data based off search params
//Then updates graphs

//ADD BUTTON FOR MODAL TO POP UP
function makeStock(searchContent){
    fetch('https://api.stockdata.org/v1/data/quote?symbols='+searchContent+'&api_token=HfXDawpiXH7vBTzXXigj7jK4WMvzGEMcEV0F6Ssm')
    .then(function(response){
        return response.json();
        console.log(response)
    })
    .then(function(data){
        console.log(data);
        let container = document.createElement("section")
        container.classList.add("stock","card","col");

        let nameEl= data.data['0']['name'];
        let stname = document.createElement("h3");
        stname.textContent = nameEl;
        container.appendChild(stname);

        let ticker = data.data['0']['ticker'];
        let tickerName = document.createElement("h5");
        tickerName.textContent="Ticker Name: "+ticker;
        container.appendChild(tickerName);

        let currentPrice = data.data['0']['price'];
        let cPrice =document.createElement("h5");
        cPrice.textContent = "Current Stock Price: "+currentPrice;
        container.appendChild(cPrice);

        let currency =data.data['0']['currency'];
        let crncy = document.createElement("h5");
        crncy.textContent = "Traded in: "+currency;
        container.appendChild(crncy);

        let dayClose = data.data['0']['previous_close_price'];
        let dClose = document.createElement("h5");
        dClose.textContent = "Day Close Price: "+dayClose;
        container.appendChild(dClose);

        let dayOpen =data.data['0']['day_open'];
        let dOpen = document.createElement("h5");
        dOpen.textContent = "Day Open Price"+dayOpen;
        container.appendChild(dOpen);

        let dayHigh = data.data['0']['day_high'];
        let dHigh = document.createElement("h5");
        dHigh.textContent = "Day High Price: "+dayHigh;
        container.appendChild(dHigh);

        let dayLow = data.data['0']['day_low'];
        let dLow = document.createElement("h5");
        dLow.textContent = "Day Low Price: "+dayLow;
        container.appendChild(dLow);

        let volume = data.data['0']['volume'];
        let Vlume = document.createElement("h5");
        Vlume.textContent = "Units traded today: "+volume;
        container.appendChild(Vlume);
        
        //BTN logic
        //When you click the button, it first changes the Modal then opens it
        let btn = document.createElement("button");
        btn.classList.add("btn", "btn-dark");
        btn.textContent="Get Stock News";
        container.appendChild(btn);
        btn.addEventListener("click", function(){
            console.log("Entered Function")
            launchModal(ticker);
            modalBtn.click();
        })

        stockContainer.appendChild(container);
        xValues[stockCounter]=searchContent;
        currentPriceValues[stockCounter]=currentPrice;
        dayOpenValues[stockCounter]=dayOpen;
        dayHighValues[stockCounter]=dayHigh;
        current(xValues,currentPriceValues);
        open(xValues,dayOpenValues);
        high(xValues,dayHighValues);
        stockCounter++;
    });
}


//ADD modal pop up button
function replaceStock(searchContent){
    fetch('https://api.stockdata.org/v1/data/quote?symbols='+searchContent+'&api_token=HfXDawpiXH7vBTzXXigj7jK4WMvzGEMcEV0F6Ssm')
    .then(function(response){
        return response.json();
        console.log(response)
    })
    .then(function(data){
        let stocks = stockContainer.querySelectorAll("section");
        if (stockCounter%3===0){
            let nameEl= data.data['0']['name'];
            stocks[0].children[0].textContent=nameEl;

            let ticker = data.data['0']['ticker'];
            stocks[0].children[1].textContent="Ticker Name: "+ticker;

            let currentPrice = data.data['0']['price'];
            stocks[0].children[2].textContent="Current Stock Price: "+currentPrice;

            let currency =data.data['0']['currency'];
            stocks[0].children[3].textContent="Traded in: "+currency;

            let dayClose = data.data['0']['previous_close_price'];
            stocks[0].children[4].textContent="Day Close Price: "+dayClose;

            let dayOpen =data.data['0']['day_open'];
            stocks[0].children[5].textContent="Day Open Price"+dayOpen;

            let dayHigh = data.data['0']['day_high'];
            stocks[0].children[6].textContent="Day High Price: "+dayHigh;

            let dayLow = data.data['0']['day_low'];
            stocks[0].children[7].textContent="Day Low Price: "+dayLow;

            let volume = data.data['0']['volume'];
            stocks[0].children[8].textContent="Units traded today: "+volume;

            //Change button event listener to new ticker name
            let btn=stocks[0].children[9];
            btn.removeEventListener("click", function(){
                console.log("Entered Function")
                launchModal(ticker);
                modalBtn.click();
            })
            console.log("removed listener")
            btn.addEventListener("click", function(){
                console.log("0th button Listener")
                console.log(ticker)
                launchModal(ticker);
                modalBtn.click();
            })

            xValues[0]=searchContent;
            currentPriceValues[0]=currentPrice;
            dayOpenValues[0]=dayOpen;
            dayHighValues[0]=dayHigh;
            current(xValues,currentPriceValues);
            open(xValues,dayOpenValues);
            high(xValues,dayHighValues);
            stockCounter++;
        }
        else if (stockCounter%3===1){
            let nameEl= data.data['0']['name'];
            stocks[1].children[0].textContent=nameEl;

            let ticker = data.data['0']['ticker'];
            stocks[1].children[1].textContent="Ticker Name: "+ticker;

            let currentPrice = data.data['0']['price'];
            stocks[1].children[2].textContent="Current Stock Price: "+currentPrice;

            let currency =data.data['0']['currency'];
            stocks[1].children[3].textContent="Traded in: "+currency;

            let dayClose = data.data['0']['previous_close_price'];
            stocks[1].children[4].textContent="Day Close Price: "+dayClose;

            let dayOpen =data.data['0']['day_open'];
            stocks[1].children[5].textContent="Day Open Price"+dayOpen;

            let dayHigh = data.data['0']['day_high'];
            stocks[1].children[6].textContent="Day High Price: "+dayHigh;

            let dayLow = data.data['0']['day_low'];
            stocks[1].children[7].textContent="Day Low Price: "+dayLow;

            let volume = data.data['0']['volume'];
            stocks[1].children[8].textContent="Units traded today: "+volume;

            //Change button event listener to new ticker name
            let btn=stocks[1].children[9];
            btn.removeEventListener("click", function(){
                console.log("Entered Function")
                launchModal(ticker);
                modalBtn.click();
            })
            console.log("removed listener")
            btn.addEventListener("click", function(){
                console.log("1th button Listener")
                console.log(ticker)
                launchModal(ticker);
                modalBtn.click();
            })

            xValues[1]=searchContent;
            currentPriceValues[1]=currentPrice;
            dayOpenValues[1]=dayOpen;
            dayHighValues[1]=dayHigh;
            current(xValues,currentPriceValues);
            open(xValues,dayOpenValues);
            high(xValues,dayHighValues);
            stockCounter++;
        }
        else{
            let nameEl= data.data['0']['name'];
            stocks[2].children[0].textContent=nameEl;

            let ticker = data.data['0']['ticker'];
            stocks[2].children[1].textContent="Ticker Name: "+ticker;

            let currentPrice = data.data['0']['price'];
            stocks[2].children[2].textContent="Current Stock Price: "+currentPrice;

            let currency =data.data['0']['currency'];
            stocks[2].children[3].textContent="Traded in: "+currency;

            let dayClose = data.data['0']['previous_close_price'];
            stocks[2].children[4].textContent="Day Close Price: "+dayClose;

            let dayOpen =data.data['0']['day_open'];
            stocks[2].children[5].textContent="Day Open Price"+dayOpen;

            let dayHigh = data.data['0']['day_high'];
            stocks[2].children[6].textContent="Day High Price: "+dayHigh;

            let dayLow = data.data['0']['day_low'];
            stocks[2].children[7].textContent="Day Low Price: "+dayLow;

            let volume = data.data['0']['volume'];
            stocks[2].children[8].textContent="Units traded today: "+volume;

            //Change button event listener to new ticker name
            let btn=stocks[2].children[9];
            btn.removeEventListener("click", function(){
                console.log("Entered Function")
                launchModal(ticker);
                modalBtn.click();
            })
            console.log("removed listener")
            btn.addEventListener("click", function(){
                console.log("2th button Listener")
                console.log(ticker)
                launchModal(ticker);
                modalBtn.click();
            })

            xValues[2]=searchContent;
            currentPriceValues[2]=currentPrice;
            dayOpenValues[2]=dayOpen;
            dayHighValues[2]=dayHigh;
            current(xValues,currentPriceValues);
            open(xValues,dayOpenValues);
            high(xValues,dayHighValues);
            stockCounter++;
        }
    });
}

//Call this when the user clicks on get news button
function launchModal(tickerName){
    let url = "https://api.marketaux.com/v1/news/all?symbols="+tickerName+"&filter_entities=true&language=en&api_token=Y2d4RvCZU75JlG2keugvRhdhBHnOEwNPS37VqFVe";
    fetch(url)
        .then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                let modalBody=document.querySelector(".modal-body");
                let modalTitle=document.querySelector(".modal-title");
                modalTitle.textContent="Breaking News for: "+data.data[0].entities[0].name;
                //Gets 3 highlights, and adds the titles as HREFs to the actual papers
                for (let i=0;i<data.data.length;i++){
                    let link =modalBody.children[0].children[i];
                    link.setAttribute("href", data.data[i].url);
                    link.textContent=("Story "+(i+1)+": "+data.data[i].description);
                }
                console.log("Finished LaunchModal");
            });
        } else {
            console.log('Error: ' + response.statusText);
        }
        })
        .catch(function (error) {
        console.log("unable to connect to API")
    });
}

function current(xvals,yvals){
   let barColors = ["yellow", "black","blue"];

   new Chart("current", {
   type: "bar",
   data: {
      labels: xvals,
      datasets: [{
      backgroundColor: barColors,
      data: yvals}]},
   options: {
      legend: {display: false},
      title: {
     display: true,
     text: "Current price of Stocks"}}
});}

function open(xvals,yvals){
   let barColors = ["yellow", "black","blue"];

 new Chart("open", {
    type: "bar",
    data: {
        labels: xvals,
    datasets: [{
        backgroundColor: barColors,
        data: yvals}]},
        options: {
            legend: {display: false},
            title: {
            display: true,
            text: "Opening prices of stocks"}}
});}


function high(xvals,yvals){
    let barColors = ["yellow", "black","blue"];

    new Chart("high", {
        type: "bar",
        data: {
            labels: xvals,
            datasets: [{
                backgroundColor: barColors,
                data: yvals}]},
                options: {
                    legend: {display: false},
                    title: {
                        display: true,
                        text: "Day high prices"},
                        fontColor: "green"}
});}

current(xValues,currentPriceValues);
open(xValues,dayOpenValues);
high(xValues,dayHighValues);
getHistory();