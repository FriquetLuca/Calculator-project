
const SPACES = [' ', '\t' ];
const OPERATORS = [ '*', '%', '+', '-', '/' ];
const PLACEHOLDERS = [ '°' ];
const CONSTANTS = [ 'π', 'e' ];
const DOTS = [ '.', ',' ];
const LETTERS = [   'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
                    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z' ];
const DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
const keySections = {};

const calculatorKeys = [
    {
        name: 'new',
        type: 'control',
        content: 'N',
        value: '\\New'
    },
    {
        name: 'remove',
        type: 'control',
        content: '⟽',
        value: '\\RemovePrevious'
    },
    {
        name: 'reset',
        type: 'control',
        content: 'R',
        value: '\\Reset'
    },
    {
        name: 'parenthesis_left',
        type: 'control',
        content: '(',
        value: '('
    },
    {
        name: 'parenthesis_right',
        type: 'control',
        content: ')',
        value: ')'
    },
    {
        name: 'pi',
        type: 'control',
        content: 'π',
        value: 'π'
    },
    {
        name: 'e',
        type: 'control',
        content: 'e',
        value: 'e'
    },
    {
        name: 'sin',
        type: 'function',
        content: 'sin(θ)',
        value: 'sin('
    },
    {
        name: 'cos',
        type: 'function',
        content: 'cos(θ)',
        value: 'cos('
    },
    {
        name: 'tan',
        type: 'function',
        content: 'tan(θ)',
        value: 'tan('
    },
    {
        name: 'arcsin',
        type: 'function',
        content: 'arcsin(θ)',
        value: 'asin('
    },
    {
        name: 'arccos',
        type: 'function',
        content: 'arccos(θ)',
        value: 'acos('
    },
    {
        name: 'arctan',
        type: 'function',
        content: 'arctan(θ)',
        value: 'atan('
    },
    {
        name: 'ln',
        type: 'function',
        content: 'ln(x)',
        value: 'ln('
    },
    {
        name: 'modulo',
        type: 'function',
        content: 'a mod b',
        value: '%'
    },
    {
        name: 'deg',
        type: 'function',
        content: '°',
        value: '°'
    },
    {
        name: 'log',
        type: 'function',
        content: 'log(n, x)',
        value: 'log('
    },
    {
        name: 'root',
        type: 'function',
        content: 'root(n, x)',
        value: 'root('
    },
    {
        name: 'square',
        type: 'function',
        content: 'square(x)',
        value: 'square('
    },
    {
        name: 'exp',
        type: 'function',
        content: 'exp(x)',
        value: 'exp('
    },
    {
        name: 'pow',
        type: 'function',
        content: 'pow(x, n)',
        value: 'pow('
    },
    {
        name: 'sqrt',
        type: 'function',
        content: 'sqrt(x)',
        value: 'sqrt('
    },
    {
        name: 'nine',
        type: 'digit',
        content: '9',
        value: '9'
    },
    {
        name: 'eight',
        type: 'digit',
        content: '8',
        value: '8'
    },
    {
        name: 'seven',
        type: 'digit',
        content: '7',
        value: '7'
    },
    {
        name: 'plus',
        type: 'digit',
        content: '+',
        value: '+'
    },
    {
        name: 'six',
        type: 'digit',
        content: '6',
        value: '6'
    },
    {
        name: 'five',
        type: 'digit',
        content: '5',
        value: '5'
    },
    {
        name: 'four',
        type: 'digit',
        content: '4',
        value: '4'
    },
    {
        name: 'minus',
        type: 'digit',
        content: '-',
        value: '-'
    },
    {
        name: 'three',
        type: 'digit',
        content: '3',
        value: '3'
    },
    {
        name: 'two',
        type: 'digit',
        content: '2',
        value: '2'
    },
    {
        name: 'one',
        type: 'digit',
        content: '1',
        value: '1'
    },
    {
        name: 'mul',
        type: 'digit',
        content: '*',
        value: '*'
    },
    {
        name: 'zero',
        type: 'digit',
        content: '0',
        value: '0'
    },
    {
        name: 'dot',
        type: 'digit',
        content: ',',
        value: '.'
    },
    {
        name: 'equal',
        type: 'digit',
        content: '=',
        value: '='
    },
    {
        name: 'div',
        type: 'digit',
        content: '÷',
        value: '/'
    }
];

class CalculatorKeyGen {
    // Construct a bunch of key buttons in a selected container
    static constructKeyButtons(keyContainer, keys)
    {
        for(let element of keys)
        {
            keyContainer.appendChild(this.createCalculatorKeyButton(element));
        }
    }
    // Construct key button
    static createCalculatorKeyButton(item)
    {
        let btn = document.createElement('button');
        btn.setAttribute('id', item.name);
        btn.setAttribute('name', item.name);
        btn.setAttribute('value', item.value);
        btn.classList.add(`calculator_${item.type}_btn`);
        btn.innerText = item.content;
        if(btn.value !== '=')
        {
            btn.addEventListener('click', () => {
                pushNewKeys(btn.value);
            });
        }
        return btn;
    }
}

/**
 * BasicPattern is a generic class made to check for pattern while looking inside a string.
 * It fetch it's inner value with the pattern founded and then return it's last index.
 */
class BasicPattern
{
    /**
     * Create a basic pattern object with a bunch of parameters for full customisation.
     * @param {{name: string, defaultValue: any, isPattern: (i: number, c: char, t: string) => boolean, isPatternEnd: (i: number, c: char, t: string) => boolean, fetch: (i: number, c: char, t: string) => {lastIndex: number, content: any}} pattern 
     */
    constructor(pattern)
    {
        this.name = pattern.name;
        this.defaultValue = pattern.defaultValue;
        this.isPattern = pattern.isPattern;
        this.isPatternEnd = pattern.isPatternEnd;
        this.fetch = pattern.fetch;
        this.stringContent = pattern.stringContent;
    }
    /**
     * Check if we found the pattern.
     * @param {number} i The actual index tested.
     * @param {char} c The actual character tested.
     * @param {string} t The actual text content parsed for special cases.
     * @returns True only if it match the pattern.
     */
    isActualPattern(i, c, t)
    {
        if(this.isPattern !== undefined && this.isPattern !== null)
        {
            return this.isPattern(i, c, t);
        }
        return false;
    }
    /**
     * Check if the pattern ended, used to handle nesting.
     * @param {number} i The actual index tested.
     * @param {char} c The actual character tested.
     * @param {string} t The actual text content parsed for special cases.
     * @returns True only if it match the pattern.
     */
    isEndPattern(i, c, t)
    {
        if(this.isPatternEnd !== undefined && this.isPatternEnd !== null)
        {
            return this.isPatternEnd(i, c, t);
        }
        return false;
    }
    /**
     * Assign the new content matching the desired pattern then return the last index of the pattern.
     * @param {number} i The actual index tested.
     * @param {char} c The actual character tested.
     * @param {string} t The actual text content parsed for special cases.
     * @param {BasicPattern[]} patternSet The actual text content parsed for special cases.
     * @param {string} actualPattern The actual pattern we're testing, used for referencing.
     * @returns An object containing the last index of the pattern and the content to fetch. Content is equal to the default value in case fetch isn't defined.
     */
    fetchContent(i, c, t, patternSet, actualPattern)
    {
        if(this.fetch !== undefined && this.fetch !== null)
        {
            return this.fetch(i, c, t, actualPattern.isPatternEnd, patternSet);
        }
        return {
            lastIndex: i,
            content: this.defaultValue
        };
    }
}
 /**
 * Shorthand static class for special string functions.
 */
class Txt
{
    /**
     * A shorthand function to extract a certain number of character from a string. 
     * @param {string} content The string where we want to extract content from.
     * @param {number} index The index from which we start.
     * @param {number} nbrLetters The number of letters to extract.
     * @returns Return a string of nbrLetters characters if there is that many from a starting point.
     */
    static extract(content, index, nbrLetters)
    {
    let result = '';
    for(let i = index; i < content.length; i++)
    {
        if(i >= index + nbrLetters)
        {
            return result;
        }
        result = `${result}${content[i]}`;
    }
    return result;
}
}
const PATTERNS = [
    new BasicPattern({
        name: 'Placeholder',
        defaultValue: '',
        isPattern: (i, c, txt) => { return PLACEHOLDERS.includes(c); },
        fetch: (index, c, txt) => {
            console.log(c);
            return {
                content: c,
                lastIndex: index
            };
        }
    }),
    new BasicPattern({
        name: 'Parenthesis',
        defaultValue: '()',
        isPattern: (i, c, txt) => { return c === '('; },
        isPatternEnd: (i, c, txt) => { return c === ')'; },
        fetch: (index, c, txt, endPattern, patternSet) => {
            const p = LookForPattern(txt, patternSet, index + 1, endPattern); // Let's look for nested pattern over here..
            // We could filter patternSet if we wanted to get rid of some functions for this case or use whatever we want anyway.
            if(p.isPatternEnd) // It's the end of our pattern
            {
                return {
                    content: p.result,
                    lastIndex: p.lastIndex
                }; // Return what we got
            }
            else // Something went wrong with brackets (user input) since it was never closed.
            {
                return {
                    content: '(',
                    lastIndex: index
                };
            }
        }
    }),
    new BasicPattern({
        name: 'Word',
        defaultValue: '',
        isPattern: (i, c, txt) => { return LETTERS.includes(c); },
        fetch: (index, c, txt) => {
            let result = {
                content: '',
                lastIndex: index
            };
            for(let i = index; i < txt.length; i++)
            {
                if(!LETTERS.includes(txt[i])) // Not a letter?
                {
                    result.lastIndex = i - 1; // Since this index is something we shouldn't bother with, let him tested by something else
                    break;
                }
                result.lastIndex = i; // Assign the last index
                result.content = `${result.content}${txt[i]}`;
            }
            console.log(result.content);
            return result;
        }
    }),
    new BasicPattern({
        name: 'Number',
        defaultValue: 0,
        isPattern: (i, c, txt) => {
            let isDecimal = c === '.' && DIGITS.includes(Txt.extract(txt, i + 1, 1));
            return DIGITS.includes(c) || isDecimal;
        },
        fetch: (index, c, txt) => {
            let result = {
                content: '',
                lastIndex: index
            };
            let alreadyDecimal = false;
            for(let i = index; i < txt.length; i++)
            {
                if(!DIGITS.includes(txt[i])) // Not a digit?
                {
                    if(!alreadyDecimal && txt[i] === '.') // It's decimal number
                    {
                        alreadyDecimal = true; // We defined it as decimal to skip problems in case of multiple decimal marks
                        if(result.content.length == 0) // .5 as example
                        {
                            result.content = '0.'; // 0.5 now
                        }
                        else
                        {
                            result.content = `${result.content}.`; // xxx.yyy
                        }
                        result.lastIndex = i; // Assign the last index
                        continue;
                    }
                    result.lastIndex = i - 1; // Since this index is something we shouldn't bother with, let him tested by something else
                    break;
                }
                result.lastIndex = i; // Assign the last index
                result.content = `${result.content}${txt[i]}`;
            }
            result.content = Number(`${result.content} `);
            return result;
        }
    }),
    new BasicPattern({
        name: 'Number',
        defaultValue: '',
        isPattern: (i, c, txt) => { return CONSTANTS.includes(c); },
        fetch: (index, c, txt) => {
            let r;
            switch(c)
            {
                case 'e':
                    r = 2.71828182846;
                    break;
                case 'π':
                    r = 3.14159265359;
                    break;
                default:
                    r = c;
                    break;
            }
            return {
                content: r,
                lastIndex: index
            };
        }
    }),
    new BasicPattern({
        name: 'Punctuation',
        defaultValue: '',
        isPattern: (i, c, txt) => { return DOTS.includes(c); },
        fetch: (index, c, txt) => {
            return {
                content: c,
                lastIndex: index
            };
        }
    }),
    new BasicPattern({
        name: 'Operator',
        defaultValue: '',
        isPattern: (i, c, txt) => { return OPERATORS.includes(c); },
        fetch: (index, c, txt) => {
            return {
                content: c,
                lastIndex: index
            };
        }
    }),
    new BasicPattern({
        name: 'Whitespace',
        defaultValue: '',
        isPattern: (i, c, txt) => { return SPACES.includes(c); },
        fetch: (index, c, txt) => {
            return {
                content: c,
                lastIndex: index
            };
        }
    })
];
/**
 * A function made to look for specific pattern
 * @param {string} txtContent The string we're currently parsing.
 * @param {BasicPattern[]} patternSet A list of different pattern to compute.
 * @param {number} i The index with default value to 0. Can be modified for nested searching.
 * @param {(index: number, c: char, text: string) => boolean} endPattern A function to check if a pattern ended.
 * @return {{isPatternEnd: boolean, result: [name:string, content:any], lastIndex: number}} Return an object representing the value parsed.
 */
function LookForPattern(txtContent, patternSet, i = 0, endPattern = (i, c, t) => { return false; })
{
    let subdivided = []; // A result called subdivided since it's the input subdivided in multiple pieces.
    
    for(; i < txtContent.length; i++) // Let's navigate the input
    {
        if(endPattern(i, txtContent[i], txtContent)) // We're in a nested pattern that just ended
        {
            return { // We're gonna return that we're inside an ended pattern, the result and the last index visited
                isPatternEnd: true,
                result: subdivided,
                lastIndex: i
            };
        }
        for(let j = 0; j < patternSet.length; j++) // Let's check all the possible patterns
        {
            if(patternSet[j].isActualPattern(i, txtContent[i], txtContent)) // It's the pattern, let's execute something
            {
                let fetchResult = patternSet[j].fetchContent(i, txtContent[i], txtContent, patternSet, patternSet[j]); // Execute something then return the fetched result
                i = fetchResult.lastIndex; // Assign the new index
                console.log(fetchResult.content)
                subdivided.push([patternSet[j].name, fetchResult.content]); // Insert an array of 2 elements (name and content) of the tested pattern inside our subdivided variable.
                break; // No need to check more pattern, we've got one already
            }
        }
    }
    console.log(subdivided)
    return { // We've done it 'till the end, no pattern ended over here
        isPatternEnd: false,
        result: subdivided,
        lastIndex: i - 1
    };
}

Start();
function Start()
{
    for(let k of calculatorKeys)
    {
        if(keySections[k.type])
        {
            keySections[k.type].push(k);
        }
        else
        {
            keySections[k.type] = [k];
        }
    }
    let mainTag = document.querySelector('main');
    
    let displaySec = document.createElement('section');
        displaySec.classList.add(`calculator_displayResult`);
            let formulaWrite = document.createElement('textarea');
                formulaWrite.classList.add(`calculator_displayResult_write`);
                formulaWrite.setAttribute('rows', 1);
                formulaWrite.setAttribute('spellcheck', false);
                formulaWrite.innerHTML = '0';
        displaySec.appendChild(formulaWrite);
            let formulaResult = document.createElement('p');
                formulaResult.innerHTML = '0';
                formulaResult.classList.add(`calculator_displayResult_result`);
        displaySec.appendChild(formulaResult);
    
    let keySec = document.createElement('section');
        keySec.classList.add(`calculator_btnContainer`);
    for(let keySection in keySections)
    {
        let k = keySections[keySection];
        let keyDiv = document.createElement('div');
        keyDiv.classList.add(`calculator_${keySection}_btnContainer`);
        CalculatorKeyGen.constructKeyButtons(keyDiv, k);
        keySec.appendChild(keyDiv);
    }
    mainTag.appendChild(displaySec);
    mainTag.appendChild(keySec);
}
function pushNewKeys(e)
{
    let userInput = document.querySelector('.calculator_displayResult_write');
    switch(e)
    {
        case '\\New':
            userInput.value = '0';
            break;
        case '\\RemovePrevious':
            if(userInput.value.length == 1)
            {
                userInput.value = '0';
            }
            else
            {
                userInput.value = userInput.value.slice(0, -1);
            }
            break;
        case '\\Reset':
            userInput.value = '0';
            break;
        default:
            if(userInput.value.length == 1 && userInput.value === '0')
            {
                if(e === '.' || e === '°')
                {
                    userInput.value = `${userInput.value}${e}`;
                }
                else
                {
                    userInput.value = e;
                }
            }
            else
            {
                userInput.value = `${userInput.value}${e}`;
            }
            break;
    }
}

let computeBtn = document.getElementById('equal');
computeBtn.addEventListener('click', () => {
    computeResult();
});

function computeResult()
{
    // Load placeholders and filter whitespace
    const subResultFilter = (elements) => {
        let subRes = [];
        for(let i = 0; i < elements.length; i++)
        {
            let element = elements[i];
            let elementName = element[0];
            let elementValue = element[1];
            switch(elementName)
            {
                case 'Placeholder':
                    if(elementValue === '°')
                    {
                        subRes.push(['Operator', '*']);
                        subRes.push(['Number', 0.0174532925199]);
                    }
                    break;
                case 'Parenthesis':
                    elementValue = subResultFilter(elementValue);
                    subRes.push([elementName, elementValue]);
                    break;
                case 'Whitespace':
                    break;
                default:
                    subRes.push(element);
                    break;
            }
        }
        return subRes;
    };
    // Merge functions
    const functionMerger = (elements) => {
        let subRes = [];
        for(let i = 0; i < elements.length; i++)
        {
            let element = elements[i];
            let elementName = element[0];
            let elementValue = element[1];
            switch(elementName)
            {
                case 'Word':
                    if(i + 1 < elements.length) // There's a next element
                    {
                        if(elements[i + 1][0] === 'Parenthesis')
                        {
                            let merge = functionMerger(elements[i + 1][1]);
                            console.log(merge)
                            subRes.push(['Function', merge, elementValue]);
                            i++;
                        }
                    }
                    break;
                default:
                    subRes.push(element);
                    break;
            }
        }
        return subRes;
    };
    const computeOperators = (items, priority = 2) => {
        const prioritySymbol = {
            '%': 2,
            '*': 2,
            '/': 2,
            '+': 1,
            '-': 1
        };
        let elements = [...items];
        console.log(`Priority: ${priority}`);
        console.log(elements);
        if(priority < 1)
        {
            return elements;
        }
        for(let i = 0; i < elements.length; i++)
        {
            console.log(elements[i])
            switch(elements[i][0])
            {
                case 'Number':
                    if(Number.isNaN(elements[i][1]))
                    {
                        elements[i].splice(i, 1);
                        i--;
                    }
                    break;
                case 'Parenthesis':
                    console.log(`Before parenthesis: ${i}`);
                    console.log(elements)
                    let result = computeOperators(elements[i][1]);
                    if(result.length == 1)
                    {
                        elements[i][0] = result[0][0];
                        elements[i][1] = result[0][1];
                        elements[i].splice(2, 1);
                        i -= 3;
                    }
                    else
                    {
                        elements[i][1] = result;
                    }
                    break;
                case 'Function':
                    console.log(`Before function: ${i}`);
                    console.log(elements)
                    let argumentsResult = computeOperators(elements[i][1]);
                    const funcArg = {
                        'cos': (element) => {
                            return Math.cos(element[0][1]);
                        },
                        'sin': (element) => {
                            return Math.sin(element[0][1]);
                        },
                        'tan': (element) => {
                            return Math.tan(element[0][1]);
                        },
                        'acos': (element) => {
                            return Math.acos(element[0][1]);
                        },
                        'asin': (element) => {
                            return Math.asin(element[0][1]);
                        },
                        'atan': (element) => {
                            return Math.atan(element[0][1]);
                        },
                        'exp': (element) => {
                            return Math.exp(element[0][1]);
                        },
                        'sqrt': (element) => {
                            return Math.sqrt(element[0][1]);
                        },
                        'square': (element) => {
                            return element[0][1] * element[0][1];
                        },
                        'ln': (element) => {
                            return Math.log(element[0][1]);
                        },
                        'log': (element) => {
                            return Math.log(element[0][1], element[2][1]);
                        },
                        'pow': (element) => {
                            return Math.pow(element[0][1], element[2][1]);
                        },
                        'root': (element) => {
                            return Math.pow(1 / element[2][1], element[0][1]);
                        }
                    };
                    console.log('Arg result')
                    console.log(argumentsResult)
                    switch(argumentsResult.length)
                    {
                        case 3:
                            elements[i][0] = 'Number';
                            elements[i][1] = funcArg[elements[i][2]](argumentsResult);
                            elements[i].splice(2, 1);
                            console.log(elements)
                            i -= 3;
                            break;
                        default:
                            elements[i][0] = 'Number';
                            elements[i][1] = funcArg[elements[i][2]](argumentsResult);
                            elements[i].splice(2, 1);
                            console.log(elements)
                            i -= 3;
                            break;
                    }
                    break;
                case 'Operator':
                    if(prioritySymbol[elements[i][1]] < priority)
                    {
                        continue;
                    }
                    console.log(`Before operator: ${i}`);
                    console.log(elements)
                    switch(elements[i][1])
                    {
                        case '%':
                            if(i - 1 >= 0 && i + 1 < elements.length)
                            {
                                if(elements[i - 1][0] === 'Number' && elements[i + 1][0] === 'Number')
                                {
                                    elements[i - 1][1] = Number(`${elements[i - 1][1]}`) % Number(`${elements[i + 1][1]}`);
                                    elements.splice(i, 2);
                                    i -= 3;
                                }
                            }
                            break;
                        case '+':
                            // First is +?
                            if(i == 0 && i + 1 < elements.length && elements[1][0] === 'Number')
                            {
                                elements.splice(0, 1);
                                i--;
                            }
                            else if(i - 1 >= 0 && i + 1 < elements.length)
                            {
                                if(elements[i - 1][0] === 'Number' && elements[i + 1][0] === 'Number')
                                {
                                    elements[i - 1][1] = Number(`${elements[i - 1][1]}`) + Number(`${elements[i + 1][1]}`);
                                    elements.splice(i, 2);
                                    i -= 3;
                                }
                            }
                            break;
                        case '-':
                            // First is -?
                            if(i == 0 && i + 1 < elements.length)
                            {
                                if(elements[1][0] === 'Number') // Next is Number
                                {
                                    elements[1][0] = -elements[1][0];
                                    elements.splice(0, 1);
                                    i--;
                                }
                            }
                            else if(i - 1 >= 0 && i + 1 < elements.length)
                            {
                                if(elements[i - 1][0] === 'Number' && elements[i + 1][0] === 'Number')
                                {
                                    elements[i - 1][1] = Number(`${elements[i - 1][1]}`) - Number(`${elements[i + 1][1]}`);
                                    elements.splice(i, 2);
                                    i -= 3;
                                }
                            }
                            break;
                        case '*':
                            if(i - 1 >= 0 && i + 1 < elements.length)
                            {
                                if(elements[i - 1][0] === 'Number' && elements[i + 1][0] === 'Number')
                                {
                                    elements[i - 1][1] = Number(`${elements[i - 1][1]}`) * Number(`${elements[i + 1][1]}`);
                                    elements.splice(i, 2);
                                    i -= 3;
                                }
                            }
                            break;
                        case '/':
                            if(i - 1 >= 0 && i + 1 < elements.length)
                            {
                                if(elements[i - 1][0] === 'Number' && elements[i + 1][0] === 'Number')
                                {
                                    elements[i - 1][1] = Number(`${elements[i - 1][1]}`) / Number(`${elements[i + 1][1]}`);
                                    elements.splice(i, 2);
                                    i -= 3;
                                }
                            }
                            break;
                    }
                    break;
            }
        }
        return [...computeOperators(elements, priority - 1)];
    };
    let input = document.querySelector('.calculator_displayResult_write');
    console.log(input.value);
    let subElements = LookForPattern(input.value, PATTERNS);
    console.log(subElements.result);
    let filteredElements = subResultFilter(subElements.result);
    let mergedFunctionsElements = functionMerger(filteredElements);
    console.log(mergedFunctionsElements);
    console.log(computeOperators(mergedFunctionsElements)[0][1]);
}