# :abacus: MW CALC
### Aqui está uma calculadora implementada em JS que promete resolver operações matemáticas de nível intermediário :astonished:. Não chega a ser uma calculadora científica, mas está cima de uma de "padaria" :stuck_out_tongue_winking_eye:.

![Badge](https://img.shields.io/badge/Java%20Script-%B1Calculadora-F27405?style=for-the-badge&logo=javascript)


:checkered_flag: Conteúdo 
-----------------------
- [Sobre](#sobre)
- [Como usar](#como-usar)
    - [Execução](#execução)
    - [Funções](#funções)
    - [Constantes](#constantes)
    - [Operações](#operações)
    - [Agrupadores](#agrupadores)
    - [Exemplos](#exemplos)
- [Funcionalidades](#funcionalidades)
- [Futuro](#futuro)

## Sobre
Este código foi desenvolvido inicialmente como parte avaliativa do curso @Santander Lets Code - Full Stack Develop, mas o interesse pela linguagem e desafios enfrentados para implementação de funcionalidades além do cobrado, fez este desenvolvedor ir "um pouco" além. 

Trata-se de um código em único script, em java script puro e sem uso do temido <code> eval </code>. Só foi utilizado um pouco de café, horas se torturando com alguns detalhes e, quando lembrado, os fundamentos de programção funcional em javascript.

## Como Usar
### Execução
No node, pode-se realizar o comando para execuação do módulo
    
    node calculator
... e tudo estará bem ...


### Funções
Como módulo inicializado, temos em mãos as seguintes funções:

+ **enter**: realiza a entrada de um novo elemento à expressão matemática;
+ **equals**: resolve a expressão matemática;
+ **list**: lista o histórico de operações;
+ **reset**: reiniciar uma operação;
+ **clear**: limpa o histórico de operações.


### Constantes
É possível se utlizar de constantes matemáticas:

| Constante       | Digitalização <br />(case isensitive) | Símbolo   
| ----------------|:-------------------------------:|:------------:
| Pi              | pi                              | &#x03C0;
| Número de Euler | e                               | &#x1D452;


### Operações
Esta calculadora implementa as seguintes operações

| Operação        | Operador   | Descrição                                            | Prioridade   | Tipo    | Posição 
| ----------------|:----------:|------------------------------------------------------|:------------:|:-------:|:---------:
| Soma            | +          | Soma dois números quaisquer.                         | 3            | binária | centro
| Subtração       | -          | Subtrai dois números quaisquer.                      | 3            | binária | centro
| Multiplicação   | *          | Multiplica dois números quaisquer.                   | 2            | binária | centro
| Divisão         | /          | Dividi dois números quaisquer, mas não fazemos divisão por aqui... | 2            | binária | centro
| Potenciação     | ^          | Realiza a potenciação de dois números quaisquer, quando possível ....      | 1            | binária | centro
| Raiz quadrada   | rz         | Calcula a raiz quadrada de um número não negativo.   | 1            | unária  | esquerda
| Raiz cúbica     | rz3        | Calcula a raiz cúbica de um número qualquer.         | 1            | unária  | esquerda
| Quadrado        | ^2         | Calcula o quadrado de um número qualquer.            | 1            | unária  | direita
| Cubo            | ^3         | Calcula o cubo de um número qualquer.                | 1            | unária  | direita
| Inversão        | ^-1        | Calcula o inverso multiplicativo de número não nulo (numerador e denomidaor "trocados"). | 1            | unária  | direita
| Porcentagem     | %          | Realiza a fivião de um número qualquer por 100.      | 1            | unária  | direita
| Fatorial        | !          | Calcula o fatorial de um número inteiro positivo.    | 0            | unária  | direita
| Supressão       |            | É o utilizada quando é suprimido o uso de parênteses.| 1.5          | binária | centro
| Oposição        | -          | Calcula o oposto de um número qualquer ("inverte o sinal").  | 1.5          | unária  | esquerda
| Identidade      | +          | Apenas retorna o próprio operando.                   | 1.5          | unária  | esquerda

A ordem de precedências seguirá das operações com menor ordinalidade em prioridade para as de maior valor, ou seja, do 0 ao 3.

### Agrupadores
Os agrupadores ariméticos implementados são descritos abaixo:

| Agrupamento     | Agrupadores  | Prioridade   
| ----------------|:------------:|:------------:
| Parênteses      | ( e )        | 3            
| Colchetes       | [ e ]        | 2           
| Chaves          | { e }        | 1        

Da mesma forma que em operações, os agrupadores são resolvidos em uma expresão em ordem de prioridade, indo do 1 ao 3.

### Exemplos
Podemos executra uma operação inputando os termos da expressão de acordo com as tabelas de operadores, constantes e agrupadores acima e seguido de um **equals**:

```js
CALCULATOR.enter(2)
CALCULATOR.enter('+')
CALCULATOR.enter(4)
CALCULATOR.equals()
6
```
```js
CALCULATOR.enter(3)
CALCULATOR.enter('!')
CALCULATOR.enter('!')
CALCULATOR.equals()
720
```
Um modo mais cômodo é criando uma função que abstrai as entradas e a saída das operações...
```js
function calculate(...inputs){
    inputs.map(CALCULATOR.enter)
    return CALCULATOR.equals()
}
```
Assim podemos compor operações mais complexas sem muito trabalho manual...
```js
calculate('(', 128, '/', 8, ')', '^', 2, '+', 7, '-', '(', 3, '*', 4, ')', '^', 2)
calculate('[', '(', '(', 128, '/', 8, ')', '^', 2, '+', 7, '-', '(', 3, '*', 4, ')', '^', 2, ')', '+', 1, ']', '/', 4, '!')
calculate(28, '/', '(', 2, '+', 5, ')', 2)
calculate(3, '^', '(', 'rz', '(', 3, '*', 12, ')' , 0.5, ')')
calculate(2, 'rz', 16)
calculate('-', 3, '^', 2)
calculate('(', '-', 3, ')', '^2')
calculate('+', '-', '-', '+', 'pi')

CALCULATOR.list()

[ '(128 ÷ 8)^2 + 7 − (3 × 4)^2 = 119',
  '[((128 ÷ 8)^2 + 7 − (3 × 4)^2) + 1] ÷ 4! = 5',
  '28 ÷ (2 + 5)2 = 2',
  '3^(√(3 × 12)0.5) = 27',
  '2√16 = 8',
  '−3² = -9',
  '(−3)² = 9',
    '+−−+π = 3.141592653589793' ]
```
## Funcionalidades
- [x] Operações básicas (+, &#x2212;, &#x00D7;, &#x00F7;, ^);
- [x] Ordem de precedência;
- [x] Uso de agrupadores ((), [], {});
- [x] Operações à diretia e à esquerda (!, %, &#x221A;, &#x00B2;, &#x00B3;, &#x207B;&#x00B9;);
- [x] Uso de supressão de parênteses;
- [x] Sobreposição de operações ('-' para inversão e '+' para identidade);
- [x] Uso de constantes matemáticas (&#x03C0;, &#x1D452;);
- [ ] Funções matemáticas(módulo, trigonométricas, logaritimos) :collision:;
- [ ] Configurações de medidas de ângulo;
- [ ] Conversão de medidas;
- [ ] Notação de engenharia e científica;
- [ ] Uso de variáveis (x, y);
- [ ] Operação com acumuladores (somatórios).

## Futuro
Pretende-se implementar variações de calculadoras (básica, científica e lógica), mas isso será após eu consegui mais café :coffee::yum:....




