# Calculator
A calculator that can parse written text to compute the value.
You can test it [here](https://friquetluca.github.io/Calculator-project/).

## Support constants:
- $\varphi$ / golden (Golden ratio)
    > It is an irrational number that is a solution to the quadratic equation x² - x - 1.\
![Golden ratio](assets/img/golden-ratio.png)
- π / pi (Pi)
    > It is a transcendental number that is the ratio of a circle's circumference to its diameter.
![Pi](assets/img/pi-formula.png)
- e (Euler's number)
    > It is a transendental number that is the base of logarithms and is defined as:
![Euler's number](assets/img/euler-number.png)
- eulermascheroni (Euler-Mascheroni)
    > It is defined as the limiting difference between the harmonic series and the natural logarithm:
![Euler-Mascheroni's constant](assets/img/euler-mascheroni.png)
- apery (Apéry's constant)
    > It is defined as the sum of the reciprocals of the positive cubes.\
    ![Apery's constant](assets/img/apery.png)
    
- @
    > Get the value of the previous answer.

## Support operators:
- a + b
    > Sum of a and b.
- a - b
    > Difference of a by b.
- a * b, a b
    > Product of a and b. (can be on function and number, but for number it can be omitted as long as there space between both numbers)
- a / b
    > Divide a by b.
- a % b
    > The remainder of the division of a by b.
- a!
    > The factorial of a.
- a°
    > Convert the angle in degree a to radian.
- a rad
    > Convert the angle in radian a to degree.

## Supported functions

### Classical operations
- abs(x)
    > The absolute value of x.
    - x: value
- floor(x)
    > Greatest integer less than or equal to x.
    - x: value
- ceil(x)
    > Lowest integer greater than or equal to x.
    - x: value
- round(x)
    > Closest integer to x.
    - x: value
- square(x)
    > x squared.
    - x: value
- sqrt(x)
    > Square root of x.
    - x: value
- root(x, n)
    > n-th root of x.
    - x: value
    - n: nth root
- pow(x, n)
    > x raised to the n.
    - x: value
    - n: raised to
- exp(x)
    > Exponential of x.
    - x: value
- ln(x)
    > Natural logarithm of x.
    - x: value
- log(x), log(x, b)
    > Logarithm of x in base b (base e by default if no base is given).
    - x: value
    - b: base
- factorial(x)
    > n!
    - x: value
- gamma(x)
    > The gamma function of x.
    - x: value
- lambertW(x)
    > The LambertW function of x.
    - x: value
- ilog(x, b)
    > The iterated logarithm of x in base b.
    - x: value
    - b: base
- random(a, b)
    > A random value between a and b.
    - a: min value
    - b: max value


### Statistics
- avg(...a)
    > The average of all values.
    - a: values
- avgAD(m, ...a)
    > The average of the absolute deviations from a central point m.
    - m: Measure of central tendency.
    - a: values
- median(...a)
    > The median of all values.
    - a: values
- midway(...a)
    > A value midway between the min and max of all values.
    - a: values

### Trigonometry
- sin(θ)
    - θ: angle in radian
- cos(θ)
    - θ: angle in radian
- tan(θ)
    - θ: angle in radian
- sinh(θ)
    - θ: hyperbolic angle
- cosh(θ)
    - θ: hyperbolic angle
- tanh(θ)
    - θ: hyperbolic angle
- asin(x)
    - x: sin value
- acos(x)
    - x: cos value
- atan(x)
    - x: tan value
- arsinh(x)
    - x: sinh value
- arcosh(x)
    - x: cosh value
- artanh(x)
    - x: tanh value