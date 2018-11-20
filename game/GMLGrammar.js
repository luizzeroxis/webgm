
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
		= Function
		| Number
		| String

	Number
		= digit+ "."? digit*

	String
		= "\"" #(~"\"" any)* "\""
		| "'" #(~"'" any)* "'"

	Semicolon
		= ";"

}

`
	}
}