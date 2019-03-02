
// This class contains a single static method that just returns the grammar string.
// This was done because you cannot load a .ohm file using 'ohm.grammarFromScriptElement',
// since for some reason it breaks CORS, even though it's a local file.

class GMLGrammar {
	static getText() {
		return String.raw`

GameMakerLanguage {

	Start
		= CurlyBrackets
		| Code

	CurlyBrackets
		= "{" Code "}"

	Code
		= Statement*

	Statement
		= Comment
		| MultiComment
		| If
		| While
		| Exit
		| Function
		| AssignmentVar
		| AssignmentGlobalVar
		| Assignment
		| AssignmentAdd
		| AssignmentSubtract
		| AssignmentMultiply
		| AssignmentDivide
		| Semicolon

	Comment
		= "//" #(~eol any)*
	MultiComment
		= "/*" #(~"*/" any)* "*/"

	eol
		= "\n"
		| "\r"

	If
		= "if" Expression (CurlyBrackets|Statement) Else?
	Else
		= "else" (CurlyBrackets|Statement)

	While
		= "while" Expression (CurlyBrackets|Statement)

	Exit
		= "exit"

	Function
		= Name "(" ListOf<Expression,","> ")"

	Name
		= (letter) (alnum | "_")*

	Expression
		= ExpressionBooleanComparison

	ExpressionBooleanComparison
		= And
		| Or
		| Xor
		| ExpressionComparison

	And
		= Expression "&&" ExpressionComparison
	Or
		= Expression "||" ExpressionComparison	
	Xor
		= Expression "^^" ExpressionComparison

	ExpressionComparison
		= Less
		| LessOrEqual
		| Equal
		| Different
		| Greater
		| GreaterOrEqual
		| ExpressionAddOrSubtract

	Less
		= Expression "<" ExpressionAddOrSubtract
	LessOrEqual
		= Expression "<=" ExpressionAddOrSubtract
	Equal
		= Expression equalSymbol ExpressionAddOrSubtract
	equalSymbol
		= "=" "="?
	Different
		= Expression "!=" ExpressionAddOrSubtract
	Greater
		= Expression ">" ExpressionAddOrSubtract
	GreaterOrEqual
		= Expression ">=" ExpressionAddOrSubtract	

	ExpressionAddOrSubtract
		= Add
		| Subtract
		| ExpressionMultiplyOrDivide

	Add
		= Expression "+" ExpressionMultiplyOrDivide
	Subtract
		= Expression? "-" ExpressionMultiplyOrDivide

	ExpressionMultiplyOrDivide
		= Multiply
		| Divide
		| OtherExpression

	Multiply
		= ExpressionMultiplyOrDivide "*" OtherExpression
	Divide
		= ExpressionMultiplyOrDivide "/" OtherExpression

	OtherExpression
		= Parentheses
		| Function
		| Number
		| String
		| Variable

	Parentheses
		= "(" Expression ")"

	Number
		= digit+ "."? digit*

	String
		= "\"" #(~"\"" any)* "\""
		| "'" #(~"'" any)* "'"

	Variable
		= Name

	Assignment
		= Name "=" Expression

	AssignmentAdd
		= Name "+=" Expression
	AssignmentSubtract
		= Name "-=" Expression
	AssignmentMultiply
		= Name "*=" Expression
	AssignmentDivide
		= Name "/=" Expression

	AssignmentVar
		= "var" NonemptyListOf<Name, ",">

	AssignmentGlobalVar
		= "globalvar" NonemptyListOf<Name, ",">

	Semicolon
		= ";"

}

`
	}
}