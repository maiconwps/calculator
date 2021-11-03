const OPERATORS_BUTTONS = document.querySelectorAll("[data-operator]")
const DIGIT_BUTTONS = document.querySelectorAll(".digit")
const equalsButton = document.querySelector("#equals")
const clearButton = document.querySelector("#clear")
const deleteButton = document.querySelector("#delete")
const display = document.querySelector("#display")
let sepator = ""
let inputs = []
let mathTerms = []
const _last = array => ([...array].pop())

function updateMathContent(s) {
    var math = MathJax.Hub.getAllJax("mathOutput")[0];
    MathJax.Hub.Queue(["Text", math, s]);
}


DIGIT_BUTTONS.forEach(digitButton => digitButton.addEventListener("click", () => {
    const typeTerm = digitButton.getAttribute("data-type-term")
    let digitValue = digitButton.innerText
    const lastInput = _last(inputs)

    if(typeTerm === "number"){
        if(typeof(lastInput) === "number"){
            inputs[inputs.length -1] = Number(inputs.slice(-1) + sepator + digitValue)
            mathTerms[mathTerms.length -1] = mathTerms.slice(-1) + sepator + digitValue
            sepator = ""
        }else{
            inputs.push(Number(digitValue))
            mathTerms.push(digitValue)
        }
    }
    else if(typeTerm === "sepator"){
        sepator = digitValue
    }
    else if(typeTerm === "operator"){
        const operation = digitButton.getAttribute("data-operation")
        const asciiMath = digitButton.getAttribute("data-ascii-math")
        inputs.push(operation)
        mathTerms.push(asciiMath)
    }
    else if(typeTerm === "constant"){
        const constant = digitButton.getAttribute("data-constant")
        inputs.push(constant)
        mathTerms.push(constant)
    }
    else{
        mathTerms.push(digitValue)
        inputs.push(digitValue)
    }

    display.innerText = "$" + mathTerms.join("") + "$"
    _marthOutput.innerText = "$" + mathTerms.join("") + "$"

    MathJax.typeset()

}))

clearButton.addEventListener("click", () => {
    display.innerText = ""
    inputs = []
    mathTerms = []
    CALCULATOR.reset()
})

deleteButton.addEventListener("click", (ev) =>{
    const lastInput = _last(inputs)

    if(typeof(lastInput) === "number"){
        if (String(lastInput).length == 1){
            console.log(lastInput)
            inputs.pop()
            mathTerms.pop()
        }else{
            console.log(lastInput)
            console.log("No erro", inputs)
            inputs[inputs.length -1] = Number(String(lastInput).slice(0, -1))
            mathTerms[mathTerms.length -1] = Number(String(lastInput).slice(0, -1))
            console.log("ii", inputs)
        }
    }else{
        console.log("aqui")
        inputs.pop()
        mathTerms.pop()
    }

    display.innerText = "$" + mathTerms.join("") + "$"
    _marthOutput.innerText = "$" + mathTerms.join("") + "$"

    MathJax.typeset()
})

equalsButton.addEventListener("click", () => {
    for (const input of inputs){
        try{
            CALCULATOR.enter(input)
        }
        catch(e){
            console.log(e, input)
        }
    }

    const result = CALCULATOR.equals()
    display.innerText = result
    inputs = []
    mathTerms = []
})