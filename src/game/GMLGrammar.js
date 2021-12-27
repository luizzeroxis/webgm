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
		= #("if" ~namePart) Expression BlockOrStatement Else?
	Else
		= #("else" ~namePart) BlockOrStatement

	While
		= #("while" ~namePart) Expression BlockOrStatement

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

	name
		= (letter | "_") namePart*

	namePart
		= (alnum | "_")

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
		= ExpressionMultiplyOrDivide #("div" ~namePart) OtherExpression
	Modulo
		= ExpressionMultiplyOrDivide #("mod" ~namePart) OtherExpression

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
		= name ArrayIndexes?

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
		= #("var" ~namePart) NonemptyListOf<name, ",">

	GlobalVarDeclare
		= #("globalvar" ~namePart) NonemptyListOf<name, ",">

}

`
	}
}