const CALCULATOR = (() => {
    // -------------------------------BASIC FUNCTIONS------------------------------------------------------
    const _containsValue = array => value => array.includes(value)
    const _filter = predicate => array => array.filter(predicate)
    const _map = callback => array => array.map(callback)
    const _find = predicate => array => array.find(predicate)
    const _findIndex = predicate => array => array.findIndex(predicate)
    const _sort = array => array.sort()
    const _removeDuplicates = array => Array.from(new Set(array))
    const _last = array => ([...array].pop())
    const _upper = str => str.toUpperCase()

    const _getProperty = prop => obj => obj[prop]
    const _isPropertyEquals = prop => value => obj => obj[prop] == value
    const _listPropValues = prop => array => _map(_getProperty(prop))(array)
    const _filterByPropValue = prop => value => array => _filter(_isPropertyEquals(prop)(value))(array)
    const _findByPropertyValue = prop => array => value => _find(_isPropertyEquals(prop)(value))(array)
    const _getIndexByValues = values => array => _findIndex(_containsValue(values))(array)
    const _getIndexByValue = value => array => _findIndex(_containsValue([value]))(array)
    const _containsAnyValue = values => array => array.some(_containsValue(values))
    const _getSubArray = (array, start, end) => array.slice(start, end)
    const _pop = index => array => {
        const _newArray = [...array]
        _newArray.splice(index, 1)
        return _newArray
    }
    const _replaceSubarrayByElement = (array, start, len, element) => {
        const _newArray = [...array]
        _newArray.splice(start, len, element)
        return _newArray
    }


    // -------------------------------VARIABLES------------------------------------------------------
    let historic = []
    let currentExpression = []
    let grouperQueue = []
    let enteredSymbols = []
    let nextTermsExpected = []

    
    // -------------------------------UTILITY FUNCTIONS------------------------------------------------------
    const isValidNumber = value => typeof (value) === "number" && !isNaN(value) && isFinite(value)
    const getLastInput = () => _last(currentExpression)


    // -------------------------------MATH CONSTANT------------------------------------------------------
    const factoryMathConstant = (name, value,  symbol) => ({name, value,  symbol})

    const MATH_CONSTANTS = [
        factoryMathConstant("PI", Math.PI, "\u03C0"),
        factoryMathConstant("E", Math.E, "\u1D452")
    ]

    const CONSTANTS = _listPropValues("name")(MATH_CONSTANTS)
    const isValidConstant = name => _containsValue(CONSTANTS)(_upper(name))
    const getConstant = name => _findByPropertyValue("name")(MATH_CONSTANTS)(_upper(name))


    // -------------------------------OPERATIONS------------------------------------------------------
    const addOperation = (operand1, operand2) => operand1 + operand2
    const subOperation = (operand1, operand2) => operand1 - operand2
    const multOperation = (operand1, operand2) => operand1 * operand2
    const divOperation = (operand1, operand2) => operand1 / operand2
    const powOperation = Math.pow
    const sqrtOperation = Math.sqrt
    const cbrtOperation = Math.cbrt
    const squareOperation = operand => powOperation(operand, 2)
    const cubeOperation = operand => powOperation(operand, 3)
    const invertOperation = operand => powOperation(operand, -1)
    const percentOperation = operand => operand/100
    const factorialOperation = operand => operand < 2 ? 1 : operand * factorialOperation(operand - 1)
    const oppositeOperation = operand => operand*(-1)
    const identityOperation = operand => operand
    const factoryMathOperation = (operator, priority, handler, symbol, position, termExpression, isDuplicate) => {
        position = (position === undefined) ? "center" : position
        symbol = (symbol === undefined) ? ` ${operator} `: symbol
        termExpression = (termExpression === undefined) ? operator : termExpression
        isDuplicate = (isDuplicate === undefined) ? false : isDuplicate
        return { operator, priority, handler, symbol, position, termExpression, isDuplicate}
    }
    
    const MATH_OPERATIONS = [
        factoryMathOperation("+", 3, addOperation),
        factoryMathOperation("-", 3, subOperation, " \u2212 "),
        factoryMathOperation("*", 2, multOperation, " \u00D7 "),
        factoryMathOperation("/", 2, divOperation, " \u00F7 "),
        factoryMathOperation("^", 1, powOperation, "^"),
        factoryMathOperation("%", 1, percentOperation, "%", "right"),
        factoryMathOperation("rz", 1, sqrtOperation, "\u221A", "left"),
        factoryMathOperation("rz3", 1, cbrtOperation, "\u221B", "left"),
        factoryMathOperation("!", 0, factorialOperation, "!", "right"),
        factoryMathOperation("^2", 1, squareOperation, "\u00B2", "right"),
        factoryMathOperation("^3", 1, cubeOperation, "\u00B3", "right"),
        factoryMathOperation("^-1", 1, invertOperation, "\u207B\u00B9", "right"),
        factoryMathOperation("*", 1.5, multOperation, "", "center", "x", true), // Operação em caso de supressão de parênteses
        factoryMathOperation("-", 1.5, oppositeOperation, "\u2212", "left", "--", true),
        factoryMathOperation("+", 1.5, identityOperation, "+", "left", "++", true),

    ]

    const PRIMARY_OPERATIONS = _filterByPropValue("isDuplicate")(false)(MATH_OPERATIONS)
    const SECONDARY_OPERATIONS = _filterByPropValue("isDuplicate")(true)(MATH_OPERATIONS)

    // PRIMARY OPERATION GENERIC FUNCTIONS
    const getTermExpressionByProperty = prop => operations => value => _listPropValues("termExpression")(_filterByPropValue(prop)(value)(operations))
    const getOperationByTermExpression = _findByPropertyValue("termExpression")(MATH_OPERATIONS)
    const getPryOperationByOperator = _findByPropertyValue("operator")(PRIMARY_OPERATIONS)
    const getSecOperationByOperator = _findByPropertyValue("operator")(SECONDARY_OPERATIONS)
    const getOperatorsByPriority = getTermExpressionByProperty("priority")(MATH_OPERATIONS)
    const getOperatorsByPosition = getTermExpressionByProperty("position")
    const getOperatorIndexes = (mathExpression, operators) => _getIndexByValues(operators)(mathExpression)

    // OPERATION CONSTANTS
    const OPERATION_PRIORITIES = _sort(_removeDuplicates(_listPropValues("priority")(MATH_OPERATIONS)))
    const CENTER_OPERATORS = getOperatorsByPosition(MATH_OPERATIONS)("center")
    const LEFT_OPERATORS = getOperatorsByPosition(MATH_OPERATIONS)("left")
    const RIGHT_OPERATORS = getOperatorsByPosition(MATH_OPERATIONS)("right")
    const OPERATORS = _removeDuplicates([...LEFT_OPERATORS, ...CENTER_OPERATORS, ...RIGHT_OPERATORS])
    const SECONDARY_OPERATORS = _listPropValues("operator")(SECONDARY_OPERATIONS)

    // OPERATION SPECIFIC FUNCTIONS
    const isValidSecOperator = _containsValue(SECONDARY_OPERATORS)
    const isValidOperator = _containsValue(OPERATORS)
    const isValidRightOperator = _containsValue(RIGHT_OPERATORS)


    // -------------------------------GROUPERS------------------------------------------------------
    const factoryMathGroupers = (name, left, right, priority) => ({name, left, right, priority })
    const mathGroupers = [
        factoryMathGroupers("parentheses", "(", ")", 3),
        factoryMathGroupers("bracket", "[", "]", 2),
        factoryMathGroupers("brace", "{", "}", 1),
    ]

    // GROUPER GENERIC FUNCTIONS
    const getGroupersPropertyValue = prop => _listPropValues(prop)(mathGroupers)
    const getGrouperByPropertyValue = prop => value => _findByPropertyValue(prop)(mathGroupers)(value)
    const getLastGrouper = () => _last(grouperQueue)

    // GROUPER CONSTANTS
    const GROUPER_PRIORITIES = _sort(_removeDuplicates(_listPropValues("priority")(mathGroupers)))
    const LETF_GROUPERS = getGroupersPropertyValue("left")
    const RIGHT_GROUPERS = getGroupersPropertyValue("right")
    const GROUPERS = [...LETF_GROUPERS, ...RIGHT_GROUPERS]

    // GROUPER SPECIFIC FUNCTIONS
    const isValidGrouper = _containsValue(GROUPERS)
    const isValidLeftGrouper = _containsValue(LETF_GROUPERS)
    const isValidRightGrouper = _containsValue(RIGHT_GROUPERS)
    const getGrouperByLeft = getGrouperByPropertyValue("left")
    const getGrouperByRight = getGrouperByPropertyValue("right")
    const getGrouperByPriority = getGrouperByPropertyValue("priority")
    const getGrouperStartIndex = (mathExpression, leftGrouper) => _getIndexByValue(leftGrouper)(mathExpression)
    const getGrouperEndIndex = (mathExpression, grouperNumber) => _getIndexByValue(grouperNumber)(mathExpression)
    const isThereGrouperIn = _containsAnyValue(GROUPERS)

    // -------------------------------CALCULATE FUNCTIONS------------------------------------------------------
    const resolveOperation = (mathExpression, operatorIndex) => {
        const operatorTermExpression = mathExpression[operatorIndex]
        const operation = getOperationByTermExpression(operatorTermExpression)
        const operands = []
        let startStepIndex = 0
        let lenStepEx = 0

        switch (operation.position) {
            case "center": {
                operands.push(mathExpression[operatorIndex - 1])
                operands.push(mathExpression[operatorIndex + 1])
                startStepIndex = operatorIndex - 1
                break
            }
            case "right": {
                operands.push(mathExpression[operatorIndex - 1])
                startStepIndex = operatorIndex - 1
                break
            }
            case "left": {
                const operand = mathExpression[operatorIndex + 1]
                if (isValidNumber(operand)) {
                    operands.push(operand)
                    startStepIndex = operatorIndex
                    break
                }
                else {
                    return resolveOperation(mathExpression, operatorIndex + 1)
                }
            }
        }

        lenStepEx = operands.length + 1
        result = operation.handler(...operands)
        return _replaceSubarrayByElement(mathExpression, startStepIndex, lenStepEx, result)
    }

    const resolveSelectOperations = (mathExpression, operators) => {
        let newMathExpression = [...mathExpression]
        let currentOperatorIndex = getOperatorIndexes(newMathExpression, operators)

        while (currentOperatorIndex !== -1) {
            newMathExpression = resolveOperation(newMathExpression, currentOperatorIndex)
            currentOperatorIndex = getOperatorIndexes(newMathExpression, operators)
        }

        return newMathExpression
    }

    const resolveSubExpression = (mathSubExpression) => {
        let result = [...mathSubExpression]

        for (priority of OPERATION_PRIORITIES) {
            const currentAbleOperators = getOperatorsByPriority(priority)
            result = resolveSelectOperations(result, currentAbleOperators)

            if (result.length == 1) {
                return result[0]
            }
        }
    }

    const resolveGrouper = (mathExpression, start) => {
        const grouperNumber = mathExpression[start-1]
        let _mathExpression = _pop(start-1)(mathExpression) // REMOVE NAME START GROUPER

        const end = getGrouperEndIndex(_mathExpression, grouperNumber)
        _mathExpression = _pop(end)(_mathExpression) // REMOVE NAME END GROUPER

        const subexpression = _getSubArray(_mathExpression, start, end)
        const result = resolveExpression(subexpression)
        
        return _replaceSubarrayByElement(_mathExpression, start-1, end - start + 2, result)
    }

    const resolveSubExpressionsByGrouper = (mathExpression, grouper) => {
        let expression = [...mathExpression]
        let nextIndexStartGrouper = getGrouperStartIndex(expression, grouper.left)

        while(nextIndexStartGrouper !== -1){
            expression = resolveGrouper(expression, nextIndexStartGrouper)
            nextIndexStartGrouper = getGrouperStartIndex(expression, grouper.left)
        }

        return expression
    }

    const resolveExpression = (mathExpression) => {
        let expression = [...mathExpression]

        if (isThereGrouperIn(expression)) {
            for (priority of GROUPER_PRIORITIES) {
                const currentGrouper = getGrouperByPriority(priority)
                expression = resolveSubExpressionsByGrouper(expression, currentGrouper)
            }
        }

        return resolveSubExpression(expression)
    }


    // -------------------------------ENTER FUNCTIONS--------------------------------------------------
    const _addSuppression = () => currentExpression.push("x")

    const nextTermExpressionExpected = (currentTermType, currentTermPosition) => {
        switch(currentTermType){
            case "grouper":
                const commom = ["número", "digit"]

                switch(currentTermPosition){
                    case "left":
                        return [...commom, ...LEFT_OPERATORS, ...LETF_GROUPERS]
                    case "right":
                        return [...commom, ...RIGHT_OPERATORS, ...CENTER_OPERATORS, ...RIGHT_GROUPERS]
                }
            case "operator":
                switch(currentTermPosition){
                    case "left":
                        return ["número", "digit", ...LEFT_OPERATORS, ...LETF_GROUPERS]
                    case "center":
                        return ["número", "digit", ...LEFT_OPERATORS, ...LETF_GROUPERS]
                    case "right":
                        return [...OPERATORS, ...GROUPERS]
                }
            case "número":
                return ["digit", ...OPERATORS, ...GROUPERS]
            case "digit":
                return ["digit", ...OPERATORS, ...GROUPERS]
            case undefined:
                return ["número", "digit", ...LEFT_OPERATORS, ...LETF_GROUPERS]
        }
    }

    const enterGrouperInput = input => {
        const lastGrouper = getLastGrouper()
        let mathGrouper = undefined
        let numberGrouper = 0
        let typeGrouper = undefined
        const lastInput = getLastInput()

        if(!_containsValue(nextTermsExpected)(input)){
            throw Error(`É esperado um dos termos: ${nextTermsExpected.join(", ")}`)
        }

        if(lastGrouper === undefined || isValidLeftGrouper(input)){
            typeGrouper = "left"
            mathGrouper = getGrouperByLeft(input)
            grouperQueue.push(input)
            numberGrouper = grouperQueue.length

            if(isValidNumber(lastInput) || isValidRightOperator(lastInput)){
                _addSuppression()
            }
        }
        else{
            mathGrouper = getGrouperByRight(input)
            typeGrouper = "right"
            if (mathGrouper.left !== lastGrouper){
                throw Error(`É esperado o fechamento do agrupador ${lastGrouper}.`) 
            }

            numberGrouper = grouperQueue.length
            grouperQueue.pop()
        }
        currentExpression.push(`${mathGrouper.name}${numberGrouper}`) // ADD NAME GROUPER
        nextTermsExpected = nextTermExpressionExpected("grouper", typeGrouper)
    }

    
    const getOperationByInput = input =>{
        let operation = getPryOperationByOperator(input)

        if(_containsValue(nextTermsExpected)(operation.termExpression)){
            return operation
        }
        if(isValidSecOperator(input)){
            operation = getSecOperationByOperator(input)

            if(_containsValue(nextTermsExpected)(operation.termExpression)){
                return operation
            }
        }
    }

    const enterOperatorInput = input => {
        let operation = getOperationByInput(input)

        if(operation === undefined){
            throw Error(`É esperado um dos termos: ${nextTermsExpected.join(", ")}`)
        }

        if(operation.position === "left"){
            const lastInput = getLastInput()
            const isValidSuppression = isValidNumber(lastInput) ||
                                        isValidRightGrouper(lastInput) ||
                                        isValidRightOperator(lastInput)
            if(isValidSuppression){
                _addSuppression()
            }
        }

        nextTermsExpected = nextTermExpressionExpected("operator", operation.position)
        return operation
    }

    const enterNumberInput = input => {
        const lastInput = getLastInput()

        if(!_containsValue(nextTermsExpected)("número")){
            throw Error(`É esperado um dos termos: ${nextTermsExpected.join(", ")}`)
        }
        
        if (isValidRightGrouper(lastInput)){
            _addSuppression()
        }
        nextTermsExpected = nextTermExpressionExpected("número")
    }


    // ----------------------------------MAIN FUNCTIONS--------------------------------------------------
    const enterDigit = input => {
        if(nextTermsExpected.length === 0){
            nextTermsExpected = nextTermExpressionExpected()
        }

        if (!_containsValue(["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"])(input)){
            throw Error("Dígito inválido.")
        }
        
        let lastInput = getLastInput()

        if(!_containsValue(nextTermsExpected)("digit")){
            throw Error(`É esperado um dos termos: ${nextTermsExpected.join(", ")}`)
        }
        
        if (isValidRightGrouper(lastInput)){
            _addSuppression()
        }

        if(isValidNumber(lastInput)){
            currentExpression.push(Number(lastInput + input))
        }
        else{
            currentExpression.push(Number(input))
        }   

        nextTermsExpected = nextTermExpressionExpected("digit")
    }

    const enter = input => {
        let symbol = input
        let termExpression = input

        if(nextTermsExpected.length === 0){
            nextTermsExpected = nextTermExpressionExpected()
        }

        if (isValidGrouper(input)){
            enterGrouperInput(input)
        }
        else if (isValidOperator(input)){
            const operation = enterOperatorInput(input)
            termExpression = operation.termExpression
            symbol = operation.symbol
        }
        else if (isValidNumber(input)){
            enterNumberInput(input)
        }
        else if (isValidConstant(input)){
            const constant = getConstant(input)
            enterNumberInput(input)
            symbol = constant.symbol
            termExpression = constant.value
        }
        else{
            throw Error("Dígito inválido.")
        }
        
        enteredSymbols.push(symbol)
        currentExpression.push(termExpression)
    }

    const equals = () => {
        const result = resolveExpression(currentExpression)
        historic.push(`${enteredSymbols.join("")} = ${result}`)
        currentExpression = []
        enteredSymbols = []
        nextTermsExpected = []
        return result
    }
    const list = () => historic
    const reset = () => currentExpression = []
    const clear = () => historic = []


    return {
        enter,
        enterDigit,
        equals,
        list,
        reset,
        clear
    }
}
)()