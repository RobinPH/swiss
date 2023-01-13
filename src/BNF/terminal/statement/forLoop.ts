/* 
export const FOR_LOOP_STATEMENT = CONCAT(
  LOOPING_KEYWORD_FOR,
  NON_EMPTY_WHITESPACE,
  // initialization
  ATOM("("), 
  LET_DECLARATOR, 
  NON_EMPTY_WHITESPACE, 
  IDENTIFIER, 
  WHITESPACE, 
  ASSIGNMENT_OPERATOR, 
  WHITESPACE, 
  VALUE,
  SEMICOLON,
  // test
  OR(
    // either an explicit condition...
    CONCAT(IDENTIFIER, WHITESPACE, RELATIONAL_BOOLEAN_OPERATORS, WHITESPACE, VALUE),
    // an explicit boolean (which will make this like a while loop)...
    // -- insert BOOLEAN_KEYWORD here --
    // or a boolean identifier
    IDENTIFIER,
  ),
  SEMICOLON,
  // update
  WHITESPACE,
  OR(
    DECLARATION_STATEMENT,
    CONCAT(IDENTIFIER, OR(INCREMENT_OPERATOR, DECREMENT_OPERATOR)),
  ),
  ATOM(")"),
  ATOM(":")
)
  .name("FOR_LOOP_STATEMENT"); 
*/
