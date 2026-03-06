const userInput = document.getElementById("date");
const resultDisplay = document.getElementById("result");
const copyBtn = document.getElementById("copyBtn"); 
const calcBtn = document.getElementById("calcBtn"); 
const zContainer = document.getElementById("zodiacContainer");
const zResult = document.getElementById("zodiacResult");
const zBtn = document.getElementById("zodiacBtn");

// Prevent selecting future dates
userInput.max = new Date().toISOString().split("T")[0];

// ENTER KEY LOGIC
document.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        event.preventDefault(); 
        CalculateAge();
    }
});

function CalculateAge() {
    if (!userInput.value) {
        typeEffect("> ERROR: PLEASE SELECT A BIRTH DATE...");
        return;
    }

    // Reset Zodiac UI
    if (zContainer) {
        zContainer.style.display = "none";
        zResult.style.display = "none";
        if(zBtn) zBtn.style.display = "inline-block";
    }

    const birthDate = new Date(userInput.value);
    const today = new Date();

    let y3 = today.getFullYear() - birthDate.getFullYear();
    let m3 = today.getMonth() - birthDate.getMonth();
    let d3 = today.getDate() - birthDate.getDate();

    if (d3 < 0) {
        m3--;
        d3 += getDaysInMonth(today.getFullYear(), today.getMonth());
    }
    if (m3 < 0) {
        y3--;
        m3 += 12;
    }

    const timeDiff = today.getTime() - birthDate.getTime();
    const totalDays = Math.floor(timeDiff / (1000 * 3600 * 24));

    let nextBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
    if (today > nextBirthday) {
        nextBirthday.setFullYear(today.getFullYear() + 1);
    }
    const nextBdayDiff = nextBirthday.getTime() - today.getTime();
    const nextBdayDays = Math.ceil(nextBdayDiff / (1000 * 3600 * 24));

    const fullText = `> STATUS: SUCCESS\n> AGE: [${y3}] YRS, [${m3}] MOS, [${d3}] DAYS\n> TOTAL LIVED: [${totalDays}] DAYS\n> NEXT B-DAY: IN [${nextBdayDays}] DAYS`;
    
    typeEffect(fullText);
}

function typeEffect(text) {
    let i = 0;
    resultDisplay.innerHTML = ""; 
    
    if(copyBtn) copyBtn.style.display = "none";
    if(calcBtn) {
        calcBtn.disabled = true;
        calcBtn.innerText = "Processing...";
    }

    const timer = setInterval(() => {
        if (i < text.length) {
            let char = text.charAt(i);
            if (char === '\n') {
                resultDisplay.innerHTML += '<br>';
            } else {
                resultDisplay.innerHTML += char;
            }
            i++;
        } else {
            clearInterval(timer);
            if(calcBtn) {
                calcBtn.disabled = false;
                calcBtn.innerText = "Calculate";
            }
            
            let formatted = resultDisplay.innerHTML
                .replace(/\[/g, '<span style="color: white; font-weight: bold;">')
                .replace(/\]/g, '</span>');
            resultDisplay.innerHTML = formatted;
            
            if(copyBtn) copyBtn.style.display = "block";
            if (zContainer) zContainer.style.display = "block";
        }
    }, 30); 
}

function getDaysInMonth(year, month) {
    return new Date(year, month, 0).getDate();
}

function showZodiac() {
    const birthDate = new Date(userInput.value);
    const month = birthDate.getMonth() + 1; 
    const day = birthDate.getDate();

    const sign = getZodiacSign(day, month);
    const stone = getBirthstone(month);

    zResult.innerHTML = `<strong>Zodiac Sign:</strong> ${sign} <br> <strong>Birthstone:</strong> ${stone}`;
    zResult.style.display = "block";
    zBtn.style.display = "none";
}

function getZodiacSign(day, month) {
    if ((month == 1 && day <= 20) || (month == 12 && day >= 22)) return "♑ Capricorn (Makar)";
    if ((month == 1 && day >= 21) || (month == 2 && day <= 18)) return "♒ Aquarius (Kumbh)";
    if ((month == 2 && day >= 19) || (month == 3 && day <= 20)) return "♓ Pisces (Meen)";
    if ((month == 3 && day >= 21) || (month == 4 && day <= 19)) return "♈ Aries (Mesh)";
    if ((month == 4 && day >= 20) || (month == 5 && day <= 20)) return "♉ Taurus (Vrishabh)";
    if ((month == 5 && day >= 21) || (month == 6 && day <= 20)) return "♊ Gemini (Mithun)";
    if ((month == 6 && day >= 21) || (month == 7 && day <= 22)) return "♋ Cancer (Kark)";
    if ((month == 7 && day >= 23) || (month == 8 && day <= 22)) return "♌ Leo (Singh)";
    if ((month == 8 && day >= 23) || (month == 9 && day <= 22)) return "♍ Virgo (Kanya)";
    if ((month == 9 && day >= 23) || (month == 10 && day <= 22)) return "♎ Libra (Tula)";
    if ((month == 10 && day >= 23) || (month == 11 && day <= 21)) return "♏ Scorpio (Vrishchik)";
    if ((month == 11 && day >= 22) || (month == 12 && day <= 21)) return "♐ Sagittarius (Dhanu)";
    return "Unknown";
}

function getBirthstone(month) {
    const stones = [
        "Garnet", "Amethyst", "Aquamarine", "Diamond", 
        "Emerald", "Pearl", "Ruby", "Peridot", 
        "Sapphire", "Opal", "Topaz", "Turquoise"
    ];
    return stones[month - 1];
}

function copyResult() {
    const textToCopy = resultDisplay.innerText;
    navigator.clipboard.writeText(textToCopy).then(() => {
        const icon = copyBtn.querySelector('i');
        if (icon) {
            icon.classList.replace('fa-copy', 'fa-check');
            setTimeout(() => {
                icon.classList.replace('fa-check', 'fa-copy');
            }, 2000);
        }
    });
}
