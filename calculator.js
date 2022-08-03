const controls = [ '\n', '\t' ];
const whitespaces = [' ', '\t' ];
const symbols = [ '§', '!', '@', '¥', '€', '¬', '&', '|', '#', '^', '*', '$', '%', '±', '=', '+', '-', '*', '/', '\\', '<', '>', '~', '°', '_', '`', '´', '¨', '(', ')', '[', ']', '{', '}' ];
const punctuations = [ '.', ',', ';', ':', '?', '"', '\'', '«', '»' ];
const letters = [   'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
                    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
                    'á', 'à', 'ä', 'â',
                    'é', 'è', 'ë', 'ê',
                    'í', 'ì', 'ï', 'î',
                    'ó', 'ò', 'ö', 'ô',
                    'ú', 'ù', 'ü', 'û',
                    'Ç', 'ç'
];
const digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
const keySections = {};

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
                 subdivided.push([patternSet[j].name, fetchResult.content]); // Insert an array of 2 elements (name and content) of the tested pattern inside our subdivided variable.
                 break; // No need to check more pattern, we've got one already
             }
         }
     }
     return { // We've done it 'till the end, no pattern ended over here
         isPatternEnd: false,
         result: subdivided,
         lastIndex: i - 1
     };
 }
 
 /*
     PATTERNS
 */
 const numbersBasicPattern = new BasicPattern({
     name: 'Number',
     defaultValue: 0,
     isPattern: (i, c, txt) => {
         let isDecimal = c === '.' && digits.includes(Txt.extract(txt, i + 1, 1));
         return digits.includes(c) || isDecimal;
     },
     fetch: (index, c, txt) => {
         let result = {
             content: '',
             lastIndex: index
         };
         let alreadyDecimal = false;
         for(let i = index; i < txt.length; i++)
         {
             if(!digits.includes(txt[i])) // Not a digit?
             {
                 if(!alreadyDecimal && txt[i] === '.') // It's decimal number
                 {
                     alreadyDecimal = true; // We defined it as decimal to skip problems in case of multiple decimal marks
                     if(result.content.length == 0) // .5 as example
                     {
                         result.content = `0.`; // 0.5 now
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
         result.content = Number(result.content); // Type hack
         return result;
     }
 });
 const wordsBasicPattern = new BasicPattern({
     name: 'Word',
     defaultValue: '',
     isPattern: (i, c, txt) => { return letters.includes(c); },
     fetch: (index, c, txt) => {
         let result = {
             content: '',
             lastIndex: index
         };
         for(let i = index; i < txt.length; i++)
         {
             if(!letters.includes(txt[i])) // Not a letter?
             {
                 result.lastIndex = i - 1; // Since this index is something we shouldn't bother with, let him tested by something else
                 break;
             }
             result.lastIndex = i; // Assign the last index
             result.content = `${result.content}${txt[i]}`;
         }
         return result;
     }
 });
 const punctuationsBasicPattern = new BasicPattern({
     name: 'Punctuation',
     defaultValue: '',
     isPattern: (i, c, txt) => { return punctuations.includes(c); },
     fetch: (index, c, txt) => {
         return {
             content: c,
             lastIndex: index
         };
     }
 });
 const symbolsBasicPattern = new BasicPattern({
     name: 'Symbol',
     defaultValue: '',
     isPattern: (i, c, txt) => { return symbols.includes(c); },
     fetch: (index, c, txt) => {
         return {
             content: c,
             lastIndex: index
         };
     }
 });
 const whitespacesBasicPattern = new BasicPattern({
     name: 'Whitespace',
     defaultValue: '',
     isPattern: (i, c, txt) => { return whitespaces.includes(c); },
     fetch: (index, c, txt) => {
         return {
             content: c,
             lastIndex: index
         };
     }
 });
 const controlsBasicPattern = new BasicPattern({
     name: 'Controls',
     defaultValue: '',
     isPattern: (i, c, txt) => { return controls.includes(c); },
     fetch: (index, c, txt) => {
         return {
             content: c,
             lastIndex: index
         };
     }
 });
 const blockNestedPatterns = new BasicPattern({
     name: 'Brackets',
     defaultValue: '()',
     isPattern: (i, c, txt) => { return c === '('; },
     isPatternEnd: (i, c, txt) => { return c === ')'; },
     fetch: (index, c, txt, endPattern, patternSet) => {
         let p = LookForPattern(txt, patternSet, index + 1, endPattern); // Let's look for nested pattern over here..
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
                 content: '',
                 lastIndex: index
             };
         }
     }
 });
 
 
 /*
     OPERATORS
 */
 const operators = {
     '+': {
         name: '+',
         priority: 3,
         exec: (a, b) => { return a + b; }
     },
     '-': {
         name: '-',
         priority: 3,
         exec: (a, b) => { return a - b; }
     },
     '*': {
         name: '*',
         priority: 2,
         exec: (a, b) => { return a * b; }
     },
     '/': {
         name: '/',
         priority: 2,
         exec: (a, b) => { return a / b; }
     },
     '%': {
         name: '%',
         priority: 2,
         exec: (a, b) => { return a % b; }
     },
     '^': {
         name: '^',
         priority: 1,
         exec: (a, b) => { return Math.pow(a, b); }
     },
     '!': {
         name: '!',
         priority: 0,
         isRightApplied: true,
         exec: (n) => { return gamma(n + 1); }
     }
 };
 
 
 /*
     FUNCTIONS
 */
 const preFunc = {
     'cos': {
         nbrArg: 1,
         exec: (e) => {
             return Math.cos(e);
         }
     },
     'sin': {
         nbrArg: 1,
         exec: (e) => {
             return Math.sin(e);
         }
     },
     'tan': {
         nbrArg: 1,
         exec: (e) => {
             return Math.tan(e);
         }
     },
     'cosh': {
         nbrArg: 1,
         exec: (e) => {
             return Math.cosh(e);
         }
     },
     'sinh': {
         nbrArg: 1,
         exec: (e) => {
             return Math.sinh(e);
         }
     },
     'tanh': {
         nbrArg: 1,
         exec: (e) => {
             return Math.tanh(e);
         }
     },
     'acos': {
         nbrArg: 1,
         exec: (e) => {
             return Math.acos(e);
         }
     },
     'asin': {
         nbrArg: 1,
         exec: (e) => {
             return Math.asin(e);
         }
     },
     'atan': {
         nbrArg: 1,
         exec: (e) => {
             return Math.atan(e);
         }
     },
     'atann': {
         nbrArg: 2,
         exec: (y, x) => {
             return Math.atan2(y, x);
         }
     },
     'arcosh': {
         nbrArg: 1,
         exec: (e) => {
             return Math.acosh(e);
         }
     },
     'arsinh': {
         nbrArg: 1,
         exec: (e) => {
             return Math.asinh(e);
         }
     },
     'artanh': {
         nbrArg: 1,
         exec: (e) => {
             return Math.atanh(e);
         }
     },
     'min': {
         nbrArg: 2,
         unlockLimit: true,
         exec: (...a) => {
             return Math.min(...a);
         }
     },
     'max': {
         nbrArg: 2,
         unlockLimit: true,
         exec: (...a) => {
             return Math.max(...a);
         }
     },
     'avg': {
         nbrArg: 2,
         unlockLimit: true,
         exec: (...a) => {
             let r = 0;
             for(let n of a)
             {
                 r += n;
             }
             return r / a.length;
         }
     },
     'avgAD': {
         nbrArg: 2,
         unlockLimit: true,
         exec: (m, ...a) => {
             let r = 0;
             for(let n of a)
             {
                 r += Math.abs(n - m);
             }
             return r / a.length;
         }
     },
     'midway': {
         nbrArg: 2,
         unlockLimit: true,
         exec: (...a) => {
             let min = Math.min(...a);
             let max = Math.max(...a);
             for(let n of a)
             {
                 min = Math.min(min, n);
                 max = Math.max(max, n);
             }
             return (max - min) / 2 + min;
         }
     },
     'median': {
         nbrArg: 2,
         unlockLimit: true,
         exec: (...a) => {
             a.sort(function(a, b) {
                 return a - b;
             });
             return a.length % 2 == 1 ? a[(a.length + 1) / 2] : (a[a.length / 2] + a[(a.length /2) + 1]) / 2;
         }
     },
     'abs': {
         nbrArg: 1,
         exec: (e) => {
             return Math.abs(e);
         }
     },
     'ceil': {
         nbrArg: 1,
         exec: (e) => {
             return Math.ceil(e);
         }
     },
     'lerp': {
         nbrArg: 3,
         exec: (a, b, t) => {
             return a + (b - a) * t;
         }
     },
     'floor': {
         nbrArg: 1,
         exec: (e) => {
             return Math.floor(e);
         }
     },
     'round': {
         nbrArg: 1,
         exec: (e) => {
             return Math.round(e);
         }
     },
     'square': {
         nbrArg: 1,
         exec: (e) => {
             return e * e;
         }
     },
     'sqrt': {
         nbrArg: 1,
         exec: (e) => {
             return Math.sqrt(e);
         }
     },
     'root': {
         nbrArg: 2,
         exec: (x, n) => {
             return Math.pow(x, 1 / n);
         }
     },
     'pow': {
         nbrArg: 2,
         exec: (x, n) => {
             return Math.pow(x, n);
         }
     },
     'exp': {
         nbrArg: 1,
         exec: (x) => {
             return Math.exp(x, n);
         }
     },
     'ln': {
         nbrArg: 1,
         exec: (x) => {
             return Math.log(x);
         }
     },
     'log': {
         nbrArg: 1,
         exec: (...x) => {
             if(x.length == 1)
             {
                 return Math.log(x[0]);
             }
             else
             {
                 return Math.log(b[1]) / Math.log(x[0]);
             }
         }
     },
     'factorial': {
         nbrArg: 1,
         exec: (x) => {
             return gamma(x + 1);
         }
     },
     'gamma': {
         nbrArg: 1,
         exec: (x) => {
             return gamma(x);
         }
     },
     'lambertW': {
         nbrArg: 1,
         exec: (x) => {
             return lambertW(x);
         }
     },
     'ilog': {
         nbrArg: 2,
         exec: (x, b) => {
             return iLog(x, b);
         }
     },
     'random': {
         nbrArg: 2,
         exec: (a, b) => {
             return Math.random() * (b - a) + a;
         }
     }
 };
 
 
 /*
     A list of all the pattern, just to make things simpler
 */
 const AllBasicPatterns = [
     blockNestedPatterns,
     numbersBasicPattern,
     wordsBasicPattern,
     punctuationsBasicPattern,
     symbolsBasicPattern,
     whitespacesBasicPattern,
     controlsBasicPattern
 ];
 
 const remakeNodes = (nodes) => {
     let result = [];
     for(let i = 0; i < nodes.length; i++)
     {
         let node = nodes[i];
         if(typeof node[1] === 'object') // This node is a sub element (an array if nothing goes wrong)
         {
             result.push({
                 name: node[0],
                 content: remakeNodes(node[1])
             });
         }
         else // It's a string, ez pz let's write it with some spacing
         {
             switch(node[0])
             {
                 case 'Whitespace':
                     break;
                 case 'Word':
                     if(preFunc[node[1]]) // Is a function
                     {
                         if(i + 1 < nodes.length)
                         {
                             let nextNode = nodes[i + 1];
                             if(nextNode[0] === 'Brackets')
                             {
                                 result.push({
                                     name: 'Function',
                                     funcName: node[1],
                                     content: remakeNodes(nextNode[1])
                                 });
                                 i++;
                             }
                             else
                             {
                                 /*
                                 result.push({ // Probably usefull
                                     name: node[0],
                                     content: node[1]
                                 });*/
                             }
                         }
                     }
                     else
                     {
                         switch(node[1])
                         {
                             case 'ϕ':
                             case 'golden':
                                 result.push({
                                     name: 'Number',
                                     content: 1.618033988749
                                 });
                                 break;
                             case 'eulermascheroni':
                                 result.push({
                                     name: 'Number',
                                     content: 0.57721566490153286060651209008240243104215933593992
                                 });
                                 break;
                             case 'apery':
                                 result.push({
                                     name: 'Number',
                                     content: 1.202056903159594285399738161511449990764986292
                                 });
                                 break;
                             case 'e':
                                 result.push({
                                     name: 'Number',
                                     content: 2.7182818284590452353602874713527
                                 });
                                 break;
                             case 'π':
                             case 'pi':
                                 result.push({
                                     name: 'Number',
                                     content: 3.1415926535897932384626433832795
                                 });
                                 break;
                             case 'rad':
                                 result.push({
                                     name: 'Symbol',
                                     content: '*'
                                 });
                                 result.push({
                                     name: 'Number',
                                     content: (180 / 3.1415926535897932384626433832795)
                                 });
                                 break;
                         }
                         // Garbage, discarding in progress..
                     }
                     break;
                 case 'Symbol':
                     if(node[1] === '°')
                     {
                         result.push({
                             name: 'Symbol',
                             content: '*'
                         });
                         result.push({
                             name: 'Number',
                             content: 0.01745329251994329576923690768489
                         });
                     }
                     else
                     {
                         result.push({
                             name: node[0],
                             content: node[1]
                         });
                     }
                     break;
                 default:
                     result.push({
                         name: node[0],
                         content: node[1]
                     });
                     break;
             }
         }
     }
     return result;
 };
 const computeResult = (nodes, priority = 0) => {
     if(priority > 3)
     {
         return nodes;
     }
     for(let i = 0; i < nodes.length; i++)
     {
         if(i < 0)
         {
             i = 0;
         }
         let node = nodes[i];
         let result;
         switch(node.name)
         {
             case 'Function':
                 let f = preFunc[node.funcName];
                 result = computeResult(node.content);
                 let prepareArgs = [];
                 // If either the limit's unlock and the length of result is greater or equal to the number of arguments
                 // or the result is at a correct length for the number of arguments
                 if((f.unlockLimit && (result.length >= 2 * f.nbrArg - 1)) || result.length == 2 * f.nbrArg - 1)
                 {
                     for(let node of result)
                     {
                         if(node.name === 'Punctuation')
                         {
                             continue;
                         }
                         prepareArgs.push(node.content);
                     }
                     nodes[i].name = 'Number';
                     nodes[i].content = f.exec(...prepareArgs);
                     i -= 2;
                 }
                 break;
             case 'Brackets':
                 result = computeResult(node.content);
                 nodes[i] = result[0];
                 i -= 2;
                 break;
         }
         if(i - 1 >= 0) // Previous exist
         {
             let prevNode = nodes[i - 1];
             if(node.name === 'Symbol' && operators[node.content] && operators[node.content].isRightApplied)
             {
                 // If it's the same priority as the current one AND if left operands is numbers
                 if(prevNode.name === 'Number' && operators[node.content].priority == priority)
                 {
                     nodes[i - 1].content = operators[node.content].exec(prevNode.content);
                     nodes.splice(i, 1);
                     i--;
                 }
             }
             if(i + 1 < nodes.length) // Element between 2 other
             {
                 let nextNode = nodes[i + 1];
                 if(node.name === 'Symbol' && operators[node.content]) // If it's an existing operator
                 {
                     // If it's the same priority as the current one AND if both operands are numbers
                     if(operators[node.content].priority == priority && (prevNode.name === 'Number' && nextNode.name === 'Number'))
                     {
                         nodes[i - 1].content = operators[node.content].exec(prevNode.content, nextNode.content);
                         nodes.splice(i, 2);
                         i--;
                     }
                 }
             }
         }
         else if(i == 0 && i + 1 < nodes.length) // First element
         {
             let nextNode = nodes[i + 1];
             if(node.name === 'Symbol')
             {
                 switch(node.content)
                 {
                     case '-':
                         if(nextNode.name === 'Number')
                         {
                             nodes[i + 1].content = -nodes[i + 1].content;
                         }
                     case '+':
                         nodes.splice(0, 1);
                         i--;
                         break;
                 }
             }
         }
     }
     return computeResult(nodes, priority + 1);
 }

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
        name: 'golden',
        type: 'control',
        content: 'φ',
        value: 'φ'
    },
    {
        name: 'eulermascheroni',
        type: 'control',
        content: 'Euler-Mascheroni',
        value: 'eulermascheroni'
    },
    {
        name: 'apery',
        type: 'control',
        content: 'Apery',
        value: 'apery'
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
        name: 'sinh',
        type: 'function',
        content: 'sinh(θ)',
        value: 'sinh('
    },
    {
        name: 'cosh',
        type: 'function',
        content: 'cosh(θ)',
        value: 'cosh('
    },
    {
        name: 'tanh',
        type: 'function',
        content: 'tanh(θ)',
        value: 'tanh('
    },
    {
        name: 'arcsin',
        type: 'function',
        content: 'arcsin(x)',
        value: 'asin('
    },
    {
        name: 'arccos',
        type: 'function',
        content: 'arccos(x)',
        value: 'acos('
    },
    {
        name: 'arctan',
        type: 'function',
        content: 'arctan(x)',
        value: 'atan('
    },
    {
        name: 'arsinh',
        type: 'function',
        content: 'arsinh(x)',
        value: 'arsinh('
    },
    {
        name: 'arcosh',
        type: 'function',
        content: 'arcosh(x)',
        value: 'arcosh('
    },
    {
        name: 'artanh',
        type: 'function',
        content: 'artanh(x)',
        value: 'artanh('
    },
    {
        name: 'avg',
        type: 'function',
        content: 'avg(...x)',
        value: 'avg('
    },
    {
        name: 'avgAD',
        type: 'function',
        content: 'avgAD(m, ...x)',
        value: 'avgAD('
    },
    {
        name: 'median',
        type: 'function',
        content: 'median(...x)',
        value: 'median('
    },
    {
        name: 'ln',
        type: 'function',
        content: 'ln(x)',
        value: 'ln('
    },
    {
        name: 'log',
        type: 'function',
        content: 'logₐ(x)',
        value: 'log('
    },
    {
        name: 'modulo',
        type: 'function',
        content: 'a mod b',
        value: '%'
    },
    {
        name: 'root',
        type: 'function',
        content: 'ⁿ√x',
        value: 'root('
    },
    {
        name: 'square',
        type: 'function',
        content: 'x²',
        value: 'square('
    },
    {
        name: 'midway',
        type: 'function',
        content: 'midway(...x)',
        value: 'midway('
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
        content: 'xⁿ',
        value: 'pow('
    },
    {
        name: 'sqrt',
        type: 'function',
        content: '√x',
        value: 'sqrt('
    },
    {
        name: 'lambertW',
        type: 'function',
        content: 'W(x)',
        value: 'lambertW('
    },
    {
        name: 'ilog',
        type: 'function',
        content: 'ilog(x, b)',
        value: 'ilog('
    },
    {
        name: 'gamma',
        type: 'function',
        content: 'Γ(x)',
        value: 'gamma('
    },
    {
        name: 'abs',
        type: 'function',
        content: '|x|',
        value: 'abs('
    },
    {
        name: 'factorial',
        type: 'function',
        content: 'x!',
        value: 'factorial('
    },
    {
        name: 'random',
        type: 'function',
        content: 'random(min, max)',
        value: 'random('
    },
    {
        name: 'floor',
        type: 'function',
        content: '⎿x⏌',
        value: 'floor('
    },
    {
        name: 'ceil',
        type: 'function',
        content: '⎾x⏋',
        value: 'ceil('
    },
    {
        name: 'round',
        type: 'function',
        content: '⎾x⏌',
        value: 'round('
    },
    {
        name: 'deg',
        type: 'digit',
        content: '°',
        value: '°'
    },
    {
        name: 'rad',
        type: 'digit',
        content: 'rad',
        value: 'rad'
    },
    {
        name: 'factorial',
        type: 'digit',
        content: '!',
        value: '!'
    },
    {
        name: 'coma',
        type: 'digit',
        content: ',',
        value: ','
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
        content: '.',
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
let userInput = document.querySelector('.calculator_displayResult_write');
computeBtn.addEventListener('click', () => {
    computeInput();
});
userInput.addEventListener('keydown', function(e){
    // Enter was pressed without shift key
    if (e.keyCode == 13 && !e.shiftKey)
    {
        e.preventDefault();
        computeInput();
    }
    });

function computeInput()
{
    let output = document.querySelector('.calculator_displayResult_result');
    let r = null;
    let computingResult = computeResult(remakeNodes(LookForPattern(userInput.value, AllBasicPatterns).result));
    if(computingResult.length > 0)
    {
        r = computingResult[0].content;
    }
    output.innerHTML = `${typeof r === 'number' ? r : 'ERROR.'}`;
}