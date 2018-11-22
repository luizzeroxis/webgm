
// This class contains a single static method that just returns the grammar string.
// This was done because you cannot load a .ohm file using 'ohm.grammarFromScriptElement',
// since for some reason it breaks CORS, even though it's a local file.

class GMLGrammar {
	static getText() {
		return String.raw`

GameMakerLanguage {

	Code
		= Statement*

	Statement
		= Comment
		| Function
		| Assignment
		| Semicolon

	Comment
		= "//" #(~eol any)*

	eol
		= "\n"
		| "\r"

	Function
		= Name "(" ListOf<Expression,","> ")"

	Name
		= (alnum) (alnum | "_")*

	Expression
		= Add
		| Subtract
		| ExpressionMultiplyOrDivide

	ExpressionMultiplyOrDivide
		= Multiply
		| Divide
		| OtherExpression

	OtherExpression
		= Parentheses
		| Function
		| Number
		| String
		| Variable

	Parentheses
		= "(" Expression ")"

	Add
		= Expression "+" ExpressionMultiplyOrDivide
	Subtract
		= Expression "-" ExpressionMultiplyOrDivide

	Multiply
		= ExpressionMultiplyOrDivide "*" OtherExpression
	Divide
		= ExpressionMultiplyOrDivide "/" OtherExpression

	Number
		= digit+ "."? digit*

	String
		= "\"" #(~"\"" any)* "\""
		| "'" #(~"'" any)* "'"

	Variable
		= Name

	Assignment
		= Name "=" Expression

	Semicolon
		= ";"

}

`
	}
}