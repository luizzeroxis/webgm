
// This class contains a single static method that just returns the grammar string.
// This was done because you cannot load a .ohm file using 'ohm.grammarFromScriptElement',
// since for some reason it breaks CORS, even though it's a local file.

class GMLGrammar {
	static getText() {
		return String.raw`

GameMakerLanguage {

	Start
		= Block
		| ListOfStatements

	space += comment | multiComment

	comment
		= "//" #(~eol any)*
	multiComment
		= "/*" #(~"*/" any)* "*/"

	eol
		= "\n"
		| "\r"

	Block
		= "{" ListOfStatements "}"

	ListOfStatements
		= Statement*

	Statement
		= StatementNoSemicolon ";"*

	StatementNoSemicolon
		= If
		| While
		| Exit
		| Function
		| VarDeclare
		| GlobalVarDeclare
		| Assignment
		| AssignmentAdd
		| AssignmentSubtract
		| AssignmentMultiply
		| AssignmentDivide

	BlockOrStatement
		= Block
		| Statement

	If
		= "if" Expression BlockOrStatement Else?
	Else
		= "else" BlockOrStatement

	While
		= "while" Expression BlockOrStatement

	Exit
		= "exit"

	Function
		= Name "(" ListOf<Expression,","> ")"

	Name
		= (letter | "_") (alnum | "_")*

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
		| VariableGet

	Parentheses
		= "(" Expression ")"

	Number
		= digit+ "."? digit*

	String
		= "\"" #(~"\"" any)* "\""
		| "'" #(~"'" any)* "'"

	VariableGet
		= Variable

	// TODO add objects and arrays HERE
	Variable
		= Name ArrayIndexes?

	ArrayIndexes
		= "[" Expression ArrayIndex2? "]"

	ArrayIndex2
		= "," Expression

	Assignment
		= Variable "=" Expression

	AssignmentAdd
		= Variable "+=" Expression
	AssignmentSubtract
		= Variable "-=" Expression
	AssignmentMultiply
		= Variable "*=" Expression
	AssignmentDivide
		= Variable "/=" Expression

	VarDeclare
		= "var" NonemptyListOf<Name, ",">

	GlobalVarDeclare
		= "globalvar" NonemptyListOf<Name, ",">

}

`
	}
}