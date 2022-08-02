const keySections = {};
const calculatorKeys = [
    {
        name: 'new',
        type: 'control',
        content: 'C',
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
        name: 'ln',
        type: 'function',
        content: 'ln(x)',
        value: 'ln('
    },
    {
        name: 'tan2',
        type: 'function',
        content: 'tan2(y, x)',
        value: 'tan2('
    },
    {
        name: 'deg',
        type: 'function',
        content: 'x°',
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
        name: 'modulo',
        type: 'digit',
        content: '%',
        value: '%'
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
        btn.addEventListener('click', () => {
            pushNewKeys(btn.value);
        });
        return btn;
    }
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
                formulaWrite.setAttribute('rows', '1');
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
            break;
        default:
            if(userInput.value.length == 1 && userInput.value === '0')
            {
                if(e === '.')
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