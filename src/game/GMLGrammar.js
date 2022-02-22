export default class GMLGrammar {
	static getText() {
		return String.raw`

GameMakerLanguage {

	Start
		= Code

	space += comment | multiComment

	comment = "//" #(~eol any)*
	multiComment = "/*" #(~"*/" any)* "*/"

	eol = "\n" | "\r"

	name = (letter | "_") namePart*
	namePart = (alnum | "_")

	Code
		= Block
		| ListOfStatements

	Block
		= "{" ListOfStatements "}"

	ListOfStatements
		= StatementWithSemicolon*

	StatementWithSemicolon
		= Statement ";"*

	Statement
		= If
		| Repeat
		| While
		| For
		| With
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
		| StatementWithSemicolon

	If
		= #("if" ~namePart) Expression BlockOrStatement Else?
	Else
		= #("else" ~namePart) BlockOrStatement

	Repeat
		= #("repeat" ~namePart) Expression BlockOrStatement

	While
		= #("while" ~namePart) Expression BlockOrStatement

	For
		= #("for" ~namePart) "(" BlockOrStatement Expression ";"? BlockOrStatement ")" BlockOrStatement

	With
		= #("with" ~namePart) Expression BlockOrStatement

	Exit
		= #("exit" ~namePart)
	Return
		= #("return" ~namePart) Expression
	Break
		= #("break" ~namePart)
	Continue
		= #("continue" ~namePart)

	Function
		= name "(" ListOf<Expression,","> ")"

	VarDeclare
		= #("var" ~namePart) NonemptyListOf<name, ",">
	GlobalVarDeclare
		= #("globalvar" ~namePart) NonemptyListOf<name, ",">

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

	// TODO add objects and arrays HERE
	Variable
		= Object? name ArrayIndexes?
	Object
		= (VariableGet | Parentheses) "."
	ArrayIndexes
		= "[" Expression ArrayIndex2? "]"
	ArrayIndex2
		= "," Expression

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
		= ExpressionMultiplyOrDivide spaces #("div" ~namePart) OtherExpression
	Modulo
		= ExpressionMultiplyOrDivide spaces #("mod" ~namePart) OtherExpression

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

}

`
	}
}