
// This class contains a single static method that just returns the grammar string.
// This was done because you cannot load a .ohm file using 'ohm.grammarFromScriptElement',
// since for some reason it breaks CORS, even though it's a local file.

export default class GMLGrammar {
	static getText() {
		return String.raw`

GameMakerLanguage {

	Start
		= Code

	Code
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
		| Return
		| Break
		| Continue
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
	Return
		= "return" Expression
	Break
		= "break"
	Continue
		= "continue"

	Function
		= Name "(" ListOf<Expression,","> ")"

	Name
		= (letter | "_") (alnum | "_")*

	Expression
		= ExpressionUnary
		| ExpressionBooleanComparison

	ExpressionUnary
		= Not
		| Negate
		| NegateBitwise

	Not
		= "!" Expression
	Negate
		= "-" Expression
	NegateBitwise
		= "~" Expression

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
		| ExpressionBitwise

	Less
		= Expression "<" ExpressionBitwise
	LessOrEqual
		= Expression "<=" ExpressionBitwise
	Equal
		= Expression equalSymbol ExpressionBitwise
	equalSymbol
		= "=" "="?
	Different
		= Expression "!=" ExpressionBitwise
	Greater
		= Expression ">" ExpressionBitwise
	GreaterOrEqual
		= Expression ">=" ExpressionBitwise

	ExpressionBitwise
		= BitwiseAnd
		| BitwiseOr
		| BitwiseXor
		| ExpressionBitwiseShift

	BitwiseAnd
		= Expression "&" ExpressionBitwiseShift
	BitwiseOr
		= Expression "|" ExpressionBitwiseShift
	BitwiseXor
		= Expression "^" ExpressionBitwiseShift

	ExpressionBitwiseShift
		= BitwiseShiftLeft
		| BitwiseShiftRight
		| ExpressionAddOrSubtract

	BitwiseShiftLeft
		= Expression "<<" ExpressionAddOrSubtract
	BitwiseShiftRight
		= Expression ">>" ExpressionAddOrSubtract

	ExpressionAddOrSubtract
		= Add
		| Subtract
		| ExpressionMultiplyOrDivide

	Add
		= Expression "+" ExpressionMultiplyOrDivide
	Subtract
		= Expression "-" ExpressionMultiplyOrDivide

	ExpressionMultiplyOrDivide
		= Multiply
		| Divide
		| IntegerDivision
		| Modulo
		| OtherExpression

	Multiply
		= ExpressionMultiplyOrDivide "*" OtherExpression
	Divide
		= ExpressionMultiplyOrDivide "/" OtherExpression
	IntegerDivision
		= ExpressionMultiplyOrDivide "div" OtherExpression
	Modulo
		= ExpressionMultiplyOrDivide "mod" OtherExpression

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

	// TODO add objects and arrays HERE
	Variable
		= Name ArrayIndexes?

	VariableGet
		= Variable

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