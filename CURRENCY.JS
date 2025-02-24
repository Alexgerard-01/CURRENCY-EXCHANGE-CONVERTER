const BASE_URL = "https://v6.exchangerate-api.com/v6/26f6e276a16cb7576ff223ef/latest/USD";

const dropdown = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");

for (let select of dropdown) {
    for (code in countryList) {
        let newoption = document.createElement("option");
        newoption.innerText = code;
        newoption.value = code;
        select.append(newoption);
        if (select.name === "from" && code === "USD") {
            newoption.selected = true;
        } else if (select.name === "to" && code === "INR") {
            newoption.selected = true;
        }
    }    
    select.addEventListener("change", (evt) => {
        updateFlag(evt.target);
    });
}

const updateFlag = (element) => {
    let code = element.value;
    let countryCode = countryList[code];
    let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
    let img = element.parentElement.querySelector("img");
    img.src = newSrc;
}

btn.addEventListener("click", async (evt) => {
    evt.preventDefault();
    let amount = document.querySelector(".amount input");
    let amtVal = amount.value;
    
    if (amtVal === "" || amtVal < 1) {
        amtVal = 1;
        amount.value = "1";
    }

    try {
        let response = await fetch(BASE_URL);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        let data = await response.json();
        
        const fromRate = data.conversion_rates[fromCurr.value];
        const toRate = data.conversion_rates[toCurr.value];
        
        // Calculate the converted amount
        const convertedAmount = (amtVal * toRate / fromRate).toFixed(2 );
        
        // Display the result
        console.log(`${amtVal} ${fromCurr.value} = ${convertedAmount} ${toCurr.value}`);
        document.getElementById('result').innerText = `${amtVal} ${fromCurr.value} = ${convertedAmount} ${toCurr.value}`;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
});
